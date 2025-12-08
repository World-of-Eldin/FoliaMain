// Player Last Seen Tracker
// Provides /seen <player> command to check when a player was last online

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
const ZoneId = java.time.ZoneId;
const Instant = java.time.Instant;
const DateTimeFormatter = java.time.format.DateTimeFormatter;
const Duration = java.time.Duration;

// Helper function to get player's timezone (from economyHistory.js pattern)
function getPlayerTimezone(playerName) {
  DiskApi.loadFile("PlayerTimezones", false, true);
  const savedTimezone = DiskApi.getVar(
    "PlayerTimezones",
    playerName,
    null,
    true
  );
  return savedTimezone || "America/New_York"; // Default to EST
}

// Helper function to format timestamp with timezone
function formatTime(timestamp, timezone) {
  try {
    const instant = Instant.ofEpochMilli(timestamp);
    const zoneId = ZoneId.of(timezone);
    const pattern = "MMM dd, yyyy hh:mm:ss a z"; // Oct 24, 2025 06:30:45 PM EDT
    const formatter = DateTimeFormatter.ofPattern(pattern).withZone(zoneId);
    return formatter.format(instant);
  } catch (e) {
    return "Invalid timezone";
  }
}

// Helper function to format time difference (e.g., "2 days ago", "5 minutes ago")
function formatTimeDifference(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return seconds === 1 ? "1 second ago" : seconds + " seconds ago";
  } else if (minutes < 60) {
    return minutes === 1 ? "1 minute ago" : minutes + " minutes ago";
  } else if (hours < 24) {
    return hours === 1 ? "1 hour ago" : hours + " hours ago";
  } else if (days < 7) {
    return days === 1 ? "1 day ago" : days + " days ago";
  } else if (weeks < 4) {
    return weeks === 1 ? "1 week ago" : weeks + " weeks ago";
  } else if (months < 12) {
    return months === 1 ? "1 month ago" : months + " months ago";
  } else {
    return years === 1 ? "1 year ago" : years + " years ago";
  }
}

// Update player's last seen time
function updateLastSeen(playerName, playerUUID) {
  DiskApi.loadFile("PlayerLastSeen", false, true);
  const timestamp = Date.now();
  const data = {
    uuid: playerUUID,
    timestamp: timestamp,
    name: playerName
  };
  DiskApi.setVar("PlayerLastSeen", playerName, JSON.stringify(data), true);
  DiskApi.saveFile("PlayerLastSeen", false, true);
}

// Get player's last seen data
function getLastSeen(playerName) {
  DiskApi.loadFile("PlayerLastSeen", false, true);
  const dataStr = DiskApi.getVar("PlayerLastSeen", playerName, null, true);
  if (dataStr) {
    try {
      return JSON.parse(dataStr);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// Event: Track player join
registerEvent("org.bukkit.event.player.PlayerJoinEvent", {
  handleEvent: function (event) {
    const player = event.getPlayer();
    updateLastSeen(player.getName(), player.getUniqueId().toString());
  }
});

// Event: Track player quit
registerEvent("org.bukkit.event.player.PlayerQuitEvent", {
  handleEvent: function (event) {
    const player = event.getPlayer();
    updateLastSeen(player.getName(), player.getUniqueId().toString());
  }
});

// Command: /seen <player>
addCommand("seen", {
  onCommand: function (sender, args) {
    const Scheduler = Bukkit.getGlobalRegionScheduler();
    args = toArray(args);

    // Check if player name is provided
    if (args.length !== 1) {
      sender.sendMessage(ChatColor.RED + "Usage: /seen <player>");
      return;
    }

    const targetName = args[0];

    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
      try {
        // First check if player is currently online
        const onlinePlayer = Bukkit.getPlayer(targetName);

        if (onlinePlayer !== null && onlinePlayer.isOnline()) {
          // Check if player is vanished
          const isVanished = onlinePlayer.hasMetadata("vanished");
          const senderIsStaff = sender.hasPermission("eldin.staff");

          // If player is vanished and sender is not staff, treat as offline
          if (isVanished && !senderIsStaff) {
            // Don't reveal that the player is online - treat as offline
            // Fall through to offline player logic below
          } else {
            // Player is online and either not vanished, or sender is staff
            sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
            sender.sendMessage(ChatColor.GREEN + "Player: " + ChatColor.WHITE + onlinePlayer.getName());

            if (isVanished && senderIsStaff) {
              sender.sendMessage(ChatColor.GREEN + "Status: " + ChatColor.YELLOW + "Currently Online " + ChatColor.GRAY + "(Vanished)");
            } else {
              sender.sendMessage(ChatColor.GREEN + "Status: " + ChatColor.YELLOW + "Currently Online");
            }

            sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
            return;
          }
        }

        // Player is offline - check last seen data
        const offlinePlayer = Bukkit.getOfflinePlayer(targetName);

        if (!offlinePlayer.hasPlayedBefore()) {
          sender.sendMessage(
            ChatColor.RED + "Player '" + targetName + "' has never joined the server."
          );
          return;
        }

        // Get last seen data
        const lastSeenData = getLastSeen(offlinePlayer.getName());

        if (!lastSeenData) {
          sender.sendMessage(
            ChatColor.YELLOW + "Player '" + offlinePlayer.getName() + "' has joined before, but no last-seen data is available."
          );
          sender.sendMessage(
            ChatColor.GRAY + "Last-seen tracking may have been added after this player last played."
          );
          return;
        }

        // Get sender's timezone for display
        const timezone = getPlayerTimezone(sender.getName());
        const formattedTime = formatTime(lastSeenData.timestamp, timezone);
        const timeDiff = formatTimeDifference(lastSeenData.timestamp);

        // Display last seen information
        sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
        sender.sendMessage(ChatColor.GREEN + "Player: " + ChatColor.WHITE + offlinePlayer.getName());
        sender.sendMessage(ChatColor.GREEN + "Status: " + ChatColor.RED + "Offline");
        sender.sendMessage(ChatColor.GREEN + "Last Seen: " + ChatColor.YELLOW + timeDiff);
        sender.sendMessage(ChatColor.GRAY + "  " + formattedTime);
        sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");

      } catch (e) {
        sender.sendMessage(ChatColor.RED + "Error checking player status: " + e.message);
        log.error("Seen command error: " + e);
      }
    });
  },

  onTabComplete: function (sender, args) {
    args = toArray(args);

    if (args.length === 1) {
      // Provide tab completion with online player names
      const onlinePlayers = Bukkit.getOnlinePlayers();
      let playerNames = [];

      onlinePlayers.forEach((player) => {
        playerNames.push(player.getName());
      });

      return toJavaList(playerNames);
    }

    return toJavaList([]);
  },
});

log.info("Player Last Seen tracker loaded! Use /seen <player> to check player status.");
