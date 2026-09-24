export class InventoryUI{
  constructor(game,query,quickbar){this.game=game;this.q=query;this.quickbar=quickbar;}
  render(){
    const game=this.game,grid=this.q("#inventoryGrid");grid.innerHTML="";
    for(let i=0;i<game.inventory.slots;i++){
      const item=game.inventory.items[i],b=document.createElement("button");
      b.className="slot"+(item?" filled":"");
      if(item){
        const icon=document.createElement("span");icon.className="item-icon";
        if(item.visual==="rottenMeat"){
          const canvas=document.createElement("canvas");canvas.width=32;canvas.height=32;canvas.className="inventory-item-canvas";
          const mini=canvas.getContext("2d"),original=game.renderer.ctx;
          game.renderer.ctx=mini;game.renderer.drawDroppedItem({x:16,y:15,visual:"rottenMeat"});game.renderer.ctx=original;
          icon.appendChild(canvas);
        }else if(typeof item.icon==="string"&&item.icon.trim().startsWith("<svg"))icon.innerHTML=item.icon;
        else icon.textContent=item.icon;
        const qty=document.createElement("small");qty.textContent=item.qty;
        b.append(icon,qty);b.onclick=()=>this.equip(item,i);
      }
      grid.appendChild(b);
    }

    /*
     * BOAS PRÁTICAS — UI
     * Exibir espaços usados e quantidade total separadamente evita confundir
     * quantidade empilhada com quantidade de slots ocupados.
     */
    const totalItems=game.inventory.items.reduce((a,x)=>a+x.qty,0);
    const usedSlots=game.inventory.items.length;
    this.q("#inventoryCount").textContent=usedSlots+" / "+game.inventory.slots+" espaços • "+totalItems+" itens";
    this.quickbar.render();
  }
  equip(item,index=null){this.quickbar.equip(item,index);}
}
