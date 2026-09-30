import {FenceGeometry} from "../features/fence/FenceGeometry.js";

export class CollisionSystem{
  constructor(world){this.world=world;}
  fenceBlocks(x,y,r=0){return FenceGeometry.blocksWorld(this.world.fences||[],x,y,r);}
  waterBlocks(x,y,r=0){
    for(const water of this.world.waterPuddles){
      const dx=x-water.x,dy=y-water.y,c=Math.cos(-(water.angle||0)),s=Math.sin(-(water.angle||0));
      const lx=dx*c-dy*s,ly=dx*s+dy*c,rx=Math.max(1,water.rx+r+1),ry=Math.max(1,water.ry+r+1);
      if((lx*lx)/(rx*rx)+(ly*ly)/(ry*ry)<1)return true;
    }
    return false;
  }
  /* REGRA DOS ANIMAIS: o consumidor pode informar o animal que está se movendo. */
  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null,ignoreRooster=null,ignoreNPC=null){
    const w=this.world;
    if(w.trees.some(t=>t.blocks(x,y,r)))return true;
    if(w.stones.some(s=>s.blocks(x,y,r)))return true;
    if(this.fenceBlocks(x,y,r))return true;
    if(this.waterBlocks(x,y,r))return true;
    if(w.chickens.some(ch=>ch!==ignoreChicken&&Math.hypot(ch.x-x,ch.y-y)<r+11))return true;
    if(w.chicks.some(ch=>ch!==ignoreChick&&Math.hypot(ch.x-x,ch.y-y)<r+7))return true;
    if(w.roosters.some(ro=>ro!==ignoreRooster&&Math.hypot(ro.x-x,ro.y-y)<r+12))return true;
    if(w.npcs.some(npc=>npc!==ignoreNPC&&Math.hypot(npc.x-x,npc.y-y)<r+(npc.radius||12)))return true;
    return false;
  }
  canMove(px,py){
    const w=this.world;
    if(w.trees.some(t=>t.blocks(px,py,w.player.r)))return false;
    if(w.stones.some(s=>s.blocks(px,py,w.player.r)))return false;
    if(this.fenceBlocks(px,py,w.player.r))return false;
    if(this.waterBlocks(px,py,w.player.r+1))return false;
    return true;
  }
  movePlayer(dx,dy){
    const w=this.world,nx=w.player.x+dx,ny=w.player.y+dy;
    if(this.canMove(nx,w.player.y))w.player.x=nx;
    if(this.canMove(w.player.x,ny))w.player.y=ny;
    w.player.x=Math.max(25,Math.min(w.width-25,w.player.x));w.player.y=Math.max(25,Math.min(w.height-25,w.player.y));
  }
}
