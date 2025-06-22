var logger = org.bukkit.Bukkit.getLogger();
var ChatColor = org.bukkit.ChatColor;

registerEvent("org.bukkit.event.player.AsyncPlayerChatEvent", {
    handleEvent: function(event) {
        try {
            var prefix = getPlayerPrefix(event.getPlayer());
            var suffix = getPlayerSuffix(event.getPlayer());
            var formattedName = getPlayerFormattedName(event.getPlayer());

            var formattedMessage = ChatColor.translateAlternateColorCodes('&', 
                prefix + formattedName + " " + suffix + ChatColor.RESET + ": " + event.getMessage());

            event.setCancelled(true);
            org.bukkit.Bukkit.broadcastMessage(formattedMessage);
        } catch (e) {
            logger.warning("Chat error: " + e.toString());
            event.setCancelled(false);
        }
    }
});

function getPlayerPrefix(player) {
    var highestWeight = -1;
    var prefix = "";
    var staffPrefix = "";

    var effectivePerms = player.getEffectivePermissions();

    for (var i = 0; i < effectivePerms.size(); i++) {
        var perm = effectivePerms.toArray()[i];
        var permission = perm.getPermission();

        if (permission.startsWith("prefix.")) {
            var parts = permission.split(".", 3);
            if (parts.length >= 3) {
                try {
                    var weight = parseInt(parts[1]);
                    var prefixText = parts[2];

                    if (weight > highestWeight && weight != 1000 && weight != 1001) {
                        highestWeight = weight;
                        prefix = prefixText;
                    }

                    if (weight === 1000 || weight === 1001) {
                        staffPrefix = prefixText
                    }
                } catch (e) {
                    return;
                }
            }
        }
    }

    return staffPrefix.trim().concat(prefix);
}

function getPlayerSuffix(player) {
    var highestWeight = -1;
    var suffix = "";

    var effectivePerms = player.getEffectivePermissions();

    for (var i = 0; i < effectivePerms.size(); i++) {
        var perm = effectivePerms.toArray()[i];
        var permission = perm.getPermission();

        if (permission.startsWith("suffix.")) {
            var parts = permission.split(".", 3);
            if (parts.length >= 3) {
                try {
                    var weight = parseInt(parts[1]);
                    var suffixText = parts[2];

                    if (weight > highestWeight) {
                        highestWeight = weight;
                        suffix = suffixText;
                    }
                } catch (e) {
                    return;
                }
            }
        }
    }
    return suffix;
}

function getPlayerFormattedName(player) {
    var playerName = player.getName();

    var effectivePerms = player.getEffectivePermissions();

    for (var i = 0; i < effectivePerms.size(); i++) {
        var perm = effectivePerms.toArray()[i];
        var permission = perm.getPermission();

        if (permission === "eldin.staff") {
            playerName = ChatColor.GRAY + playerName;
        }
    }
    return playerName;
}