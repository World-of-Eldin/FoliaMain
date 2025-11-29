// Map Command
// Provides /map command with clickable link to BlueMap web interface

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

// CONFIGURE YOUR BLUEMAP URL HERE
const MAP_URL = "http://worldofeldin.com:8101";

// Function to send map link message
function sendMapMessage(sender) {
  sender.sendMessage(ChatColor.GOLD + "View the live map!");
  sender.sendMessage(ChatColor.DARK_GRAY + MAP_URL);
}

// Register the command
addCommand("map", {
  onCommand: function (sender, args) {
    sendMapMessage(sender);
  },
});

log.info("Map command loaded! Use /map to get the BlueMap link.");
