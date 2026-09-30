import {Inventory} from "./Inventory.js";

export class NPCInventorySystem{
  constructor(world){
    this.world=world;
    this.initialize();
  }

  initialize(){
    for(const npc of this.world.npcs)this.initializeNPC(npc);
  }

  initializeNPC(npc){
    /*
     * BOAS PRÁTICAS:
     * NPC usa exatamente o mesmo Inventory e catálogo de itens do jogador.
     * O NPC não possui regras paralelas para madeira, pedra, comida ou ferramentas.
     */
    npc.inventory=new Inventory(12,false);
    npc.inventory.add("axe",1);
  }

  canCarry(npc,id,qty=1){
    const inventory=npc.inventory;
    if(!inventory)return false;
    const item=inventory.get(id);
    if(item)return item.qty+qty<=item.maxStack;
    return inventory.items.length<inventory.slots;
  }

  add(npc,id,qty=1){
    if(!this.canCarry(npc,id,qty))return false;
    return npc.inventory.add(id,qty);
  }

  has(npc,id,qty=1){
    return npc.inventory?.qty(id)>=qty;
  }
}
