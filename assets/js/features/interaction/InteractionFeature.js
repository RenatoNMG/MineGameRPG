/*
 * CAIXA: INTERAÇÃO
 *
 * Ação do jogador é encaminhada para a caixa responsável pela mecânica.
 * Futuras IAs: uma nova ação não deve ser colocada diretamente no GameLoop.
 */
import {InteractionSystem} from "../../systems/InteractionSystem.js";
import {ChickenCarrySystem} from "../../systems/ChickenCarrySystem.js";
import {RoosterCarrySystem} from "../../systems/RoosterCarrySystem.js";

export class InteractionFeature{
  constructor({player,world,inventory,input,particles,getEquipped,setEquipped,onInventoryChanged,events,gateFeature}){
    this.player=player;this.world=world;this.inventory=inventory;this.input=input;
    this.particles=particles;this.getEquipped=getEquipped;this.setEquipped=setEquipped;
    this.onInventoryChanged=onInventoryChanged;this.events=events;this.gateFeature=gateFeature;
  }
  update(){if(this.input.consumeAttack())this.attack();}
  attack(){
    const equipped=this.getEquipped();
    if(this.player.attackCd>0)return;
    if(this.gateFeature?.interact()){this.player.attackCd=.2;return;}
    const rooster=RoosterCarrySystem.toggle({player:this.player,world:this.world,particles:this.particles});
    if(rooster){this.player.attackCd=.2;this.events.emit(rooster.type,rooster);return;}
    const chicken=ChickenCarrySystem.toggle({player:this.player,world:this.world,particles:this.particles});
    if(chicken){this.player.attackCd=.2;this.events.emit(chicken.type,chicken);return;}
    const result=InteractionSystem.interact({player:this.player,world:this.world,inventory:this.inventory,equipped,particles:this.particles});
    if(result?.type==="itemUsed"&&this.inventory.qty(result.itemId)<=0)this.setEquipped(null);
    if(result?.type==="itemCollected"||result?.type==="itemUsed")this.onInventoryChanged();
    if(result?.type&&result.type!=="none")this.events.emit(result.type,result);
  }
  afterWorldUpdate(){ChickenCarrySystem.update({player:this.player,world:this.world});RoosterCarrySystem.update({player:this.player,world:this.world});}
}
