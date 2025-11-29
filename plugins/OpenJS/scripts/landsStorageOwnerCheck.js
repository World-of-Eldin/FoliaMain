// Lands Storage Owner Check
// Intercepts /lands storage command and only allows land owners or co-owners to access storage

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

log.info("=== Lands Storage Owner Check Loading ===");

// Get OpenJS plugin instance
const OpenJSPlugin = Bukkit.getPluginManager().getPlugin("OpenJS");

// Get LandsIntegration using constructor
let landsAPI = null;
try {
  const LandsIntegrationClass = java.lang.Class.forName(
    "me.angeschossen.lands.api.integration.LandsIntegration"
  );
  const PluginClass = java.lang.Class.forName("org.bukkit.plugin.Plugin");
  const constructor = LandsIntegrationClass.getConstructor(PluginClass);
  landsAPI = constructor.newInstance(OpenJSPlugin);
  log.info("Created Lands API instance successfully");
} catch (e) {
  log.error("Failed to create Lands API instance: " + e);
}

// Listen for command preprocessing
registerEvent("org.bukkit.event.player.PlayerCommandPreprocessEvent", {
  handleEvent: function (event) {
    const message = event.getMessage().toLowerCase();
    const player = event.getPlayer();

    // Check if this is a /lands storage command
    if (
      message.startsWith("/lands storage") ||
      message.startsWith("/land storage") ||
      message.startsWith("/l storage")
    ) {
      // Make sure we have the API
      if (!landsAPI) {
        log.error("LandsAPI not initialized!");
        event.setCancelled(true);
        player.sendMessage(
          ChatColor.RED + "Storage check failed - API not initialized"
        );
        return;
      }

      try {
        // Get the player's currently edited land
        const UUIDClass = java.lang.Class.forName("java.util.UUID");
        const getLandPlayerMethod = landsAPI
          .getClass()
          .getMethod("getLandPlayer", UUIDClass);
        const landPlayer = getLandPlayerMethod.invoke(
          landsAPI,
          player.getUniqueId()
        );

        if (!landPlayer) {
          // Player has no lands - let Lands handle this
          return;
        }

        const method = landPlayer.getClass().getMethod("getEditLand");
        let land = method.invoke(landPlayer);

        if (!land) {
          // No edit land - let Lands handle this
          return;
        }

        // Get owner UUID
        const getOwnerUIDMethod = land.getClass().getMethod("getOwnerUID");
        const ownerUUID = getOwnerUIDMethod.invoke(land);
        const playerUUID = player.getUniqueId();

        // Check if player is the owner
        if (ownerUUID.equals(playerUUID)) {
          // Player IS the owner - allow
          return;
        }

        // Player is not the owner - check if they have the co-owner role
        try {
          const isTrustedMethod = land
            .getClass()
            .getMethod("isTrusted", playerUUID.getClass());
          const isTrusted = isTrustedMethod.invoke(land, playerUUID);

          if (isTrusted) {
            // Get role information via HXvGq method
            const getHXvGqMethod = land
              .getClass()
              .getMethod("HXvGq", playerUUID.getClass());
            const roleObj = getHXvGqMethod.invoke(land, playerUUID);

            if (roleObj) {
              // Call pdjAO() which returns JSON with role info
              const pdjAOMethod = roleObj.getClass().getMethod("pdjAO");
              const roleJson = pdjAOMethod.invoke(roleObj);

              if (roleJson) {
                const roleStr = roleJson.toString();

                // Check if role JSON contains "Co-Owner"
                if (roleStr.toUpperCase().indexOf("CO-OWNER") >= 0) {
                  // Player has co-owner role - allow access
                  return;
                }
              }
            }
          }
        } catch (roleCheckError) {
          log.error(roleCheckError);
        }

        // Player is NOT the owner and NOT a co-owner - block the command
        event.setCancelled(true);
        player.sendMessage(
          ChatColor.RED +
            "Only the land owner or co-owners can access land storage."
        );
      } catch (e) {
        log.error("Error checking land ownership: " + e);
        event.setCancelled(true);
        player.sendMessage(ChatColor.RED + "Error checking land ownership.");
      }
    }
  },
});

log.info("=== Lands Storage Owner Check Loaded Successfully ===");
