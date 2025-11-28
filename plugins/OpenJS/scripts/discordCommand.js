// Discord Command Override
// Intercepts /discord command and provides clickable link to Discord server

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

// CONFIGURE YOUR DISCORD INVITE LINK HERE
const DISCORD_INVITE = "https://discord.gg/VBGVzNzyr7";

// Function to send Discord invite message
function sendDiscordMessage(sender) {
  sender.sendMessage(
    ChatColor.DARK_PURPLE + "═══════════════════════════════════"
  );
  sender.sendMessage(
    "㒐 " + ChatColor.DARK_PURPLE + "Join our Discord server!"
  );
  sender.sendMessage(ChatColor.GOLD + DISCORD_INVITE);
  sender.sendMessage(
    ChatColor.DARK_PURPLE + "═══════════════════════════════════"
  );
}

// Register the command so it shows up properly in client
addCommand("discord", {
  onCommand: function (sender, args) {
    sendDiscordMessage(sender);
  },
});

// Also intercept via event in case DiscordSRV tries to handle it first
registerEvent("org.bukkit.event.player.PlayerCommandPreprocessEvent", {
  handleEvent: function (event) {
    const message = event.getMessage().toLowerCase();
    const player = event.getPlayer();

    // Check if this is the /discord command
    if (message === "/discord" || message.startsWith("/discord ")) {
      // Cancel DiscordSRV's command
      event.setCancelled(true);

      // Send our custom message
      sendDiscordMessage(player);
    }
  },
});

log.info(
  "Discord command override loaded! /discord will now show custom invite link."
);
