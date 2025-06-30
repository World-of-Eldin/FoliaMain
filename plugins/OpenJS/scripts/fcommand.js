const Bukkit = org.bukkit.Bukkit;
const Server = plugin.getServer();
addCommand("f", {
    onCommand: function(sender, args) {
        Server.broadcastMessage(sender.getName() + " pays their respects")
    },
    
    onTabComplete: function(sender, args) {
        return toJavaList([]);
    }
})