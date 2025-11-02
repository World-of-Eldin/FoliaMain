const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
addCommand("mute", { 
    onCommand: function(sender, args) {
        const onlinePlayers = Bukkit.getOnlinePlayers();
        let message = ''
        if(args[0]) {
            message = ChatColor.RED + args[0] + " has never played or is not currently online"
            onlinePlayers.forEach(player => {
                if(args[0] == player.getName()) {
                    if(player.hasMetadata("muted")) {
                        player.removeMetadata("muted", plugin) //Set the player metadata to muted
                        message = ChatColor.GREEN + args[0] + " has been unmuted"
                    }
                    else {
                        player.setMetadata("muted", new org.bukkit.metadata.FixedMetadataValue(plugin, true)) //Remove the player muted metadata
                        message = ChatColor.RED + args[0] + " has been muted"
                    }
                }
            }) 
        }
        else {
            message = ChatColor.RED + "A player name must be specified as the first argument of this command"
        }
        sender.sendMessage(message)
    }
},"eldin.staff");