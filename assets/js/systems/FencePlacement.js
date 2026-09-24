export class FencePlacement{
  static getPosition({player,world}){
    const baseX=player.x+player.lastDir*28;
    const baseY=player.y+8;
    let best=null;
    let bestDist=58;

    for(const item of world.droppedItems){
      if(item.id!=="fence")continue;

      const dx=player.x-item.x;
      const dy=player.y-item.y;
      const d=Math.hypot(dx,dy);

      if(d>=bestDist)continue;

      const side=Math.abs(dx)>4?(dx>0?1:-1):(player.lastDir||1);
      bestDist=d;
      best={x:item.x+side*32,y:item.y};
    }

    return best||{x:baseX,y:baseY};
  }
}