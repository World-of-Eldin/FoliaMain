var Bukkit = org.bukkit.Bukkit;
var ChatColor = org.bukkit.ChatColor;
var Server = plugin.getServer();
const Scheduler = Bukkit.getGlobalRegionScheduler();

var serverMessageHeader =
  ChatColor.GOLD + "[" + ChatColor.GRAY + "Server" + ChatColor.GOLD + "] ";

addCommand(
  "calendar",
  {
    onCommand: function (sender, args) {
      if (args.length > 0 && args[0] === "setAge") {
        if (!args[1]) {
          sender.sendMessage(
            serverMessageHeader + "An age name must be specified."
          );
          return;
        }

        DiskApi.loadFile("CalendarData", true, true);
        DiskApi.setVar("CalendarData", "AgeName", args[1], true);
        DiskApi.saveFile("CalendarData", true, true);
        sender.sendMessage(
          serverMessageHeader +
            "Age name has been updated to " +
            ChatColor.GRAY +
            args[1]
        );
      } else if (args.length > 0 && args[0] === "setFullTime") {
        if (!args[1] && isNaN(args[1])) {
          sender.sendMessage(
            serverMessageHeader + "A valid integer must be specified."
          );
          return;
        }
        Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
          Server.getWorld("world").setFullTime(parseInt(args[1]));
        })
        sender.sendMessage(
          serverMessageHeader +
            "World time has been set to " +
            ChatColor.GRAY +
            args[1]
        );
      } else {
        sender.sendMessage(
          serverMessageHeader +
            "Current fulltime is " +
            ChatColor.GRAY +
            Server.getWorld("world").getFullTime()
        );
      }
    },
    onTabComplete: function () {
      return ["setAge", "setFullTime"];
    },
  },
  "eldin.staff"
);
