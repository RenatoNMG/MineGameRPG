import {createItem} from "../data/items/index.js";
import {Chicken} from "../entities/Chicken.js";
import {Chick} from "../entities/Chick.js";

export class TransformationSystem{
  constructor(world){
    this.world=world;
    this.eggHatchTime=90;
    this.chickGrowthTime=90;
    this.chickenLifespan=180;
    this.meatRotTime=120;
  }
  update(dt){
    this.updateEggs(dt);
    this.updateChicks(dt);
    this.updateChickens(dt);
    this.updateMeat(dt);
  }
  updateEggs(dt){
    const w=this.world;
    for(let i=w.eggs.length-1;i>=0;i--){
      const egg=w.eggs[i];
      egg.age=(egg.age||0)+dt;
      if(egg.age>=this.eggHatchTime){
        w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));
        w.eggs.splice(i,1);
      }
    }
  }
  updateChicks(dt){
    const w=this.world;
    for(let i=w.chicks.length-1;i>=0;i--){
      const chick=w.chicks[i];
      chick.age=(chick.age||0)+dt;
      if(chick.age>=this.chickGrowthTime){
        w.chickens.push(new Chicken(chick.x,chick.y,chick.dir));
        w.chicks.splice(i,1);
      }
    }
  }
  updateChickens(dt){
    const w=this.world;
    for(let i=w.chickens.length-1;i>=0;i--){
      const chicken=w.chickens[i];
      chicken.age=(chicken.age||0)+dt;
      if(chicken.age>=this.chickenLifespan){
        w.droppedItems.push({...createItem("chickenMeat",1),x:chicken.x,y:chicken.y,dropAge:0});
        w.chickens.splice(i,1);
      }
    }
  }
  updateMeat(dt){
    const w=this.world;
    for(const item of w.droppedItems){
      if(item.id!=="chickenMeat")continue;
      item.dropAge=(item.dropAge||0)+dt;
      if(item.dropAge>=this.meatRotTime){
        const rotten=createItem("rottenMeat",item.qty||1);
        if(!rotten)continue;
        Object.assign(item,rotten,{x:item.x,y:item.y,dropAge:0});
      }
    }
  }
}
