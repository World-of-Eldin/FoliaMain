// Economy History with Timezone Support
// Provides /txhistory command to view transaction history with proper timezone formatting

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
const DriverManager = java.sql.DriverManager;
const ZoneId = java.time.ZoneId;
const Instant = java.time.Instant;
const DateTimeFormatter = java.time.format.DateTimeFormatter;

// Database connection details (from FoliaEconomy config)
const DB_CONFIG = {
  host: "${DB_HOST}",
  port: "${DB_PORT}",
  database: "Folia_BrendoEco",
  user: "${DB_USER}",
  password: "${DB_PASS}",
};

// Predefined time formats
const TIME_FORMATS = {
  us: "MMM dd, yyyy hh:mm:ss a z", // Oct 24, 2025 06:30:45 PM EDT
  "us-short": "MM/dd/yy hh:mm a", // 10/24/25 06:30 PM
  eu: "dd MMM yyyy HH:mm:ss z", // 24 Oct 2025 18:30:45 EDT
  "eu-short": "dd/MM/yy HH:mm", // 24/10/25 18:30
  iso: "yyyy-MM-dd HH:mm:ss z", // 2025-10-24 18:30:45 EDT
  "iso-short": "yyyy-MM-dd HH:mm", // 2025-10-24 18:30
  compact: "MM/dd HH:mm", // 10/24 18:30
  full: "EEEE, MMMM dd, yyyy hh:mm:ss a z", // Friday, October 24, 2025 06:30:45 PM EDT
};

// Helper function to get player's timezone
function getPlayerTimezone(playerName) {
  DiskApi.loadFile("PlayerTimezones", false, true); // Reload from disk to get fresh data
  const savedTimezone = DiskApi.getVar(
    "PlayerTimezones",
    playerName,
    null,
    true
  );
  return savedTimezone || "America/New_York"; // Default to EST
}

// Helper function to get player's time format
function getPlayerTimeFormat(playerName) {
  DiskApi.loadFile("PlayerTimeFormats", false, true); // Reload from disk to get fresh data
  const savedFormat = DiskApi.getVar(
    "PlayerTimeFormats",
    playerName,
    null,
    true
  );
  return savedFormat || "us"; // Default to US format
}

// Helper function to format timestamp with timezone and format
function formatTime(timestamp, timezone, formatKey) {
  try {
    const instant = Instant.ofEpochMilli(timestamp);
    const zoneId = ZoneId.of(timezone);
    const pattern = TIME_FORMATS[formatKey] || TIME_FORMATS["us"];
    const formatter = DateTimeFormatter.ofPattern(pattern).withZone(zoneId);
    return formatter.format(instant);
  } catch (e) {
    return "Invalid timezone/format";
  }
}

// Get database connection
function getConnection() {
  const url =
    "jdbc:mysql://" +
    DB_CONFIG.host +
    ":" +
    DB_CONFIG.port +
    "/" +
    DB_CONFIG.database;
  return DriverManager.getConnection(url, DB_CONFIG.user, DB_CONFIG.password);
}

// Query transaction history
function getTransactionHistory(playerUUID, limit) {
  const conn = getConnection();
  try {
    const query =
      "SELECT * FROM transactions WHERE sender = ? OR receiver = ? ORDER BY time DESC LIMIT ?";
    const stmt = conn.prepareStatement(query);
    stmt.setString(1, playerUUID);
    stmt.setString(2, playerUUID);
    stmt.setInt(3, limit);

    const rs = stmt.executeQuery();
    const transactions = [];

    while (rs.next()) {
      const datetime = rs.getTimestamp("time");
      transactions.push({
        timestamp: datetime.getTime(), // Convert to milliseconds
        senderUUID: rs.getString("sender"),
        receiverUUID: rs.getString("receiver"),
        amount: rs.getDouble("amount"),
        transactionID: rs.getInt("transactionID"),
      });
    }

    rs.close();
    stmt.close();
    return transactions;
  } finally {
    conn.close();
  }
}

// Helper function to get player name from UUID
function getPlayerName(uuidString) {
  try {
    const uuid = java.util.UUID.fromString(uuidString);
    const offlinePlayer = Bukkit.getOfflinePlayer(uuid);
    return offlinePlayer.getName() || "Unknown";
  } catch (e) {
    return "Unknown";
  }
}

// Command: /txhistory [player] [page]
addCommand("txhistory", {
  onCommand: function (sender, args) {
    const Scheduler = Bukkit.getGlobalRegionScheduler();
    args = toArray(args);

    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
      try {
        let page = 1;
        let limit = 10;

        // Parse arguments
        let targetPlayer = sender;
        let targetPlayerName = sender.getName();
        if (args.length > 0) {
          if (sender.hasPermission("economy.history.others")) {
            targetPlayer = Bukkit.getOfflinePlayer(args[0]);
            targetPlayerName = targetPlayer.getName();
            if (args.length > 1) {
              page = parseInt(args[1]) || 1;
            }
          } else {
            page = parseInt(args[0]) || 1;
          }
        }

        const playerTimezone = getPlayerTimezone(sender.getName());
        const playerTimeFormat = getPlayerTimeFormat(sender.getName());
        const playerUUID = targetPlayer.getUniqueId().toString();
        const transactions = getTransactionHistory(playerUUID, limit * page);

        if (transactions.length === 0) {
          sender.sendMessage(ChatColor.RED + "No transaction history found.");
          return;
        }

        // Display header
        sender.sendMessage(
          ChatColor.GOLD + "═══════════════════════════════════"
        );
        sender.sendMessage(
          ChatColor.GOLD + " Transaction History - " + targetPlayerName
        );
        sender.sendMessage(
          ChatColor.GRAY +
            " Timezone: " +
            playerTimezone +
            " | Format: " +
            playerTimeFormat
        );
        sender.sendMessage(
          ChatColor.GOLD + "═══════════════════════════════════"
        );

        // Display transactions
        const startIdx = (page - 1) * limit;
        const endIdx = Math.min(startIdx + limit, transactions.length);

        for (let i = startIdx; i < endIdx; i++) {
          const tx = transactions[i];
          const isReceiver = tx.receiverUUID === playerUUID;
          const time = formatTime(
            tx.timestamp,
            playerTimezone,
            playerTimeFormat
          );

          const senderName = getPlayerName(tx.senderUUID);
          const receiverName = getPlayerName(tx.receiverUUID);

          if (isReceiver) {
            sender.sendMessage(
              ChatColor.GREEN +
                time +
                ChatColor.GRAY +
                " 㒖" +
                ChatColor.WHITE +
                " +" +
                tx.amount +
                " Tradebars " +
                ChatColor.GRAY +
                "from " +
                ChatColor.YELLOW +
                senderName
            );
          } else {
            sender.sendMessage(
              ChatColor.GREEN +
                time +
                ChatColor.GRAY +
                " 㒖" +
                ChatColor.WHITE +
                " -" +
                tx.amount +
                " Tradebars " +
                ChatColor.GRAY +
                "to " +
                ChatColor.YELLOW +
                receiverName
            );
          }
        }

        sender.sendMessage(
          ChatColor.GOLD + "═══════════════════════════════════"
        );
        sender.sendMessage(
          ChatColor.GRAY +
            "Page " +
            page +
            " | Use /txhistory " +
            (page + 1) +
            " for more"
        );
      } catch (e) {
        sender.sendMessage(
          ChatColor.RED + "Error loading transaction history: " + e.message
        );
        log.error("Transaction history error: " + e);
      }
    });
  },
});

// Command: /settimezone <timezone>
addCommand("settimezone", {
  onCommand: function (sender, args) {
    DiskApi.loadFile("PlayerTimezones", false, true); // Load at command start
    args = toArray(args);

    if (args.length === 0) {
      sender.sendMessage(ChatColor.RED + "Usage: /settimezone <timezone>");
      sender.sendMessage(ChatColor.GRAY + "Examples:");
      sender.sendMessage(
        ChatColor.YELLOW +
          "  /settimezone America/New_York " +
          ChatColor.GRAY +
          "(EST/EDT)"
      );
      sender.sendMessage(
        ChatColor.YELLOW +
          "  /settimezone America/Chicago " +
          ChatColor.GRAY +
          "(CST/CDT)"
      );
      sender.sendMessage(
        ChatColor.YELLOW +
          "  /settimezone America/Los_Angeles " +
          ChatColor.GRAY +
          "(PST/PDT)"
      );
      sender.sendMessage(
        ChatColor.YELLOW +
          "  /settimezone Europe/London " +
          ChatColor.GRAY +
          "(GMT/BST)"
      );
      sender.sendMessage(
        ChatColor.YELLOW + "  /settimezone UTC " + ChatColor.GRAY + "(UTC)"
      );
      return;
    }

    const timezone = args[0];

    // Validate timezone
    try {
      ZoneId.of(timezone);
      DiskApi.setVar("PlayerTimezones", sender.getName(), timezone, true);
      DiskApi.saveFile("PlayerTimezones", false, true);
      sender.sendMessage(
        ChatColor.GREEN + "Timezone set to: " + ChatColor.YELLOW + timezone
      );
      sender.sendMessage(
        ChatColor.GRAY +
          "Your transaction history will now show in this timezone."
      );
    } catch (e) {
      sender.sendMessage(ChatColor.RED + "Invalid timezone: " + timezone);
      sender.sendMessage(
        ChatColor.GRAY +
          "Use a valid timezone ID like 'America/New_York' or 'UTC'"
      );
    }
  },
});

// Command: /listtimezones - Show common timezones
addCommand("listtimezones", {
  onCommand: function (sender, args) {
    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
    sender.sendMessage(ChatColor.GOLD + " Common Timezones");
    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
    sender.sendMessage(ChatColor.YELLOW + "North America:");
    sender.sendMessage(
      ChatColor.GRAY +
        "  America/New_York" +
        ChatColor.WHITE +
        " - Eastern (EST/EDT)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  America/Chicago" +
        ChatColor.WHITE +
        " - Central (CST/CDT)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  America/Denver" +
        ChatColor.WHITE +
        " - Mountain (MST/MDT)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  America/Los_Angeles" +
        ChatColor.WHITE +
        " - Pacific (PST/PDT)"
    );
    sender.sendMessage("");
    sender.sendMessage(ChatColor.YELLOW + "Europe:");
    sender.sendMessage(
      ChatColor.GRAY + "  Europe/London" + ChatColor.WHITE + " - UK (GMT/BST)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  Europe/Paris" +
        ChatColor.WHITE +
        " - Central Europe (CET/CEST)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  Europe/Athens" +
        ChatColor.WHITE +
        " - Eastern Europe (EET/EEST)"
    );
    sender.sendMessage("");
    sender.sendMessage(ChatColor.YELLOW + "Asia/Pacific:");
    sender.sendMessage(
      ChatColor.GRAY + "  Asia/Tokyo" + ChatColor.WHITE + " - Japan (JST)"
    );
    sender.sendMessage(
      ChatColor.GRAY +
        "  Australia/Sydney" +
        ChatColor.WHITE +
        " - Sydney (AEDT/AEST)"
    );
    sender.sendMessage("");
    sender.sendMessage(ChatColor.YELLOW + "Other:");
    sender.sendMessage(
      ChatColor.GRAY +
        "  UTC" +
        ChatColor.WHITE +
        " - Coordinated Universal Time"
    );
    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
    sender.sendMessage(ChatColor.GRAY + "Use: /settimezone <timezone>");
  },
});

// Command: /settimeformat <format> - Set time display format
addCommand("settimeformat", {
  onCommand: function (sender, args) {
    DiskApi.loadFile("PlayerTimeFormats", false, true); // Load at command start
    args = toArray(args);

    if (args.length === 0) {
      sender.sendMessage(ChatColor.RED + "Usage: /settimeformat <format>");
      sender.sendMessage(
        ChatColor.GRAY +
          "Use " +
          ChatColor.YELLOW +
          "/listtimeformats" +
          ChatColor.GRAY +
          " to see available formats"
      );
      return;
    }

    const formatKey = args[0].toLowerCase();

    if (!TIME_FORMATS[formatKey]) {
      sender.sendMessage(ChatColor.RED + "Invalid format: " + formatKey);
      sender.sendMessage(
        ChatColor.GRAY +
          "Use " +
          ChatColor.YELLOW +
          "/listtimeformats" +
          ChatColor.GRAY +
          " to see available formats"
      );
      return;
    }

    DiskApi.setVar("PlayerTimeFormats", sender.getName(), formatKey, true);
    DiskApi.saveFile("PlayerTimeFormats", false, true);

    // Show example of the format
    const now = Date.now();
    const timezone = getPlayerTimezone(sender.getName());
    const example = formatTime(now, timezone, formatKey);

    sender.sendMessage(
      ChatColor.GREEN + "Time format set to: " + ChatColor.YELLOW + formatKey
    );
    sender.sendMessage(
      ChatColor.GRAY + "Example: " + ChatColor.WHITE + example
    );
  },
});

// Command: /listtimeformats - Show available time formats
addCommand("listtimeformats", {
  onCommand: function (sender, args) {
    const now = Date.now();
    const timezone = getPlayerTimezone(sender.getName());

    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
    sender.sendMessage(ChatColor.GOLD + " Available Time Formats");
    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");

    for (const key in TIME_FORMATS) {
      const example = formatTime(now, timezone, key);
      sender.sendMessage(
        ChatColor.YELLOW +
          key +
          ChatColor.GRAY +
          " → " +
          ChatColor.WHITE +
          example
      );
    }

    sender.sendMessage(ChatColor.GOLD + "═══════════════════════════════════");
    sender.sendMessage(ChatColor.GRAY + "Use: /settimeformat <format>");
    sender.sendMessage(
      ChatColor.GRAY +
        "Current format: " +
        ChatColor.YELLOW +
        getPlayerTimeFormat(sender.getName())
    );
  },
});

log.info(
  "Economy History script loaded with timezone and time format support!"
);
