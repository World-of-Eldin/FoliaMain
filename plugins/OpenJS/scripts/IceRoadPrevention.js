Server = plugin.getServer();
registerEvent("org.bukkit.event.vehicle.VehicleMoveEvent", {
  handleEvent: function (event) {
    var vehicle = event.getVehicle();
    if (vehicle.getName().toString().indexOf("BOAT")) {
      var passengers = vehicle.getPassengers();
      for (i = 0; i < passengers.length; i++) {
        if (
          passengers[i]
            .getLocation()
            .getBlock()
            .getRelative(0, -0.5, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passengers[i]
            .getLocation()
            .getBlock()
            .getRelative(1, -0.5, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passengers[i]
            .getLocation()
            .getBlock()
            .getRelative(-1, -0.5, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passengers[i]
            .getLocation()
            .getBlock()
            .getRelative(0, -0.5, 1)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passengers[i]
            .getLocation()
            .getBlock()
            .getRelative(0, -0.5, 1)
            .getType()
            .toString()
            .indexOf("ICE") >= 0
        ) {
          vehicle.removePassenger(passengers[i]);
        }
      }
    }
  },
});
