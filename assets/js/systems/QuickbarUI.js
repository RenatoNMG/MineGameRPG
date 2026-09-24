export class QuickbarUI{
  constructor(game,query){this.game=game;this.q=query;}
  renderIcon(item){
    const icon=document.createElement("span");icon.className="quick-icon";
    /*
     * REGRA VISUAL OBRIGATÓRIA:
     * Item com renderMode:"canvas" NÃO PODE exibir emoji, texto ou icon como
     * substituto. O quickbar usa exatamente o mesmo desenho Canvas do mundo
     * e do inventário. A futura IA deve adicionar o desenho no ItemRenderer,
     * nunca criar uma segunda versão do desenho aqui.
     */
    if(item?.renderMode==="canvas"){
      const canvas=document.createElement("canvas");
      canvas.width=48;canvas.height=48;canvas.className="quick-icon-canvas";
      const mini=canvas.getContext("2d"),original=this.game.renderer.ctx;
      this.game.renderer.ctx=mini;
      this.game.renderer.drawDroppedItem({...item,x:24,y:24});
      this.game.renderer.ctx=original;
      icon.appendChild(canvas);
    }else if(item?.icon){
      icon.textContent=item.icon;
    }
    return icon;
  }
  render(){
    const game=this.game,box=this.q("#quickbar");if(!box)return;
    box.innerHTML="";
    const used=new Set();
    game.quickbar.forEach((id,i)=>{
      const item=id&&game.inventory.get(id);
      if(item&&used.has(item.id)){game.quickbar[i]=null;return;}
      if(item)used.add(item.id);
      const b=document.createElement("button");b.type="button";
      b.className="quick-slot"+(item?" filled":" empty")+(game.equipped&&item&&game.equipped.id===item.id?" active":"");
      const key=document.createElement("span");key.className="quick-key";key.textContent=i+1;
      const qty=document.createElement("span");qty.className="quick-qty";qty.textContent=item?item.qty:"";
      if(item){b.append(key,this.renderIcon(item),qty);}else{const empty=document.createElement("span");empty.className="quick-empty";empty.textContent="＋";b.append(key,empty);}
      b.onclick=()=>item&&this.equip(item,i);box.appendChild(b);
    });
  }
  equip(item,index=null){
    const game=this.game;game.equipped=item;
    if(index!==null){for(let i=0;i<game.quickbar.length;i++)if(i!==index&&game.quickbar[i]===item.id)game.quickbar[i]=null;game.quickbar[index]=item.id;}
    else{const at=game.quickbar.indexOf(item.id);if(at<0){const empty=game.quickbar.indexOf(null);if(empty>=0)game.quickbar[empty]=item.id;}}
    this.render();this.q("#itemInfo").textContent="Equipado: "+item.name+".";
  }
}
