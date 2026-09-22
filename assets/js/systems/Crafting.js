import {RECIPES} from "../data/recipes.js";
import {getItem} from "../data/items/index.js";

export class Crafting{
  constructor(inventory){
    this.inventory=inventory;
    this.recipes=RECIPES;
  }

  canCraft(recipe){
    const [outputId,outputQty]=recipe.output;
    const output=this.inventory.get(outputId);
    const definition=getItem(outputId);
    if(!definition||!Number.isInteger(outputQty)||outputQty<1)return false;
    return recipe.cost.every(([id,q])=>this.inventory.qty(id)>=q)&&
      (!output||this.inventory.qty(outputId)+outputQty<=definition.maxStack);
  }

  craft(recipe){
    if(!this.canCraft(recipe))return false;
    for(const [id,q] of recipe.cost)this.inventory.remove(id,q);
    const [outputId,outputQty]=recipe.output;
    return this.inventory.add(outputId,outputQty);
  }
}
