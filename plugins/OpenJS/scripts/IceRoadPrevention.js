registerEvent("org.bukkit.event.vehicle.VehicleMoveEvent", {
    handleEvent: function(event) {
        var vehicle = event.getVehicle();
        var blockUnder = vehicle.getLocation().getBlock().getRelative(0, -1, 0); //Get the block under the boat 

        if (vehicle.getName().toString().indexOf("Boat")) {
            if (blockUnder.getType().toString().indexOf("ICE") >= 0) {
                var velocity = vehicle.getVelocity();
                vehicle.setVelocity(velocity);
            }
        }
    }
});