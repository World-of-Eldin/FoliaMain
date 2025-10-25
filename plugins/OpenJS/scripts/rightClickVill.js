const Bukkit = org.bukkit.Bukkit;
var Console = Bukkit.getConsoleSender();
var Scheduler = Bukkit.getServer().getScheduler();
var Runnable = java.lang.Runnable;
var Consumer = java.util.function.Consumer;

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
      const villagerName = villager.getCustomName();

      // Check if this villager has the official shop tag AND a valid shop name
      const isOfficialShopVillager = villager.getScoreboardTags().contains("OfficialShopVillager");

      if (isOfficialShopVillager && validShops.includes(villagerName)) {
        task.main(function () {
          Bukkit.dispatchCommand(
            Console,
            "lp user " +
              player.getName() +
              " permission settemp genesis.open.command." +
              villagerName +
              " true 2s"
          );
        });

        player.getScheduler().runDelayed(
          plugin,
          new Consumer({
            accept: function () {
              player.performCommand("shop open " + villagerName);
            },
          }),
          null,
          5
        );
      }
    }
  },
});
