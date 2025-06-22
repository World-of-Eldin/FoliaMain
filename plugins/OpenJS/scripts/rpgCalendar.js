var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            var world = Server.getWorld("world");    
            Server.broadcastMessage("Gametime: " + world.getTime());
            DiskAPI.loadFile("test", false, true);
            DiskAPI.setVar("test", "gametime", world.getTime(), true);
            DiskAPI.saveFile("test",false,true);
}}, "handler");