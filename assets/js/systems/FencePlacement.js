/*
 * RESPONSABILIDADE: calcular somente a posição da próxima cerca.
 * Objetos físicos já colocados vivem em world.fences.
 */
export class FencePlacement{
  static getPosition({player,world,orientation="horizontal"}){
    const vertical=orientation==="vertical";
    const baseX=player.x+player.lastDir*28;
    const baseY=player.y+8;
    let best=null,bestDist=58;
    for(const item of world.fences||[]){
      const dx=player.x-item.x,dy=player.y-item.y,d=Math.hypot(dx,dy);
      if(d>=bestDist)continue;
      const itemVertical=item.orientation==="vertical";
      if(vertical===itemVertical){
        if(vertical){
          const side=Math.abs(dy)>4?(dy>0?1:-1):(player.lastDir||1);
          bestDist=d;best={x:item.x,y:item.y+side*32,orientation:"vertical"};
        }else{
          const side=Math.abs(dx)>4?(dx>0?1:-1):(player.lastDir||1);
          bestDist=d;best={x:item.x+side*32,y:item.y,orientation:"horizontal"};
        }
        continue;
      }
      const corners=[
        {x:item.x+16,y:item.y+16},{x:item.x+16,y:item.y-16},
        {x:item.x-16,y:item.y+16},{x:item.x-16,y:item.y-16}
      ];
      let corner=null,cornerDist=Infinity;
      for(const candidate of corners){
        const cd=Math.hypot(player.x-candidate.x,player.y-candidate.y);
        if(cd<cornerDist){cornerDist=cd;corner=candidate;}
      }
      if(cornerDist<bestDist){
        bestDist=cornerDist;
        best={x:corner.x,y:corner.y,orientation:vertical?"vertical":"horizontal"};
      }
    }
    return best||{x:baseX,y:baseY,orientation:vertical?"vertical":"horizontal"};
  }
}