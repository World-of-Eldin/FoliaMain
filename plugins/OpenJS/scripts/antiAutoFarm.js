const crops = ["WHEAT", "NETHER_WART", "POTATOES", "CARROTS", "PUMPKIN", "MELON", "BEETROOTS", "SUGAR_CANE", "BAMBOO", "KELP", "CACTUS", "SWEET_BERRY_BUSH", "CHORUS_PLANT", "CHORUS_FLOWER", "RED_MUSHROOM", "BROWN_MUSHROOM"];
registerEvent("org.bukkit.event.block.BlockPistonExtendEvent", {
    handleEvent: function(event) {
        antiCrop(event)
    }
})

registerEvent("org.bukkit.event.block.BlockPistonRetractEvent", {
    handleEvent: function(event) {
        antiCrop(event)
    }
})

registerEvent("org.bukkit.event.block.BlockFromToEvent", {
    handleEvent: function(event) {
        let face = event.getToBlock().getType().toString();
        let block = event.getBlock().getType().toString();
        if(block === "WATER") {
            crops.forEach(crop => {
                if(crop === face) {
                    event.setCancelled(true);
                }
            })
        }
    }
})

function antiCrop(event) {
    const block = event.getBlock();
    const direction = event.getDirection().toString();
    switch(direction) {
        case "SOUTH":
            for(let z = 1; z <= 14; z++) {
                for(let y = -1; y <= 2; y++) {
                    crops.forEach(crop => {
                        if(block.getRelative(0, y, z).getType().toString() === crop) {
                            event.setCancelled(true);
                        }
                    })
                }
            }
        
        case "NORTH":
        for(let z = 1; z >= -14; z--) {
            for(let y = -1; y <= 2; y++) {
                crops.forEach(crop => {
                    if(block.getRelative(0, y, z).getType().toString() === crop) {
                        event.setCancelled(true);
                    }
                })
            }
        }
    
        case "EAST":
        for(let x = 1; x <= 14; x++) {
            for(let y = -1; y <= 2; y++) {
                crops.forEach(crop => {
                    if(block.getRelative(x, y, 0).getType().toString() === crop) {
                        event.setCancelled(true);
                    }
                })
            }
        }
    
        case "WEST":
        for(let x = 1; x >= -14; x--) {
            for(let y = -1; y <= 2; y++) {
                crops.forEach(crop => {
                    if(block.getRelative(x, y, 0).getType().toString() === crop) {
                        event.setCancelled(true);
                    }
                })
            }
        }
    
        case "UP":
            for(let y = 1; y <= 14; y++) {
                crops.forEach(crop => {
                    if(block.getRelative(0, y, 0).getType().toString() === crop) {
                        event.setCancelled(true);
                    }
                })
            }
        
        case "DOWN":
            for(let y = -14; y <= 0; y++) {
                crops.forEach(crop => {
                    if(block.getRelative(0, y, 0).getType().toString() === crop) {
                        event.setCancelled(true);
                    }
                })
            }
    }
}