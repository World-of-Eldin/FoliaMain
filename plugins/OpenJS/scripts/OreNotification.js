var checkedCoords = []; //An array of coordinates where ores have already been mined
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
    handleEvent: function(event) {
        var blockMined = event.getBlock(); //The block mined by the player
        var bukkit = org.bukkit.Bukkit;
        var blocks = ["IRON_ORE", "GOLD_ORE", "EMERALD_ORE", "DIAMOND_ORE", "ANCIENT_DEBRIS", "DEEPSLATE_IRON_ORE", "DEEPSLATE_GOLD_ORE", "DEEPSLATE_EMERALD_ORE", "DEEPSLATE_DIAMOND_ORE", "RAW_IRON_BLOCK", "RAW_GOLD_BLOCK"]; //Ores to record
        var scriptUsers = ["cerberus402", "Awesomebrendan"] //A list of script users to check against when sending messages
        for(var i = 0; i < blocks.length; i++) {
            if(blockMined.getType().toString() === blocks[i]) { //Check that the block mined is an ore
                var oreNotAlreadyDisplayed = true;
                for(j = 0; j < checkedCoords.length; j++) {
                    if(blockMined.x === checkedCoords[j][0] && blockMined.y === checkedCoords[j][1] && blockMined.z === checkedCoords[j][2]) { //If the block is in the array, set the value to false.
                        oreNotAlreadyDisplayed = false;
                    }
                }
                if(oreNotAlreadyDisplayed) { //If the ore is not already displayed, display it
                    for(c = 0; c < scriptUsers.length; c++) {
                        var targetPlayer = bukkit.getPlayer(scriptUsers[c]);
                        if(targetPlayer === null) { //Ensure that staff member is online
                        }
                        else {
                            var block = "";
                            if(blockMined.getType().toString().indexOf("IRON") > -1) { //Several if statements to convert the event block type into a short, easily readable type.
                                block="iron"
                            }
                            if(blockMined.getType().toString().indexOf("GOLD") > -1) {
                                block="gold"
                            }
                            if(blockMined.getType().toString().indexOf("EMERALD") > -1) {
                                block="emerald"
                            }
                            if(blockMined.getType().toString().indexOf("DIAMOND") > -1) {
                                block="diamond"
                            }
                            if(blockMined.getType().toString().indexOf("DEBRIS") > -1) {
                                block="debris"
                            }
                            targetPlayer.sendMessage(event.getPlayer().name + " found " + oreVeinSize(blockMined, blocks[i]) + " " + block + " at " + blockMined.x + ", " + blockMined.y + ", " + blockMined.z); //Send the ore found message.
                        }
                    }
                }
            }
        }
    }
});

function oreVeinSize(block, ore) {
    var oreMined = 0;
    for(var xCoord = -3; xCoord < 3; xCoord++) { //x coordinate
        for(var yCoord = -3; yCoord < 3; yCoord++) { //y coordinate
            for(var zCoord = -3; zCoord < 3; zCoord++) { //z coordinate
                if(block.getRelative(xCoord, yCoord, zCoord).getType().toString() === ore) { //ensure block is of the right type
                    oreMined++;
                    var orePresent = true;
                    for(d = 0; d < checkedCoords.length; d++) {
                        if(block.getRelative(xCoord,yCoord,zCoord).x === checkedCoords[d][0] && block.getRelative(xCoord,yCoord,zCoord).y === checkedCoords[d][1] && block.getRelative(xCoord,yCoord,zCoord).z === checkedCoords[d][2]) { //Ensure that coordinates that exist in the array are not rechecked
                            orePresent = false;
                        }
                    }
                    if(orePresent === true) {
                        checkedCoords.push([block.getRelative(xCoord,yCoord,zCoord).x, block.getRelative(xCoord,yCoord,zCoord).y, block.getRelative(xCoord,yCoord,zCoord).z]) //Add the coordinates to the array
                    }
                }
            }
        }
    }
    return oreMined;
}