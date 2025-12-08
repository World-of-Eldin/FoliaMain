// Client Brand Tracker
// Notifies staff what client players are connecting with

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;

registerEvent("org.bukkit.event.player.PlayerJoinEvent", {
  handleEvent: function (event) {
    const player = event.getPlayer();

    // Delay slightly to ensure client brand is sent
    const Scheduler = Bukkit.getGlobalRegionScheduler();
    Scheduler.runDelayed(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
      try {
        // Paper API provides getClientBrandName()
        const brand = player.getClientBrandName();

        if (brand) {
          // Notify staff
          const message = ChatColor.GRAY + "[Client] " +
            ChatColor.WHITE + player.getName() +
            ChatColor.GRAY + " connected with: " +
            ChatColor.YELLOW + brand;

          const onlinePlayers = Bukkit.getOnlinePlayers();
          onlinePlayers.forEach(staffPlayer => {
            if (staffPlayer.hasPermission("eldin.staff")) {
              staffPlayer.sendMessage(message);
            }
          });
        }
      } catch (e) {
        log.error("Error reading client brand: " + e);
      }
    }, 20); // Wait 1 second (20 ticks) for client to send brand info
  }
});

log.info("Client Brand Tracker loaded!");
