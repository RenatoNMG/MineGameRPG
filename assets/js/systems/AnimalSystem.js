import {createItem} from "../data/items/index.js";
import {Chicken} from "../entities/Chicken.js";

export class AnimalSystem{
  constructor(world){this.world=world;this.chickenLifespan=180;this.chickGrowthTime=90;this.maxEggs=20;}
  update(dt){
    const w=this.world;
    for(let i=w.chickens.length-1;i>=0;i--){const chicken=w.chickens[i];this.updateChicken(chicken,dt);if(chicken.age>=this.chickenLifespan){w.droppedItems.push({...createItem("chickenMeat",1),x:chicken.x,y:chicken.y,dropAge:0});w.chickens.splice(i,1);}}
    for(let i=w.chicks.length-1;i>=0;i--){const chick=w.chicks[i];this.updateChick(chick,dt);if(chick.age>=this.chickGrowthTime){w.chickens.push(new Chicken(chick.x,chick.y,chick.dir));w.chicks.splice(i,1);}}
  }
  updateChicken(chicken,dt){const w=this.world;if(chicken.carried)return;chicken.age+=dt;chicken.timer-=dt;chicken.eggTimer-=dt;this.move(chicken,dt,13,2.2);chicken.x=Math.max(30,Math.min(w.width-30,chicken.x));chicken.y=Math.max(30,Math.min(w.height-30,chicken.y));if(chicken.eggTimer<=0&&w.eggs.length<this.maxEggs){const ex=chicken.x-chicken.dir*14,ey=chicken.y+8;if(!w.objectBlocks(ex,ey,6,chicken)&&!w.eggs.some(e=>Math.hypot(e.x-ex,e.y-ey)<18))w.eggs.push({x:ex,y:ey});chicken.eggTimer=15+Math.random()*20;}else if(chicken.eggTimer<=0)chicken.eggTimer=3+Math.random()*5;}
  updateChick(chick,dt){const w=this.world;chick.age+=dt;chick.timer-=dt;this.move(chick,dt,7,1.8);chick.x=Math.max(25,Math.min(w.width-25,chick.x));chick.y=Math.max(25,Math.min(w.height-25,chick.y));}
  move(animal,dt,r,mult){const w=this.world,d=Math.hypot(animal.x-w.player.x,animal.y-w.player.y),ignoreChicken=animal instanceof Chicken?animal:null,ignoreChick=animal instanceof Chicken?null:animal;if(d<75){const dx=animal.x-w.player.x,dy=animal.y-w.player.y,len=Math.hypot(dx,dy)||1;animal.dir=dx<0?-1:1;const nx=animal.x+(dx/len)*animal.speed*mult*dt,ny=animal.y+(dy/len)*animal.speed*mult*dt;if(!w.objectBlocks(nx,ny,r,ignoreChicken,ignoreChick)){animal.x=nx;animal.y=ny;}}else{if(animal.timer<=0){animal.dir=Math.random()<.5?-1:1;animal.timer=1+Math.random()*2.5;}const nx=animal.x+animal.dir*animal.speed*.35*dt,ny=animal.y+Math.sin((animal.x+animal.y)*.03)*animal.speed*.08*dt;if(!w.objectBlocks(nx,ny,r,ignoreChicken,ignoreChick)){animal.x=nx;animal.y=ny;}else{animal.dir*=-1;animal.timer=.2+Math.random()*.5;}}}
}
