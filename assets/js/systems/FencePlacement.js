export class FencePlacement{
  static getPosition({player,world}){
    const baseX=player.x+player.lastDir*28;
    const baseY=player.y+8;
    let best=null;
    let bestDist=42;

    for(const item of world.droppedItems){
      if(item.id!=="fence")continue;
      const dx=baseX-item.x;
      const dy=baseY-item.y;
      const d=Math.hypot(dx,dy);
      if(d<bestDist){
        bestDist=d;
        best={x:item.x+(dx>=0?32:-32),y:item.y};
      }
    }

    return best||{x:baseX,y:baseY};
  }
}
