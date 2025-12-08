//!PlaceholderAPI
const Bukkit = org.bukkit.Bukkit;
const deathTypeList = ["Fall", "Cactus", "FlyIntoWall", "Lava", "Fire", "Starve", "Drown", "inWall", "Zombie", "Skeleton", "Spider", "Creeper", "Enderman", "Endermite", "Bee", "Blaze", "Bogged", "Breeze", "CaveSpider", "Creaking", "Drowned", "ElderGuardian", "Guardian", "Evoker", "Vex", "Ghast", "Hoglin", "Zoglin", "Llama", "Iron Golem", "Husk", "MagmaCube", "Panda", "Piglin", "PiglinBrute", "Pillager", "PolarBear", "Pufferfish", "Ravager", "Shulker", "Silverfish", "Slime", "Stray", "Vindicator", "Warden", "Witch", "WitherSkeleton", "Wolf", "ZombieVillager", "ZombifiedPiglin", "Wither", "EnderDragon"];
addCommand("customdeath", {
    onCommand: function(sender, args) {
        if(sender.hasPermission("eldin.staff")) {
            const Scheduler = Bukkit.getGlobalRegionScheduler();
            const ChatColor = org.bukkit.ChatColor;
            DiskApi.loadFile("DeathMessageData", true, true)

            if (args.length > 0) {
                switch(args[0]) {
                    case "set":
                        Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                            let message = "";
                            if(args.length >= 3) { //Accomodate for spaces
                                const deathType = args[1];
                                for(let i = 0; i < args.length; i++) {
                                    if(i > 1) { //Check arguments above 1
                                        if(i != args.length - 1) { //Avoid a trailing space
                                            message = message + args[i] + " ";
                                        }

                                        else {
                                            message = message + args[i];
                                        }
                                    }
                                }

                                let correctDeathTypeUsed = false;
                                deathTypeList.forEach(death => { //Check that the death is in the list
                                    if(deathType === death) {
                                        correctDeathTypeUsed = true;
                                    }

                                })

                                if(correctDeathTypeUsed) { //Save the death message
                                    DiskApi.setVar("DeathMessageData", deathType, message, true);
                                    DiskApi.saveFile("DeathMessageData", true, true);
                                    sender.sendMessage(ChatColor.GOLD + "Set the message for dying to a " +  deathType + " to \"" + ChatColor.GREEN + message + ChatColor.GOLD + "\"");
                                }

                                else {
                                    sender.sendMessage(ChatColor.RED + "This death type is not in the listed types")
                                }
                            }

                            else {
                                sender.sendMessage(ChatColor.RED  + "Command format: /customdeath set <death type> <message>")
                            }
                        })
                        break;
                    
                    case "info": 
                        Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                            if(args.length === 2) {
                                const deathType = args[1];
                                let correctDeathTypeUsed = false;
                                deathTypeList.forEach(death => { //Check that the death is in the list
                                    if(deathType === death) {
                                        correctDeathTypeUsed = true;
                                    }

                                })

                                if(correctDeathTypeUsed) { //Display the death message
                                    const deathInData = DiskApi.getVar("DeathMessageData", deathType, '0', true);
                                    if(deathInData != 0) {
                                        sender.sendMessage(ChatColor.GOLD + "Death message for " + deathType + " is " + "\"" + ChatColor.GREEN + deathInData + ChatColor.GOLD + "\"");
                                    }

                                    else {
                                        sender.sendMessage(ChatColor.RED + "No message has been set for this type of death");
                                    }
                                }
                                
                                else {
                                    sender.sendMessage(ChatColor.RED + "This death type is not in the listed types");
                                }
                            }

                            else {
                                sender.sendMessage(ChatColor.RED + "Command format: /customdeath info <death type")
                            }
                        })
                        break;

                    case "reset":
                        Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                            if(args.length === 2) {
                                const deathType = args[1];
                                let correctDeathTypeUsed = false;
                                deathTypeList.forEach(death => {
                                    if(deathType === death) {
                                        correctDeathTypeUsed = true;
                                    }

                                })

                                if(correctDeathTypeUsed) {
                                    const deathInData = DiskApi.getVar("DeathMessageData", deathType, '0', true);
                                    if(deathInData != 0) { //Ensure that the death is present and reset it
                                        DiskApi.setVar("DeathMessageData", deathType, '0', true);
                                        DiskApi.saveFile("DeathMessageData", true, true);
                                        sender.sendMessage(ChatColor.GOLD + "The death message for " + deathType + " has been reset")
                                    }

                                    else {
                                        sender.sendMessage(ChatColor.RED + "No message has been set for this type of death");
                                    }
                                }
                                
                                else {
                                    sender.sendMessage(ChatColor.RED + "This death type is not in the listed types");
                                }
                            }

                            else {
                                sender.sendMessage(ChatColor.RED + "Command format: /customdeath reset <death type")
                            }
                        })
                }
            }
            else {
                sender.sendMessage(ChatColor.GOLD + "/customdeath set <death type> <message>" + ChatColor.GREEN + " - Add a message to a death");
                sender.sendMessage(ChatColor.GOLD + "/customdeath info <death type" + ChatColor.GREEN + " - See the message for a death");
                sender.sendMessage(ChatColor.GOLD + "/customdeath reset" + ChatColor.GREEN + " - Reset the message for a death to default");
            }
        }
    },
    onTabComplete: function(sender, args) {
        if(sender.hasPermission("eldin.staff")) {
            args = toArray(args);
            if (args.length === 1) {
                return toJavaList(["set", "info", "reset"]);
            }

            if((args[0] === "set" || args[0] === "info" || args[0] === "reset") && args.length === 2) { //Provide tab completion with player name
                if(args[1] === "") {
                    return toJavaList(deathTypeList);
                }

                else {
                    const length = args[1].length;
                    let newList = [];
                    deathTypeList.forEach(death => { //For each item in the list, if their start matches the argument, display them
                        const caseChanged = args[1] .charAt(0).toUpperCase() + args[1].slice(1);
                        if(death.substring(0, length) === caseChanged) {
                            newList.push(death);
                        }
                    })
                    return toJavaList(newList);
                }
            }
            return toJavaList([]);
        }
    }
});

setShared("deathTypeList", deathTypeList)