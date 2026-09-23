import {Chicken} from "../entities/Chicken.js";
import {Rooster} from "../entities/Rooster.js";

export class AnimalSystem{
  constructor(world){this.world=world;this.maxEggs=20;}
  update(dt){const w=this.world;for(const chicken of w.chickens)this.updateChicken(chicken,dt);for(const rooster of w.roosters)this.updateRooster(rooster,dt);for(const chick of w.chicks)this.updateChick(chick,dt);}
  updateChicken(chicken,dt){
    const w=this.world;if(chicken.carried)return;
    chicken.timer-=dt;chicken.eggTimer-=dt;
    this.moveChicken(chicken,dt);
    chicken.x=Math.max(30,Math.min(w.width-30,chicken.x));chicken.y=Math.max(30,Math.min(w.height-30,chicken.y));
    if(chicken.eggTimer<=0&&w.eggs.length<this.maxEggs){const ex=chicken.x-chicken.dir*14,ey=chicken.y+8;if(!w.objectBlocks(ex,ey,6,chicken)&&!w.eggs.some(e=>Math.hypot(e.x-ex,e.y-ey)<18))w.eggs.push({x:ex,y:ey});chicken.eggTimer=15+Math.random()*20;}else if(chicken.eggTimer<=0)chicken.eggTimer=3+Math.random()*5;
  }
  moveChicken(chicken,dt){
    const w=this.world,d=Math.hypot(chicken.x-w.player.x,chicken.y-w.player.y);
    let roosterThreat=null,roosterDistance=Infinity;
    for(const rooster of w.roosters){const rd=Math.hypot(chicken.x-rooster.x,chicken.y-rooster.y);if(rd<roosterDistance){roosterDistance=rd;roosterThreat=rooster;}}
    if(roosterThreat&&roosterDistance<110){
      const dx=chicken.x-roosterThreat.x,dy=chicken.y-roosterThreat.y,len=Math.hypot(dx,dy)||1;
      chicken.dir=dx<0?-1:1;
      const fleeSpeed=chicken.speed*1.5;
      const nx=chicken.x+(dx/len)*fleeSpeed*dt,ny=chicken.y+(dy/len)*fleeSpeed*dt;
      this.moveSmart(chicken,dx/len,dy/len,dt,13,1.5,chicken);
      return;
    }
    if(d<75){
      const dx=chicken.x-w.player.x,dy=chicken.y-w.player.y,len=Math.hypot(dx,dy)||1;
      chicken.dir=dx<0?-1:1;
      const nx=chicken.x+(dx/len)*chicken.speed*2.2*dt,ny=chicken.y+(dy/len)*chicken.speed*2.2*dt;
      if(!w.objectBlocks(nx,ny,13,chicken))chicken.x=nx,chicken.y=ny;else this.wanderChicken(chicken,dt);
      return;
    }
    this.wanderChicken(chicken,dt);
  }
  wanderChicken(chicken,dt){
    const w=this.world;
    if(chicken.timer<=0){chicken.dir=Math.random()<.5?-1:1;chicken.timer=1+Math.random()*2.5;}
    const tx=chicken.dir,ty=Math.sin((chicken.x+chicken.y)*.03)*.22;
    if(this.moveSmart(chicken,tx,ty,dt,13,.35,chicken))return;
    const side=chicken.dir*(Math.random()<.5?1:-1);
    const sx=chicken.x,sy=chicken.y+side*chicken.speed*.6*dt;
    const bx=chicken.x-chicken.dir*chicken.speed*.6*dt,by=chicken.y+side*chicken.speed*.6*dt;
    if(!w.objectBlocks(sx,sy,13,chicken))chicken.y=sy;
    else if(!w.objectBlocks(bx,by,13,chicken))chicken.x=bx,chicken.y=by;
    else chicken.dir*=-1,chicken.timer=.2+Math.random()*.5;
  }
  moveSmart(animal,dx,dy,dt,r,mult,ignoreChicken=null){
    const w=this.world;
    const base=Math.hypot(dx,dy)||1;
    dx/=base;dy/=base;
    const angles=[0,-0.45,0.45,-0.9,0.9,-1.35,1.35,Math.PI];
    for(const angle of angles){
      const c=Math.cos(angle),s=Math.sin(angle);
      const vx=dx*c-dy*s,vy=dx*s+dy*c;
      const nx=animal.x+vx*animal.speed*mult*dt,ny=animal.y+vy*animal.speed*mult*dt;
      if(!w.objectBlocks(nx,ny,r,ignoreChicken,null)){
        animal.x=nx;animal.y=ny;animal.dir=vx<0?-1:1;return true;
      }
    }
    return false;
  }
  updateRooster(rooster,dt){
    const w=this.world;
    if(rooster.matingTimer>0){
      rooster.matingTimer-=dt;
      return;
    }
    if(rooster.matingCooldown>0){
      rooster.matingCooldown-=dt;
      this.move(rooster,dt,15,1);
      rooster.x=Math.max(30,Math.min(w.width-30,rooster.x));rooster.y=Math.max(30,Math.min(w.height-30,rooster.y));
      return;
    }
    rooster.timer-=dt;rooster.mateTimer-=dt;
    let target=null,best=Infinity;
    for(const chicken of w.chickens){if(chicken.carried)continue;const d=Math.hypot(chicken.x-rooster.x,chicken.y-rooster.y);if(d<120&&d<best){best=d;target=chicken;}}
    if(target){const dx=target.x-rooster.x,dy=target.y-rooster.y,len=Math.hypot(dx,dy)||1;rooster.dir=dx<0?-1:1;if(rooster.mateTimer<=0&&best<22){rooster.mateTimer=7+Math.random()*5;rooster.matingTimer=1.2;rooster.matingCooldown=5;rooster.timer=.25;}else{if(!this.moveSmart(rooster,dx/len,dy/len,dt,15,1.8,null))rooster.dir*=-1;}}else this.move(rooster,dt,15,1.8);
    rooster.x=Math.max(30,Math.min(w.width-30,rooster.x));rooster.y=Math.max(30,Math.min(w.height-30,rooster.y));
  }
  updateChick(chick,dt){const w=this.world;chick.timer-=dt;this.move(chick,dt,7,1.8);chick.x=Math.max(25,Math.min(w.width-25,chick.x));chick.y=Math.max(25,Math.min(w.height-25,chick.y));}
  move(animal,dt,r,mult){const w=this.world,d=Math.hypot(animal.x-w.player.x,animal.y-w.player.y);if(d<75){const dx=animal.x-w.player.x,dy=animal.y-w.player.y,len=Math.hypot(dx,dy)||1;animal.dir=dx<0?-1:1;const nx=animal.x+(dx/len)*animal.speed*mult*dt,ny=animal.y+(dy/len)*animal.speed*mult*dt;if(!w.objectBlocks(nx,ny,r,null,null)){animal.x=nx;animal.y=ny;}}else{if(animal.timer<=0){animal.dir=Math.random()<.5?-1:1;animal.timer=1+Math.random()*2.5;}const nx=animal.x+animal.dir*animal.speed*.35*dt,ny=animal.y+Math.sin((animal.x+animal.y)*.03)*animal.speed*.08*dt;if(!w.objectBlocks(nx,ny,r,null,null)){animal.x=nx;animal.y=ny;}else animal.dir*=-1,animal.timer=.2+Math.random()*.5;}}
}