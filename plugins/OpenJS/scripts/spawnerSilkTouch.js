const Bukkit = org.bukkit.Bukkit;
const Material = org.bukkit.Material;
const ItemStack = org.bukkit.inventory.ItemStack;
const CreatureSpawner = org.bukkit.block.CreatureSpawner;
const Enchantment = org.bukkit.enchantments.Enchantment;
const NamespacedKey = org.bukkit.NamespacedKey;
const PersistentDataType = org.bukkit.persistence.PersistentDataType;

// Handle breaking spawners with Silk Touch
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
  handleEvent: function (event) {
    const block = event.getBlock();

    // Check if the broken block is a spawner
    if (block.getType().toString() !== "SPAWNER") {
      return;
    }

    const player = event.getPlayer();
    const tool = player.getInventory().getItemInMainHand();

    // Check if the tool has Silk Touch
    if (!tool || !tool.containsEnchantment(Enchantment.SILK_TOUCH)) {
      return;
    }

    // Get the spawner and its mob type
    const spawner = block.getState();
    const mobType = spawner.getSpawnedType().toString();

    // Cancel default drop behavior
    event.setDropItems(false);

    // Create a spawner item
    const spawnerItem = new ItemStack(Material.SPAWNER, 1);
    const meta = spawnerItem.getItemMeta();

    // Store mob type in persistent data
    const key = new NamespacedKey(plugin, "mob_type");
    meta
      .getPersistentDataContainer()
      .set(key, PersistentDataType.STRING, mobType);

    // Set display name to show mob type
    meta.setDisplayName("�6" + mobType + " Spawner");

    // Add lore
    const lore = java.util.Arrays.asList(
      "�7Place this spawner to create",
      "�7a " + mobType + " spawner"
    );
    meta.setLore(lore);

    spawnerItem.setItemMeta(meta);

    // Drop the spawner at the block location
    block.getWorld().dropItemNaturally(block.getLocation(), spawnerItem);
  },
});

// Handle placing spawners
registerEvent("org.bukkit.event.block.BlockPlaceEvent", {
  handleEvent: function (event) {
    const block = event.getBlockPlaced();

    // Check if the placed block is a spawner
    if (block.getType().toString() !== "SPAWNER") {
      return;
    }

    const player = event.getPlayer();
    const item = event.getItemInHand();
    const meta = item.getItemMeta();

    if (!meta) {
      return;
    }

    // Get mob type from persistent data
    const key = new NamespacedKey(plugin, "mob_type");
    const container = meta.getPersistentDataContainer();

    if (!container.has(key, PersistentDataType.STRING)) {
      return;
    }

    const mobType = container.get(key, PersistentDataType.STRING);

    // Set the spawner's mob type
    task.main(function () {
      const spawner = block.getState();

      const entityType = org.bukkit.entity.EntityType.valueOf(mobType);
      spawner.setSpawnedType(entityType);
      spawner.update();
    });
  },
});
