registerEvent("org.bukkit.event.vehicle.VehicleMoveEvent", {
  handleEvent: function (event) {
    var vehicle = event.getVehicle();
    var blockUnder = vehicle.getLocation().getBlock().getRelative(0, -1, 0);

    if (vehicle.getName().toString().indexOf("BOAT")) {
      if (blockUnder.getType().toString().indexOf("ICE") >= 0) {
        var passengers = vehicle.getPassengers();

        for (i = 0; i < passengers.length; i++) {
          vehicle.removePassenger(passengers[i]);
        }
      }
    }
  },
});
