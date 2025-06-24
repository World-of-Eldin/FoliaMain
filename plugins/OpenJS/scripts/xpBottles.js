registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
    handleEvent: function(event) {
        const ItemStack = org.bukkit.inventory.ItemStack; //The Bukkit ItemStack class
        const Material = org.bukkit.Material; //The Bukkit Material class
        const player = event.getPlayer();
        const inventory = player.getInventory();
        if(event.getClickedBlock() != null && player.hasPermission("eldin.xp.bottle")) {
            if(event.getClickedBlock().type.toString() === "ENCHANTING_TABLE" && event.getAction().toString() === "RIGHT_CLICK_BLOCK") { //Check that block is enchanting table and right click is used
                if(player.isSneaking() && inventory.getItemInMainHand().type.toString() === "GLASS_BOTTLE") { //Check that player is crouching and holding a glass bottle
                    if(event.getHand().toString() === "HAND" && player.getLevel() > 0) { //Ensure that the logic does not run twice because of the off hand and ensure that the player is at least level 1
                        let material = Material.getMaterial("GLASS_BOTTLE")
                        const glassBottle = new ItemStack(material, 1)
                        material = Material.getMaterial("EXPERIENCE_BOTTLE");
                        const XPBottle = new ItemStack(material, 1); //Add the exp bottle to player inventory
                        let partialStack = false;
                        inventory.forEach(item => {;
                            if(item != null && item.getType() == material && item.getAmount() < 64) {
                                partialStack = true;
                            }
                        });

                        if(inventory.firstEmpty() >= 0 || partialStack) {
                            inventory.addItem(XPBottle);
                        }
                        else {
                            player.getWorld().dropItem(player.getLocation(), XPBottle)
                        }
                        inventory.removeItem(glassBottle); //Remove the glass bottle from player inventory
                        player.giveExp(-7); //Subtract 7 exp from the player
                    }
                }
            }
        }
    }
})

registerEvent("org.bukkit.event.entity.ExpBottleEvent", {
    handleEvent: function(event) {
        event.setExperience(7); //Make exp bottle drop 7 xp
    }
})