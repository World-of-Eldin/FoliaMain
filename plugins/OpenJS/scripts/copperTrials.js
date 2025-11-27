//!import net.coreprotect.CoreProtect
//!import net.coreprotect.CoreProtectAPI
const Bukkit = org.bukkit.Bukkit;
const Scheduler = Bukkit.getGlobalRegionScheduler();
const Console = Bukkit.getConsoleSender();
let checkedCoords = []; //An array of coordinates where ores have already been mined
const CoreProtectPlugin = Bukkit.getPluginManager().getPlugin("CoreProtect");
const CoreProtectAPI = getMethod(CoreProtect, "getAPI").invoke(CoreProtectPlugin);
registerEvent("org.bukkit.event.block.BlockBreakEvent", {
    handleEvent: function(event) {
        const blockMined = event.getBlock(); //The block mined by the player
        if(blockMined.getType().toString() === "WAXED_COPPER_BLOCK") {
           lookup = CoreProtectAPI.blockLookup(blockMined, -1)
           if(lookup.size() === 0) {
                event.setDropItems(false)
           }
        }
    }
})