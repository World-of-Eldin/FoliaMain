const Bukkit = org.bukkit.Bukkit;
const Scheduler = Bukkit.getGlobalRegionScheduler();
const Console = Bukkit.getConsoleSender();
let checkedCoords = []; //An array of coordinates where ores have already been mined
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
    handleEvent: function(event) {
        const blockMined = event.getBlock(); //The block mined by the player
        const bukkit = org.bukkit.Bukkit;
        const blocks = ["IRON_ORE", "GOLD_ORE", "EMERALD_ORE", "DIAMOND_ORE", "ANCIENT_DEBRIS", "DEEPSLATE_IRON_ORE", "DEEPSLATE_GOLD_ORE", "DEEPSLATE_EMERALD_ORE", "DEEPSLATE_DIAMOND_ORE", "RAW_IRON_BLOCK", "RAW_GOLD_BLOCK", "COPPER_ORE", "COPPER_BLOCK", "WAXED_COPPER_BLOCK", "DEEPSLATE_COPPER_ORE", "COAL_ORE", "DEEPSLATE_COAL_ORE", "REDSTONE_ORE", "DEEPSLATE_REDSTONE_ORE", "LAPIS_ORE", "DEEPSLATE_LAPIS_ORE"]; //Ores to record
        blocks.forEach(block => {
            if(blockMined.getType().toString() === block) { //Check that the block mined is an ore
                let oreNotAlreadyDisplayed = true;
                checkedCoords.forEach(coord => {
                    if(blockMined.x === coord[0] && blockMined.y === coord[1] && blockMined.z === coord[2]) { //If the block is in the array, set the value to false.
                        oreNotAlreadyDisplayed = false;
                    }
                })
                const oreCount = oreVeinSize(blockMined, block);
                if(oreNotAlreadyDisplayed)  {//If the ore is not already displayed, display it
                    let block = "";
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
                    if(blockMined.getType().toString().indexOf("COPPER") > -1) {
                        block = "copper"
                    }
                    if(blockMined.getType().toString().indexOf("COAL") > -1) {
                        block = "coal"
                    }
                    if(blockMined.getType().toString().indexOf("REDSTONE") > -1) {
                        block = "redstone";
                    }
                    if(blockMined.getType().toString().indexOf("LAPIS") > -1) {
                        block = "lapis"
                    }
                    const onlinePlayer = bukkit.getOnlinePlayers();
                    message = event.getPlayer().name + " found " + oreCount + " " + block + " at " + blockMined.x + ", " + blockMined.y + ", " + blockMined.z
                    onlinePlayer.forEach(player => {
                        if(player.hasPermission("eldin.staff")) { //Check that player is staff
                            player.sendMessage(message); //Send the ore found message.
                        }
                    })

                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        Bukkit.dispatchCommand(Console, "discordsrv bcast #1443427143660077157 " + message); //Send the discord message
                    });
                }
            }
        })
    }
});

function oreVeinSize(block, ore) {
    let oreMined = 0;
    for(let xCoord = -3; xCoord < 3; xCoord++) { //x coordinate
        for(let yCoord = -3; yCoord < 3; yCoord++) { //y coordinate
            for(let zCoord = -3; zCoord < 3; zCoord++) { //z coordinate
                if(block.getRelative(xCoord, yCoord, zCoord).getType().toString() === ore) { //ensure block is of the right type
                    oreMined++;
                    let orePresent = true;
                    checkedCoords.forEach(coord => {
                        if(block.getRelative(xCoord,yCoord,zCoord).x === coord[0] && block.getRelative(xCoord,yCoord,zCoord).y === coord[1] && block.getRelative(xCoord,yCoord,zCoord).z === coord[2]) { //Ensure that coordinates that exist in the array are not rechecked
                            orePresent = false;
                        }
                    })
                    if(orePresent === true) {
                        checkedCoords.push([block.getRelative(xCoord,yCoord,zCoord).x, block.getRelative(xCoord,yCoord,zCoord).y, block.getRelative(xCoord,yCoord,zCoord).z]) //Add the coordinates to the array
                    }
                }
            }
        }
    }
    return oreMined;
}

task.repeat(0, 3600, () => { 
    checkedCoords = [];
});