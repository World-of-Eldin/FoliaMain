const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
const lastMessaged = {};

addCommand("msg", {
    onCommand(sender, args) {
        if(!sender.hasMetadata("muted")) {
            messanger(sender, args, "msg")
        }

        else {
            sender.sendMessage(ChatColor.RED + "You are muted")
        }
    },
    onTabComplete: function (sender, args) {
        return tabCompleter(args)
    }
});

addCommand("tell", {
    onCommand(sender, args) {
        if(!sender.hasMetadata("muted")) {
            messanger(sender, args, "tell")
        }

        else {
            sender.sendMessage(ChatColor.RED + "You are muted")
        }
    },
    onTabComplete: function (sender, args) {
        return tabCompleter(args)
    }
});

addCommand("r", {
    onCommand(sender, args) {   
        if(lastMessaged[sender] != undefined) {
            messanger(sender, args, "r")
        }
        else {
            sender.sendMessage(ChatColor.RED + "No message history is recorded")
        }
    },
    onTabComplete: function (sender, args) {
        return tabCompleter(args)
    }
});

function messanger(sender, args, command) {
    if (args.length >= 2 || (command === "r" && (args.length >= 1))) {
        commandPlayer = args[0]
        i = 1
        if(command === "r") {
            commandPlayer = lastMessaged[sender].getName()
            i = 0
        }
        message = ""
        while (i < args.length) {
            message = message + args[i] + " "
            i++
        }
        const onlinePlayers = Bukkit.getOnlinePlayers();
        playerOnline = false
        onlinePlayers.forEach(player => { //Ensure that the player is online
            if(commandPlayer === player.getName()) {
                playerOnline = true;
            }
        })


        if(playerOnline) {
            playerObject = Bukkit.getPlayerExact(commandPlayer)
            if(playerObject.hasMetadata("vanished")) {
                sender.sendMessage(ChatColor.RED + "No player was found")
            }
            else {
                lastMessaged[sender] = playerObject;
                lastMessaged[playerObject] = sender;
                sender.sendMessage(ChatColor.GRAY + ChatColor.ITALIC + "You whisper to " + commandPlayer + ": " + message)
                playerObject.sendMessage(ChatColor.GRAY + ChatColor.ITALIC + sender.getName() + " whispers to you: " + message)
            }
        }
        else {
            sender.sendMessage(ChatColor.RED + "No player was found")
        }
    }

    else {
        message = ChatColor.RED + "Command format: " + "/" + command + " <playername> <message>"
        if(command === "r") {
            message = ChatColor.RED + "Command format: " + "/" + command + " <message>"
        }
        sender.sendMessage(message);
    }
}

function tabCompleter(args) {
    args = toArray(args);

    if (args.length === 1 || args.length === 0) { //Cover /r since otherwise it is said to not be a valid command
      // Provide tab completion with online player names
      const onlinePlayers = Bukkit.getOnlinePlayers();
      let playerNames = [];

      onlinePlayers.forEach((player) => {
        playerNames.push(player.getName());
      });

      return toJavaList(playerNames);
    }

    return toJavaList([]);;
}