const NamespacedKey = org.bukkit.NamespacedKey
const PersistentDataType = org.bukkit.persistence.PersistentDataType //API that saves when player logs off
const ChatColor = org.bukkit.ChatColor;

registerEvent("me.angeschossen.lands.api.events.land.spawn.LandSpawnTeleportEvent", {
    handleEvent: function(event) {
        let key = new NamespacedKey(plugin, "spawnTime")
        let player = event.getLandPlayer().getPlayer()
        let container = player.getPersistentDataContainer()
        const value = container.get(key, PersistentDataType.DOUBLE)
        const timeRemaining = Date.now() - value //Difference bewteen current time and last home time
        if(timeRemaining >= 1800000) {
            container.set(key, PersistentDataType.DOUBLE, Date.now())
        }
        else {
            player.sendMessage(ChatColor.DARK_GRAY + "[" + ChatColor.DARK_GREEN + "Lands" + ChatColor.DARK_GRAY + "] " + ChatColor.RED + "You can't do this now. " + ChatColor.GRAY + "You need to wait " + ChatColor.DARK_PURPLE + formatTime(1800000 - timeRemaining) + ChatColor.GRAY + ".")
            event.setCancelled(true)
        }
    }
})

function formatTime(unixTime) {
    let totalSeconds = Math.floor(unixTime / 1000)
    let minutes = Math.floor(totalSeconds / 60)
    let seconds = totalSeconds % 60
    return minutes + " minute(s), " + seconds + " second(s)"
}