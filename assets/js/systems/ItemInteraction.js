import {ItemSystem} from "./ItemSystem.js";
import {Config} from "../core/Config.js";

/*
 * RESPONSABILIDADE: traduzir a ação do jogador em uma tentativa de uso do
 * item equipado. Regras do item ficam no ItemSystem/ItemBehaviorSystem.
 * Não adicionar aqui regras específicas como "se for ovo" ou "se for carne".
 */
export class ItemInteraction{
  static interact({player,inventory,equipped,particles,world}){
    if(!ItemSystem.canUse(equipped)||inventory.qty(equipped.id)<=0)return null;
    if(!ItemSystem.use(equipped,player,inventory,world))return null;
    player.attackCd=Config.COMBAT.attackCooldown;
    particles.push({x:player.x,y:player.y-35,t:.9,text:"🍽️ ITEM USADO"});
    return {type:"itemUsed",itemId:equipped.id};
  }
}
