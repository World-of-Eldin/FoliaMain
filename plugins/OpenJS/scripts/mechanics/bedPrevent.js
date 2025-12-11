registerEvent("org.bukkit.event.player.PlayerSpawnChangeEvent", { 
    handleEvent: function(event)  {
        if(event.getCause().toString() === "BED") {
            event.setCancelled(true);
        }
    }
})