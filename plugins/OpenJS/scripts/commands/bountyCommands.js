//!PlaceholderAPI
const Bukkit = org.bukkit.Bukkit;
addCommand("bounty", {
    onCommand: function(sender, args) {
        const Console = Bukkit.getConsoleSender();
        const Scheduler = Bukkit.getGlobalRegionScheduler();
        const ChatColor = org.bukkit.ChatColor;
        const savePLayer = getShared("savePlayer");
        const minBounty = 1000;
        args = toArray(args);
        DiskApi.loadFile("BountyData", true, true)
        const Server = plugin.getServer();
        if (args.length > 0) {
            switch(args[0]) {
                case "set":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        if(args.length === 3) { //Check that 2 arguments were used
                            if(args[2] >= minBounty) { //Check that the number is within the set range
                                const bountyValue = Number(args[2]);
                                const sendingPlayer = sender.getName();

                                if(bountyValue % 1 === 0) { //Check that the number is whole
                                    const playerWithBounty = args[1]
                                    let playerOnline = false;
                                    const onlinePlayers = Bukkit.getOnlinePlayers();
                                    onlinePlayers.forEach(player => { //Ensure that the player is online
                                        if(playerWithBounty === player.getName()) {
                                            playerOnline = true;
                                        }
                                    })

                                    if(playerOnline && playerWithBounty != sendingPlayer) {
                                        const balancePlaceholder = "%foliaeconomy_balance%"
                                        const balance = PlaceholderAPI.parseString(sender, balancePlaceholder) //Get the player's balance
                                        log.info(balance);

                                        if(balance >= bountyValue) { //Check that the player can afford the ticket
                                            const currentBounty = DiskApi.getVar("BountyData", playerWithBounty, 0, true);
                                            const totalBounty = bountyValue + currentBounty;
                                            DiskApi.setVar("BountyData", playerWithBounty, totalBounty, true);
                                            savePLayer(playerWithBounty, "BountyData")
                                            DiskApi.saveFile("BountyData", false, true);
                                            Bukkit.dispatchCommand(Console, "setbal " + sender.getName() + " " + (balance - bountyValue)); //Remove the money from the player
                                            if(bountyValue != totalBounty) {
                                                Server.broadcastMessage("§e§l" + "A bounty has been placed on " + playerWithBounty + "'s head by " + sendingPlayer + ", worth " + bountyValue + ChatColor.RESET + " 㒖" + "§e§l" + "Trade Bars" + ", taking their total bounty to " + totalBounty + ChatColor.RESET + " 㒖" + "§e§l" + " Trade Bars");
                                            }

                                            else {
                                                Server.broadcastMessage("§e§l" + "A bounty has been placed on " + playerWithBounty + "'s head by " + sendingPlayer + ", worth " + bountyValue + ChatColor.RESET + " 㒖" + "§e§l" + "Trade Bars")
                                            }
                                        }

                                        else {
                                            sender.sendMessage(ChatColor.RED + "You do not have " + bountyValue + " 㒖 Trade Bars");
                                        }
                                    }
                                    else {
                                        sender.sendMessage(ChatColor.RED + "This player is offline or yourself");
                                    }
                                }

                                else {
                                    sender.sendMessage(ChatColor.RED + "The number must be whole");
                                }
                            }

                            else {
                                sender.sendMessage(ChatColor.RED + "Not a number greater than or equal to " + minBounty);
                            }
                        }

                        else {
                            sender.sendMessage(ChatColor.RED + "Command format: /bounty set <player>, <whole number greater than or equal to " + minBounty + ">");
                        }
                    })
                    break;

                case "info":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        if(args.length === 2) { //Check that 2 arguments were used
                            const playerData = DiskApi.getVar("BountyData", "players", 0, true);
                            const playerDataList = playerData.split(",");
                            const victim = args[1];
                            let victimInList = false;
                            playerDataList.forEach(playerInData => { //Check that the specified player is in the data
                                if (playerInData.equalsIgnoreCase(victim)) {
                                    victimInList = true;
                                }
                            });

                            if(victimInList) {
                                const bountyValue = DiskApi.getVar("BountyData", victim, 0, true);
                                sender.sendMessage(ChatColor.GREEN + victim + " has a bounty of " + bountyValue + ChatColor.RESET + " 㒖" +  ChatColor.GREEN + "Trade Bars for the taking!!")
                            }

                            else {
                                sender.sendMessage(ChatColor.RED + victim + " has no bounty")
                            }
                        }

                        else {
                           sender.sendMessage(ChatColor.RED + "Command format: /bounty info <player>"); 
                        }
                    })
                    break;

                case "top":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () { 
                        const playerData = DiskApi.getVar("BountyData", "players", 0, true);

                        if(playerData != 0) { //Ensure that any bounties have been set
                            const playerDataList = playerData.split(",");
                            let topBountyHolders = []; //An object to store players and their bounty value

                            playerDataList.forEach(playerInData => { //For every player, get their personal bounty and push it to topTicketHolders
                                let bountyValue = DiskApi.getVar("BountyData", playerInData, 0, true)
                                topBountyHolders.push({name: playerInData, bounty: bountyValue});
                            })
                            topBountyHolders.sort((a, b) => b.bounty - a.bounty);
                            sender.sendMessage(ChatColor.GOLD + "Top 10 Bounties:")
                            let playersCalculated = 0;

                            topBountyHolders.forEach(playerInData => { //For each player, display their name and bounty, up to 10 players
                                if(playersCalculated < 10) {
                                    sender.sendMessage(ChatColor.GREEN + playerInData.name + ": " + ChatColor.WHITE + playerInData.bounty);
                                    playersCalculated++;
                                }

                            })
                        }

                        else {
                            sender.sendMessage(ChatColor.RED + "No bounties have been set");
                        }
                    })
                    break;
            }
        }

        else if(args.length === 0) { //Provide help to players who use 0 arguments
            sender.sendMessage(ChatColor.GOLD + "/bounty set <playername> <amount>" + ChatColor.GREEN + " - Set a bounty");
            sender.sendMessage(ChatColor.GOLD + "/bounty info <playername>" + ChatColor.GREEN + " - The current bounty on that player")
            sender.sendMessage(ChatColor.GOLD + "/bounty top" + ChatColor.GREEN + " - The top 10 bounties");
        }
    },
    
    onTabComplete: function(sender, args) {
        args = toArray(args);
        if (args.length === 1) {
            return toJavaList(["set", "info", "top"]);
        }

        if((args[0] === "set" || args[0] === "info") && args.length === 2) { //Provide tab completion with player names
            const onlinePlayers = Bukkit.getOnlinePlayers();
            let playerNames = [];
            onlinePlayers.forEach(player => {
                playerNames.push(player.getName());
            })

            return toJavaList(playerNames);
        }
        return toJavaList([]);
    }
});