export class InventoryUI{
  constructor(game,query,quickbar){this.game=game;this.q=query;this.quickbar=quickbar;}
  render(){
    const game=this.game,grid=this.q("#inventoryGrid");grid.innerHTML="";
    for(let i=0;i<game.inventory.slots;i++){
      const item=game.inventory.items[i],b=document.createElement("button");b.className="slot"+(item?" filled":"");
      if(item){
        const icon=document.createElement("span");icon.className="item-icon";
        /* UI NÃO DESENHA ITEM. Renderer é a única fronteira visual do Canvas. */
        if(item.renderMode==="canvas")icon.appendChild(game.renderer.createItemIcon(item,32,"inventory-item-canvas"));
        else if(typeof item.icon==="string"&&item.icon.trim().startsWith("<svg"))icon.innerHTML=item.icon;
        else icon.textContent=item.icon||"";
        const qty=document.createElement("small");qty.textContent="×"+item.qty;b.append(icon,qty);b.onclick=()=>this.equip(item,i);
      }
      grid.appendChild(b);
    }
    const totalItems=game.inventory.items.reduce((a,x)=>a+x.qty,0),usedSlots=game.inventory.items.length;
    this.q("#inventoryCount").textContent=usedSlots+" / "+game.inventory.slots+" espaços • "+totalItems+" itens";this.quickbar.render();
  }
  equip(item,index=null){this.quickbar.equip(item,index);}
}