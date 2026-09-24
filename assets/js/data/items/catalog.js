/*
 * CATÁLOGO ÚNICO DOS ITENS
 *
 * REGRA OBRIGATÓRIA PARA FUTURAS IAs:
 * 1. Cada item novo recebe seu próprio arquivo em data/items/.
 * 2. O arquivo do item contém somente DADOS: id, nome, categoria, stack,
 *    visual e efeitos/propriedades declarativas.
 * 3. Depois, importe o item aqui e adicione-o ao objeto ITEMS.
 * 4. NÃO coloque regras de gameplay, DOM ou Canvas dentro do arquivo do item.
 * 5. Comportamentos especiais devem usar `behavior` e ficar no
 *    ItemBehaviorSystem. Visuais especiais ficam no ItemRenderer.
 * 6. IDs são contratos: não renomeie um ID existente sem revisar todas as
 *    referências (inventário, drops, receitas, mundo, UI e saves).
 */
import {WOOD} from "./wood.js";
import {STONE} from "./stone.js";
import {EGG} from "./egg.js";
import {CHICKEN_MEAT} from "./chickenMeat.js";
import {ROTTEN_MEAT} from "./rottenMeat.js";
import {WOODEN_AXE} from "./woodenAxe.js";
import {PICKAXE} from "./pickaxe.js";
import {AXE} from "./axe.js";
import {SWORD} from "./sword.js";
import {TORCH} from "./torch.js";
import {POTION} from "./potion.js";
import {FENCE} from "./fence.js";

export const ITEMS=Object.freeze({
  wood:WOOD,
  stone:STONE,
  egg:EGG,
  chickenMeat:CHICKEN_MEAT,
  rottenMeat:ROTTEN_MEAT,
  woodenAxe:WOODEN_AXE,
  pickaxe:PICKAXE,
  axe:AXE,
  sword:SWORD,
  torch:TORCH,
  potion:POTION,
  fence:FENCE
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
