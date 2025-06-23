    var crops = ["WHEAT", "NETHER_WART", "POTATOES", "CARROTS", "PUMPKIN", "MELON", "BEETROOTS", "SUGAR_CANE", "BAMBOO", "KELP", "CACTUS", "SWEET_BERRY_BUSH", "CHORUS_PLANT", "CHORUS_FLOWER", "RED_MUSHROOM", "BROWN_MUSHROOM"];
registerEvent("org.bukkit.event.block.BlockPistonExtendEvent", {
    handleEvent: function(event) {
        var block = event.getBlock();
        var direction = event.getDirection().toString();
        switch(direction) {
            case "SOUTH":
                for(z = 1; z <= 14; z++) {
                    for(y = -1; y <= 2; y++) {
                        for(i = 0; i < crops.length; i++) {
                            if(block.getRelative(0, y, z).getType().toString() === crops[i]) {
                                event.setCancelled(true);
                            }
                        }
                    }
                }
            
            case "NORTH":
            for(z = 1; z >= -14; z--) {
                for(y = -1; y <= 2; y++) {
                    for(i = 0; i < crops.length; i++) {
                        if(block.getRelative(0, y, z).getType().toString() === crops[i]) {
                            event.setCancelled(true);
                        }
                    }
                }
            }
        
            case "EAST":
            for(x = 1; x <= 14; x++) {
                for(y = -1; y <= 2; y++) {
                    for(i = 0; i < crops.length; i++) {
                        if(block.getRelative(x, y, 0).getType().toString() === crops[i]) {
                            event.setCancelled(true);
                        }
                    }
                }
            }
        
            case "WEST":
            for(x = 1; x >= -14; x--) {
                for(y = -1; y <= 2; y++) {
                    for(i = 0; i < crops.length; i++) {
                        if(block.getRelative(x, y, 0).getType().toString() === crops[i]) {
                            event.setCancelled(true);
                        }
                    }
                }
            }
        
            case "UP":
                for(y = 1; y <= 14; y++) {
                    for(i = 0; i < crops.length; i++) {
                        if(block.getRelative(0, y, 0).getType().toString() === crops[i]) {
                            event.setCancelled(true);
                        }
                    }
                }
            
            case "DOWN":
                for(y = -14; y <= 0; y++) {
                    for(i = 0; i < crops.length; i++) {
                        if(block.getRelative(0, y, 0).getType().toString() === crops[i]) {
                            event.setCancelled(true);
                        }
                    }
                }
        }
    }
})