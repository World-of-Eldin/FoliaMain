var colors = ["WHITE", "GRAY", "BLACK", "BROWN", "RED", "ORANGE", "YELLOW", "LIME", "GREEN", "CYAN", "BLUE", "PURPLE", "MAGENTA", "PINK", "LIGHT_GRAY", "LIGHT_BLUE"] //An array of concrete colors
var blocks = ["COBBLESTONE", "GRAVEL"] //An array of blocks
var grindStoneUsed = false;
registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
    handleEvent: function(event) {
        var ItemStack = org.bukkit.inventory.ItemStack; //The Bukkit ItemStack class
        var Material = org.bukkit.Material; //The Bukkit Material class
        var player = event.getPlayer();
        if(event.getClickedBlock() != null) { //Prevent air from triggering logic since block is null
            if(event.getClickedBlock().type.toString() === "GRINDSTONE" && event.getAction().toString() === "RIGHT_CLICK_BLOCK") { //Check that block is enchanting table and right click is used
                if(player.isSneaking() && event.getHand().toString() === "HAND") { //Check that player is crouching and holding a glass bottle
                    var itemInHand = player.getInventory().getItemInMainHand().type.toString();
                    var rightBlock = false;
                    var inventory = player.getInventory();
                    for(i = 0; i < blocks.length; i++) { //Ensure that passed block is valid and not concrete powder
                        if(itemInHand === blocks[i] || (itemInHand.indexOf("CONCRETE") >= 0 && itemInHand.indexOf("POWDER") === -1)) {
                            rightBlock = true;
                        }
                    }
                    if(rightBlock) {
                        grindStoneUsed = true;
                        var materialtoAdd; //The material to give the player
                        var materialtoRemove; //The material to take away from the player
                        if(itemInHand === "COBBLESTONE") {
                            material = Material.getMaterial("COBBLESTONE")
                            materialtoRemove = new ItemStack(material, 1)
                            var material = Material.getMaterial("GRAVEL");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                        }

                        if(itemInHand === "GRAVEL") {
                            material = Material.getMaterial("GRAVEL")
                            materialtoRemove = new ItemStack(material, 1)
                            var material = Material.getMaterial("SAND");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                        }

                        if(itemInHand.indexOf("CONCRETE") >= 0) {
                            var color;
                            for(i = 0; i < colors.length; i++) { //Iterate through colors array, determining which concrete color player is holding
                                if(itemInHand.indexOf(colors[i]) >= 0) {
                                    color = colors[i];
                                }
                            }
                            material = Material.getMaterial(color + "_CONCRETE")
                            materialtoRemove = new ItemStack(material, 1)
                            var material = Material.getMaterial(color + "_CONCRETE_POWDER");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                        }

                        var partialStack = false;
                        for(var i = 0; i < inventory.getSize(); i++) {
                            var item = inventory.getItem(i);
                            if(item != null && item.getType() == material && item.getAmount() < 64) {
                                partialStack = true;
                                break;
                            }
                        }

                        if(inventory.firstEmpty() >= 0 || partialStack) {
                            player.getInventory().addItem(materialtoAdd); //Add the item to player inventory
                        }
                        else {
                            player.getWorld().dropItem(player.getLocation(), materialtoAdd)
                        }
                        player.getInventory().removeItem(materialtoRemove); //Remove the item from player inventory

                    }
                }
            }
        }
    }
})

registerEvent("org.bukkit.event.block.BlockPlaceEvent", {
    handleEvent: function(event) {
        if(grindStoneUsed) { //Block the player from placing blocks if they used the grindstone
            event.setCancelled(true);
        }
    }
})

function freePlayer() {
    grindStoneUsed = false; //Allow player to place blocks again
}
registerSchedule(0, 20, this, "freePlayer"); //Run this every 20 ticks