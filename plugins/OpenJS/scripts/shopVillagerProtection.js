const Bukkit = org.bukkit.Bukkit;

// Prevent shop villagers from being put into vehicles (boats, minecarts, etc.)
registerEvent("org.bukkit.event.entity.EntityMountEvent", {
  handleEvent: function (event) {
    const entity = event.getEntity();

    // Check if the entity entering the vehicle is a villager
    if (entity.getType().name() !== "VILLAGER") {
      return;
    }

    const tags = entity.getScoreboardTags();

    // Check if this villager has the shop_villager tag
    if (tags.contains("shop_villager")) {
      // Cancel the mount event to prevent shop villagers from entering vehicles
      event.setCancelled(true);
    }
  },
});

log.info("Shop villager vehicle protection loaded!");
