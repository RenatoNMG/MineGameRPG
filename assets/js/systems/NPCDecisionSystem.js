import {NPCTaskRegistry} from "./NPCTaskRegistry.js";

export class NPCDecisionSystem{
  constructor(world){
    this.world=world;
    this.taskRegistry=new NPCTaskRegistry(world);
  }

  chooseTask(npc){
    if(npc.task)return;

    const candidates=this.taskRegistry.getCandidates(npc);
    if(!candidates.length)return;

    candidates.sort((a,b)=>b.priority-a.priority);
    npc.task=this.taskRegistry.createFromCandidate(candidates[0]);
    npc.state="task";
    npc.stateTimer=Infinity;
    npc.moveX=0;
    npc.moveY=0;
  }

  update(dt){
    for(const npc of this.world.npcs)this.chooseTask(npc);
  }
}
