itemCount = 0; //The count of items sold
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
registerEvent("studio.magemonkey.genesis.events.GenesisPlayerPurchaseEvent", {
    handleEvent: function(event) {
        player = event.getPlayer()
        items = player.getInventory().getContents(); //Get inventory contents
        const clickType = event.getClickType()

        if(clickType == "MIDDLE") { //Ensure that logic only runs on middle click
            const spentItem = event.getShopItem().getPrice(clickType)
            for(let i = 0; i < items.length; i++) {
                const item = items[i];
                
                if (item != null && item.getType() == spentItem.getType()) { 
                    itemCount += item.getAmount();
                }
            }
        }
    }
})

registerEvent("studio.magemonkey.genesis.events.GenesisPlayerPurchasedEvent", {
    handleEvent: function(event) {
        player = event.getPlayer()
        const buy = event.getShopItem()
        const clickType = event.getClickType()
        const priceValue = event.getShopItem().getPrice(clickType)
        const rewardValue = event.getShopItem().getReward(clickType)
        let price = event.getShopItem().getPriceType(clickType).getDisplayPrice(player, buy, priceValue, clickType);
        let reward = event.getShopItem().getRewardType(clickType).getDisplayReward(player, buy, rewardValue, clickType);

        if(!price.contains("nothing") && !reward.contains("Unknown")) { //Avoid playershop interaction events other than purchase
            if(price.contains("all")) {
                price = itemCount + price.split("all")[1]; //Split the string to match non middle-click value
            }

            let rewardNumber  = reward.match(/-?\d+\.?\d*/g);
            const priceNumber = price.match(/-?\d+\.?\d*/g)
            rewardNumber = rewardNumber * priceNumber //Get full price for all items combined
            discordMessage = player.getName() + " sold " + price + " for " + rewardNumber + " Trade Bars";

            if(!reward.contains("Trade Bars")) {
                discordMessage = player.getName() + " paid " + price + " for " + reward;
            }

            Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                Bukkit.dispatchCommand(Console, "discordsrv bcast #1388395111133479004 " + discordMessage); //Send the discord message
            });
        }
        itemCount = 0; //Reset itemCount
    }
})