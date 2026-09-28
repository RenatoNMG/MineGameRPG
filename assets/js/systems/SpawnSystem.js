import {Config} from "../core/Config.js";
import {NPC} from "../entities/NPC.js";

export class SpawnSystem{
  constructor(world){this.world=world;}
  spawnInitialNPCs(){
    const w=this.world;
    for(let i=0;i<Config.NPC.count;i++){
      let spawned=false;
      for(let attempt=0;attempt<100&&!spawned;attempt++){
        const x=80+Math.random()*(w.width-160),y=80+Math.random()*(w.height-160),radius=Config.NPC.radius;
        if(Math.hypot(x-w.player.x,y-w.player.y)<radius+35)continue;
        if(w.collision.objectBlocks(x,y,radius))continue;
        w.npcs.push(new NPC({id:i+1,x,y,dir:Math.random()<.5?-1:1,speed:Config.NPC.speed,state:"idle",radius}));
        spawned=true;
      }
    }
  }
  update(dt){
    if(this.world.npcs.length===0)this.spawnInitialNPCs();
  }
}