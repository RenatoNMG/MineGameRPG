import {Chick} from "../entities/Chick.js";
export class SpawnSystem{
  constructor(world){this.world=world;this.eggHatchTime=90;}
  update(dt){const w=this.world;w.chickens.forEach(ch=>ch.update(dt,w));w.chicks.forEach(ch=>ch.update(dt,w));for(let i=w.eggs.length-1;i>=0;i--){const egg=w.eggs[i];egg.age=(egg.age||0)+dt;if(egg.age>=this.eggHatchTime){w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));w.eggs.splice(i,1);}}}
}