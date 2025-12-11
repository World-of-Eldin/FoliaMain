// powder-snow-solid-boots.js
// Makes powder snow solid for players wearing boots with Frost Walker enchantment OR riding horses with armor
// Uses client-side fake blocks to trick the client into treating powder snow as solid

const Material = org.bukkit.Material;
const Bukkit = org.bukkit.Bukkit;
const EntityDamageEvent = org.bukkit.event.entity.EntityDamageEvent;
const Location = org.bukkit.Location;
const Enchantment = org.bukkit.enchantments.Enchantment;
const Console = Bukkit.getConsoleSender();

Console.sendMessage("[Powder Snow Bypass] Loading script...");

const openJsPlugin = Bukkit.getPluginManager().getPlugin("OpenJS");

// Track fake blocks per player: uuid -> {key: Location}
const fakeBlocks = {};

// Helper to make location key
function locKey(x, y, z) {
  return x + "," + y + "," + z;
}

// Check if player has boots with Frost Walker enchantment
function hasValidBoots(player) {
  const boots = player.getInventory().getBoots();
  if (boots == null) return false;
  const bootType = boots.getType().toString();
  if (bootType == "AIR") return false;

  // Check if boots have Frost Walker enchantment
  try {
    return boots.containsEnchantment(Enchantment.FROST_WALKER);
  } catch (e) {
    Console.sendMessage(
      "[Powder Snow Bypass] §cError checking Frost Walker enchantment: " + e
    );
    return false;
  }
}

// Check if player is riding a horse with armor (not mule/donkey)
function isOnHorseWithArmor(player) {
  if (!player.isInsideVehicle()) return false;

  const vehicle = player.getVehicle();
  if (!vehicle) return false;

  const vehicleType = vehicle.getType().toString();

  // Only actual horses can wear armor
  // Mules, donkeys, skeleton horses, zombie horses should all have different entity types
  if (vehicleType != "HORSE") return false;

  const horse = vehicle;

  // Try to check if it's specifically a horse (not mule/donkey variant)
  // In case they share the HORSE entity type, check if it can actually wear armor
  try {
    const inventory = horse.getInventory();
    const armor = inventory.getArmor();

    // If armor slot exists and has armor, it's a horse with armor
    if (armor != null && armor.getType().toString() != "AIR") {
      return true;
    }
  } catch (e) {
    // If getArmor() fails, it might be a mule/donkey
    return false;
  }

  // No armor equipped or can't access armor slot
  return false;
}

// Check if player should bypass powder snow
// If riding a horse: ONLY horse armor matters (player boots ignored)
// If riding anything else: always sink (player boots ignored)
// If not riding: player boots matter
function shouldBypassPowderSnow(player) {
  // Check if riding a vehicle first
  if (player.isInsideVehicle()) {
    const vehicle = player.getVehicle();
    if (!vehicle) return hasValidBoots(player);

    const vehicleType = vehicle.getType().toString();

    // Explicitly handle mules and donkeys - always sink (they can't wear armor)
    if (vehicleType == "MULE" || vehicleType == "DONKEY") {
      return false;
    }

    // On a horse - only check horse armor (ignore player boots)
    if (vehicleType == "HORSE") {
      return isOnHorseWithArmor(player);
    }

    // On any other vehicle (camel, pig, strider, boat, minecart, etc.) - always sink
    return false;
  }

  // Not riding - check player boots
  return hasValidBoots(player);
}

// Send fake snow block to player
function sendFakeBlock(player, loc) {
  try {
    const snowBlockData = Material.SNOW_BLOCK.createBlockData();
    player.sendBlockChange(loc, snowBlockData);
  } catch (e) {
    Console.sendMessage(
      "[Powder Snow Bypass] §cError sending fake block: " + e
    );
  }
}

// Restore real block to player (send powder snow block data directly for immediate sync)
function restoreBlock(player, loc) {
  try {
    // Send powder snow block data directly (synchronous, no world access needed)
    // We know these locations had powder snow when we sent the fake, so restore to powder snow
    const powderSnowData = Material.POWDER_SNOW.createBlockData();
    player.sendBlockChange(loc, powderSnowData);
  } catch (e) {
    Console.sendMessage("[Powder Snow Bypass] §cError restoring block: " + e);
  }
}

// Main tick loop - check players and manage fake blocks
// Use Folia's global scheduler to iterate players, then region scheduler for world access
const globalScheduler = Bukkit.getGlobalRegionScheduler();
globalScheduler.runAtFixedRate(
  openJsPlugin,
  function () {
    try {
      const players = Bukkit.getOnlinePlayers().toArray();

      for (let i = 0; i < players.length; i++) {
        const player = players[i];
        if (!player || !player.isOnline()) continue;

        // Schedule region-specific work for this player's location
        const playerLoc = player.getLocation();
        if (!playerLoc) continue;

        const regionScheduler = Bukkit.getRegionScheduler();
        regionScheduler.run(openJsPlugin, playerLoc, function (context) {
          try {
            // Re-check player is still valid
            if (!player || !player.isOnline()) return;

            const uuid = player.getUniqueId().toString();

            // Initialize tracking for this player
            if (!fakeBlocks[uuid]) {
              fakeBlocks[uuid] = {};
            }

            const shouldBypass = shouldBypassPowderSnow(player);
            const currentFakes = fakeBlocks[uuid];
            const newFakes = {};

            if (shouldBypass) {
              // Player has boots or is on horse with armor - show them fake snow blocks (solid)
              // Reset freeze ticks
              try {
                player.setFreezeTicks(0);
              } catch (e) {
                // Ignore
              }

              const loc = player.getLocation();
              if (!loc) return;

              const world = player.getWorld();
              if (!world) return;

              const px = Math.floor(loc.getX());
              const py = Math.floor(loc.getY());
              const pz = Math.floor(loc.getZ());

              // Scan blocks around player (3x4x3 area centered on feet)
              for (let dx = -3; dx <= 3; dx++) {
                for (let dy = -2; dy <= 2; dy++) {
                  for (let dz = -3; dz <= 3; dz++) {
                    const bx = px + dx;
                    const by = py + dy;
                    const bz = pz + dz;

                    try {
                      const blockLoc = new Location(world, bx, by, bz);
                      const block = blockLoc.getBlock();
                      if (!block) continue;

                      if (block.getType() == Material.POWDER_SNOW) {
                        const key = locKey(bx, by, bz);
                        newFakes[key] = blockLoc;

                        // Send fake block if not already tracked
                        if (!currentFakes[key]) {
                          sendFakeBlock(player, blockLoc);
                        }
                      }
                    } catch (e) {
                      // Skip this block if there's an error
                      continue;
                    }
                  }
                }
              }
            } else {
              // Player doesn't meet bypass conditions - ensure they see real powder snow
              // Restore any fake blocks that were previously shown
              for (const key in currentFakes) {
                if (currentFakes[key]) {
                  try {
                    restoreBlock(player, currentFakes[key]);
                  } catch (e) {
                    // Ignore restore errors
                  }
                }
              }
            }

            // Restore blocks that are no longer in range
            for (const key in currentFakes) {
              if (!newFakes[key] && currentFakes[key]) {
                try {
                  restoreBlock(player, currentFakes[key]);
                } catch (e) {
                  // Ignore restore errors
                }
              }
            }

            fakeBlocks[uuid] = newFakes;
          } catch (e) {
            Console.sendMessage(
              "[Powder Snow Bypass] §cError processing player in powder snow loop: " +
                e
            );
          }
        });
      }
    } catch (e) {
      Console.sendMessage(
        "[Powder Snow Bypass] §cError in powder snow tick loop: " + e
      );
    }
  },
  1, // Initial delay (1 tick)
  2 // Period (2 ticks)
);

// Cancel freeze damage for players with boots or on horses with armor
registerEvent("org.bukkit.event.entity.EntityDamageEvent", {
  handleEvent: function (event) {
    if (event.getCause() != EntityDamageEvent.DamageCause.FREEZE) return;

    const entity = event.getEntity();
    if (!(entity instanceof org.bukkit.entity.Player)) return;

    const player = entity;
    if (shouldBypassPowderSnow(player)) {
      event.setCancelled(true);
      player.setFreezeTicks(0);
    }
  },
});

// Handle chunk load - resend fake blocks when player enters new chunks
registerEvent("org.bukkit.event.player.PlayerMoveEvent", {
  handleEvent: function (event) {
    // Only process on block change for performance
    if (!event.hasChangedBlock()) return;

    const player = event.getPlayer();
    if (!shouldBypassPowderSnow(player)) return;

    const uuid = player.getUniqueId().toString();
    const to = event.getTo();
    if (!to) return;

    // Use region scheduler for world access
    const regionScheduler = Bukkit.getRegionScheduler();
    regionScheduler.run(openJsPlugin, to, function () {
      try {
        const world = player.getWorld();
        if (!world) return;

        // Check for powder snow at new location and send fake blocks immediately
        const px = Math.floor(to.getX());
        const py = Math.floor(to.getY());
        const pz = Math.floor(to.getZ());

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            for (let dz = -1; dz <= 1; dz++) {
              try {
                const blockLoc = new Location(world, px + dx, py + dy, pz + dz);
                const block = blockLoc.getBlock();
                if (!block) continue;

                if (block.getType() == Material.POWDER_SNOW) {
                  sendFakeBlock(player, blockLoc);

                  // Track it
                  if (!fakeBlocks[uuid]) fakeBlocks[uuid] = {};
                  fakeBlocks[uuid][locKey(px + dx, py + dy, pz + dz)] =
                    blockLoc;
                }
              } catch (e) {
                // Skip this block
                continue;
              }
            }
          }
        }
      } catch (e) {
        Console.sendMessage(
          "[Powder Snow Bypass] §cError in player move handler: " + e
        );
      }
    });
  },
});

// The main tick loop already handles detecting when bypass conditions change
// No need for additional event handlers - the loop runs every 2 ticks and will
// automatically restore blocks when player removes boots or dismounts

// Cleanup on player quit
registerEvent("org.bukkit.event.player.PlayerQuitEvent", {
  handleEvent: function (event) {
    const uuid = event.getPlayer().getUniqueId().toString();
    delete fakeBlocks[uuid];
  },
});

// Handle when blocks actually break/change - restore tracking
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
  handleEvent: function (event) {
    const block = event.getBlock();
    if (block.getType() != Material.POWDER_SNOW) return;

    const loc = block.getLocation();
    const key = locKey(loc.getBlockX(), loc.getBlockY(), loc.getBlockZ());

    // Remove from all player tracking
    for (const uuid in fakeBlocks) {
      if (fakeBlocks[uuid][key]) {
        delete fakeBlocks[uuid][key];
      }
    }
  },
});

// Handle block placement
registerEvent("org.bukkit.event.block.BlockPlaceEvent", {
  handleEvent: function (event) {
    const block = event.getBlockPlaced();
    if (block.getType() != Material.POWDER_SNOW) return;

    const loc = block.getLocation();

    // Use region scheduler for world access
    const regionScheduler = Bukkit.getRegionScheduler();
    regionScheduler.run(openJsPlugin, loc, function () {
      try {
        // Notify nearby players with boots to update their fake blocks
        const nearbyPlayers = block
          .getWorld()
          .getNearbyEntities(loc, 5, 5, 5)
          .toArray();

        for (let i = 0; i < nearbyPlayers.length; i++) {
          const entity = nearbyPlayers[i];
          if (!(entity instanceof org.bukkit.entity.Player)) continue;

          const player = entity;
          if (!shouldBypassPowderSnow(player)) continue;

          // Send fake block to this player
          sendFakeBlock(player, loc);

          // Track it
          const uuid = player.getUniqueId().toString();
          if (!fakeBlocks[uuid]) fakeBlocks[uuid] = {};
          const key = locKey(loc.getBlockX(), loc.getBlockY(), loc.getBlockZ());
          fakeBlocks[uuid][key] = loc;
        }
      } catch (e) {
        Console.sendMessage(
          "[Powder Snow Bypass] §cError in block place handler: " + e
        );
      }
    });
  },
});

Console.sendMessage("[Powder Snow Bypass] §aLoaded successfully!");
Console.sendMessage(
  "[Powder Snow Bypass] §aPlayers with Frost Walker boots or riding horses with armor will see powder snow as solid snow blocks."
);
