import {Config} from "../core/Config.js";

export class WaterInteraction{
  static interact({player,world,particles=[],water=null}){
    const source=water||world.findWater(70);
    if(!source)return null;
    player.thirst=100;
    player.attackCd=Config.COMBAT.attackCooldown;
    particles.push({x:player.x,y:player.y-35,t:.9,text:"💧 +SEDE CHEIA"});
    return {type:"water"};
  }
}
