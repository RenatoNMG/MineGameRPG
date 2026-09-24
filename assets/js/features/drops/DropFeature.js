/*
 * CAIXA: DROPS
 * Responsabilidade: soltar o item equipado e coletar drops de recursos.
 * DropSystem continua sendo o motor de regra; esta caixa controla a entrada
 * do jogador e o momento correto no ciclo do mundo.
 *
 * Contrato:
 * Input -> DropFeature -> DropSystem -> World/Inventory
 *
 * NÃO colocar regra de cerca aqui. A orientação vem de FenceFeature.
 */
import {DropSystem} from "../../systems/DropSystem.js";

export class DropFeature{
  constructor({player,world,inventory,input,particles,getEquipped,setEquipped,getPlacement,onInventoryChanged,events}){
    this.player=player;this.world=world;this.inventory=inventory;this.input=input;
    this.particles=particles;this.getEquipped=getEquipped;this.setEquipped=setEquipped;
    this.getPlacement=getPlacement;this.onInventoryChanged=onInventoryChanged;this.events=events;
  }
  updateBeforeWorld(){
    if(!this.input.consumeDrop())return;
    const equipped=this.getEquipped();
    if(!equipped)return;
    const result=DropSystem.dropItem({
      player:this.player,world:this.world,inventory:this.inventory,equipped,
      particles:this.particles,placement:this.getPlacement(equipped)
    });
    if(!result.ok&&result.type==="empty"){this.setEquipped(null);this.onInventoryChanged();return;}
    if(result.ok){
      if(result.empty)this.setEquipped(null);
      this.onInventoryChanged();
      this.events.emit("itemDropped",{itemId:result.itemId});
    }
  }
  updateAfterWorld(){
    DropSystem.collectResourceDrops({
      player:this.player,world:this.world,inventory:this.inventory,particles:this.particles
    });
  }
}
