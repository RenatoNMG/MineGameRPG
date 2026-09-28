import {Config} from "../core/Config.js";
import {NPC} from "../entities/NPC.js";

export class SpawnSystem{
  constructor(world){
    this.world=world;
    this.spawnInitialNPCs();
  }
  spawnInitialNPCs(){
    const w=this.world;
    for(let i=0;i<Config.NPC.count;i++){
      let spawned=false;
      for(let attempt=0;attempt<100&&!spawned;attempt++){
        const x=80+Math.random()*(w.width-160);
        const y=80+Math.random()*(w.height-160);
        const radius=12;
        if(Math.hypot(x-w.player.x,y-w.player.y)<radius+35)continue;
        if(w.collision.objectBlocks(x,y,radius))continue;
        const id=i+1;
        w.npcs.push(new NPC({id,x,y,dir:Math.random()<.5?-1:1,speed:0,state:"idle"}));
        spawned=true;
      }
    }
  }
  update(dt){}
}
