export class CraftUI{
  constructor(game,query,inventoryUI){this.game=game;this.q=query;this.inventoryUI=inventoryUI;}
  render(){
    const game=this.game,box=this.q("#recipes");box.innerHTML="";
    game.crafting.recipes.forEach(recipe=>{
      const row=document.createElement("div");row.className="recipe";
      const output=game.inventory.get(recipe.output[0])||game.crafting.getRecipe(recipe.id)&&game.inventory.get(recipe.output[0]);
      const definition=game.inventory.get(recipe.output[0])||null;
      const outputDefinition=definition||game.crafting.getRecipe(recipe.id)&&null;
      const icon=document.createElement("span");icon.className="recipe-icon";
      /*
       * REGRA VISUAL: o CraftUI também não desenha itens.
       * Se a saída for Canvas, usa exatamente o mesmo ItemRenderer.
       */
      const itemDef=game.inventory.get(recipe.output[0])||null;
      if(itemDef?.renderMode==="canvas")icon.appendChild(game.renderer.createItemIcon(itemDef,38,"recipe-item-canvas"));
      else if(recipe.icon)icon.textContent=recipe.icon;
      else if(itemDef?.icon)icon.textContent=itemDef.icon;
      const main=document.createElement("div");main.className="recipe-main";
      const name=document.createElement("div");name.className="recipe-name";name.textContent=recipe.name;
      const cost=document.createElement("div");cost.className="recipe-cost";cost.textContent=recipe.cost.map(([id,q])=>q+"× "+(game.inventory.get(id)?.name||id)).join(" · ")+" · Você: "+recipe.cost.map(([id])=>game.inventory.qty(id)).join("/");
      main.append(name,cost);
      const b=document.createElement("button");b.type="button";b.textContent="Criar";b.disabled=!game.crafting.canCraft(recipe);
      b.onclick=()=>{if(game.crafting.craft(recipe)){this.q("#itemInfo").textContent="Criado: "+game.inventory.get(recipe.output[0])?.name+".";game.events.emit("crafted",{recipeId:recipe.id,output:recipe.output});this.inventoryUI.render();this.render();}};
      row.append(icon,main,b);box.appendChild(row);
    });
  }
}