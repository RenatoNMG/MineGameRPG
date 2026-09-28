import {NPCTaskRegistry} from "./NPCTaskRegistry.js";

export class NPCDecisionSystem{
  constructor(world){
    this.world=world;
    this.taskRegistry=new NPCTaskRegistry(world);
  }

  distanceTo(npc,target){
    const value=target?.object||target;
    if(!value||!Number.isFinite(value.x)||!Number.isFinite(value.y))return 0;
    return Math.hypot(value.x-npc.x,value.y-npc.y);
  }

  scoreCandidate(npc,candidate){
    const type=candidate.definition.type;
    const target=candidate.target;
    let score=this.world.npcMemorySystem.scoreCandidate(npc,candidate);

    /*
     * INTEGRAÇÃO DA IA:
     * cada sistema continua responsável pela própria regra. Aqui apenas
     * combinamos prioridade, necessidade, energia, distância, memória e
     * segurança antes de escolher uma tarefa.
     */
    score-=Math.min(20,this.distanceTo(npc,target)/80);

    if(npc.priority.level==="critical"){
      if(npc.priority.need==="hunger"&&type==="eat")score+=30;
      if(npc.priority.need==="thirst"&&type==="drink")score+=30;
      if(npc.priority.need==="energy"&&type==="rest")score+=30;
    }

    if(npc.priority.level==="high"&&type==="walk")score-=15;

    /*
     * Segurança física continua centralizada no CollisionSystem/NPCSystem.
     * Construções passam pela validação oficial do DropSystem.
     */
    if(type==="walk"&&!this.world.collision.objectBlocks(target.x,target.y,npc.radius,null,null,null,npc)){
      score+=2;
    }

    return score;
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

    candidates.sort((a,b)=>this.scoreCandidate(npc,b)-this.scoreCandidate(npc,a));

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
