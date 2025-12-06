// BlueMap Shop Villager Markers
// Automatically displays shop villagers on BlueMap
// Reads villager data from DiskAPI (saved by villagerPositions.js)
// Updates every 60 seconds

const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const OpenJSPlugin = Bukkit.getPluginManager().getPlugin("OpenJS");

// Get BlueMap API using reflection
let BlueMapAPIClass = null;
let POIMarkerClass = null;
let MarkerSetClass = null;
let StringClass = null;
let DoubleClass = null;

try {
  BlueMapAPIClass = java.lang.Class.forName(
    "de.bluecolored.bluemap.api.BlueMapAPI"
  );
  POIMarkerClass = java.lang.Class.forName(
    "de.bluecolored.bluemap.api.markers.POIMarker"
  );
  MarkerSetClass = java.lang.Class.forName(
    "de.bluecolored.bluemap.api.markers.MarkerSet"
  );
  StringClass = java.lang.Class.forName("java.lang.String");
  DoubleClass = java.lang.Double.TYPE;
  Console.sendMessage(
    "[BlueMap Shops] Loaded BlueMap API classes successfully"
  );
} catch (e) {
  Console.sendMessage(
    "[BlueMap Shops] §cFailed to load BlueMap API classes: " + e
  );
}

// Villager head icons - local asset files
// Place PNG images in: plugins/BlueMap/web/assets/shopicons/
const villagerIcons = {
  Armorer: "assets/shopicons/armorer.png",
  Butcher: "assets/shopicons/butcher.png",
  Cartographer: "assets/shopicons/cartographer.png",
  Cleric: "assets/shopicons/cleric.png",
  Farmer: "assets/shopicons/farmer.png",
  Fisherman: "assets/shopicons/fisherman.png",
  Fletcher: "assets/shopicons/fletcher.png",
  Leatherworker: "assets/shopicons/leatherworker.png",
  Librarian: "assets/shopicons/librarian.png",
  Mason: "assets/shopicons/mason.png",
  Nitwit: "assets/shopicons/nitwit.png",
  Shepherd: "assets/shopicons/shepherd.png",
  Toolsmith: "assets/shopicons/toolsmith.png",
  Weaponsmith: "assets/shopicons/weaponsmith.png",
  VillagerShops: "assets/shopicons/librarian.png",
};

const villagerNames = {
  Armorer: "Gareth",
  Butcher: "Roland",
  Cartographer: "Elara",
  Cleric: "Matthias",
  Farmer: "Bren",
  Fisherman: "Caspian",
  Fletcher: "Rowan",
  Leatherworker: "Silas",
  Librarian: "Aldric",
  Mason: "Thorne",
  Nitwit: "Pip",
  Shepherd: "Mara",
  Toolsmith: "Balin",
  Weaponsmith: "Kael",
  VillagerShops: "Tomas",
};

// World configurations - maps BlueMap map IDs to DiskAPI file names
const worldConfigs = [
  { mapId: "world", diskFile: "world_Villagers" },
  { mapId: "world_nether", diskFile: "world_nether_Villagers" },
  { mapId: "world_the_end", diskFile: "world_the_end_Villagers" },
];

function updateShopMarkers() {
  try {
    if (!BlueMapAPIClass || !POIMarkerClass || !MarkerSetClass) {
      Console.sendMessage("[BlueMap Shops] §cBlueMap API classes not loaded");
      return;
    }

    // Get BlueMap API instance
    const getInstanceMethod = BlueMapAPIClass.getMethod("getInstance");
    const blueMapOptional = getInstanceMethod.invoke(null);

    // Check if Optional is present
    const isPresentMethod = blueMapOptional.getClass().getMethod("isPresent");
    const isPresent = isPresentMethod.invoke(blueMapOptional);

    if (!isPresent) {
      Console.sendMessage("[BlueMap Shops] BlueMap API not available yet");
      return;
    }

    // Get the BlueMap API instance from Optional
    const getMethod = blueMapOptional.getClass().getMethod("get");
    const blueMap = getMethod.invoke(blueMapOptional);

    // Get all maps
    const getMapsMethod = blueMap.getClass().getMethod("getMaps");
    const mapsCollection = getMapsMethod.invoke(blueMap);
    const mapsArray = mapsCollection.toArray();

    // Process each world
    worldConfigs.forEach((worldConfig) => {
      try {
        // Find the BlueMap map for this world
        let worldMap = null;
        for (let i = 0; i < mapsArray.length; i++) {
          const mapObj = mapsArray[i];
          try {
            const getIdMethod = mapObj.getClass().getMethod("getId");
            const mapId = getIdMethod.invoke(mapObj);

            if (mapId && mapId.toString() === worldConfig.mapId) {
              worldMap = mapObj;
              break;
            }
          } catch (e) {
            // Skip maps we can't identify
          }
        }

        if (!worldMap) {
          Console.sendMessage(
            "[BlueMap Shops] §eCould not find map: " + worldConfig.mapId
          );
          return;
        }

        // Create MarkerSet using builder
        const markerSetBuilderMethod = MarkerSetClass.getMethod("builder");
        const markerSetBuilder = markerSetBuilderMethod.invoke(null);
        const markerSetBuilderClass = markerSetBuilder.getClass();

        // Set label
        const labelMethod = markerSetBuilderClass.getMethod(
          "label",
          StringClass
        );
        labelMethod.invoke(markerSetBuilder, "Villager Shops");

        // Set optional properties
        try {
          const toggleableMethod = markerSetBuilderClass.getMethod(
            "toggleable",
            java.lang.Boolean.TYPE
          );
          toggleableMethod.invoke(
            markerSetBuilder,
            java.lang.Boolean.valueOf(true)
          );
        } catch (e) {
          // Method doesn't exist, skip
        }

        try {
          const defaultHiddenMethod = markerSetBuilderClass.getMethod(
            "defaultHidden",
            java.lang.Boolean.TYPE
          );
          defaultHiddenMethod.invoke(
            markerSetBuilder,
            java.lang.Boolean.valueOf(false)
          );
        } catch (e) {
          // Method doesn't exist, skip
        }

        // Build the MarkerSet
        const buildMethod = markerSetBuilderClass.getMethod("build");
        const markerSet = buildMethod.invoke(markerSetBuilder);

        // Load villager data from DiskAPI
        DiskApi.loadFile(worldConfig.diskFile, false, true);

        const villagerUUIDsJSON = DiskApi.getVar(
          worldConfig.diskFile,
          "Villager_UUIDS",
          "[]",
          true
        );
        const villagerUUIDs = JSON.parse(villagerUUIDsJSON);

        let markerCount = 0;

        // Create markers for each villager
        villagerUUIDs.forEach((uuid) => {
          if (!uuid) return; // Skip null UUIDs

          const dataJSON = DiskApi.getVar(
            worldConfig.diskFile,
            uuid,
            null,
            true
          );

          if (!dataJSON) return;

          try {
            const data = JSON.parse(dataJSON);
            const shopType = data.shopType;
            const locationStr = data.location;

            // Parse location "x y z"
            const coords = locationStr.split(" ");
            const x = parseFloat(coords[0]);
            const y = parseFloat(coords[1]);
            const z = parseFloat(coords[2]);

            // Create POI marker using builder
            const poiMarkerBuilderMethod = POIMarkerClass.getMethod("builder");
            const poiMarkerBuilder = poiMarkerBuilderMethod.invoke(null);
            const poiMarkerBuilderClass = poiMarkerBuilder.getClass();

            // Set label
            const poiLabelMethod = poiMarkerBuilderClass.getMethod(
              "label",
              StringClass
            );
            poiLabelMethod.invoke(
              poiMarkerBuilder,
              villagerNames[shopType] + "<br></br>" + shopType
            );

            // Set position
            const positionMethod = poiMarkerBuilderClass.getMethod(
              "position",
              DoubleClass,
              DoubleClass,
              DoubleClass
            );
            positionMethod.invoke(poiMarkerBuilder, x, y, z);

            // Set custom icon
            const iconPath = villagerIcons[shopType] || "assets/poi.svg";
            try {
              const IntClass = java.lang.Integer.TYPE;
              const iconMethod = poiMarkerBuilderClass.getMethod(
                "icon",
                StringClass,
                IntClass,
                IntClass
              );
              iconMethod.invoke(poiMarkerBuilder, iconPath, 8, 16);
            } catch (e) {
              Console.sendMessage(
                "[BlueMap Shops] §cFailed to set icon for " +
                  shopType +
                  ": " +
                  e
              );
            }

            // Build the marker
            const poiBuildMethod = poiMarkerBuilderClass.getMethod("build");
            const marker = poiBuildMethod.invoke(poiMarkerBuilder);

            // Add marker to set
            const markerId = "shop_" + shopType.toLowerCase() + "_" + uuid;
            const ObjectClass = java.lang.Class.forName("java.lang.Object");
            const getMarkersMethod = markerSet
              .getClass()
              .getMethod("getMarkers");
            const markersMap = getMarkersMethod.invoke(markerSet);
            const putMethod = markersMap
              .getClass()
              .getMethod("put", ObjectClass, ObjectClass);
            putMethod.invoke(markersMap, markerId, marker);

            markerCount++;
          } catch (e) {
            Console.sendMessage(
              "[BlueMap Shops] §cError creating marker for UUID " +
                uuid +
                ": " +
                e
            );
          }
        });

        // Update the map with the marker set
        const getMarkerSetsMethod = worldMap
          .getClass()
          .getMethod("getMarkerSets");
        const markerSets = getMarkerSetsMethod.invoke(worldMap);
        const ObjectClass = java.lang.Class.forName("java.lang.Object");
        const markerSetsPutMethod = markerSets
          .getClass()
          .getMethod("put", ObjectClass, ObjectClass);
        markerSetsPutMethod.invoke(markerSets, "shop_villagers", markerSet);

        Console.sendMessage(
          "[BlueMap Shops] §aUpdated " +
            markerCount +
            " markers for " +
            worldConfig.mapId
        );
      } catch (e) {
        Console.sendMessage(
          "[BlueMap Shops] §cError processing " + worldConfig.mapId + ": " + e
        );
      }
    });
  } catch (e) {
    Console.sendMessage("[BlueMap Shops] §cError updating markers: " + e);
    if (e.printStackTrace) {
      e.printStackTrace();
    }
  }
}

// Schedule the update task to run every 60 seconds (1200 ticks)
const globalScheduler = Bukkit.getGlobalRegionScheduler();

// Initial update after 5 seconds (100 ticks) to allow BlueMap to fully load
globalScheduler.runDelayed(
  OpenJSPlugin,
  function () {
    updateShopMarkers();

    // Then schedule repeating task
    globalScheduler.runAtFixedRate(
      OpenJSPlugin,
      function () {
        updateShopMarkers();
      },
      1200, // Delay (60 seconds)
      1200 // Period (60 seconds)
    );
  },
  100 // Initial delay (5 seconds)
);

Console.sendMessage("§a[BlueMap Shops] Loaded - Updates every 60 seconds");
