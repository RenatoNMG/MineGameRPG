import {createItem} from "../data/items/index.js";
import {Chicken} from "../entities/Chicken.js";
import {Rooster} from "../entities/Rooster.js";
import {Chick} from "../entities/Chick.js";

export class TransformationSystem{
  constructor(world){
    this.world=world;
    this.eggHatchTime=90;
    this.chickGrowthTime=90;
    this.chickenLifespan=180;
    this.meatRotTime=120;
    this.rottenMeatLife=120;
  }
  update(dt){this.updateEggs(dt);this.updateChicks(dt);this.updateChickens(dt);this.updateRoosters(dt);this.updateMeat(dt);}
  updateEggs(dt){const w=this.world;for(let i=w.eggs.length-1;i>=0;i--){const egg=w.eggs[i];egg.age=(egg.age||0)+dt;if(egg.age>=this.eggHatchTime){w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));w.eggs.splice(i,1);}}}
  updateChicks(dt){const w=this.world;for(let i=w.chicks.length-1;i>=0;i--){const chick=w.chicks[i];chick.age=(chick.age||0)+dt;if(chick.age>=this.chickGrowthTime){if(Math.random()<.5)w.chickens.push(new Chicken(chick.x,chick.y,chick.dir));else w.roosters.push(new Rooster(chick.x,chick.y,chick.dir));w.chicks.splice(i,1);}}}
  updateChickens(dt){const w=this.world;for(let i=w.chickens.length-1;i>=0;i--){const chicken=w.chickens[i];chicken.age=(chicken.age||0)+dt;if(chicken.age>=this.chickenLifespan){w.droppedItems.push({...createItem("chickenMeat",1),x:chicken.x,y:chicken.y,dropAge:0});w.chickens.splice(i,1);}}}
  updateRoosters(dt){const w=this.world;for(let i=w.roosters.length-1;i>=0;i--){const rooster=w.roosters[i];rooster.age=(rooster.age||0)+dt;if(rooster.age>=this.chickenLifespan){w.droppedItems.push({...createItem("chickenMeat",1),x:rooster.x,y:rooster.y,dropAge:0});w.roosters.splice(i,1);}}}
  updateMeat(dt){const w=this.world;for(let i=w.droppedItems.length-1;i>=0;i--){const item=w.droppedItems[i];if(item.id!=="chickenMeat"&&item.id!=="rottenMeat")continue;item.dropAge=(item.dropAge||0)+dt;if(item.id==="chickenMeat"&&item.dropAge>=this.meatRotTime){const rotten=createItem("rottenMeat",item.qty||1);if(!rotten)continue;Object.assign(item,rotten,{x:item.x,y:item.y,dropAge:0});}else if(item.id==="rottenMeat"&&item.dropAge>=this.rottenMeatLife)w.droppedItems.splice(i,1);}}
}