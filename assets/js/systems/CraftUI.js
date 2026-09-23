export class CraftUI{
  constructor(game,query,inventoryUI){this.game=game;this.q=query;this.inventoryUI=inventoryUI;}
  render(){
    const game=this.game,box=this.q("#recipes");box.innerHTML="";
    game.crafting.recipes.forEach(recipe=>{
      const row=document.createElement("div");row.className="recipe";
      row.innerHTML='<span class="recipe-icon">'+recipe.icon+'</span><div class="recipe-main"><div class="recipe-name">'+recipe.name+'</div><div class="recipe-cost">'+recipe.cost.map(([id,q])=>q+"× "+(game.inventory.get(id)?.name||id)).join(" · ")+" · Você: "+recipe.cost.map(([id])=>game.inventory.qty(id)).join("/")+'</div></div>';
      const b=document.createElement("button");b.type="button";b.textContent="Criar";b.disabled=!game.crafting.canCraft(recipe);
      b.onclick=()=>{
        if(game.crafting.craft(recipe)){
          this.q("#itemInfo").textContent="Criado: "+game.inventory.get(recipe.output[0])?.name+".";
          game.events.emit("crafted",{recipeId:recipe.id,output:recipe.output});
          this.inventoryUI.render();this.render();
        }
      };
      row.appendChild(b);box.appendChild(row);
    });
  }
}
