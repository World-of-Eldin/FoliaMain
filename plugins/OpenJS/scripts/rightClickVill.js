const Bukkit = org.bukkit.Bukkit;
var Console = Bukkit.getConsoleSender();
var Consumer = java.util.function.Consumer;
var Server = plugin.getServer();

// Valid shop names that villagers can open
var validShops = [
  "Armorer",
  "Butcher",
  "Cartographer",
  "Cleric",
  "Farmer",
  "Fisherman",
  "Fletcher",
  "Leatherworker",
  "Librarian",
  "Mason",
  "Nitwit",
  "Shepherd",
  "Toolsmith",
  "Weaponsmith"
];

registerEvent("org.bukkit.event.player.PlayerInteractEntityEvent", {
  handleEvent: function (event) {
    if (event.getRightClicked().getType().name() === "VILLAGER") {
      event.setCancelled(true);

      const player = event.getPlayer();
      const villager = event.getRightClicked();
      const tags = villager.getScoreboardTags();

      // Check if this villager has the shop_villager tag
      if (tags.contains("shop_villager")) {
        // Find which shop this villager represents
        var shopName = null;
        for (var i = 0; i < validShops.length; i++) {
          if (tags.contains("shop_" + validShops[i])) {
            shopName = validShops[i];
            break;
          }
        }

        if (shopName !== null) {
          task.main(function () {
            Bukkit.dispatchCommand(
              Console,
              "lp user " +
                player.getName() +
                " permission settemp genesis.open.command." +
                shopName +
                " true 2s"
            );
          });

          player.getScheduler().runDelayed(
            plugin,
            new Consumer({
              accept: function () {
                player.performCommand("shop open " + shopName);
              },
            }),
            null,
            5
          );
        }
      }
    }
  },
});
