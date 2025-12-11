const DriverManager = java.sql.DriverManager;
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
const defaultX = -264
const defaultY = 119
const defaultZ = -24

const DB_CONFIG = {
  host: "${DB_HOST}",
  port: "${DB_PORT}",
  database: "${DB_LANDS}",
  user: "${DB_USER}",
  password: "${DB_PASS}"
};

function getConnection() {
  const url =
    "jdbc:mysql://" +
    DB_CONFIG.host +
    ":" +
    DB_CONFIG.port +
    "/" +
    DB_CONFIG.database;
  return DriverManager.getConnection(url, DB_CONFIG.user, DB_CONFIG.password);
}

registerEvent("org.bukkit.event.entity.PlayerDeathEvent", {
    handleEvent: function(event) {
        if(typeof event.getPlayer === 'function') {
            const spawnPoints = getSpawnPoints(event.getPlayer().getUniqueId())
            player = event.getPlayer().getName()

            if(spawnPoints.length != 0) {
                world = event.getPlayer().getLocation().getWorld().getName()
                closestPoint = distanceCalculator(spawnPoints, event.getPlayer().getX(), event.getPlayer().getZ(), world)

                if(closestPoint != undefined) {
                    dimension = worldPicker(closestPoint.world)
                    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
                        Bukkit.dispatchCommand(Console, "execute in " + dimension + " run spawnpoint " + player + " " + Math.round(closestPoint.x) + " " + Math.round(closestPoint.y) + " " + Math.round(closestPoint.z));
                    });
                }

                else { //No valid point found
                    defaultPoint(player)
                }
            }

            else { //No spawnpoints present
                defaultPoint(player)
            }
        }
    }
})

function defaultPoint(player) {
    Scheduler.run(Bukkit.getPluginManager().getPlugin("OpenJS"), function () {
        Bukkit.dispatchCommand(Console, "spawnpoint " + player + " " + defaultX + " " + defaultY + " " + defaultZ);
    });
}

function getSpawnPoints(playerUUID) {
  const conn = getConnection();
  try {
    const query =
      "SELECT spawn FROM lands WHERE members like CONCAT('%', ?, '%')"; //Get spawnpoints that player is member of
    const stmt = conn.prepareStatement(query);
    stmt.setString(1, playerUUID.toString());

    const rs = stmt.executeQuery();
    const spawnPoints = [];

    while (rs.next()) {
        const json = rs.getString("spawn");
          let data;
          
        try {
            data = JSON.parse(json);
        } catch (e) {
            continue;
        }
        if(data != null) { //Avoid lands with null spawnpoints
            spawnPoints.push(data);
        }
    }

    rs.close();
    stmt.close();
    return spawnPoints;
  } finally {
    conn.close();
  }
}

function distanceCalculator(spawnPoints, playerX, playerZ, world) {
    let closestDistance = Infinity;
    let chosenSpawnPoint;
    spawnPoints.forEach(spawnPoint => {
        const length = Math.abs(playerX - spawnPoint.x);
        const width = Math.abs(playerZ - spawnPoint.z);
        let distance = Math.sqrt(length * length + width * width);
        if((distance < closestDistance || closestDistance == Infinity) && spawnPoint.world == world) { //Get closest spawnpoint in same world
            closestDistance = distance;
            chosenSpawnPoint = spawnPoint;
        }
    });
    return chosenSpawnPoint;
}

function worldPicker(world) { //Change world name to work with command
    if (world === "world_nether") {
        return "minecraft:the_nether";
    }

    if (world === "world_the_end") {
        return "minecraft:the_end";
    }

    return "minecraft:overworld";
}