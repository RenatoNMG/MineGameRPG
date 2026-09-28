import {getItem} from "../data/items/index.js";
import {useItem} from "./ItemBehaviorSystem.js";
import {WaterInteraction} from "./WaterInteraction.js";
import {ToolSystem} from "./ToolSystem.js";
import {ResourceInteraction} from "./ResourceInteraction.js";

export class NPCActionSystem{
  constructor(world){this.world=world;}

  targetExists(task){
    const w=this.world;
    if(task.type==="eat"){
      if(task.target.kind==="egg")return w.eggs.includes(task.target.object);
      return w.droppedItems.includes(task.target.object);
    }
    if(task.type==="drink")return w.waterPuddles.includes(task.target);
    if(task.type==="cutTree")return w.trees.includes(task.target);
    if(task.type==="walk")return !!task.target;
    return false;
  }

  eat(npc,food){
    let item=null;
    if(food.kind==="egg"){
      item=getItem("egg");
      if(this.world.eggs.indexOf(food.object)<0)return false;
    }else{
      item=getItem(food.object.id);
      if(this.world.droppedItems.indexOf(food.object)<0)return false;
    }

    if(!item||!useItem({item,player:npc,world:this.world}))return false;

    if(food.kind==="egg"){
      const index=this.world.eggs.indexOf(food.object);
      if(index>=0)this.world.eggs.splice(index,1);
    }else{
      const index=this.world.droppedItems.indexOf(food.object);
      if(index>=0)this.world.droppedItems.splice(index,1);
    }
    return true;
  }

  cutTree(npc,tree){
    const axe=npc.inventory?.get("axe");
    if(!ToolSystem.canUse(axe,"axe"))return false;

    if(tree.state==="fallen")return true;
    if(tree.state!=="standing")return "continue";

    ResourceInteraction.interact({
      player:npc,
      world:this.world,
      inventory:npc.inventory,
      equipped:axe,
      particles:[],
      target:{kind:"tree",object:tree}
    });
    return "continue";
  }

  collectWood(npc){
    const wood=this.world.query.findLooseWood(50,npc);
    if(!wood)return true;

    const result=ResourceInteraction.interact({
      player:npc,
      world:this.world,
      inventory:npc.inventory,
      equipped:null,
      particles:[],
      target:{kind:"looseWood",object:wood}
    });

    return result?.type==="woodCollected" ? "continue" : false;
  }

  execute(npc,task){
    if(task.type==="eat")return this.eat(npc,task.target);
    if(task.type==="drink"){
      return !!WaterInteraction.interact({
        player:npc,
        world:this.world,
        particles:[],
        water:task.target
      });
    }
    if(task.type==="cutTree"){
      if(task.step==="action")return this.cutTree(npc,task.target);
      if(task.step==="collect")return this.collectWood(npc);
    }
    if(task.type==="walk")return true;
    return false;
  }
}
