import {RECIPES,getRecipe} from "../data/recipes/index.js";
import {getItem} from "../data/items/index.js";

/*
 * RESPONSABILIDADE: executar regras genéricas de crafting.
 *
 * REGRA PARA FUTURAS IAs:
 * receitas pertencem a data/recipes. Não adicione aqui um `if` para uma
 * receita específica. Se uma receita nova existir, ela deve ser cadastrada
 * no índice de receitas e funcionar automaticamente por este sistema.
 */
export class Crafting{
  constructor(inventory){
    this.inventory=inventory;
    this.recipes=[...RECIPES];
  }

  getRecipe(id){
    return getRecipe(id)||null;
  }

  canCraft(recipe){
    if(!recipe||!Array.isArray(recipe.cost)||!Array.isArray(recipe.output))return false;
    const [outputId,outputQty]=recipe.output;
    const definition=getItem(outputId);
    if(!definition||!Number.isInteger(outputQty)||outputQty<1)return false;
    return recipe.cost.every(([id,q])=>this.inventory.qty(id)>=q)&&
      (!this.inventory.get(outputId)||this.inventory.qty(outputId)+outputQty<=definition.maxStack);
  }

  craft(recipe){
    if(!this.canCraft(recipe))return false;
    for(const [id,q] of recipe.cost)this.inventory.remove(id,q);
    const [outputId,outputQty]=recipe.output;
    return this.inventory.add(outputId,outputQty);
  }
}
