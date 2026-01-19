const NamespacedKey = org.bukkit.NamespacedKey
const PersistentDataType = org.bukkit.persistence.PersistentDataType
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();

registerEvent("org.bukkit.event.player.PlayerJoinEvent", {
    handleEvent: function(event) {
        const key = new NamespacedKey(plugin, "inactiveTime")
        const player = event.getPlayer()
        const container = player.getPersistentDataContainer()
        container.set(key, PersistentDataType.DOUBLE, Date.now()) //Set afk timer
    }
})

registerEvent("org.bukkit.event.player.PlayerMoveEvent", {
    handleEvent: function(event) {
        const key = new NamespacedKey(plugin, "inactiveTime")
        const player = event.getPlayer()
        const container = player.getPersistentDataContainer()
        container.set(key, PersistentDataType.DOUBLE, Date.now()) //Reset afk timer
    }
})

task.repeat(5, 10, () => {
    let key = new NamespacedKey(plugin, "inactiveTime")
    const onlinePlayers = Bukkit.getOnlinePlayers();
    onlinePlayers.forEach(player => {
        let container = player.getPersistentDataContainer()
        const value = container.get(key, PersistentDataType.DOUBLE)
        const timeRemaining = Date.now() - value
        if(timeRemaining >= 1800000) {
            Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                 Bukkit.dispatchCommand(Console, "kick " + player.getName() + " AFK"); //Kick player
            })
        }
    }) 
});
