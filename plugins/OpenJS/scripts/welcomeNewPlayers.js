// Welcome New Players Script
// Sends a pink welcome message when a player joins for the first time

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

registerEvent("org.bukkit.event.player.PlayerJoinEvent", {
  handleEvent: function (event) {
    const player = event.getPlayer();

    // Check if this is the player's first time joining
    if (!player.hasPlayedBefore()) {
      // Broadcast a pink welcome message to all players
      const welcomeMessage =
        ChatColor.LIGHT_PURPLE +
        "Welcome " +
        ChatColor.WHITE +
        player.getName() +
        ChatColor.LIGHT_PURPLE +
        " to the World of Eldin! We are glad to have you!";

      Bukkit.broadcastMessage(welcomeMessage);
    }
  },
});

log.info("Welcome New Players script loaded!");
