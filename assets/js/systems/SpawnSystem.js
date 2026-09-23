import {Chick} from "../entities/Chick.js";
import {Chicken} from "../entities/Chicken.js";
import {createItem} from "../data/items/index.js";

export class SpawnSystem{
  constructor(world){this.world=world;this.eggHatchTime=90;}
  update(dt){
    const w=this.world;
    for(let i=w.chickens.length-1;i>=0;i--){
      const chicken=w.chickens[i];
      if(chicken.update(dt,w)){
        w.droppedItems.push({...createItem("chickenMeat",1),x:chicken.x,y:chicken.y});
        w.chickens.splice(i,1);
      }
    }
    for(let i=w.chicks.length-1;i>=0;i--){
      const chick=w.chicks[i];
      chick.update(dt,w);
      if(chick.age>=chick.growthTime){
        w.chickens.push(new Chicken(chick.x,chick.y,chick.dir));
        w.chicks.splice(i,1);
      }
    }
    for(let i=w.eggs.length-1;i>=0;i--){
      const egg=w.eggs[i];
      egg.age=(egg.age||0)+dt;
      if(egg.age>=this.eggHatchTime){
        w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));
        w.eggs.splice(i,1);
      }
    }
  }
}