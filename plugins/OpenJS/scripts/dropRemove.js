const bannedDrops = ["IRON_INGOT", "GOLD_NUGGET", "GOLD_INGOT", "EMERALD", "COPPER_INGOT", "COAL", "REDSTONE", "NAUTILUS_SHELL"]

// Prevent any entity (except players) from dropping these items
registerEvent("org.bukkit.event.entity.EntityDeathEvent", {
    handleEvent: function(event) {
        const entity = event.getEntity();

        // Skip if the entity is a player (allow players to drop these items)
        if (entity.getType().toString() === "PLAYER") {
            return;
        }

        let droppedItems = event.getDrops();
        let itemsToRemove = []; // Iterate through list of dropped items, searching for a banned item

        droppedItems.forEach(item => {
            bannedDrops.forEach(drop => { // Search the array for matches to a banned item
                if (item.getType().toString() === drop) {
                    itemsToRemove.push(item); // Push the item to the itemsToRemove array
                }
            })
        });

        // Remove the items in the itemsToRemove array
        itemsToRemove.forEach(item => {
            droppedItems.remove(item);
        });
    }
})