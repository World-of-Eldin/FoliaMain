var Bukkit = org.bukkit.Bukkit;
var Console = Bukkit.getConsoleSender();
var ChatColor = org.bukkit.ChatColor;
var Scheduler = Bukkit.getGlobalRegionScheduler();

var serverMessageHeader =
  ChatColor.GOLD + "[" + ChatColor.GRAY + "Server" + ChatColor.GOLD + "] ";
var swapMessageBase =
  serverMessageHeader + ChatColor.GRAY + "Rank swapped to " + ChatColor.RESET;
var noRankMessage =
  serverMessageHeader +
  ChatColor.GRAY +
  "No swap available for rank: " +
  ChatColor.RESET;
var yourRankMessage =
  serverMessageHeader + ChatColor.GRAY + "Your Rank: " + ChatColor.RESET;

addCommand("rank", {
  onCommand: function (sender, args) {
    var permissions = sender.getEffectivePermissions().toArray();
    var rank = "";
    var highestPriority = -1;

    for (var i = 0; i < permissions.length; i++) {
      var permission = permissions[i].getPermission().split(".");
      var context = permission[0];
      var priority = parseInt(permission[1]);
      var prefixText = permission[2];

      if (context === "prefix" && priority != 1000 && priority != 1001) {
        if (priority > highestPriority) {
          rank = prefixText;
          highestPriority = priority;
        }
      }
    }

    if (args.length > 0 && args[0] === "swap") {
      switch (rank) {
        // Nobleman
        case "㐒 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 3)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 3, "㐓")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐓");
          break;
        // Noblewoman
        case "㐓 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 3)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 3, "㐒")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐒");
          break;
        // Baron
        case "㐟 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 4)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 4, "㐠")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐠");
          break;
        // Baroness
        case "㐠 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 4)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 4, "㐟")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐟");
          break;
        // Duke
        case "㐢 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 6)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 6, "㐣")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐣");
          break;
        // Duchess
        case "㐣 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 6)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 6, "㐢")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐢");
          break;
        // Prince
        case "㐤 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 7)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 7, "㐥")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐥");
          break;
        // Princess
        case "㐥 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 7)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 7, "㐤")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐤");
          break;
        // King
        case "㐦 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 8)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 8, "㐧")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐧");
          break;
        // Queen
        case "㐧 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 8)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 8, "㐦")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐦");
          break;
        // Emperor
        case "㐨 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 9)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 9, "㐩")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐩");
          break;
        // Empress
        case "㐩 ":
          Scheduler.run(
            Bukkit.getPluginManager().getPlugin("OpenJS"),
            function () {
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "remove", 9)
              );
              Bukkit.dispatchCommand(
                Console,
                lpCmdBuilder(sender, "add", 9, "㐨")
              );
            }
          );
          sender.sendMessage(swapMessageBase + "㐨");
          break;
        default:
          sender.sendMessage(noRankMessage + rank);
      }
    } else {
      sender.sendMessage(yourRankMessage + rank);
    }
  },
  onTabComplete: function (sender, args) {
    args = toArray(args);
    if(args.length === 1) {
      return ["swap"];
    }
  },
});

function lpCmdBuilder(sender, op, priority, text) {
  if (op === "add") {
    return (
      "lp user " +
      sender.getName() +
      " meta addprefix " +
      priority +
      ' "' +
      text +
      ' "'
    );
  } else {
    return "lp user " + sender.getName() + " meta removeprefix " + priority;
  }
}
