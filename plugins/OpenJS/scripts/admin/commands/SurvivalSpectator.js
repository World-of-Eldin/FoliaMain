const Bukkit = org.bukkit.Bukkit;
const GameMode = org.bukkit.GameMode;

addCommand("spectator", {
    onCommand(sender, args) {
        sender.setGameMode(GameMode.SPECTATOR)
    },
    onTabComplete: function (sender, args) {
        return []
    }
},
"eldin.staff")

addCommand("survival", {
    onCommand(sender, args) {
        sender.setGameMode(GameMode.SURVIVAL)
    },
    onTabComplete: function (sender, args) {
        return []
    }
},
"eldin.staff")