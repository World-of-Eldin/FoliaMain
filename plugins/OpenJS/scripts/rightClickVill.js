// Define shop mappings - use the exact names shown on the villagers
var shopNames = {
    "balls": "blocks",
    "Blocks Merchant": "blocks",
    "Food Merchant": "food"
    // Add more mappings as needed
};

registerEvent("org.bukkit.event.player.PlayerInteractEntityEvent", {
    handleEvent: function(event) {
        var logger = org.bukkit.Bukkit.getLogger();
        if (event.getRightClicked().getType().name() === "VILLAGER") {
            var player = event.getPlayer();
            var playerName = player.getName();

            // Get entity name in the correct thread context
            var villager = event.getRightClicked();
            var npcName = villager.getCustomName() || "unnamed";

            // Debug message to see what the actual name is
            player.sendMessage("§7Debug - Villager name: §f" + npcName);
            logger.info("Villager name detected: " + npcName);

            // Important: Use bracket notation for object lookup
            var shopType = shopNames[npcName];

            // If no mapping exists, use a default or the name itself
            if (!shopType) {
                player.sendMessage("§cNo shop mapping found for: §f" + npcName);
                // Fallback to using the name directly or a default
                shopType = "blocks"; // Default fallback
            }

            event.setCancelled(true);

            try {
                var plugin = org.bukkit.Bukkit.getPluginManager().getPlugin("OpenJS");
                var globalScheduler = org.bukkit.Bukkit.getGlobalRegionScheduler();

                globalScheduler.runDelayed(plugin, function() {
                    // Give temporary permission
                    var permCmd = "lp user " + playerName + " permission settemp ultimateshops.menu true 5s";
                    org.bukkit.Bukkit.dispatchCommand(org.bukkit.Bukkit.getConsoleSender(), permCmd);

                    // Log what we're going to use
                    logger.info("Using shop type: " + shopType + " for villager: " + npcName);

                    // Execute the shop command
                    player.chat("/shop menu " + shopType);
                }, 1);  
            } catch (e) {
                logger.severe("Error in villager shop script: " + e.toString());
                player.sendMessage("§cError: " + e.toString());
            }
        }
    }
});