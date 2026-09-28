/*
 * MEMÓRIA SIMPLES DO NPC.
 *
 * RESPONSABILIDADE: registrar fatos de ações anteriores.
 * Não decide comportamento e não cria regras de mundo.
 */
export class NPCMemorySystem{
  constructor(world){
    this.world=world;
    for(const npc of world.npcs)this.initialize(npc);
  }

  initialize(npc){
    npc.memory={
      knownResources:[],
      visitedLocations:[],
      completedTasks:[],
      lastObjective:null,
      failures:[]
    };
  }

  keyForTarget(target){
    if(!target)return null;
    if(target.id!==undefined)return String(target.id);
    if(target.x!==undefined&&target.y!==undefined)return `${Math.round(target.x)}:${Math.round(target.y)}`;
    return null;
  }

  rememberResource(npc,target,kind="unknown"){
    const key=this.keyForTarget(target);
    if(!key)return;
    if(!npc.memory.knownResources.some(item=>item.key===key)){
      npc.memory.knownResources.push({key,kind});
    }
  }

  visitLocation(npc,target){
    const key=this.keyForTarget(target);
    if(!key)return;
    if(!npc.memory.visitedLocations.some(item=>item.key===key)){
      npc.memory.visitedLocations.push({key,x:target.x,y:target.y});
    }
  }

  setObjective(npc,task){
    npc.memory.lastObjective={
      type:task.type,
      objective:task.objective,
      targetKey:this.keyForTarget(task.target)
    };
  }

  completeTask(npc,task){
    npc.memory.completedTasks.push({
      type:task.type,
      objective:task.objective,
      targetKey:this.keyForTarget(task.target)
    });
  }

  failTask(npc,task){
    npc.memory.failures.push({
      type:task.type,
      objective:task.objective,
      targetKey:this.keyForTarget(task.target)
    });
  }

  scoreCandidate(npc,candidate){
    const targetKey=this.keyForTarget(candidate.target);
    let score=candidate.priority;
    if(targetKey&&npc.memory.failures.some(f=>f.type===candidate.definition.type&&f.targetKey===targetKey)){
      score-=8;
    }
    if(targetKey&&npc.memory.completedTasks.some(t=>t.type===candidate.definition.type&&t.targetKey===targetKey)){
      score-=2;
    }
    if(npc.memory.lastObjective?.type===candidate.definition.type&&
       npc.memory.lastObjective.targetKey===targetKey){
      score-=1;
    }
    return score;
  }

  update(dt){}
}
