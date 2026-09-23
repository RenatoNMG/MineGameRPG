import {Config} from "../core/Config.js";

export class WaterInteraction{
  static interact({player,world,particles}){
    const water=world.findWater(70);
    if(!water)return null;
    player.thirst=100;
    player.attackCd=Config.COMBAT.attackCooldown;
    particles.push({x:player.x,y:player.y-35,t:.9,text:"💧 +SEDE CHEIA"});
    return {type:"water"};
  }
}
