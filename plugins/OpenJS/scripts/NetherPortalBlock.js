registerEvent("org.bukkit.event.world.PortalCreateEvent", {
    handleEvent: function(event) {
        const entity = event.getEntity();
        if(entity) {
            if(entity.getType().toString() === "PLAYER" && !entity.hasPermission("eldin.create.netherportal")) {
                entity.sendMessage("You cannot open a portal until achieving Duke/Duchess rank")
                event.setCancelled(true);
            }
        }
        
        else {
            event.setCancelled(true);
        }
    }
})