var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            DiskApi.loadFile("CalendarData", true, true);
            var fullTime = Server.getWorld("world").getFullTime();
            var historicalDay =  DiskApi.getVar("CalendarData", "DayCount", 0, true)
            var currentDay = Math.floor(fullTime / 24000);
            
            if (currentDay = historicalDay) {
                DiskApi.setVar("CalendarData", "DayCount", currentDay, true);
                DiskApi.saveFile("CalendarData",true,true);
            } else {
                Server.broadcastMessage("Dawn of day " + currentDay + "!")
                DiskApi.setVar("CalendarData", "DayCount", currentDay, true);
                DiskApi.saveFile("CalendarData",true,true);
            }
}}, "handler");