const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
const PotionEffect = org.bukkit.potion.PotionEffect;
const PotionEffectType = org.bukkit.potion.PotionEffectType;
registerEvent("org.bukkit.event.player.PlayerJoinEvent", {
    handleEvent: function(event) {
        const joiningPlayer = event.getPlayer();
        if(joiningPlayer.hasPermission("eldin.staff")) {
            const onlinePlayers = Bukkit.getOnlinePlayers();

            onlinePlayers.forEach(player => {
                if(!player.hasPermission("eldin.staff")) {
                    player.hidePlayer(joiningPlayer); //Hide the sender to all non-staff players
                }
            }) 
            const nightVisionEffect = new PotionEffect(PotionEffectType.NIGHT_VISION, Number.MAX_VALUE, 0, false, false);
            joiningPlayer.addPotionEffect(nightVisionEffect);
            joiningPlayer.setMetadata("vanished", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to vanished
            joiningPlayer.setAllowFlight(true); //Allow flight
            joiningPlayer.setMetadata("god", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to god
            event.setJoinMessage(""); //Block the join message
            joiningPlayer.sendActionBar(ChatColor.GOLD + "You are vanished"); //Notify the player that they are vanished

        }
        
        else {
            const onlinePlayers = Bukkit.getOnlinePlayers();

            onlinePlayers.forEach(player => {
                if(player.hasPermission("eldin.staff")) {
                   joiningPlayer.hidePlayer(player); //Hide the joining player
                }
            }) 
        }
    }
});

registerEvent("org.bukkit.event.player.PlayerQuitEvent", {
    handleEvent: function(event) {
        const joiningPlayer = event.getPlayer();
        if(joiningPlayer.hasMetadata("vanished")) {
            event.setQuitMessage(""); //Remove the leave message
        }
    }
});

registerEvent("org.bukkit.event.entity.EntityTargetEvent", { //Stop entities from targeting vanished players
    handleEvent: function(event) {
        const target = event.getTarget();
        if(target) {
            if(target.getType().toString() === "PLAYER") {
                if(target.hasMetadata("vanished")) {
                    event.setCancelled(true);
                }
            }
        }
    }
})

registerEvent("org.bukkit.event.entity.EntityDamageEvent", { //Stop damage being dealt to players in god mode
    handleEvent: function(event) {
        const entity = event.getEntity();
        if(entity.getType().toString() === "PLAYER") {
            if(entity.hasMetadata("god")) { 
                event.setCancelled(true);
            }
        }
    }
})

registerEvent("org.bukkit.event.entity.FoodLevelChangeEvent", { //Stop food level changing for players in god mode
    handleEvent: function(event) {
        const entity = event.getEntity();
        if(entity.getType().toString() === "PLAYER") {
            if(entity.hasMetadata("god")) { 
                event.setCancelled(true);
            }
        }
    }
})

registerEvent("org.bukkit.event.player.PlayerPickupItemEvent", { //Stop vanished players picking up items
    handleEvent: function(event) {
        const player = event.getPlayer()
        if(player.hasMetadata("vanished")) {
            event.setCancelled(true);
        }
    }
})

registerEvent("org.bukkit.event.server.TabCompleteEvent", {
    handleEvent: function(event) {
        const completions = event.getCompletions(); //The tab completions for the event
        const newCompletions = []; //The tab completions to return
        const onlinePlayerNames = new Set(); //A set of player names
        let playerCompletionExists = false;
        Bukkit.getOnlinePlayers().forEach(player => {
            if (!player.hasMetadata("vanished")) {
                onlinePlayerNames.add(player.getName()); //Add the player name to the set
            }
        });

        completions.forEach(completion => {
            if (onlinePlayerNames.has(completion)) { //Check that the player is a completion so that functionality is not run on other types of commands
                playerCompletionExists = true;
            }
        });
        
        if(playerCompletionExists) {
            completions.forEach(completion => {
                if (onlinePlayerNames.has(completion)) { //Push the completion to new completions if it is in the set
                    newCompletions.push(completion);
                }
            });
            event.setCompletions(newCompletions); //Set the tab completions to the new completions
        }

        else {
            event.setCompletions(completions) //Use the existng completions
        }

    }
}, "HIGHEST")

registerEvent("org.bukkit.event.server.ServerListPingEvent", {
    handleEvent: function(event) {
        const listedPlayers = event.getListedPlayers();

        if (listedPlayers != null) {
            const iterator = listedPlayers.iterator();
            while (iterator.hasNext()) {
                const player = Bukkit.getPlayer(iterator.next().id); //Get the next player
                if (player && player.hasMetadata("vanished")) {
                    iterator.remove(); //Remove the player from the list
                }
            }
            event.setNumPlayers(listedPlayers.size()); //Change the number of players displayed

        } 
    }
})

task.repeat(0, 2, () => { //Refresh an action bar every 20 ticks to notify vanished players
    const onlinePlayers = Bukkit.getOnlinePlayers();
        onlinePlayers.forEach(player => {
            if(player.hasMetadata("vanished")) {
                player.sendActionBar(ChatColor.GOLD + "You are vanished");
            }
        }) 
});
