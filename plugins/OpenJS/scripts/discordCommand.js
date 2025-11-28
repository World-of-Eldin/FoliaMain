// Discord Command
// Provides /discord command with clickable link to Discord server

const Bukkit = org.bukkit.Bukkit;
const ChatColor = org.bukkit.ChatColor;
const Component = net.kyori.adventure.text.Component;
const ClickEvent = net.kyori.adventure.text.event.ClickEvent;
const HoverEvent = net.kyori.adventure.text.event.HoverEvent;

// CONFIGURE YOUR DISCORD INVITE LINK HERE
const DISCORD_INVITE = "https://discord.gg/VBGVzNzyr7";

addCommand("discord", {
  onCommand: function (sender, args) {
    // Create clickable link component
    const message = Component.text()
      .append(
        Component.text("═══════════════════════════════════").color(
          ChatColor.DARK_PURPLE
        )
      )
      .append(Component.newline())
      .append(
        Component.text("㒐 Join our Discord server!").color(
          ChatColor.DARK_PURPLE
        )
      )
      .append(Component.newline())
      .append(Component.text("  "))
      .append(
        Component.text(DISCORD_INVITE)
          .color(ChatColor.GOLD)
          .clickEvent(ClickEvent.openUrl(DISCORD_INVITE))
          .hoverEvent(
            HoverEvent.showText(Component.text("Click to open Discord invite!"))
          )
      )
      .append(Component.newline())
      .append(
        Component.text("═══════════════════════════════════").color(
          ChatColor.DARK_PURPLE
        )
      )
      .build();

    sender.sendMessage(message);
  },
});

log.info(
  "Discord command loaded! Use /discord to get the Discord invite link."
);
