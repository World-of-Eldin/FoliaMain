const Bukkit = org.bukkit.Bukkit;
const PotionEffect = org.bukkit.potion.PotionEffect;
const PotionEffectType = org.bukkit.potion.PotionEffectType;
const ChatColor = org.bukkit.ChatColor;
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
            const nightVisionEffect = new PotionEffect(PotionEffectType.NIGHT_VISION, Number.MAX_VALUE, 0, false, false);
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
    }
    },
    "eldin.staff"
);

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
    }
    },
    "eldin.staff"
);

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
    }},
    "eldin.staff"
);

addCommand("msg", {
    onCommand(sender, args) {
        messanger(sender, args, "msg")
    }}
);

addCommand("tell", {
    onCommand(sender, args) {
        messanger(sender, args, "tell")
    }}
);

function messanger(sender, args, command) {
    if (args.length >= 2) {
        commandPlayer = args[0]
        i = 1
        message = ""
        while (i < args.length) {
            message = message + args[i] + " "
            i++
        }
        const onlinePlayers = Bukkit.getOnlinePlayers();
        playerOnline = false
        onlinePlayers.forEach(player => { //Ensure that the player is online
            if(commandPlayer === player.getName()) {
                playerOnline = true;
            }
        })


        if(playerOnline) {
            playerObject = Bukkit.getPlayerExact(commandPlayer)
            if(playerObject.hasMetadata("vanished")) {
                sender.sendMessage(ChatColor.RED + "No player was found")
            }
            else {
                sender.sendMessage(ChatColor.GRAY + ChatColor.ITALIC + "You whisper to " + commandPlayer + ": " + message)
                playerObject.sendMessage(ChatColor.GRAY + ChatColor.ITALIC + sender.getName() + " whispers to you: " + message)
            }
        }
        else {
            sender.sendMessage(ChatColor.RED + "No player was found")
        }
    }

    else {
        sender.sendMessage(ChatColor.RED + `Command format: /${command} <playername> <message>`);
    }
}