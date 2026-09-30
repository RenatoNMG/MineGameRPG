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

  moveTo(npc,targetX,targetY,dt,arrivalRadius=24){
    const dx=targetX-npc.x;
    const dy=targetY-npc.y;
    const distance=Math.hypot(dx,dy);
    if(distance<=arrivalRadius){
      npc.moveX=0;
      npc.moveY=0;
      return true;
    }

    const length=distance||1;
    const baseX=dx/length;
    const baseY=dy/length;
    const step=Config.NPC.speed*dt;
    const angles=[0,-.35,.35,-.7,.7,-1.05,1.05,Math.PI];

    for(const angle of angles){
      const c=Math.cos(angle),s=Math.sin(angle);
      const moveX=baseX*c-baseY*s;
      const moveY=baseX*s+baseY*c;
      if(this.tryMove(npc,moveX*step,moveY*step)){
        npc.moveX=moveX;
        npc.moveY=moveY;
        npc.dir=moveX<0?-1:1;
        return false;
      }
    }

    return false;
  }

  update(dt){
    for(const npc of this.world.npcs){
      if(npc.task)continue;
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
