/*
 * RESPONSABILIDADE: calcular somente a posição da próxima cerca.
 * A cerca continua sendo UM item; "orientation" é apenas o estado de colocação.
 * Não desenhar aqui e não criar fenceVertical/fenceHorizontal como itens.
 */
export class FencePlacement{
  static getPosition({player,world,orientation="horizontal"}){
    const vertical=orientation==="vertical";
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
      if(vertical){
        const side=Math.abs(dy)>4?(dy>0?1:-1):(player.lastDir||1);
        bestDist=d;
        best={x:item.x,y:item.y+side*32,orientation:"vertical"};
      }else{
        const side=Math.abs(dx)>4?(dx>0?1:-1):(player.lastDir||1);
        bestDist=d;
        best={x:item.x+side*32,y:item.y,orientation:"horizontal"};
      }
    }
    return best||{x:baseX,y:baseY,orientation:vertical?"vertical":"horizontal"};
  }
}
