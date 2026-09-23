import {Chicken} from "../entities/Chicken.js";
import {Rooster} from "../entities/Rooster.js";

export class AnimalSystem{
  constructor(world){this.world=world;this.maxEggs=20;}
  update(dt){
    const w=this.world;
    for(const chicken of w.chickens)this.updateChicken(chicken,dt);
    for(const rooster of w.roosters)this.updateRooster(rooster,dt);
    for(const chick of w.chicks)this.updateChick(chick,dt);
  }
  updateChicken(chicken,dt){
    const w=this.world;if(chicken.carried)return;
    chicken.timer-=dt;chicken.eggTimer-=dt;this.move(chicken,dt,13,2.2);
    chicken.x=Math.max(30,Math.min(w.width-30,chicken.x));chicken.y=Math.max(30,Math.min(w.height-30,chicken.y));
    if(chicken.eggTimer<=0&&w.eggs.length<this.maxEggs){const ex=chicken.x-chicken.dir*14,ey=chicken.y+8;if(!w.objectBlocks(ex,ey,6,chicken)&&!w.eggs.some(e=>Math.hypot(e.x-ex,e.y-ey)<18))w.eggs.push({x:ex,y:ey});chicken.eggTimer=15+Math.random()*20;}else if(chicken.eggTimer<=0)chicken.eggTimer=3+Math.random()*5;
  }
  updateRooster(rooster,dt){const w=this.world;rooster.timer-=dt;this.move(rooster,dt,15,1.8);rooster.x=Math.max(30,Math.min(w.width-30,rooster.x));rooster.y=Math.max(30,Math.min(w.height-30,rooster.y));}
  updateChick(chick,dt){const w=this.world;chick.timer-=dt;this.move(chick,dt,7,1.8);chick.x=Math.max(25,Math.min(w.width-25,chick.x));chick.y=Math.max(25,Math.min(w.height-25,chick.y));}
  move(animal,dt,r,mult){const w=this.world,d=Math.hypot(animal.x-w.player.x,animal.y-w.player.y);if(d<75){const dx=animal.x-w.player.x,dy=animal.y-w.player.y,len=Math.hypot(dx,dy)||1;animal.dir=dx<0?-1:1;const nx=animal.x+(dx/len)*animal.speed*mult*dt,ny=animal.y+(dy/len)*animal.speed*mult*dt;if(!w.objectBlocks(nx,ny,r,null,null)){animal.x=nx;animal.y=ny;}}else{if(animal.timer<=0){animal.dir=Math.random()<.5?-1:1;animal.timer=1+Math.random()*2.5;}const nx=animal.x+animal.dir*animal.speed*.35*dt,ny=animal.y+Math.sin((animal.x+animal.y)*.03)*animal.speed*.08*dt;if(!w.objectBlocks(nx,ny,r,null,null)){animal.x=nx;animal.y=ny;}else{animal.dir*=-1;animal.timer=.2+Math.random()*.5;}}}
}