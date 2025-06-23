var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            var time = Server.getWorld("world").getFullTime();    
            Server.broadcastMessage("CurrentDay: " + time % 24000);
            DiskApi.loadFile("test.yml", true, true);
            DiskApi.setVar("test.yml", "gametime", time, true);
            DiskApi.saveFile("test.yml",true,true);
}}, "handler");