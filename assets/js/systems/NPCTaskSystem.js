export class NPCTaskSystem{
  constructor(world){
    this.world=world;
    this.arrivalRadius=24;
  }

  finish(npc){
    npc.task=null;
    this.world.npcBehaviorSystem.setState(npc,"idle");
  }

  updateNPC(npc,dt){
    const task=npc.task;
    if(!task)return;

    if(!this.world.npcActionSystem.targetExists(task)){
      this.finish(npc);
      return;
    }

    if(task.step==="move"){
      const target=task.target.kind?task.target.object:task.target;
      const arrived=this.world.npcSystem.moveTo(npc,target.x,target.y,dt,this.arrivalRadius);
      if(arrived)task.nextStep();
      return;
    }

    if(task.step==="action"||task.step==="collect"){
      const result=this.world.npcActionSystem.execute(npc,task);
      if(result==="continue")return;
      if(result)task.nextStep();
      else this.finish(npc);
      return;
    }

    if(task.step==="complete")this.finish(npc);
  }

  update(dt){
    for(const npc of this.world.npcs)this.updateNPC(npc,dt);
  }
}
