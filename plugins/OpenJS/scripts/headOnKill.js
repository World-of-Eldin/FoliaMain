const headChance = 50
const Bukkit = org.bukkit.Bukkit;
const Console = Bukkit.getConsoleSender();
const Scheduler = Bukkit.getGlobalRegionScheduler();
const ItemStack = org.bukkit.inventory.ItemStack;
const Material = org.bukkit.Material;

registerEvent("org.bukkit.event.entity.EntityDeathEvent", {
    handleEvent: function(event) {
        const entityResponsible = event.getDamageSource().getCausingEntity();
        const victim = event.getEntity();
        if (entityResponsible) {
            if(entityResponsible != victim) {
                if (entityResponsible.getType().toString() === "PLAYER" && victim.getType().toString() === 'PLAYER') {
                    if(Math.random() < headChance/100) {
                        const playerHead = new ItemStack(Material.PLAYER_HEAD, 1);
                        const skullMeta = playerHead.getItemMeta()
                        skullMeta.setOwningPlayer(victim)
                        playerHead.setItemMeta(skullMeta)
                        victim.getWorld().dropItemNaturally(victim.getLocation(), playerHead)
                    }
                }
            }
        }
    }
})