export class QuickbarUI{
  constructor(game,query){this.game=game;this.q=query;}
  render(){
    const game=this.game,box=this.q("#quickbar");if(!box)return;
    box.innerHTML="";
    game.quickbar.forEach((id,i)=>{
      const item=id&&game.inventory.get(id),b=document.createElement("button");
      b.type="button";
      b.className="quick-slot"+(item?" filled":" empty")+(game.equipped&&item&&game.equipped.id===item.id?" active":"");
      b.innerHTML=item?'<span class="quick-key">'+(i+1)+'</span><span class="quick-icon">'+item.icon+'</span><span class="quick-qty">'+item.qty+"</span>":'<span class="quick-key">'+(i+1)+'</span><span class="quick-empty">＋</span>';
      b.onclick=()=>item&&this.equip(item,i);
      box.appendChild(b);
    });
  }
  equip(item,index=null){
    const game=this.game;
    game.equipped=item;
    if(index!==null)game.quickbar[index]=item.id;
    else{
      const at=game.quickbar.indexOf(item.id);
      if(at<0){const empty=game.quickbar.indexOf(null);if(empty>=0)game.quickbar[empty]=item.id;}
    }
    this.render();
    this.q("#itemInfo").textContent="Equipado: "+item.name+".";
  }
}
