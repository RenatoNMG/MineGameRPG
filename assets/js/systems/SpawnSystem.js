import {Chick} from "../entities/Chick.js";

export class SpawnSystem{
  constructor(world){this.world=world;this.eggHatchTime=90;this.meatRotTime=120;}
  update(dt){
    const w=this.world;
    for(let i=w.eggs.length-1;i>=0;i--){const egg=w.eggs[i];egg.age=(egg.age||0)+dt;if(egg.age>=this.eggHatchTime){w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));w.eggs.splice(i,1);}}
    for(const item of w.droppedItems){if(item.id!=="chickenMeat")continue;item.dropAge=(item.dropAge||0)+dt;if(item.dropAge>=this.meatRotTime){item.id="rottenMeat";item.name="Carne Podre";item.icon="🤢";item.visual="rottenMeat";item.behavior="food";item.effects={hunger:5};item.dropAge=0;}}
  }
}
