import {Config} from "../core/Config.js";

export class NPCSystem{
  constructor(world){this.world=world;this.directions=[[-1,-1],[0,-1],[1,-1],[-1,0],[1,0],[-1,1],[0,1],[1,1]];this.world.npcs.forEach(npc=>this.setDirection(npc));}
  randomDirection(){return this.directions[Math.floor(Math.random()*this.directions.length)];}
  setDirection(npc){const [x,y]=this.randomDirection();npc.moveX=x;npc.moveY=y;npc.moveTimer=Config.NPC.minDirectionTime+Math.random()*(Config.NPC.maxDirectionTime-Config.NPC.minDirectionTime);}
  tryMove(npc,dx,dy){const w=this.world,nx=Math.max(npc.radius,Math.min(w.width-npc.radius,npc.x+dx)),ny=Math.max(npc.radius,Math.min(w.height-npc.radius,npc.y+dy));if(w.collision.objectBlocks(nx,ny,npc.radius,null,null,null,npc))return false;npc.x=nx;npc.y=ny;return true;}
  update(dt){for(const npc of this.world.npcs){npc.moveTimer-=dt;if(npc.moveTimer<=0)this.setDirection(npc);const length=Math.hypot(npc.moveX,npc.moveY)||1,step=npc.speed*dt;if(!this.tryMove(npc,(npc.moveX/length)*step,(npc.moveY/length)*step))this.setDirection(npc);}}
}
