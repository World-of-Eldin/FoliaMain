const Bukkit = org.bukkit.Bukkit;
var Console = Bukkit.getConsoleSender();
var Scheduler = Bukkit.getServer().getScheduler();
var Runnable = java.lang.Runnable;
var Consumer = java.util.function.Consumer;

var shopNames = {
  balls: "Blacksmith",
};

registerEvent("org.bukkit.event.player.PlayerInteractEntityEvent", {
  handleEvent: function (event) {
    if (event.getRightClicked().getType().name() === "VILLAGER") {
      event.setCancelled(true);

      const player = event.getPlayer();
      const villagerName = event.getRightClicked().getCustomName();

      task.main(function () {
        Bukkit.dispatchCommand(
          Console,
          "lp user " +
            player.getName() +
            " permission settemp genesis.open.command." +
            shopNames[villagerName] +
            " true 2s"
        );
      });

      player.getScheduler().runDelayed(
        plugin,
        new Consumer({
          accept: function () {
            player.performCommand("shop open Blacksmith");
          },
        }),
        null,
        5
      );
    }
  },
});
