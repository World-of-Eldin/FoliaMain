const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

addCommand("invsee", {
  onCommand: function (sender, args) {
    const Scheduler = Bukkit.getGlobalRegionScheduler();
    args = toArray(args);

    // Check if sender is a player
    if (!(sender instanceof org.bukkit.entity.Player)) {
      sender.sendMessage(
        ChatColor.RED + "This command can only be used by players."
      );
      return;
    }

    // Check for permission
    if (!sender.hasPermission("eldin.staff")) {
      sender.sendMessage(
        ChatColor.RED + "You don't have permission to use this command."
      );
      return;
    }

    // Check if target player is specified
    if (args.length !== 1) {
      sender.sendMessage(ChatColor.RED + "Usage: /invsee <player>");
      return;
    }

    const targetName = args[0];

    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
      // First check if player is online
      const onlinePlayer = Bukkit.getPlayer(targetName);

      if (onlinePlayer !== null && onlinePlayer.isOnline()) {
        // Player is online - open their inventory directly
        sender.openInventory(onlinePlayer.getInventory());
        sender.sendMessage(
          ChatColor.GREEN + "Opening " + onlinePlayer.getName() + "'s inventory"
        );
      } else {
        // Player is offline - try to load from player data
        try {
          const OfflinePlayer = Bukkit.getOfflinePlayer(targetName);

          // Check if the player has ever joined
          if (!OfflinePlayer.hasPlayedBefore()) {
            sender.sendMessage(
              ChatColor.RED +
                "Player '" +
                targetName +
                "' has never joined the server."
            );
            return;
          }

          // Get player UUID
          const playerUUID = OfflinePlayer.getUniqueId();

          // Try to find the player data file
          const mainWorld = Bukkit.getWorlds().get(0);
          const worldFolder = mainWorld.getWorldFolder();
          const playerDataFolder = new java.io.File(worldFolder, "playerdata");
          const playerFile = new java.io.File(
            playerDataFolder,
            playerUUID.toString() + ".dat"
          );

          if (!playerFile.exists()) {
            sender.sendMessage(
              ChatColor.RED +
                "Could not find player data for '" +
                OfflinePlayer.getName() +
                "'."
            );
            sender.sendMessage(
              ChatColor.GRAY +
                "Player file expected at: " +
                playerFile.getPath()
            );
            return;
          }

          // Use Bukkit's NBT API through CraftBukkit
          try {
            const FileInputStream = java.io.FileInputStream;
            const DataInputStream = java.io.DataInputStream;

            // Try to load NBT data
            const NBTCompressedStreamTools =
              org.bukkit.craftbukkit.v1_21_R3.util.CraftNBTTagConfigSerializer
                .NBTCompressedStreamTools ||
              net.minecraft.nbt.NBTCompressedStreamTools;

            const fis = new FileInputStream(playerFile);
            const nbt = NBTCompressedStreamTools.readCompressed(fis);
            fis.close();

            // Create inventory to show items
            const inventory = Bukkit.createInventory(
              null,
              54,
              ChatColor.GOLD +
                OfflinePlayer.getName() +
                "'s Inventory " +
                ChatColor.GRAY +
                "(Offline)"
            );

            // Try to parse inventory
            if (nbt.hasKey("Inventory")) {
              const invList = nbt.getList("Inventory", 10);

              for (let i = 0; i < invList.size(); i++) {
                const itemCompound = invList.getCompound(i);
                const slot = itemCompound.getByte("Slot");

                // Try to create ItemStack from NBT
                try {
                  const CraftItemStack =
                    org.bukkit.craftbukkit.v1_21_R3.inventory.CraftItemStack;
                  const item = CraftItemStack.asCraftMirror(
                    net.minecraft.world.item.ItemStack.parse(
                      Bukkit.getServer()
                        .getRegistry(org.bukkit.Registry.ITEM)
                        .registryAccess(),
                      itemCompound
                    ).orElse(null)
                  );

                  if (item !== null) {
                    // Map slots: 0-8 hotbar, 9-35 main inv, 100-103 armor, -106 offhand
                    let displaySlot = slot;
                    if (slot >= 0 && slot < 36) {
                      displaySlot = slot;
                    } else if (slot >= 100 && slot <= 103) {
                      displaySlot = slot - 100 + 36; // Armor slots
                    } else if (slot == -106) {
                      displaySlot = 40; // Offhand
                    }

                    if (displaySlot >= 0 && displaySlot < 54) {
                      inventory.setItem(displaySlot, item);
                    }
                  }
                } catch (itemError) {
                  // Skip items that can't be parsed
                  log.warn(
                    "Could not parse item in slot " + slot + ": " + itemError
                  );
                }
              }
            }

            sender.openInventory(inventory);
            sender.sendMessage(
              ChatColor.YELLOW +
                "Opening " +
                OfflinePlayer.getName() +
                "'s inventory " +
                ChatColor.GRAY +
                "(Offline - Read-only)"
            );
            sender.sendMessage(
              ChatColor.GRAY +
                "Note: This is a snapshot from when the player last logged out."
            );
          } catch (nbtError) {
            sender.sendMessage(
              ChatColor.RED + "Unable to read player data (NBT parsing failed)"
            );
            sender.sendMessage(
              ChatColor.GRAY + "This player might be using a newer data format."
            );
            log.error("NBT Error for " + targetName + ": " + nbtError);
          }
        } catch (e) {
          sender.sendMessage(
            ChatColor.RED + "Error loading offline player inventory."
          );
          sender.sendMessage(ChatColor.GRAY + "Error: " + e.message);
          log.error("InvSee error for player " + targetName + ":", e);

          // Print full stack trace for debugging
          if (e.printStackTrace) {
            e.printStackTrace();
          }
        }
      }
    });
  },

  onTabComplete: function (sender, args) {
    args = toArray(args);

    if (args.length === 1) {
      // Provide tab completion with online player names
      const onlinePlayers = Bukkit.getOnlinePlayers();
      let playerNames = [];

      onlinePlayers.forEach((player) => {
        playerNames.push(player.getName());
      });

      return toJavaList(playerNames);
    }

    return toJavaList([]);
  },
});
