import {RESOURCE_ITEMS} from "./resources.js";
import {TOOL_ITEMS} from "./tools.js";
import {WEAPON_ITEMS} from "./weapons.js";
import {CONSUMABLE_ITEMS} from "./consumables.js";

export const ITEMS={
  ...RESOURCE_ITEMS,
  ...TOOL_ITEMS,
  ...WEAPON_ITEMS,
  ...CONSUMABLE_ITEMS
};

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
