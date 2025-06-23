registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
    handleEvent: function(event) {
        var ItemStack = org.bukkit.inventory.ItemStack; //The Bukkit ItemStack class
        var Material = org.bukkit.Material; //The Bukkit Material class
        var player = event.getPlayer();
        if(event.getClickedBlock() != null && player.hasPermission("eldin.xp.bottle")) {
            if(event.getClickedBlock().type.toString() === "ENCHANTING_TABLE" && event.getAction().toString() === "RIGHT_CLICK_BLOCK") { //Check that block is enchanting table and right click is used
                if(player.isSneaking() && player.getInventory().getItemInMainHand().type.toString() === "GLASS_BOTTLE") { //Check that player is crouching and holding a glass bottle
                    if(event.getHand().toString() === "HAND" && player.getLevel() > 0) { //Ensure that the logic does not run twice because of the off hand and ensure that the player is at least level 1
                        var material = Material.getMaterial("EXPERIENCE_BOTTLE");
                        var XPBottle = new ItemStack(material, 1); //Add the exp bottle to player inventory
                        player.getInventory().addItem(XPBottle);
                        material = Material.getMaterial("GLASS_BOTTLE")
                        var glassBottle = new ItemStack(material, 1)
                        player.getInventory().removeItem(glassBottle); //Remove the glass bottle from player inventory
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