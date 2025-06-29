const bannedDrops = ["IRON_INGOT", "GOLD_NUGGET", "GOLD_INGOT", "EMERALD", "COPPER INGOT"]

registerEvent("org.bukkit.event.entity.PlayerDeathEvent", {
    handleEvent: function(event) {
        const victim = event.getEntity();
        if(victim.getName()) {
            let droppedItems = event.getDrops();
            let itemsToRemove = []; //Iterate through list of dropped items, searching for a banned item
            droppedItems.forEach(item => {

                bannedDrops.forEach(drop => { //Search the array for matches to a banned item
                    if (item.getType().toString() === drop) {
                        itemsToRemove.push(item);  //Push the item to the itemsToRemove array
                    }
                })
            });
            //Remove the items in the itemsToRemove array
            itemsToRemove.forEach(item => {
                droppedItems.remove(item);
            });
        }
    }
})