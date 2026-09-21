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
