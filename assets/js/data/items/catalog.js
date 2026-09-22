import {WOOD} from "./wood.js";
import {STONE} from "./stone.js";
import {EGG} from "./egg.js";
import {WOODEN_AXE} from "./woodenAxe.js";
import {PICKAXE} from "./pickaxe.js";
import {AXE} from "./axe.js";
import {SWORD} from "./sword.js";
import {TORCH} from "./torch.js";
import {POTION} from "./potion.js";

export const ITEMS=Object.freeze({
  wood:WOOD,
  stone:STONE,
  egg:EGG,
  woodenAxe:WOODEN_AXE,
  pickaxe:PICKAXE,
  axe:AXE,
  sword:SWORD,
  torch:TORCH,
  potion:POTION
});

export function getItem(id){
  return ITEMS[id]||null;
}

export function createItem(id,qty=1){
  const definition=getItem(id);
  if(!definition)return null;
  return {...definition,qty};
}

export function validateItems(){
  const required=["id","name","icon","category","maxStack","visual"];
  const errors=[];
  for(const [id,item] of Object.entries(ITEMS)){
    const missing=required.filter(key=>item[key]===undefined||item[key]===null);
    if(missing.length)errors.push(id+": "+missing.join(","));
    if(item.id!==id)errors.push(id+": id divergente");
    if(!Number.isInteger(item.maxStack)||item.maxStack<1)errors.push(id+": maxStack invalido");
  }
  return errors;
}
