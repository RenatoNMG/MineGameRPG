import {Config} from "../core/Config.js";

export class NPCSystem{
  constructor(world){
    this.world=world;
  }

  setDirection(npc){
    const length=Math.hypot(npc.moveX,npc.moveY)||1;
    npc.moveX/=length;
    npc.moveY/=length;
  }

  tryMove(npc,dx,dy){
    const w=this.world;
    const nx=Math.max(npc.radius,Math.min(w.width-npc.radius,npc.x+dx));
    const ny=Math.max(npc.radius,Math.min(w.height-npc.radius,npc.y+dy));
    if(w.collision.objectBlocks(nx,ny,npc.radius,null,null,null,npc))return false;
    npc.x=nx;
    npc.y=ny;
    return true;
  }

  update(dt){
    for(const npc of this.world.npcs){
      if(npc.state!=="wander")continue;

      this.setDirection(npc);
      const step=Config.NPC.speed*dt;
      if(!this.tryMove(npc,npc.moveX*step,npc.moveY*step)){
        npc.moveX=-npc.moveX;
        npc.moveY=-npc.moveY;
      }
    }
  }
}
