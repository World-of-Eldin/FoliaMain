const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
const Server = plugin.getServer();
const ChatColor = org.bukkit.ChatColor;

registerEvent("org.bukkit.event.entity.EntityDeathEvent", {
    handleEvent: function(event) {
        DiskApi.loadFile("BountyData", false, true);
        const entityResponsible = event.getDamageSource().getCausingEntity();
        if (entityResponsible) { //Ensure that null entities are not passed through
            if (entityResponsible.getType().toString() === "PLAYER") {
                const responsiblePlayer = entityResponsible.getName().toString();
                const victim = event.getEntity().getName();
                const playerData = DiskApi.getVar("BountyData", "players", 0, true);

                if (playerData != 0) {
                    const playerDataList = playerData.split(",");
                    let victimInList = false;
                    playerDataList.forEach(playerInData => { //If the victim is in the data, continue
                        if (playerInData === victim) {
                            victimInList = true;
                        }
                    });

                    if (victimInList) {
                        const responsiblePlayerAddress = entityResponsible.getAddress().getAddress().getHostAddress(); //The IP address of the killer
                        const victimAddress = event.getEntity().getAddress().getAddress().getHostAddress(); //The IP address of the victim

                        if(responsiblePlayerAddress != victimAddress) { //Check that the killer and victim do not have the same IP address
                            const bountyValue = DiskApi.getVar("BountyData", victim, 0, true);
                            Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                                Bukkit.dispatchCommand(Console, "economy add " + responsiblePlayer + " " + bountyValue); //Give the killer money
                            });
                            DiskApi.setVar("BountyData", victim, 0, true);
                            const indexToRemove = playerDataList.indexOf(victim);
                            playerDataList.splice(indexToRemove, 1); //Splice of the string to remove the index of the individual player
                            const updatedPlayerData = playerDataList.join(",");
                            DiskApi.setVar("BountyData", "players", updatedPlayerData, true)
                            DiskApi.saveFile("BountyData", false, true);
                            Server.broadcastMessage("§e§l" + victim + "'s bounty was claimed by " + responsiblePlayer + ", giving them " + bountyValue + ChatColor.RESET + " 㒖" + "§e§l" + "Tradebars")
                        }

                        else {
                            Server.broadcastMessage("§e§l" + "Bounty is unclaimed as " + responsiblePlayer + " and " + victim + " share an IP address")
                        }
                    }
                }
            }
        }
    }
});