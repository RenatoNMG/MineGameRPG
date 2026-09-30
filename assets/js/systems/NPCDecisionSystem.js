import {NPCTaskRegistry} from "./NPCTaskRegistry.js";

export class NPCDecisionSystem{
  constructor(world){
    this.world=world;
    this.taskRegistry=new NPCTaskRegistry(world);
  }

  chooseTask(npc){
    if(npc.task)return;

    if(!npc.constructionOrder){
      const request=this.world.query.findConstructionRequest(npc);
      if(request){
        request.assignedTo=npc.id;
        npc.assignConstruction(request);
      }
    }

    const candidates=this.taskRegistry.getCandidates(npc);
    if(!candidates.length)return;

    for(const candidate of candidates){
      const target=candidate.target?.object||candidate.target;
      if(candidate.definition.type==="cutTree"||candidate.definition.type==="eat"){
        this.world.npcMemorySystem.rememberResource(npc,target,candidate.definition.type);
      }
    }

    candidates.sort((a,b)=>this.world.npcMemorySystem.scoreCandidate(npc,b)-this.world.npcMemorySystem.scoreCandidate(npc,a));
    npc.task=this.taskRegistry.createFromCandidate(candidates[0]);
    this.world.npcMemorySystem.setObjective(npc,npc.task);
    npc.state="task";
    npc.stateTimer=Infinity;
    npc.moveX=0;
    npc.moveY=0;
  }

  update(dt){
    for(const npc of this.world.npcs)this.chooseTask(npc);
  }
}
