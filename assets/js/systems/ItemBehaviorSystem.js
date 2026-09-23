export const ITEM_BEHAVIORS=Object.freeze({
  food:{use({item,player}){const amount=item.effects?.hunger||0;if(!amount)return false;player.hunger=Math.min(player.maxHunger??100,(player.hunger??0)+amount);return true;}},
  placeable:{use({item,world,player}){if(typeof world.placeItem!=='function')return false;return !!world.placeItem(item.id,player.x+(player.lastDir||1)*28,player.y);}},
  tool:{use(){return false;}},
  material:{use(){return false;}}
});

export function getItemBehavior(item){return ITEM_BEHAVIORS[item?.behavior||item?.category]||null;}
export function useItem(context){const behavior=getItemBehavior(context.item);return !!behavior?.use(context);}
export function registerItemBehavior(id,behavior){if(!id||!behavior?.use)throw new Error("Comportamento de item inválido");ITEM_BEHAVIORS[id]=behavior;}
