var ItemStack = org.bukkit.inventory.ItemStack;
var Material = org.bukkit.Material;

registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
  handleEvent: function (event) {
    var player = event.getPlayer();
    var playerInventory = player.getInventory();
    var transactionAmount = 1;
    if (player.isSneaking()) {
      transactionAmount = 16;
    }

    if (
      event.getAction().toString() === "RIGHT_CLICK_BLOCK" &&
      event.getClickedBlock().getType().toString() === "GRINDSTONE"
    ) {
      var itemInHand = playerInventory.getItemInMainHand().getType().toString();
      var amountInHand = playerInventory.getItemInMainHand().getAmount();

      if (transactionAmount > amountInHand) {
        transactionAmount = amountInHand;
      }

      //Handle cobblestone
      if (itemInHand === "COBBLESTONE") {
        event.setCancelled(true);
        var item = new ItemStack(
          Material.getMaterial("GRAVEL"),
          transactionAmount
        );
        if (
          hasInventorySpace(
            playerInventory,
            Material.getMaterial("GRAVEL"),
            transactionAmount - 1
          )
        ) {
          playerInventory.addItem(item);
        } else {
          player.getWorld().dropItem(player.getLocation(), item);
        }
      }

      //Handle gravel
      if (itemInHand === "GRAVEL") {
        event.setCancelled(true);
        var item = new ItemStack(
          Material.getMaterial("SAND"),
          transactionAmount
        );
        if (
          hasInventorySpace(
            playerInventory,
            Material.getMaterial("SAND"),
            transactionAmount - 1
          )
        ) {
          playerInventory.addItem(item);
        } else {
          player.getWorld().dropItem(player.getLocation(), item);
        }
      }

      //Handle all concrete
      if (itemInHand.endsWith("CONCRETE")) {
        event.setCancelled(true);
        var item = new ItemStack(
          Material.getMaterial(itemInHand + "_POWDER"),
          transactionAmount
        );
        if (
          hasInventorySpace(
            playerInventory,
            Material.getMaterial(itemInHand + "_POWDER"),
            transactionAmount - 1
          )
        ) {
          playerInventory.addItem(item);
        } else {
          player.getWorld().dropItem(player.getLocation(), item);
        }
      }

      //Check if item in hand is correct, and then remove the transaction amount
      if (
        itemInHand === "COBBLESTONE" ||
        itemInHand === "GRAVEL" ||
        itemInHand.endsWith("CONCRETE")
      ) {
        playerInventory.setItemInMainHand(
          playerInventory
            .getItemInMainHand()
            .setAmount(
              playerInventory.getItemInMainHand().getAmount() -
                transactionAmount
            )
        );
      }
    }
  },
});

function hasInventorySpace(playerInventory, material, amount) {
  var allMaterial = playerInventory.all(material);
  var adjustedAmount = 64 - amount;
  if (playerInventory.firstEmpty() >= 0) {
    return true;
  }
  for (i = 0; i < allMaterial.length; i++) {
    if (allMaterial.values().toArray()[i].getAmount() < adjustedAmount) {
      return true;
    }
  }

  return false;
}
