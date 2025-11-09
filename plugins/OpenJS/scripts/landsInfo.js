//!PlaceholderAPI
const ranks = {
    "Gentry": 1,
    "Yeoman": 4,
    "Nobleman": 8,
    "Baron": 16,
    "Earl": 32,
    "Duke": 64,
    "Prince": 128,
    "King": 256,
    "Emperor": 512
};
const ChatColor = org.bukkit.ChatColor;
addCommand("toplands", {
    onCommand: function (sender, args) {
        let page = args[0];
        if(args[0] == undefined) {
            page = 1;
        }
        const startIndex = (page - 1) * 8 + 1
            if(page >= 1) {
                if(page % 1 === 0) {
                    sender.sendMessage(ChatColor.GOLD + "Top Lands:")
                    for(i = startIndex; i < startIndex + 8; i++) {
                        const topLandsPlaceholderName = `%lands_top_land_chunks_${i}_name%`
                        const topLandsPlaceholderOwner = `%lands_top_land_chunks_${i}_owner%`
                        const topLandsPlaceholderSize = `%lands_top_land_chunks_${i}_size%`
                        const topLandsName = PlaceholderAPI.parseString(sender, topLandsPlaceholderName)
                        const topLandsOwner = PlaceholderAPI.parseString(sender, topLandsPlaceholderOwner)
                        const topLandsSize = PlaceholderAPI.parseString(sender, topLandsPlaceholderSize)
                        if(!topLandsName.contains("None")) {
                            sender.sendMessage("§b #" + i + " " +  ChatColor.GREEN + topLandsName + " §e- " + topLandsOwner + ": §7" +  + topLandsSize + " chunks");
                        }
                    }
                    sender.sendMessage(ChatColor.GOLD + `Use /toplands ${Number(page) + 1} to see more`)
                }
            else {
                sender.sendMessage(ChatColor.RED + "The number must be whole")
            }
        }
        else {
            sender.sendMessage(ChatColor.RED + "Not a number above 1")
        }
    }
})

addCommand("nextrank", {
    onCommand: function (sender, args) {
        let page = args[0];
        
        if(args[0] == undefined) {
            page = 1;
        }
        landCount = 0;
        landsEnded = false;

        for(i = 1; !landsEnded && i < 10000; i++) {
             const topLandsPlaceholderName = `%lands_top_land_chunks_${i}_name%`
             const topLandsName = PlaceholderAPI.parseString(sender, topLandsPlaceholderName)
             if((!topLandsName.contains("None")))
             {
                landCount++;
             }
             else {
                landsEnded = true
             }
        }
        let topLandName = '';
        let topLandOwner = '';
        let topLandSize = 0;

        for(i = 1; i <= landCount; i++) {
            const topLandsPlaceholderName = `%lands_top_land_chunks_${i}_name%`
            const topLandsPlaceholderOwner = `%lands_top_land_chunks_${i}_owner%`
            const topLandsPlaceholderSize = `%lands_top_land_chunks_${i}_size%`
            topLandName = PlaceholderAPI.parseString(sender, topLandsPlaceholderName)
            topLandOwner = PlaceholderAPI.parseString(sender, topLandsPlaceholderOwner)
            topLandSize = PlaceholderAPI.parseString(sender, topLandsPlaceholderSize)
            if(topLandOwner == sender.getName()) {
                break;
            }
        }

        let messageRank = '';
        let messageValue = 0;
        for (var rank in ranks) {
            var value = ranks[rank];
            if (topLandSize < value) {
                messageRank = rank;
                messageValue = value;
                break;
            }
        }

        let message = '';
        if(topLandSize >= 512) {
            message = "There are no further ranks, you have achieved emperor"
        }

        else {
            message = "You have no land, your next rank is " + messageRank + ", which you are " + (messageValue-topLandSize) + " chunk or 7680 Trade Bars away from";
            if(topLandName != '') {
                message = "Your top land of " + topLandName + " has a total of " + topLandSize + " chunks, placing you " + (messageValue-topLandSize) + " chunks or " + (messageValue-topLandSize) * 7680 +  ChatColor.RESET + " 㒖" + "Trade Bars away from " + messageRank;
            }
        }
        sender.sendMessage(message)
    }
})