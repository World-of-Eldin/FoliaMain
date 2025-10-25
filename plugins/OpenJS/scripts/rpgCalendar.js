var Server = plugin.getServer();
var Days = [
  "Lunae",
  "Martis",
  "Mercurii",
  "Iovis",
  "Veneris",
  "Saturni",
  "Solis",
];
var Months = [
  "Hammer",
  "Alturiak",
  "Ches",
  "Tarsakh",
  "Mirtul",
  "Kythorn",
  "Flamerule",
  "Elesias",
  "Eleint",
  "Marpenoth",
  "Uktar",
  "Nightal",
];

registerSchedule(
  0,
  200,
  {
    handler: function () {
      const currentTime = Server.getWorld("world").getTime();
      DiskApi.loadFile("CalendarData", false, true);
      let daycount = DiskApi.getVar("CalendarData", "DayCount", 0, true);
      if(currentTime >= 23800 && currentTime <= 24000) {
        const currentDay = daycount + 1;
        
        var dayOfWeek = daycount % 7;
        var dayOfMonth = (daycount % 30) + 1;
        var monthIndex = Math.floor(daycount / 30) % 12;
        var years = Math.floor(daycount / 360);
        var yearsMessage = " years of the age of Ruins have passed";

        if (years === 1) {
          yearsMessage = " year of the age of Ruins has passed";
        }

        var message =
          "Today is " +
          Days[dayOfWeek] +
          ", " +
          Months[monthIndex] +
          " " +
          dayOfMonth +
          ", " +
          years +
          yearsMessage;
        Server.broadcastMessage(message);
        DiskApi.setVar("CalendarData", "DayCount", currentDay, true);
        DiskApi.saveFile("CalendarData", false, true);
      }
    },
  },
  "handler"
);
