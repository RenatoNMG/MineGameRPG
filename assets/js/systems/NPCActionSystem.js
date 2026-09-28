import {getItem} from "../data/items/index.js";
import {useItem} from "./ItemBehaviorSystem.js";
import {WaterInteraction} from "./WaterInteraction.js";

export class NPCActionSystem{
  constructor(world){
    this.world=world;
    this.arrivalRadius=24;
  }

  needsAction(npc){
    return npc.priority.level==="high"||npc.priority.level==="critical";
  }

  setTask(npc,type,target){
    npc.task={type,target};
    npc.state=type;
    npc.stateTimer=Infinity;
    npc.moveX=0;
    npc.moveY=0;
  }

  clearTask(npc){
    npc.task=null;
    this.world.npcBehaviorSystem.setState(npc,"idle");
  }

  targetExists(task){
    const w=this.world;
    if(task.type==="eat"){
      if(task.target.kind==="egg")return w.eggs.includes(task.target.object);
      return w.droppedItems.includes(task.target.object);
    }
    if(task.type==="drink")return w.waterPuddles.includes(task.target);
    return false;
  }

  chooseTask(npc){
    if(!this.needsAction(npc)||npc.task)return;

    if(npc.priority.need==="hunger"){
      const food=this.world.query.findFood(npc);
      if(food)this.setTask(npc,"eat",food);
      return;
    }

    if(npc.priority.need==="thirst"){
      const water=this.world.query.findWater(Infinity,npc);
      if(water)this.setTask(npc,"drink",water);
    }
  }

  eat(npc,food){
    let item=null;

    if(food.kind==="egg"){
      item=getItem("egg");
      const index=this.world.eggs.indexOf(food.object);
      if(index<0)return false;
    }else{
      item=getItem(food.object.id);
      const index=this.world.droppedItems.indexOf(food.object);
      if(index<0)return false;
    }

    if(!item)return false;

    const used=useItem({item,player:npc,world:this.world});
    if(!used)return false;

    if(food.kind==="egg"){
      const index=this.world.eggs.indexOf(food.object);
      if(index>=0)this.world.eggs.splice(index,1);
    }else{
      const index=this.world.droppedItems.indexOf(food.object);
      if(index>=0)this.world.droppedItems.splice(index,1);
    }

    return true;
  }

  drink(npc,water){
    return !!WaterInteraction.interact({
      player:npc,
      world:this.world,
      particles:[],
      water
    });
  }

  completeTask(npc){
    this.clearTask(npc);
  }

  updateNPC(npc,dt){
    if(!npc.task){
      this.chooseTask(npc);
      return;
    }

    if(!this.targetExists(npc.task)){
      this.clearTask(npc);
      return;
    }

    const target=npc.task.type==="drink"
      ? npc.task.target
      : npc.task.target.object;

    const distance=Math.hypot(target.x-npc.x,target.y-npc.y);
    if(distance>this.arrivalRadius){
      this.world.npcSystem.moveTo(npc,target.x,target.y,dt,this.arrivalRadius);
      return;
    }

    const completed=npc.task.type==="eat"
      ? this.eat(npc,npc.task.target)
      : this.drink(npc,npc.task.target);

    if(completed)this.completeTask(npc);
    else this.clearTask(npc);
  }

  update(dt){
    for(const npc of this.world.npcs)this.updateNPC(npc,dt);
  }
}
