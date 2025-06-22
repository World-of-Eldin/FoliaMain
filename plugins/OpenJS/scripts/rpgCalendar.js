var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            var world = Server.getWorld("world");    
            Server.broadcastMessage("Gametime: " + world.getTime());
            DiskApi.loadFile("test.yml", true, true);
            DiskApi.setVar("test.yml", "gametime", world.getTime(), true);
            DiskApi.saveFile("test.yml",true,true);
}}, "handler");