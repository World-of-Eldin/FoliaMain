//!PlaceholderAPI
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
const Server = plugin.getServer();
const ChatColor = org.bukkit.ChatColor;
const discordSRV = Server.getPluginManager().getPlugin("DiscordSRV");

registerEvent("org.bukkit.event.entity.EntityDeathEvent", {
    handleEvent: function(event) {
        DiskApi.loadFile("BountyData", false, true);
        const entityResponsible = event.getDamageSource().getCausingEntity();
        const victim = event.getEntity();
        if (entityResponsible) { //Ensure that null entities are not passed through
            if(entityResponsible != victim) {
                if (entityResponsible.getType().toString() === "PLAYER" && victim.getType().toString() === 'PLAYER') {
                    const responsiblePlayer = entityResponsible.getName().toString();
                    const playerData = DiskApi.getVar("BountyData", "players", '0', true);

                    const victimName = event.getEntity().getName();
                    if (playerData != 0) {
                        const playerDataList = playerData.split(",");
                        let victimInList = false;
                        playerDataList.forEach(playerInData => { //If the victim is in the data, continue
                            if (playerInData === victimName) {
                                victimInList = true;
                            }
                        });

                        if (victimInList) {
                            const bountyValue = DiskApi.getVar("BountyData", victimName, '0', true);
                            Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                                const player = entityResponsible;
                                const balanceStr = PlaceholderAPI.parseString(player, "%foliaeconomy_balance%");
                                const balance = Number(balanceStr);
                                log.info("Balance of " + player.getName() + ": " + balance);
                                log.info("Correct balance: " + balance);
                                Bukkit.dispatchCommand(Console, "setbal " + responsiblePlayer + " " + (balance + bountyValue)); //Give the killer money
                            });
                            DiskApi.setVar("BountyData", victimName, '0', true);
                            const indexToRemove = playerDataList.indexOf(victimName);
                            playerDataList.splice(indexToRemove, 1); //Splice of the string to remove the index of the individual player
                            const updatedPlayerData = playerDataList.join(",");
                            DiskApi.setVar("BountyData", "players", updatedPlayerData, true)
                            DiskApi.saveFile("BountyData", false, true);
                            Server.broadcastMessage("§e§l" + victimName + "'s bounty was claimed by " + responsiblePlayer + ", giving them " + bountyValue + ChatColor.RESET + " 㒖" + "§e§l" + "Trade Bars")
                            const responsiblePlayerAddress = entityResponsible.getAddress().getAddress().getHostAddress(); //The IP address of the killer
                            const victimAddress = victim.getAddress().getAddress().getHostAddress(); //The IP address of the victim
                            const responsiblePlayerHostName = entityResponsible.getAddress().getHostName(); //The host name of the killer
                            const victimHostName = victim.getAddress().getHostName(); //The host name of the victim

                            if(responsiblePlayerAddress === victimAddress) {
                                if(responsiblePlayerHostName === victimHostName) {
                                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                                        const message = " Bounty: " + responsiblePlayer + " and " + victimName + " share an IP address and host name" + ", with " + responsiblePlayer + " claiming a bounty of " + bountyValue;
                                        Bukkit.dispatchCommand(Console, "discordsrv bcast #1388395111133479004" + message);
                                    });
                                }

                                else {
                                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                                        const message = " " + responsiblePlayer + " and " + victimName + " share an IP address" + ", with " + responsiblePlayer + " claiming a bounty of " + bountyValue;
                                        Bukkit.dispatchCommand(Console, "discordsrv bcast #1388395111133479004" + message);
                                    });
                                }
                            }
                        }
                    }
                }
            }
        }
    }
});