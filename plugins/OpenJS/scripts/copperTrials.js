//!import net.coreprotect.CoreProtect
//!import net.coreprotect.CoreProtectAPI
const Bukkit = org.bukkit.Bukkit;
const Scheduler = Bukkit.getGlobalRegionScheduler();
const Console = Bukkit.getConsoleSender();
const CoreProtectPlugin = Bukkit.getPluginManager().getPlugin("CoreProtect");
const CoreProtectAPI = getMethod(CoreProtect, "getAPI").invoke(
  CoreProtectPlugin
);

// All copper block types that can be found in trial chambers and converted to ingots
const COPPER_BLOCKS = [
  "COPPER_BLOCK",
  "EXPOSED_COPPER",
  "WEATHERED_COPPER",
  "OXIDIZED_COPPER",
  "WAXED_COPPER_BLOCK",
  "WAXED_EXPOSED_COPPER",
  "WAXED_WEATHERED_COPPER",
  "WAXED_OXIDIZED_COPPER",
];

registerEvent("org.bukkit.event.block.BlockBreakEvent", {
  handleEvent: function (event) {
    const blockMined = event.getBlock();
    const blockType = blockMined.getType().toString();

    // Check if it's any type of copper block
    if (COPPER_BLOCKS.indexOf(blockType) !== -1) {
      const lookup = CoreProtectAPI.blockLookup(blockMined, -1);

      // No history = naturally generated trial chamber block
      if (lookup.size() === 0) {
        event.setDropItems(false);
        return;
      }

      // Get the earliest (first) interaction with this block
      // Results are ordered newest-to-oldest, so last element is the earliest
      const results = lookup.toArray();
      const earliestRecord = results[results.length - 1];
      const parsed = CoreProtectAPI.parseResult(earliestRecord);
      const firstAction = parsed.getActionString();

      // If first action was a break, it's naturally generated (wax was scraped)
      // If first action was a place, it's player-placed
      if (firstAction === "break") {
        event.setDropItems(false);
      }
    }
  },
});
