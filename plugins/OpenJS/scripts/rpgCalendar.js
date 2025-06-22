// Register the schedule to run every 10 seconds (200 ticks)
registerSchedule(0, 200, {
        handler: function() {
            var world = plugin.getServer().getWorld("world");    
            server.broadcastMessage("Gametime: " + world.getTime());
}}, "handler");