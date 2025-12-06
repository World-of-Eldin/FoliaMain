const Bukkit = org.bukkit.Bukkit;
const EntityType = org.bukkit.entity.EntityType;
const Console = Bukkit.getConsoleSender();
const OpenJSPlugin = Bukkit.getPluginManager().getPlugin("OpenJS");

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
  "VillagerShops",
];

function scanForVillagers(worldString) {
  const world = Bukkit.getWorld(worldString);
  const loadedChunksJava = world.getLoadedChunks();
  const loadedChunks = Java.from(loadedChunksJava);

  const regionScheduler = Bukkit.getRegionScheduler();
  loadedChunks.forEach((chunk) => {
    const chunkLoc = chunk.getBlock(8, 64, 8).getLocation(); // Middle of chunk

    regionScheduler.run(OpenJSPlugin, chunkLoc, function (scheduledTask) {
      try {
        const chunkEntitiesJava = chunk.getEntities();
        const chunkEntities = Java.from(chunkEntitiesJava);

        chunkEntities.forEach((entity) => {
          if (entity.getType() !== EntityType.VILLAGER) {
            return;
          }

          const tags = entity.getScoreboardTags();
          if (!tags.contains("shop_villager")) {
            return;
          }

          let shopName = null;
          validShops.forEach((shop) => {
            if (tags.contains("shop_" + shop)) {
              shopName = shop;
            }
          });

          if (shopName === null) {
            return;
          }
          const entityUUID = entity.getUniqueId();
          const loc = entity.getLocation();
          const x = loc.getX();
          const y = loc.getY();
          const z = loc.getZ();

          const data = {
            shopType: shopName,
            location: x + " " + y + " " + z,
          };

          DiskApi.loadFile(worldString + "_Villagers", false, true);
          DiskApi.setVar(
            worldString + "_Villagers",
            entityUUID,
            JSON.stringify(data),
            true
          );
          let villagerUUIDS = JSON.parse(
            DiskApi.getVar(
              worldString + "_Villagers",
              "Villager_UUIDS",
              "[]",
              true
            )
          );
          if (villagerUUIDS.indexOf(entityUUID.toString()) === -1) {
            villagerUUIDS.push(entityUUID.toString());
          }
          DiskApi.setVar(
            worldString + "_Villagers",
            "Villager_UUIDS",
            JSON.stringify(villagerUUIDS),
            true
          );
          DiskApi.saveFile(worldString + "_Villagers", false, true);
        });
      } catch (e) {
        Console.sendMessage(
          "[Villager Positions] §cError processing chunk: " + e
        );
      }
    });
  });
}

Bukkit.getGlobalRegionScheduler().runAtFixedRate(
  OpenJSPlugin,
  function () {
    scanForVillagers("world");
    scanForVillagers("world_nether");
    scanForVillagers("world_the_end");
  },
  100,
  1200
);
