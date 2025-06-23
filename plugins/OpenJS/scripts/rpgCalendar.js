var Server = plugin.getServer();

registerSchedule(0, 200, {
        handler: function() {
            DiskApi.loadFile("CalendarData", true, true);
            var historicalDay =  DiskApi.getVar("CalendarData", "DayCount", 0, true)
            var currentDay = Math.floor(Server.getWorld("world").getFullTime()/24000);
            
            if (currentDay = historicalDay) {
                return;
            } else if (currentDay > historicalDay) {
                Server.broadcastMessage("Dawn of day " + currentDay + "!")
                DiskApi.setVar("CalendarData", "DayCount", currentDay, true);
                DiskApi.saveFile("CalendarData",true,true);
            }
}}, "handler");