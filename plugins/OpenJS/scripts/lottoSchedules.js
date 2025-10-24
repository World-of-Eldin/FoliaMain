//!PlaceholderAPI
const hours = 48; //The number of hours between each draw
const announcementRate = 1; //The number of hours between each lottery announcement
const rollOverChance = 10; //The chance of a rollover (in percent)
const rollOverChanceDropRate = 1; //The drop rate of this chance on each subsequent iteration (in percent)
const ticketValue = 1000; //The value of an individual lottery ticket
const maxTickets = 5; //The maximum tickets a player can purchase
const extraMoney = 1000; //Extra money added to the pot
const tax = 10; //The tax in percent
const Server = plugin.getServer();
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
const ChatColor = org.bukkit.ChatColor;
task.repeat(0, 10, () => { //Run every 10 seconds
    DiskApi.loadFile("LottoTimePassage", false, true)
    const timePassed = DiskApi.getVar("LottoTimePassage", "time", 0, true);
    
    if(timePassed < hours * 3600) { //Increment time if not passed hours * 3600
        DiskApi.setVar("LottoTimePassage", "time", timePassed + 10, true)
        DiskApi.saveFile("LottoTimePassage", false, true)
    }

    else {
        DiskApi.setVar("LottoTimePassage", "time", 0, true)
        iterations();
        DiskApi.saveFile("LottoTimePassage", true, true);
        DiskApi.loadFile("LottoTimePassage", true, true);
        gambling();
    }
});

function iterations() { //Add an iteration to deplete rollOverChance
    const iterations = DiskApi.getVar("LottoTimePassage", "iterations", 0, true);
    DiskApi.setVar("LottoTimePassage", "iterations", iterations + 1, true);
}   
    
function gambling() {
    const iterations = DiskApi.getVar("LottoTimePassage", "iterations", 0, true);
    if((Math.random() * 100) > (rollOverChance - iterations * rollOverChanceDropRate)) { //Compare a random number between 1 and 100 to the rollOverChance subtracted by the number of iterations * the drop rate
        DiskApi.setVar("LottoTimePassage", "iterations", 0, true);
        DiskApi.saveFile("LottoTimePassage", false, true); //Reset iterations
        
        DiskApi.loadFile("LottoData", false, true)
        const totalTickets = DiskApi.getVar("LottoData", "total", 0, true);
        
        if(totalTickets > 0) { //Check that tickets have been purchased
            const playerData = DiskApi.getVar("LottoData", "players", 0, true);
            const winningTicket = Math.floor(Math.random() * totalTickets) + 1; //Set the winningTicket to a random whole number between 1 and the number of total tickets
            const playerDataList = playerData.split(",");
            let totalTicketsCalculated = 0;
            playerDataList.forEach(playerInData => { //For every player, get their ticket count, calculating whether they are in the range for victory
                const ticketCount = DiskApi.getVar("LottoData", playerInData, 0, true)
                    let startingTicket = totalTicketsCalculated + 1;
                    let endingTicket = startingTicket + ticketCount - 1;

                    if (winningTicket >= startingTicket && winningTicket <= endingTicket) {
                    const winningMoney = (totalTickets * ticketValue + extraMoney) * (1 - tax/100);
                    Server.broadcastMessage(ChatColor.GOLD +"Lottery: " + ChatColor.GREEN + playerInData + " won " + winningMoney + ChatColor.RESET + " 㒖" + ChatColor.GREEN + "Tradebars");
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        const player = Bukkit.getPlayerExact(playerInData);
                            const balancePlaceholder = "%foliaeconomy_balance%"
                            const balanceStr = PlaceholderAPI.parseString(player, balancePlaceholder);
                            const balance = Number(balanceStr);
                        Bukkit.dispatchCommand(Console, "setbal " + playerInData + " " + (balance + winningMoney)); //Give the player the money
                    });
                }
                totalTicketsCalculated = totalTicketsCalculated + ticketCount;
            })
            
            playerDataList.forEach(playerInData => { //Remove the individual player keys
                DiskApi.setVar("LottoData", playerInData, 0, true);
                DiskApi.saveFile("LottoData", false, true)
            })

            DiskApi.setVar("LottoData", "players", 0, true); //Set players and total to 0
            DiskApi.setVar("LottoData", "total", 0, true);
            DiskApi.saveFile("LottoData", false, true)
        }
        else {
            Server.broadcastMessage(ChatColor.GOLD + "Lottery: " + ChatColor.RED + "Nobody purchased tickets");
        }

    }
    else {
        Server.broadcastMessage(ChatColor.GOLD + "Lottery rolled over");
    }
}

task.repeat(announcementRate * 1800, announcementRate * 3600, () => { //Broadcast lotto information
    DiskApi.loadFile("LottoTimePassage", false, true)
    DiskApi.loadFile("LottoData", false, true)
    const timer = DiskApi.getVar("LottoTimePassage", "time", 0, true);
    const timerValue = hours * 3600 - Number(timer);
    const totalTickets = DiskApi.getVar("LottoData", "total", 0, true);
    Server.broadcastMessage(ChatColor.GOLD + "Lottery:")
    Server.broadcastMessage(ChatColor.GOLD + "Pot: " + ChatColor.GREEN + (totalTickets * ticketValue + extraMoney) + ChatColor.RESET + " 㒖" + ChatColor.GREEN + "Tradebars")
    Server.broadcastMessage(ChatColor.GOLD + "Remaining Time: " + ChatColor.GREEN + remainingTime(timerValue))
});

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

setShared("ticketValue", ticketValue)
setShared("hours", hours)
setShared("maxTickets", maxTickets)
setShared("extraMoney", extraMoney)
setShared("remainingTime", remainingTime)
setShared("tax", tax);