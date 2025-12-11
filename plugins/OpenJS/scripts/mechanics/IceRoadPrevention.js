Server = plugin.getServer();
registerEvent("org.bukkit.event.vehicle.VehicleMoveEvent", {
  handleEvent: function (event) {
    const vehicle = event.getVehicle();
    if (vehicle.getName().toString().indexOf("BOAT")) {
      vehicle.getPassengers().forEach((passenger) => {
        if (
          passenger
            .getLocation()
            .getBlock()
            .getRelative(0, 0, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passenger
            .getLocation()
            .getBlock()
            .getRelative(1, 0, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passenger
            .getLocation()
            .getBlock()
            .getRelative(-1, 0, 0)
            .getType()
            .toString()
            .indexOf("ICE") >= 0 ||
          passenger
            .getLocation()
            .getBlock()
            .getRelative(0, 0, 1)
            .getType()
            .toString()
            .indexOf("ICE") >= 0) {
          vehicle.removePassenger(passenger);
        }
      });
    }
  },
});
