import {Config} from "../core/Config.js";

export class NPCBehaviorSystem{
  constructor(world){
    this.world=world;
    this.directions=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];
    this.world.npcs.forEach(npc=>this.setState(npc,"idle"));
  }

  randomDirection(){
    return this.directions[Math.floor(Math.random()*this.directions.length)];
  }

  setState(npc,state){
    npc.state=state;
    npc.stateTimer=state==="idle"
      ? Config.NPC.idleMinTime+Math.random()*(Config.NPC.idleMaxTime-Config.NPC.idleMinTime)
      : Config.NPC.wanderMinTime+Math.random()*(Config.NPC.wanderMaxTime-Config.NPC.wanderMinTime);

    if(state==="wander"){
      const [x,y]=this.randomDirection();
      npc.moveX=x;
      npc.moveY=y;
    }else{
      npc.moveX=0;
      npc.moveY=0;
    }
  }

  decideNextState(npc){
    this.setState(npc,npc.state==="idle"?"wander":"idle");
  }

  update(dt){
    for(const npc of this.world.npcs){
      if(npc.task)continue;
      npc.stateTimer-=dt;
      if(npc.stateTimer<=0)this.decideNextState(npc);
    }
  }
}
