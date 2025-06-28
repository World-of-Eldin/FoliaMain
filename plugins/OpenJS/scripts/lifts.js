const ChatColor = org.bukkit.ChatColor;
registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
    handleEvent: function(event) {
        const player = event.getPlayer();
        const block = event.getClickedBlock()
        const Server = plugin.getServer();
        if(block != null) {

            if(block.getType().toString().indexOf("SIGN") > -1 && event.getAction().toString() === "RIGHT_CLICK_BLOCK") { //Check that the block is a sign and that player right clicked it
                const sign =  block.getState();
                let liftUp = false;
                let liftDown = false;

                for(let i = 0; i < 4; i++) { //Iterate through all 4 lines of the sign
                    const line = sign.getTargetSide(player).getLine(i)
                    if(line.indexOf("Lift Up") > -1) {
                        liftUp = true;
                    }
                    if(line.indexOf("Lift Down") > -1) {
                        liftDown = true;
                    }
                }

                if(liftUp && liftDown) { //Notify players if they put both
                    player.sendMessage(ChatColor.RED + "Both Lift Up and Lift Down are in one sign")
                }

                else if(liftUp || liftDown) {
                    const liftX = block.getX() + 0.5; //Add 0.5 to spawn in middle of block
                    const liftY = block.getY();
                    const liftZ = block.getZ() + 0.5; //Add 0.5 to spawn in middle of block
                    
                    if(liftUp) {
                        log.info("Lift Up ran")
                        for(let i = liftY; i < 320; i++) { //Search upwards from lift location to the height limit
                            const world = Server.getWorld("world"); 
                            const location = new org.bukkit.Location(player.getWorld(), liftX, i, liftZ);
                            const blockAtLocation = world.getBlockAt(location);
                            if(blockAtLocation.getType().toString().indexOf("SIGN") > -1) {
                                
                                for(let j = 0; j < 4; j++) {
                                    const line = blockAtLocation.getState().getTargetSide(player).getLine(j);
                                    if(line.indexOf("Lift Down") > -1) {
                                        player.teleportAsync(location)
                                        event.setCancelled(true);
                                        return;
                                    }
                                }
                            }
                        }
                    }

                    if(liftDown) {
                        for(let i = liftY; i > -64; i--) { //Search downwars from lift location to the height limit
                            log.info("Lift Down ran")
                            const world = Server.getWorld("world");
                            const location = new org.bukkit.Location(player.getWorld(), liftX, i, liftZ);
                            const blockAtLocation = world.getBlockAt(location);
                            if(blockAtLocation.getType().toString().indexOf("SIGN") > -1) {
                                
                                for(let j = 0; j < 4; j++) {
                                    const line = blockAtLocation.getState().getTargetSide(player).getLine(j);
                                    if(line.indexOf("Lift Up") > -1) {
                                        player.teleportAsync(location)
                                        event.setCancelled(true);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
})