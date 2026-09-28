import {Config} from "../core/Config.js";
import {NPCTask} from "./NPCTask.js";

export class NPCTaskRegistry{
  constructor(world){
    this.world=world;
    this.definitions=new Map();
    this.registerDefaults();
  }

  register(definition){this.definitions.set(definition.type,definition);}

  registerDefaults(){
    this.register({
      type:"eat",
      objective:"satisfy_hunger",
      canStart:npc=>npc.needs.hunger<=Config.NPC.needs.lowThreshold,
      getPriority:npc=>100-npc.needs.hunger,
      findTarget:npc=>this.world.query.findFood(npc),
      steps:["move","action","complete"]
    });

    this.register({
      type:"drink",
      objective:"satisfy_thirst",
      canStart:npc=>npc.needs.thirst<=Config.NPC.needs.lowThreshold,
      getPriority:npc=>100-npc.needs.thirst,
      findTarget:npc=>this.world.query.findWater(Infinity,npc),
      steps:["move","action","complete"]
    });

    this.register({
      type:"cutTree",
      objective:"collect_wood",
      getPriority:()=>5,
      findTarget:npc=>this.world.query.findTree(Infinity,npc),
      steps:["move","action","collect","complete"]
    });

    this.register({
      type:"walk",
      objective:"wander",
      getPriority:()=>1,
      findTarget:npc=>({
        x:Math.max(npc.radius,Math.min(this.world.width-npc.radius,npc.x+(Math.random()-.5)*240)),
        y:Math.max(npc.radius,Math.min(this.world.height-npc.radius,npc.y+(Math.random()-.5)*240))
      }),
      steps:["move","complete"]
    });
  }

  getCandidates(npc){
    const candidates=[];
    for(const definition of this.definitions.values()){
      if(definition.canStart&&!definition.canStart(npc))continue;
      const target=definition.findTarget(npc);
      if(!target)continue;
      candidates.push({
        definition,
        target,
        priority:definition.getPriority(npc)
      });
    }
    return candidates;
  }

  createFromCandidate(candidate){
    return new NPCTask({
      type:candidate.definition.type,
      objective:candidate.definition.objective,
      target:candidate.target,
      priority:candidate.priority,
      steps:[...candidate.definition.steps]
    });
  }
}
