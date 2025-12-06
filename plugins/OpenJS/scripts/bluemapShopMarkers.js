// BlueMap Shop Villager Markers
// Automatically displays shop villagers on BlueMap
// Updates every 60 seconds

const Bukkit = org.bukkit.Bukkit;
const EntityType = org.bukkit.entity.EntityType;

// BlueMap API imports
const BlueMapAPI = de.bluecolored.bluemap.api.BlueMapAPI;
const POIMarker = de.bluecolored.bluemap.api.markers.POIMarker;
const MarkerSet = de.bluecolored.bluemap.api.markers.MarkerSet;

// Valid shop names (matching rightClickVill.js)
const validShops = [
  "Armorer",
  "Butcher",
  "Cartographer",
  "Cleric",
  "Farmer",
  "Fisherman",
  "Fletcher",
  "Leatherworker",
  "Librarian",
  "Mason",
  "Nitwit",
  "Shepherd",
  "Toolsmith",
  "Weaponsmith",
];

// Icon colors for each profession (using hex colors)
const shopColors = {
  Armorer: "#808080", // Gray (armor)
  Butcher: "#8B4513", // Brown (meat)
  Cartographer: "#FFFFFF", // White (maps)
  Cleric: "#9B59B6", // Purple (magic/potions)
  Farmer: "#228B22", // Green (crops)
  Fisherman: "#1E90FF", // Blue (water)
  Fletcher: "#8B4513", // Brown (wood/arrows)
  Leatherworker: "#A0522D", // Sienna (leather)
  Librarian: "#FFD700", // Gold (books/knowledge)
  Mason: "#696969", // Dark gray (stone)
  Nitwit: "#90EE90", // Light green (special)
  Shepherd: "#F0E68C", // Khaki (wool)
  Toolsmith: "#4682B4", // Steel blue (tools)
  Weaponsmith: "#B22222", // Firebrick (weapons)
};

function updateShopMarkers() {
  try {
    // Check if BlueMap API is available
    const blueMapOptional = BlueMapAPI.getInstance();
    if (!blueMapOptional.isPresent()) {
      console.log("[BlueMap Shops] BlueMap API not available yet");
      return;
    }

    const blueMap = blueMapOptional.get();

    // Get the overworld map
    const maps = blueMap.getMaps();
    const worldMap = maps
      .stream()
      .filter(function (m) {
        return m.getWorld().getName().equals("world");
      })
      .findFirst();

    if (!worldMap.isPresent()) {
      console.log("[BlueMap Shops] Could not find world map");
      return;
    }

    const map = worldMap.get();

    // Create or get the marker set
    const markerSet = MarkerSet.builder()
      .label("Villager Shops")
      .toggleable(true)
      .defaultHidden(false)
      .build();

    // Get all entities in the world
    const world = Bukkit.getWorld("world");
    if (!world) {
      console.log("[BlueMap Shops] Could not find world");
      return;
    }

    const entities = world.getEntities();
    let markerCount = 0;

    // Iterate through all entities
    for (let i = 0; i < entities.size(); i++) {
      const entity = entities.get(i);

      // Check if it's a villager or wandering trader
      if (
        entity.getType() !== EntityType.VILLAGER &&
        entity.getType() !== EntityType.WANDERING_TRADER
      ) {
        continue;
      }

      const tags = entity.getScoreboardTags();

      // Check if this villager has the shop_villager tag
      if (!tags.contains("shop_villager")) {
        continue;
      }

      // Find which shop this villager represents
      let shopName = null;
      for (let j = 0; j < validShops.length; j++) {
        if (tags.contains("shop_" + validShops[j])) {
          shopName = validShops[j];
          break;
        }
      }

      if (shopName === null) {
        continue;
      }

      // Get villager location
      const loc = entity.getLocation();
      const x = loc.getX();
      const y = loc.getY();
      const z = loc.getZ();

      // Create marker
      const markerId = "shop_" + shopName.toLowerCase();
      const color = shopColors[shopName] || "#FFFFFF";

      const marker = POIMarker.builder()
        .label(shopName + " Shop")
        .position(x, y, z)
        .build();

      // Set marker color using reflection (BlueMap API might use different method)
      try {
        marker.setStyleClasses(
          java.util.Arrays.asList("shop-marker", shopName.toLowerCase())
        );
      } catch (e) {
        // Ignore if method doesn't exist
      }

      markerSet.put(markerId, marker);
      markerCount++;
    }

    // Update the map with the new marker set
    map.getMarkerSets().put("shop_villagers", markerSet);

    console.log(
      "[BlueMap Shops] Updated " + markerCount + " shop villager markers"
    );
  } catch (e) {
    console.log("[BlueMap Shops] Error updating markers: " + e);
    console.log(e.stack);
  }
}

// Schedule the update task to run every 60 seconds (1200 ticks)
const globalScheduler = Bukkit.getGlobalRegionScheduler();

// Initial update after 5 seconds (100 ticks) to allow BlueMap to fully load
globalScheduler.runDelayed(
  plugin,
  function () {
    updateShopMarkers();

    // Then schedule repeating task
    globalScheduler.runAtFixedRate(
      plugin,
      function () {
        updateShopMarkers();
      },
      1200, // Delay (60 seconds)
      1200 // Period (60 seconds)
    );
  },
  100 // Initial delay (5 seconds)
);

console.log("[BlueMap Shops] Script loaded - will update markers every 60 seconds");
