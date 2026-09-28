import {Inventory} from "./Inventory.js";

export class NPCInventorySystem{
  constructor(world){
    this.world=world;
    this.initialize();
  }

  initialize(){
    for(const npc of this.world.npcs){
      npc.inventory=new Inventory(8,false);
      npc.inventory.add("axe",1);
    }
  }
}
