const Bukkit = org.bukkit.Bukkit;
const NamespacedKey = org.bukkit.NamespacedKey;
const PersistentDataType = org.bukkit.persistence.PersistentDataType;
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
      const pdc = villager.getPersistentDataContainer();

      // Create namespaced keys for custom data
      const serverShopKey = new NamespacedKey("minecraft", "server_shop");
      const shopNameKey = new NamespacedKey("minecraft", "shop_name");

      // Check if this villager is an official shop villager
      const isServerShop = pdc.has(serverShopKey, PersistentDataType.BYTE) &&
                           pdc.get(serverShopKey, PersistentDataType.BYTE) === 1;

      if (isServerShop && pdc.has(shopNameKey, PersistentDataType.STRING)) {
        const shopName = pdc.get(shopNameKey, PersistentDataType.STRING);

        if (validShops.includes(shopName)) {
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
