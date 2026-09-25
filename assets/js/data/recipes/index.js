import {WOODEN_AXE_RECIPE} from "./woodenAxe.js";import {PICKAXE_RECIPE} from "./pickaxe.js";import {FENCE_RECIPE} from "./fence.js";import {FENCE_GATE_RECIPE} from "./fenceGate.js";
/* ÍNDICE ÚNICO DE RECEITAS: nova receita entra aqui; Crafting.js permanece genérico. */
export const RECIPES=Object.freeze([WOODEN_AXE_RECIPE,PICKAXE_RECIPE,FENCE_RECIPE,FENCE_GATE_RECIPE]);
export function getRecipe(id){return RECIPES.find(recipe=>recipe.id===id)||null;}
export function validateRecipes(){const errors=[];for(const recipe of RECIPES){if(!recipe.id)errors.push("receita sem id");if(!recipe.name)errors.push(recipe.id+": sem nome");if(!Array.isArray(recipe.cost)||recipe.cost.length===0)errors.push(recipe.id+": custo invalido");if(!Array.isArray(recipe.output)||recipe.output.length!==2)errors.push(recipe.id+": output invalido");}return errors;}
