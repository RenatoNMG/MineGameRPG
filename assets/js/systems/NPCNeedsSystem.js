import {Config} from "../core/Config.js";

export class NPCNeedsSystem{
  constructor(world){
    this.world=world;
    this.needs=["hunger","thirst","energy"];
    this.world.npcs.forEach(npc=>this.initialize(npc));
  }

  initialize(npc){
    npc.needs={
      hunger:100,
      thirst:100,
      energy:100
    };
    npc.priority={need:null,level:"normal",value:100};
  }

  updateNeed(value,rate,dt){
    return Math.max(0,value-rate*dt);
  }

  restoreEnergy(npc,dt){
    npc.needs.energy=Math.min(100,npc.needs.energy+Config.NPC.needs.restRecovery*dt);
    this.updatePriority(npc);
    return npc.needs.energy;
  }

  updateNPC(npc,dt){
    const rates=Config.NPC.needs;
    npc.needs.hunger=this.updateNeed(npc.needs.hunger,rates.hungerDrain,dt);
    npc.needs.thirst=this.updateNeed(npc.needs.thirst,rates.thirstDrain,dt);
    npc.needs.energy=this.updateNeed(npc.needs.energy,rates.energyDrain,dt);

    this.updatePriority(npc);
  }

  updatePriority(npc){
    let lowestNeed=this.needs[0];

    for(const need of this.needs){
      if(npc.needs[need]<npc.needs[lowestNeed])lowestNeed=need;
    }

    const value=npc.needs[lowestNeed];
    npc.priority={
      need:lowestNeed,
      level:value<=Config.NPC.needs.criticalThreshold?"critical"
        :value<=Config.NPC.needs.lowThreshold?"high"
        :"normal",
      value
    };
  }

  update(dt){
    for(const npc of this.world.npcs)this.updateNPC(npc,dt);
  }
}
