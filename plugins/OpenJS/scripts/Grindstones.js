var colors = ["WHITE", "GRAY", "BLACK", "BROWN", "RED", "ORANGE", "YELLOW", "LIME", "GREEN", "CYAN", "BLUE", "PURPLE", "MAGENTA", "PINK", "LIGHT_GRAY", "LIGHT_BLUE"] //An array of concrete colors
var blocks = ["COBBLESTONE", "GRAVEL"] //An array of blocks
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
                    for(i = 0; i < blocks.length; i++) { //Ensure that passed block is valid and not concrete powder
                        if(itemInHand === blocks[i] || (itemInHand.indexOf("CONCRETE") >= 0 && itemInHand.indexOf("POWDER") === -1)) {
                            rightBlock = true;
                        }
                    }
                    if(rightBlock) {
                        var materialtoAdd; //The material to give the player
                        var materialtoRemove; //The material to take away from the player
                        if(itemInHand === "COBBLESTONE") {
                            var material = Material.getMaterial("GRAVEL");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                            material = Material.getMaterial("COBBLESTONE")
                            materialtoRemove = new ItemStack(material, 1)
                        }

                        if(itemInHand === "GRAVEL") {
                            var material = Material.getMaterial("SAND");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                            material = Material.getMaterial("GRAVEL")
                            materialtoRemove = new ItemStack(material, 1)
                        }

                        if(itemInHand.indexOf("CONCRETE") >= 0) {
                            var color;
                            for(i = 0; i < colors.length; i++) { //Iterate through colors array, determining which concrete color player is holding
                                if(itemInHand.indexOf(colors[i]) >= 0) {
                                    color = colors[i];
                                }
                            }
                            var material = Material.getMaterial(color + "_CONCRETE_POWDER");
                            materialtoAdd = new ItemStack(material, 1); //Add the material to player inventory
                            material = Material.getMaterial(color + "_CONCRETE")
                            materialtoRemove = new ItemStack(material, 1)
                        }
                        player.getInventory().addItem(materialtoAdd); //Add the item to player inventory
                        player.getInventory().removeItem(materialtoRemove); //Remove the item from player inventory
                    }
                }
            }
        }
    }
})