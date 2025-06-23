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
      DiskApi.loadFile("CalendarData", false, true);
      var fullTime = Server.getWorld("world").getFullTime();
      var historicalDay = parseInt(
        DiskApi.getVar("CalendarData", "DayCount", 0, true)
      );
      var currentDay = parseInt(Math.floor(fullTime / 24000));

      if (currentDay === historicalDay) {
        return;
      } else {
        var dayOfWeek = currentDay % 7;
        var dayOfMonth = (currentDay % 30) + 1;
        var monthIndex = Math.floor(currentDay / 30) % 12;
        var years = Math.floor(currentDay / 360);
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
