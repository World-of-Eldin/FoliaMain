var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            var world = Server.getWorld("world");    
            Server.broadcastMessage("Gametime: " + world.getTime());
}}, "handler");