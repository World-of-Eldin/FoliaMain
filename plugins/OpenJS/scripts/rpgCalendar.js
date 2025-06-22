var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            var world = Server.getWorld("world");    
            Server.broadcastMessage("Gametime: " + world.getTime());
            DiskApi.loadFile("test", false, true);
            DiskApi.setVar("test", "gametime", world.getTime(), true);
            DiskApi.saveFile("test",false,true);
}}, "handler");