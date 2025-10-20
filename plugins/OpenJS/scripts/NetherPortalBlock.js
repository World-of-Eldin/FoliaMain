registerEvent("org.bukkit.event.world.PortalCreateEvent", {
    handleEvent: function(event) {
        const entity = event.getEntity();
        if(entity) {
            if(entity.getType().toString() === "PLAYER" && !entity.hasPermission("eldin.create.netherportal")) {
                event.setCancelled(true);
            }
        }
    }
})