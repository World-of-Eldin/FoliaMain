const Bukkit = org.bukkit.Bukkit;
const PotionEffect = org.bukkit.potion.PotionEffect;
const PotionEffectType = org.bukkit.potion.PotionEffectType;
addCommand("vanish", { 
    onCommand: function(sender, args) {
        if (!sender.hasMetadata("vanished")) { //Check that the sender is not already vanished
            const onlinePlayers = Bukkit.getOnlinePlayers();

            onlinePlayers.forEach(player => {
                if(!player.hasPermission("eldin.staff")) {
                    player.hidePlayer(sender); //Hide the sender to all non-staff players
                }
            }) 
            sender.setMetadata("vanished", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to vanished
            sender.setMetadata("god", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to god
            const nightVisionEffect = new PotionEffect(PotionEffectType.NIGHT_VISION, 100000000, 0, false, false);
            sender.addPotionEffect(nightVisionEffect); //Add a night vision effect
            sender.setAllowFlight(true); //Allow flight
        }

        else {
            const onlinePlayers = Bukkit.getOnlinePlayers();
            onlinePlayers.forEach(player => {
                player.showPlayer(sender); //Show the sender to all players
            })
            sender.removePotionEffect(PotionEffectType.NIGHT_VISION); //Remove the night vision effect
            sender.removeMetadata("vanished", plugin); //Remove the vanished metadata
        }
    }, 
    onTabComplete: function (sender, args) {
        return []
    }
},
"eldin.staff");

addCommand("fly", {
    onCommand: function(sender, args) {
        if (!sender.getAllowFlight() === true) {
            sender.setAllowFlight(true) //Allow flight
            sender.sendMessage("You can now fly");
        }

        else {
            sender.setAllowFlight(false) //Remove flight 
            sender.sendMessage("You can no longer fly");
        }
    }, 
    onTabComplete: function (sender, args) {
        return []
    }
},
"eldin.staff");

addCommand("god", {
    onCommand(sender, args) {
        if (!sender.hasMetadata("god")) {
            sender.setMetadata("god", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to god
            sender.sendMessage("You are now in god mode");
        }

        else {
            sender.removeMetadata("god", plugin);
            sender.sendMessage("You are no longer in god mode"); //Remove the god metadata
        }
    }, 
    onTabComplete: function (sender, args) {
        return []
    }
},
"eldin.staff");