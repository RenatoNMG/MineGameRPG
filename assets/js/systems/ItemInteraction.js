import {ItemSystem} from "./ItemSystem.js";
import {Config} from "../core/Config.js";

export class ItemInteraction{
  static interact({player,inventory,equipped,particles}){
    if(!ItemSystem.canUse(equipped)||inventory.qty(equipped.id)<=0)return null;
    if(!ItemSystem.use(equipped,player,inventory))return null;
    player.attackCd=Config.COMBAT.attackCooldown;
    particles.push({x:player.x,y:player.y-35,t:.9,text:"🍽️ ITEM USADO"});
    return {type:"itemUsed",itemId:equipped.id};
  }
}