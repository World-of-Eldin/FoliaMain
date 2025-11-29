const biteTimes = {};
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
registerEvent("org.bukkit.event.player.PlayerFishEvent", {
    handleEvent: function(event) {
        const player = event.getPlayer()
        if (event.getState() == "BITE") {
            biteTimes[player.getUniqueId()] = Date.now();
        }

        if (event.getState() == "CAUGHT_FISH") {
            const start = biteTimes[player.getUniqueId()];
            const elapsedMs = Date.now() - start;
            const seconds = (elapsedMs / 1000).toFixed(2);
            delete biteTimes[player.getUniqueId()];
            discordMessage = `${player.getName()} caught a ${event.getCaught().getName()} in ${seconds} seconds`
            Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                Bukkit.dispatchCommand(Console, "discordsrv bcast #1444191016377909358 " + discordMessage);
            })
        }

    }
})