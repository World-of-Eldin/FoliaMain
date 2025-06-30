const logger = org.bukkit.Bukkit.getLogger();
const ChatColor = org.bukkit.ChatColor;

registerEvent("org.bukkit.event.player.AsyncPlayerChatEvent", {
  handleEvent: function (event) {
    var prefix = getPlayerPrefix(event.getPlayer());
    var suffix = getPlayerSuffix(event.getPlayer());
    var formattedName = getPlayerFormattedName(event.getPlayer());

    var formattedMessage = ChatColor.translateAlternateColorCodes(
      "&",
      prefix +
        formattedName +
        " " +
        suffix +
        ChatColor.RESET +
        ": " +
        emojiCodeReplace(event.getMessage())
    );

    event.setCancelled(true);
    const player = event.getPlayer();
    if(!player.hasMetadata("vanished")) {
        org.bukkit.Bukkit.broadcastMessage(formattedMessage);
    }
    else {
        player.sendMessage(ChatColor.RED + "You are currently vanished")
    }
  },
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
            staffPrefix = prefixText;
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
  player.getEffectivePermissions().forEach((permission) => {
    if (permission.getPermission() == "eldin.staff") {
      return ChatColor.GRAY + player.getName();
    }
  });

  return player.getName();
}

const emojiCodeReplace = (message) => {
  message = message.replace(new RegExp(":angry:", "g"), "㐻");
  message = message.replace(new RegExp(":anguished:", "g"), "㐼");
  message = message.replace(new RegExp(":astonished:", "g"), "㐽");
  message = message.replace(new RegExp(":blush:", "g"), "㐾");
  message = message.replace(new RegExp(":cold_face:", "g"), "㐿");
  message = message.replace(new RegExp(":cold_sweat:", "g"), "㑀");
  message = message.replace(new RegExp(":confounded:", "g"), "㑁");
  message = message.replace(new RegExp(":confused:", "g"), "㑂");
  message = message.replace(new RegExp(":cry:", "g"), "㑃");
  message = message.replace(new RegExp(":disappointed:", "g"), "㑄");
  message = message.replace(new RegExp(":disappointed_relieved:", "g"), "㑅");
  message = message.replace(new RegExp(":disguised_face:", "g"), "㑆");
  message = message.replace(new RegExp(":dizzy_face:", "g"), "㑇");
  message = message.replace(new RegExp(":drool:", "g"), "㑈");
  message = message.replace(new RegExp(":exploding_head:", "g"), "㑉");
  message = message.replace(new RegExp(":expressionless:", "g"), "㑊");
  message = message.replace(new RegExp(":face_exhaling:", "g"), "㑋");
  message = message.replace(new RegExp(":face_vomitting:", "g"), "㑌");
  message = message.replace(new RegExp(":hand_over_mouth:", "g"), "㑍");
  message = message.replace(new RegExp(":raised_eyebrow:", "g"), "㑎");
  message = message.replace(new RegExp(":spiral_eyes:", "g"), "㑏");
  message = message.replace(new RegExp(":fearful:", "g"), "㑐");
  message = message.replace(new RegExp(":flushed:", "g"), "㑑");
  message = message.replace(new RegExp(":frowning:", "g"), "㑒");
  message = message.replace(new RegExp(":frowning2:", "g"), "㑓");
  message = message.replace(new RegExp(":grimacing:", "g"), "㑔");
  message = message.replace(new RegExp(":grin:", "g"), "㑕");
  message = message.replace(new RegExp(":grinning:", "g"), "㑖");
  message = message.replace(new RegExp(":heart_eyes:", "g"), "㑗");
  message = message.replace(new RegExp(":hot_face:", "g"), "㑘");
  message = message.replace(new RegExp(":hushed:", "g"), "㑙");
  message = message.replace(new RegExp(":innocent:", "g"), "㑚");
  message = message.replace(new RegExp(":joy:", "g"), "㑛");
  message = message.replace(new RegExp(":kissing:", "g"), "㑜");
  message = message.replace(new RegExp(":kissing_blush:", "g"), "㑝");
  message = message.replace(new RegExp(":kissing_happy:", "g"), "㑞");
  message = message.replace(new RegExp(":kissing_heart:", "g"), "㑟");
  message = message.replace(new RegExp(":laughing:", "g"), "㑠");
  message = message.replace(new RegExp(":money_mouth:", "g"), "㑡");
  message = message.replace(new RegExp(":nerd:", "g"), "㑢");
  message = message.replace(new RegExp(":neutral_face:", "g"), "㑣");
  message = message.replace(new RegExp(":no_mouth:", "g"), "㑤");
  message = message.replace(new RegExp(":open_mouth:", "g"), "㑥");
  message = message.replace(new RegExp(":partying_face:", "g"), "㑦");
  message = message.replace(new RegExp(":pensive:", "g"), "㑧");
  message = message.replace(new RegExp(":perservere:", "g"), "㑨");
  message = message.replace(new RegExp(":rage:", "g"), "㑩");
  message = message.replace(new RegExp(":rage_symbols:", "g"), "㑪");
  message = message.replace(new RegExp(":relieved:", "g"), "㑫");
  message = message.replace(new RegExp(":rofl:", "g"), "㑬");
  message = message.replace(new RegExp(":rolling_eyes:", "g"), "㑭");
  message = message.replace(new RegExp(":scream:", "g"), "㑮");
  message = message.replace(new RegExp(":shushing_face:", "g"), "㑯");
  message = message.replace(new RegExp(":sleeping:", "g"), "㑰");
  message = message.replace(new RegExp(":sleepy:", "g"), "㑱");
  message = message.replace(new RegExp(":slight_frown:", "g"), "㑲");
  message = message.replace(new RegExp(":slight_smile:", "g"), "㑳");
  message = message.replace(new RegExp(":smile:", "g"), "㑴");
  message = message.replace(new RegExp(":smile_love:", "g"), "㑵");
  message = message.replace(new RegExp(":smiley:", "g"), "㑶");
  message = message.replace(new RegExp(":smiling_imp:", "g"), "㑷");
  message = message.replace(new RegExp(":smiling_tear:", "g"), "㑸");
  message = message.replace(new RegExp(":smirk:", "g"), "㑹");
  message = message.replace(new RegExp(":sob:", "g"), "㑺");
  message = message.replace(new RegExp(":star_struck:", "g"), "㑻");
  message = message.replace(new RegExp(":sunglasses:", "g"), "㑼");
  message = message.replace(new RegExp(":sweat:", "g"), "㑽");
  message = message.replace(new RegExp(":sweat_smile:", "g"), "㑾");
  message = message.replace(new RegExp(":thermometer_face:", "g"), "㑿");
  message = message.replace(new RegExp(":thinking:", "g"), "㒀");
  message = message.replace(new RegExp(":tired_face:", "g"), "㒁");
  message = message.replace(new RegExp(":tongue:", "g"), "㒂");
  message = message.replace(new RegExp(":tongue_closed_eyes:", "g"), "㒃");
  message = message.replace(new RegExp(":tongue_wink:", "g"), "㒄");
  message = message.replace(new RegExp(":triumph:", "g"), "㒅");
  message = message.replace(new RegExp(":unamused:", "g"), "㒆");
  message = message.replace(new RegExp(":upside_down:", "g"), "㒇");
  message = message.replace(new RegExp(":weary:", "g"), "㒈");
  message = message.replace(new RegExp(":wink:", "g"), "㒉");
  message = message.replace(new RegExp(":woozy_face:", "g"), "㒊");
  message = message.replace(new RegExp(":worried:", "g"), "㒋");
  message = message.replace(new RegExp(":yawning_face:", "g"), "㒌");
  message = message.replace(new RegExp(":yum:", "g"), "㒍");
  message = message.replace(new RegExp(":zany_face:", "g"), "㒎");
  message = message.replace(new RegExp(":zipper_mouth:", "g"), "㒏");
  message = message.replace(new RegExp(":discord:", "g"), "㒐");
  return message;
};
