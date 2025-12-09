//!PlaceholderAPI
const ticketValue = 1000;
const hours = 72;
const maxTickets = 5;
const extraMoney = 1000;
const tax = 10;
addCommand("lottery", {
    onCommand: function(sender, args) {
        const Bukkit = org.bukkit.Bukkit;
        const Console = Bukkit.getConsoleSender();
        const Scheduler = Bukkit.getGlobalRegionScheduler();
        const ChatColor = org.bukkit.ChatColor;
        args = toArray(args);
        DiskApi.loadFile("LottoData", true, true)
        if (args.length > 0) {
            switch(args[0]) {
                case "buy":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        if(args.length === 2) { //Check that 2 arguments were used
                            if(args[1] >= 1 && args[1] <= maxTickets) { //Check that the number is within the set range
                                if(args[1] % 1 === 0) { //Check that the number is whole
                                    const balancePlaceholder = "%foliaeconomy_balance%"
                                    const balance = PlaceholderAPI.parseString(sender, balancePlaceholder) //Get the player's balance
                                    const valueOfTicket = ticketValue * args[1];

                                    if(balance >= valueOfTicket) { //Check that the player can afford the ticket
                                        const playerTickets = DiskApi.getVar("LottoData", sender.getName(), '0', true);
                                        const numberOfTickets = Number(playerTickets) + Number(args[1]);

                                        if(!(numberOfTickets > maxTickets)) { //Check that the player has not gone over the ticket purchase limit
                                            sender.sendMessage(ChatColor.GOLD +"You have purchased " + args[1] + " tickets");
                                            Bukkit.dispatchCommand(Console, "setbal " + sender.getName() + " " + (balance - valueOfTicket)); //Remove the money from the player
                                            DiskApi.setVar("LottoData", sender.getName(), numberOfTickets, true)
                                            saveTotal(args[1], "LottoData")
                                            savePlayer(sender.getName(), "LottoData");
                                            DiskApi.saveFile("LottoData", false, true)
                                        }

                                        else {
                                            sender.sendMessage(ChatColor.RED + "The maximum number of tickets is " + maxTickets + " tickets, use /lottery info to see how many you have purchased")
                                        }
                                    }

                                    else {
                                        sender.sendMessage(ChatColor.RED + "A lottery ticket costs " + ticketValue + ChatColor.RESET + " 㒖" + ChatColor.RED + "Trade Bars");
                                    }
                                }

                                else {
                                    sender.sendMessage(ChatColor.RED + "The number must be whole");
                                }
                            }

                            else {
                                sender.sendMessage(ChatColor.RED + "Not a number between 1 and " + maxTickets);
                            }
                        }

                        else {
                            sender.sendMessage(ChatColor.RED + "Command format: /lottery buy <whole number between 1 and " + maxTickets + ">");
                        }
                    })
                    break;

                case "info":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        const total = DiskApi.getVar("LottoData", "total", '0', true);
                        const ticketCount = DiskApi.getVar("LottoData", sender.getName(), '0', true);
                        DiskApi.loadFile("LottoTimePassage", false, true)
                        const timer = DiskApi.getVar("LottoTimePassage", "time", '0', true);
                        sender.sendMessage(ChatColor.GOLD + "Total Tickets:" + ChatColor.GREEN + " There are a total of " + total + " tickets");
                        sender.sendMessage(ChatColor.GOLD + "Ticket Count:" + ChatColor.GREEN + " You have a total of " + ticketCount + " tickets, worth " + ticketCount * ticketValue * (1 - tax/100) + ChatColor.RESET + " 㒖" + ChatColor.GREEN + "Trade Bars");

                        if(total != 0) { //Ensure that no division by 0 occurs
                            sender.sendMessage(ChatColor.GOLD + "Chances:" + ChatColor.GREEN + " This gives you a " + (ticketCount/total * 100).toFixed(2) + "% chance of winning")
                        }

                        else {
                            sender.sendMessage(ChatColor.GOLD + "Chances:" + ChatColor.GREEN + " This gives you a 0% chance of winning")
                        }

                        sender.sendMessage(ChatColor.GOLD + "Current Pot:" + ChatColor.GREEN + " " + (total * ticketValue + extraMoney) * (1 - tax/100) + ChatColor.RESET + " 㒖" + ChatColor.GREEN + "Trade Bars")
                        const timerValue = hours * 3600 - Number(timer);
                        sender.sendMessage(ChatColor.GOLD + "Remaining Time: " + ChatColor.GREEN + remainingTime(timerValue))
                    })
                    break;

                case "top":
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () { 
                        const playerData = DiskApi.getVar("LottoData", "players", '0', true);

                        if(playerData != 0) { //Ensure that players have purchased tickets
                            const totalTickets = DiskApi.getVar("LottoData", "total", '0', true);
                            const playerDataList = playerData.split(",");
                            let topTicketHolders = []; //An object to store players and their ticket count

                            playerDataList.forEach(playerInData => { //For every player, get their personal number of tickets and push it to topTicketHolders
                                let ticketCount = DiskApi.getVar("LottoData", playerInData, '0', true)
                                topTicketHolders.push({name: playerInData, tickets: ticketCount});
                            })

                            topTicketHolders.sort((a, b) => b.tickets - a.tickets);
                            sender.sendMessage(ChatColor.GOLD + "Top 10 Ticket Holders:")
                            let playersCalculated = 0;

                            topTicketHolders.forEach(playerInData => { //For each player, display their name, ticket count and chances, up to 10 players
                                if(playersCalculated < 10) {
                                    sender.sendMessage(ChatColor.GREEN + playerInData.name + ": " + ChatColor.WHITE + playerInData.tickets + " tickets (" + (playerInData.tickets/totalTickets * 100).toFixed(2) + "%)");
                                    playersCalculated++;
                                }

                            })
                        }

                        else {
                            sender.sendMessage(ChatColor.RED + "Nobody has purchased tickets");
                        }
                    })
                    break;
            }
        }

        else if(args.length === 0) { //Provide help to players who use 0 arguments
            sender.sendMessage(ChatColor.GOLD + "/lottery buy <ticketcount>" + ChatColor.GREEN + " - Buy a ticket");
            sender.sendMessage(ChatColor.GOLD + "/lottery info" + ChatColor.GREEN + " - Get information on the current lottery");
            sender.sendMessage(ChatColor.GOLD + "/lottery top" + ChatColor.GREEN + " - Get information on the top bidders");
        }
    },
    
    onTabComplete: function(sender, args) {
        args = toArray(args);
        if (args.length === 1) {
            return ["buy", "info", "top"];
        }
        return []
    }
});

function savePlayer(player, file) {
    const playerData = DiskApi.getVar(file, "players", '0', true);

    if(playerData != 0) { //Check that player data is not 0 (the fallback value)
        let playerAlreadyInList = false;
        const playerDataList = playerData.split(","); //Create a list by splitting playerData based on commas
        
        playerDataList.forEach(playerInData => {
            if(playerInData === player) {
                playerAlreadyInList = true;
            }
        });

        if(!playerAlreadyInList) //If player is in the list, do not add them again
        {
            DiskApi.setVar(file, "players", player + "," + playerData, true)
        }
    }

    else {
        DiskApi.setVar(file, "players", player, true)    
    }
}

function saveTotal(total, file) {
    const totalData = DiskApi.getVar(file, "total", '0', true);
        DiskApi.setVar(file, "total", Number(total) + Number(totalData), true)

    DiskApi.saveFile(file, true, false)
}


function remainingTime(totalSeconds) {
    let drawTimeMessage = "";

    const weeks = Math.floor(totalSeconds / 604800);
    totalSeconds -= weeks * 604800;
    if (weeks > 0) {
        drawTimeMessage += weeks + " week" + (weeks > 1 ? "s" : "") + ", ";
    }

    const days = Math.floor(totalSeconds / 86400);
    totalSeconds -= days * 86400;
    if (days > 0) {
        drawTimeMessage += days + " day" + (days > 1 ? "s" : "") + ", ";
    }

    const hours = Math.floor(totalSeconds / 3600);
    totalSeconds -= hours * 3600;
    if (hours > 0) {
        drawTimeMessage += hours + " hour" + (hours > 1 ? "s" : "") + ", ";
    }

    const minutes = Math.floor(totalSeconds / 60);
    totalSeconds -= minutes * 60;
    if (minutes > 0) {
        drawTimeMessage += minutes + " minute" + (minutes > 1 ? "s" : "") + " and ";
    }

    const seconds = totalSeconds;
    if (seconds > 0 || drawTimeMessage === "") {
        drawTimeMessage += seconds + " second" + (seconds !== 1 ? "s" : "");
    }

    if (drawTimeMessage.endsWith(", ")) { //Remove a comma a the end
        drawTimeMessage = drawTimeMessage.slice(0, -2);
    }

    if (drawTimeMessage.endsWith("and ")) { //Remove an and a the end
        drawTimeMessage = drawTimeMessage.slice(0, -4);
    }
    return drawTimeMessage;
}