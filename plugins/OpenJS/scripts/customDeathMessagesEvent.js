const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Server = plugin.getServer();
const ChatColor = org.bukkit.ChatColor;
const deathTypeList = getShared("deathTypeList");

registerEvent("org.bukkit.event.entity.PlayerDeathEvent", {
    handleEvent: function(event) {
        DiskApi.loadFile("DeathMessageData", false, true);
        const victim = event.getEntity();
        if(victim.getName()) {
            if (victim.getType().toString() === "PLAYER") { //Ensure that the victim is a player cause this event is broken
                if(event.getDamageSource().getCausingEntity()) {
                    let entityResponsible = event.getDamageSource().getCausingEntity().getName().toString();
                    if(event.getDamageSource().getCausingEntity().getType().toString() != "PLAYER") {
                        entityResponsible = entityResponsible.replace(/\s+/g, ''); //Remove any spaces
                        let deathTypeInList = false;
                        deathTypeList.forEach(deathType => { //Check that the death is in the list
                            if(entityResponsible === deathType) {
                                deathTypeInList = true;
                            }
                        })

                        if(deathTypeInList) { //Display the death message if data is present in DeathMessageData
                            const deathInData = DiskApi.getVar("DeathMessageData", entityResponsible, '0', true);
                            if(deathInData != 0) {
                                event.setDeathMessage(victim.getName() + " " +  deathInData);
                            }
                        }
                    }

                    else {
                        event.setDeathMessage(victim.getName() + " was murdered by " + entityResponsible);
                    }
                }
                
                else {
                    let deathTypeInList = false;
                    let eventResponsible = event.getDamageSource().getDamageType().getTranslationKey() //Get the name of the event
                    eventResponsible = eventResponsible.charAt(0).toUpperCase() + eventResponsible.slice(1);

                    if(eventResponsible === "InFire" || eventResponsible === "OnFire") { //Handle fire having two events
                        eventResponsible = "Fire"
                    }

                    deathTypeList.forEach(deathType => {
                        if(eventResponsible === deathType) { //Check that the death is in the list
                            deathTypeInList = true;
                        }

                        if(deathTypeInList) { //Display the message
                            const deathInData = DiskApi.getVar("DeathMessageData", eventResponsible, '0', true);
                            if(deathInData != 0) {
                                event.setDeathMessage(victim.getName() + " " + deathInData);
                            }
                        }
                    })
                }
            }
        }
    }
})