import {getItem} from "../data/items/index.js";

export class ItemSystem{
  static validate(id){
    const item=getItem(id);
    if(!item)return {valid:false,error:"ITEM_NAO_CADASTRADO"};
    const required=["id","name","icon","category","maxStack","visual"];
    const missing=required.filter(key=>item[key]===undefined||item[key]===null);
    if(missing.length)return {valid:false,error:"ITEM_INCOMPLETO:"+missing.join(",")};
    if(item.id!==id)return {valid:false,error:"ID_DIVERGENTE"};
    if(!Number.isInteger(item.maxStack)||item.maxStack<1)return {valid:false,error:"MAX_STACK_INVALIDO"};
    return {valid:true,item};
  }

  static canUse(item){
    if(!item)return false;
    const check=this.validate(item.id);
    if(!check.valid)return false;
    return item.category==="food"||item.category==="consumable";
  }

  static use(item,player,inventory){
    if(!this.canUse(item))return false;
    if(!inventory.remove(item.id,1))return false;
    if(item.effects?.hunger!==undefined)player.hunger=Math.min(100,player.hunger+item.effects.hunger);
    if(item.effects?.thirst!==undefined)player.thirst=Math.min(100,player.thirst+item.effects.thirst);
    if(item.heal!==undefined)player.hp=Math.min(player.max,player.hp+item.heal);
    return true;
  }
}
