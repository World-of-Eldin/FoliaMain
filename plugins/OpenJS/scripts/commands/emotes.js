const ChatColor = org.bukkit.ChatColor;
const emotes = [
  ChatColor.GREEN + ":angry: " + ChatColor.RESET + "㐻",
  ChatColor.GREEN + ":anguished: " + ChatColor.RESET + "㐼",
  ChatColor.GREEN + ":astonished: " + ChatColor.RESET + "㐽",
  ChatColor.GREEN + ":blush: " + ChatColor.RESET + "㐾",
  ChatColor.GREEN + ":cold_face: " + ChatColor.RESET + "㐿",
  ChatColor.GREEN + ":cold_sweat: " + ChatColor.RESET + "㑀",
  ChatColor.GREEN + ":confounded: " + ChatColor.RESET + "㑁",
  ChatColor.GREEN + ":confused: " + ChatColor.RESET + "㑂",
  ChatColor.GREEN + ":cry: " + ChatColor.RESET + "㑃",
  ChatColor.GREEN + ":disappointed: " + ChatColor.RESET + "㑄",
  ChatColor.GREEN + ":disappointed_relieved: " + ChatColor.RESET + "㑅",
  ChatColor.GREEN + ":disguised_face: " + ChatColor.RESET + "㑆",
  ChatColor.GREEN + ":dizzy_face: " + ChatColor.RESET + "㑇",
  ChatColor.GREEN + ":drool: " + ChatColor.RESET + "㑈",
  ChatColor.GREEN + ":exploding_head: " + ChatColor.RESET + "㑉",
  ChatColor.GREEN + ":expressionless: " + ChatColor.RESET + "㑊",
  ChatColor.GREEN + ":face_exhaling: " + ChatColor.RESET + "㑋",
  ChatColor.GREEN + ":face_vomitting: " + ChatColor.RESET + "㑌",
  ChatColor.GREEN + ":hand_over_mouth: " + ChatColor.RESET + "㑍",
  ChatColor.GREEN + ":raised_eyebrow: " + ChatColor.RESET + "㑎",
  ChatColor.GREEN + ":spiral_eyes: " + ChatColor.RESET + "㑏",
  ChatColor.GREEN + ":fearful: " + ChatColor.RESET + "㑐",
  ChatColor.GREEN + ":flushed: " + ChatColor.RESET + "㑑",
  ChatColor.GREEN + ":frowning: " + ChatColor.RESET + "㑒",
  ChatColor.GREEN + ":frowning2: " + ChatColor.RESET + "㑓",
  ChatColor.GREEN + ":grimacing: " + ChatColor.RESET + "㑔",
  ChatColor.GREEN + ":grin: " + ChatColor.RESET + "㑕",
  ChatColor.GREEN + ":grinning: " + ChatColor.RESET + "㑖",
  ChatColor.GREEN + ":heart_eyes: " + ChatColor.RESET + "㑗",
  ChatColor.GREEN + ":hot_face: " + ChatColor.RESET + "㑘",
  ChatColor.GREEN + ":hushed: " + ChatColor.RESET + "㑙",
  ChatColor.GREEN + ":innocent: " + ChatColor.RESET + "㑚",
  ChatColor.GREEN + ":joy: " + ChatColor.RESET + "㑛",
  ChatColor.GREEN + ":kissing: " + ChatColor.RESET + "㑜",
  ChatColor.GREEN + ":kissing_blush: " + ChatColor.RESET + "㑝",
  ChatColor.GREEN + ":kissing_happy: " + ChatColor.RESET + "㑞",
  ChatColor.GREEN + ":kissing_heart: " + ChatColor.RESET + "㑟",
  ChatColor.GREEN + ":laughing: " + ChatColor.RESET + "㑠",
  ChatColor.GREEN + ":money_mouth: " + ChatColor.RESET + "㑡",
  ChatColor.GREEN + ":nerd: " + ChatColor.RESET + "㑢",
  ChatColor.GREEN + ":neutral_face: " + ChatColor.RESET + "㑣",
  ChatColor.GREEN + ":no_mouth: " + ChatColor.RESET + "㑤",
  ChatColor.GREEN + ":open_mouth: " + ChatColor.RESET + "㑥",
  ChatColor.GREEN + ":partying_face: " + ChatColor.RESET + "㑦",
  ChatColor.GREEN + ":pensive: " + ChatColor.RESET + "㑧",
  ChatColor.GREEN + ":perservere: " + ChatColor.RESET + "㑨",
  ChatColor.GREEN + ":rage: " + ChatColor.RESET + "㑩",
  ChatColor.GREEN + ":rage_symbols: " + ChatColor.RESET + "㑪",
  ChatColor.GREEN + ":relieved: " + ChatColor.RESET + "㑫",
  ChatColor.GREEN + ":rofl: " + ChatColor.RESET + "㑬",
  ChatColor.GREEN + ":rolling_eyes: " + ChatColor.RESET + "㑭",
  ChatColor.GREEN + ":scream: " + ChatColor.RESET + "㑮",
  ChatColor.GREEN + ":shushing_face: " + ChatColor.RESET + "㑯",
  ChatColor.GREEN + ":sleeping: " + ChatColor.RESET + "㑰",
  ChatColor.GREEN + ":sleepy: " + ChatColor.RESET + "㑱",
  ChatColor.GREEN + ":slight_frown: " + ChatColor.RESET + "㑲",
  ChatColor.GREEN + ":slight_smile: " + ChatColor.RESET + "㑳",
  ChatColor.GREEN + ":smile: " + ChatColor.RESET + "㑴",
  ChatColor.GREEN + ":smile_love: " + ChatColor.RESET + "㑵",
  ChatColor.GREEN + ":smiley: " + ChatColor.RESET + "㑶",
  ChatColor.GREEN + ":smiling_imp: " + ChatColor.RESET + "㑷",
  ChatColor.GREEN + ":smiling_tear: " + ChatColor.RESET + "㑸",
  ChatColor.GREEN + ":smirk: " + ChatColor.RESET + "㑹",
  ChatColor.GREEN + ":sob: " + ChatColor.RESET + "㑺",
  ChatColor.GREEN + ":star_struck: " + ChatColor.RESET + "㑻",
  ChatColor.GREEN + ":sunglasses: " + ChatColor.RESET + "㑼",
  ChatColor.GREEN + ":sweat: " + ChatColor.RESET + "㑽",
  ChatColor.GREEN + ":sweat_smile: " + ChatColor.RESET + "㑾",
  ChatColor.GREEN + ":thermometer_face: " + ChatColor.RESET + "㑿",
  ChatColor.GREEN + ":thinking: " + ChatColor.RESET + "㒀",
  ChatColor.GREEN + ":tired_face: " + ChatColor.RESET + "㒁",
  ChatColor.GREEN + ":tongue: " + ChatColor.RESET + "㒂",
  ChatColor.GREEN + ":tongue_closed_eyes: " + ChatColor.RESET + "㒃",
  ChatColor.GREEN + ":tongue_wink: " + ChatColor.RESET + "㒄",
  ChatColor.GREEN + ":triumph: " + ChatColor.RESET + "㒅",
  ChatColor.GREEN + ":unamused: " + ChatColor.RESET + "㒆",
  ChatColor.GREEN + ":upside_down: " + ChatColor.RESET + "㒇",
  ChatColor.GREEN + ":weary: " + ChatColor.RESET + "㒈",
  ChatColor.GREEN + ":wink: " + ChatColor.RESET + "㒉",
  ChatColor.GREEN + ":woozy_face: " + ChatColor.RESET + "㒊",
  ChatColor.GREEN + ":worried: " + ChatColor.RESET + "㒋",
  ChatColor.GREEN + ":yawning_face: " + ChatColor.RESET + "㒌",
  ChatColor.GREEN + ":yum: " + ChatColor.RESET + "㒍",
  ChatColor.GREEN + ":zany_face: " + ChatColor.RESET + "㒎",
  ChatColor.GREEN + ":zipper_mouth: " + ChatColor.RESET + "㒏",
  ChatColor.GREEN + ":discord: " + ChatColor.RESET + "㒐"
];

addCommand("emotes", {
    onCommand: function(sender, args) {
        page = 1
        if(args[0]) {
            page = args[0]
        }
        const startIndex = (page - 1) * 8 + 1
        if(page >= 1) {
            if(page % 1 === 0) {
                sender.sendMessage(ChatColor.GOLD + `Emotes Page ${page}`)
                for(i = startIndex; i < startIndex + 8; i++) {
                    if(emotes[i] != undefined) {
                        sender.sendMessage(emotes[i])
                    }
                }
            }
            else {
                    sender.sendMessage(ChatColor.RED + "The number must be whole")
            }
        }
        else {
            sender.sendMessage(ChatColor.RED + "Not a number equal to or above 1")
        }
    },
    
    onTabComplete: function(sender, args) {
        return toJavaList([]);
    }
})