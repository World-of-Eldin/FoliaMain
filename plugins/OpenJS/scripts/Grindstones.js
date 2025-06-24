const ItemStack = org.bukkit.inventory.ItemStack;
const Material = org.bukkit.Material;

registerEvent("org.bukkit.event.player.PlayerInteractEvent", {
  handleEvent: function (event) {
    const player = event.getPlayer();
    const playerInventory = player.getInventory();
    let transactionAmount = player.isSneaking() ? 16 : 1;

    if (
      event.getAction().toString() === "RIGHT_CLICK_BLOCK" &&
      event.getClickedBlock().getType().toString() === "GRINDSTONE"
    ) {
      const itemInHand = playerInventory
        .getItemInMainHand()
        .getType()
        .toString();
      const amountInHand = playerInventory.getItemInMainHand().getAmount();
      transactionAmount =
        transactionAmount > amountInHand ? amountInHand : transactionAmount;

      //Handle cobblestone
      if (itemInHand === "COBBLESTONE") {
        event.setCancelled(true);
        const item = new ItemStack(
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
        const item = new ItemStack(
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
        const item = new ItemStack(
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
  const itemStacks = playerInventory.all(material).values();
  const adjustedAmount = 64 - amount;
  if (playerInventory.firstEmpty() >= 0) {
    return true;
  }
  itemStacks.forEach((itemStack) => {
    if (itemStack.getAmount() < adjustedAmount) {
      return true;
    }
  });

  return false;
}
