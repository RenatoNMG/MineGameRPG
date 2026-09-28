import {getItem} from "../data/items/index.js";
import {useItem} from "./ItemBehaviorSystem.js";
import {WaterInteraction} from "./WaterInteraction.js";
import {ToolSystem} from "./ToolSystem.js";
import {ResourceInteraction} from "./ResourceInteraction.js";
import {Crafting} from "./Crafting.js";
import {DropSystem} from "./DropSystem.js";

export class NPCActionSystem{
  constructor(world){this.world=world;}

  targetExists(task){
    const w=this.world;
    if(task.type==="eat"){
      if(task.target.kind==="egg")return w.eggs.includes(task.target.object);
      return w.droppedItems.includes(task.target.object);
    }
    if(task.type==="drink")return w.waterPuddles.includes(task.target);
    if(task.type==="rest")return !!task.target?.npc;
    if(task.type==="cutTree")return w.trees.includes(task.target);
    if(task.type==="build")return this.world.constructionRequests.includes(task.target);
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

  rest(npc){
    const energy=this.world.npcNeedsSystem.restoreEnergy(npc,1/60);
    return energy>=Config.NPC.needs.restTarget?"done":"continue";
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

  craftConstruction(npc,construction){
    const crafting=new Crafting(npc.inventory);
    const recipe=crafting.getRecipe(construction.itemId);
    return !!recipe&&crafting.craft(recipe);
  }

  validateConstruction(npc,construction){
    return DropSystem.canPlaceConstruction({
      builder:npc,
      world:this.world,
      itemId:construction.itemId,
      x:construction.x,
      y:construction.y,
      orientation:construction.orientation
    });
  }

  buildConstruction(npc,construction){
    return DropSystem.placeConstruction({
      builder:npc,
      world:this.world,
      inventory:npc.inventory,
      itemId:construction.itemId,
      x:construction.x,
      y:construction.y,
      orientation:construction.orientation
    }).ok;
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
    if(task.type==="rest"){
      return this.rest(npc);
    }
    if(task.type==="cutTree"){
      if(task.step==="action")return this.cutTree(npc,task.target);
      if(task.step==="collect")return this.collectWood(npc);
    }
    if(task.type==="build"){
      if(task.step==="craft")return this.craftConstruction(npc,task.target);
      if(task.step==="validate")return this.validateConstruction(npc,task.target);
      if(task.step==="build")return this.buildConstruction(npc,task.target);
    }
    if(task.type==="walk")return true;
    return false;
  }
}
