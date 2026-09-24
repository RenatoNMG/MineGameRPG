export class InventoryUI{
  constructor(game,query,quickbar){this.game=game;this.q=query;this.quickbar=quickbar;}
  render(){
    const game=this.game,grid=this.q("#inventoryGrid");grid.innerHTML="";
    for(let i=0;i<game.inventory.slots;i++){
      const item=game.inventory.items[i],b=document.createElement("button");
      b.className="slot"+(item?" filled":"");
      if(item){
        const icon=document.createElement("span");icon.className="item-icon";
        /*
         * REGRA VISUAL OBRIGATÓRIA:
         * Se o item possui visual Canvas, o emoji/icon NÃO EXISTE na UI.
         * Inventário, quickbar, mão e mundo devem usar a mesma implementação
         * de desenho do ItemRenderer. Nunca usar item.icon como fallback para
         * um item renderMode:"canvas".
         */
        if(item.renderMode==="canvas"){
          const canvas=document.createElement("canvas");canvas.width=32;canvas.height=32;canvas.className="inventory-item-canvas";
          const mini=canvas.getContext("2d"),original=game.renderer.ctx;
          game.renderer.ctx=mini;game.renderer.drawDroppedItem({...item,x:16,y:15});game.renderer.ctx=original;
          icon.appendChild(canvas);
        }else if(typeof item.icon==="string"&&item.icon.trim().startsWith("<svg"))icon.innerHTML=item.icon;
        else icon.textContent=item.icon||"";
        const qty=document.createElement("small");qty.textContent="×"+item.qty;
        b.append(icon,qty);b.onclick=()=>this.equip(item,i);
      }
      grid.appendChild(b);
    }
    const totalItems=game.inventory.items.reduce((a,x)=>a+x.qty,0);
    const usedSlots=game.inventory.items.length;
    this.q("#inventoryCount").textContent=usedSlots+" / "+game.inventory.slots+" espaços • "+totalItems+" itens";
    this.quickbar.render();
  }
  equip(item,index=null){this.quickbar.equip(item,index);}
}
