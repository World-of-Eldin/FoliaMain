let page = 0; //The starting page
const ChatColor = org.bukkit.ChatColor;
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
    handleEvent: function(event) {
        blockEvent(event, "broke");
    }
})

registerEvent("org.bukkit.event.block.BlockPlaceEvent", {
    handleEvent: function(event) {
        blockEvent(event, "placed");
    }
})

function blockEvent(event, type) {
    if(!event.getPlayer().hasMetadata("inspector")) {
        DiskApi.loadFile("BlockData", false, true)
        const block = event.getBlock();
        const location = block.getX() + "." + block.getY() + "." + block.getZ(); //Store the key as the coordinates
        const date = new Date();
        const currentTime = Number(date.getTime()/1000);
        const message = currentTime + "/" + event.getPlayer().getName() + " " + type + " " + block.getType().toString().toLowerCase(); //Store every message in lower case, with a / between time and the content
        const preexistingMessage = DiskApi.getVar("BlockData", location, 0, true);

        if(preexistingMessage != 0) {
            DiskApi.setVar("BlockData", location, message + "," + preexistingMessage, true) //Place the message in front of the preexisting message
        }

        else {
            DiskApi.setVar("BlockData", location, message, true)
        }

        DiskApi.saveFile("BlockData", false, true)
    }

    else {
        DiskApi.loadFile("BlockData", false, true)
        const block = event.getBlock();
        const location = block.getX() + "." + block.getY() + "." + block.getZ();
        const message = DiskApi.getVar("BlockData", location, 0, true);

        if(message != 0) {
            const messageToSend = splitMessage(message);
            event.getPlayer().sendMessage(messageToSend);
        }

        else {
            event.getPlayer().sendMessage("No data exists for this block")
        }
        event.setCancelled(true);
    }
}

function splitMessage(messages) {
    const messageList = messages.split(","); //Create a list by splitting messages based on commas
    let newMessage = ChatColor.GOLD + "Page #" + (page + 1) + "\n"; //Display the current page
    const date = new Date();
    const currentTime = date.getTime()/1000;
    let messagesSent = 0; //The number of messages sent
    let messagesIterated = 0; //The number of messages iterated through
    messageList.forEach(message => {
        if(messagesIterated >= page * 9) { //
            if(messagesSent < 9) { //Ensure that only 9 messages are displayed
                const timeSplit = message.indexOf("/")
                const messageNoTime = message.substring(timeSplit + 1, message.length); //Remove the time
                const time = message.substring(0, timeSplit);
                const timeGap = currentTime - Number(time); //the difference between the current time and the time stored
                newMessage = newMessage + "\n" + timeConvert(timeGap) + ChatColor.GREEN + " " + messageNoTime;
                messagesSent++;
            }
        }
        messagesIterated++;
    });
    return newMessage;
}

function timeConvert(time) {
    if(time < 60) {
        return ChatColor.GRAY + time.toFixed(2) + " Secs ago:";
    }
    if(time < 3600) {
        return ChatColor.GRAY + (time/60).toFixed(2) + " Mins ago:";;
    }
    if(time < 86400) {
        return ChatColor.GRAY + (time/3600).toFixed(2) + " Hours ago:";;
    }
    if(time < 604800) {
        return ChatColor.GRAY + (time/86400).toFixed(2) + " Days ago:";;
    }
    if(time < 2628002.88) {
        return ChatColor.GRAY + (time/604800).toFixed(2) + " Weeks ago:";
    }
    if(time < 31536000) {
        return ChatColor.GRAY + (time/2628002.88).toFixed(2) + " Months ago:";
    }
    else {
        return ChatColor.GRAY + (time/31536000).toFixed(2) + " Years ago:";
    }
}

addCommand("block_inspect", {
    onCommand: function(sender, args) {
        if(args[0] === "setpage") {
            if(args.length === 2) {
                const commandPage = args[1]

                if(commandPage >= 1) {

                    if(commandPage % 1 === 0) {
                        page = commandPage - 1;
                        sender.sendMessage("Page changed to " + commandPage)
                    }

                    else {
                        sender.sendMessage(ChatColor.RED + "The page number must be whole")
                    }
                }

                else {
                    sender.sendMessage(ChatColor.RED + "The page number must be equal to or above 1")
                }
            }

            else {
                sender.sendMessage(ChatColor.RED + "Command Format: /block_inspect setpage <whole page number that is 1 or above>")
            }
        }
        if(args[0] === "changestatus") {
            if (!sender.hasMetadata("inspector")) { //Check that the sender does not already have inspector
                sender.setMetadata("inspector", new org.bukkit.metadata.FixedMetadataValue(plugin, true)); //Set the player metadata to inspector
                sender.sendMessage("Inspector added");
            }

            else {
                sender.removeMetadata("inspector", plugin); //Remove the inspector metadata
                sender.sendMessage("Inspector removed");
            }
        }
        if(args.length === 0) {
            sender.sendMessage(ChatColor.GOLD + "/block_inspect changestatus" + ChatColor.GREEN + " - Turn inspector on or off");
            sender.sendMessage(ChatColor.GOLD + "/block_inspect setpage <pageNumber>" + ChatColor.GREEN + " - Change the current page being viewed");
        }
    },
    onTabComplete: function(sender, args) {
        args = toArray(args);
        if (args.length === 1) {
            return toJavaList(["setpage", "changestatus"]);
        }
        return toJavaList([]);
    }
}, "eldin.staff")
