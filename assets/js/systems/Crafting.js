import {RECIPES,getRecipe} from "../data/recipes/index.js?v=2.39";
import {FENCE_RECIPE} from "../data/recipes/fence.js?v=2.39";
import {getItem} from "../data/items/index.js";

export class Crafting{
  constructor(inventory){
    this.inventory=inventory;
    const recipes=[...RECIPES];
    if(!recipes.some(recipe=>recipe.id==="fence"))recipes.push(FENCE_RECIPE);
    this.recipes=recipes;
  }

  getRecipe(id){
    return getRecipe(id)||this.recipes.find(recipe=>recipe.id===id)||null;
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
