/*
 * RESPONSABILIDADE: calcular somente a posição da próxima cerca.
 * Objetos físicos já colocados vivem em world.fences.
 *
 * REGRA DE SEGURANÇA:
 * uma posição só pode ser escolhida se o segmento físico completo da cerca
 * estiver fora do jogador. Não basta verificar apenas o centro.
 */
import {FenceGeometry} from "../features/fence/FenceGeometry.js";

export class FencePlacement{
  static isSafeForPlayer(position,player){
    return !FenceGeometry.blocksPlayer(position,player);
  }

  static getPosition({player,world,orientation="horizontal"}){
    const vertical=orientation==="vertical";
    /* Distância inicial suficiente para o segmento não envolver o jogador. */
    const safeOffset=40;
    const baseX=player.x+player.lastDir*safeOffset;
    const baseY=player.y+8;
    let best=null,bestDist=58;

    for(const item of world.fences||[]){
      const dx=player.x-item.x,dy=player.y-item.y,d=Math.hypot(dx,dy);
      if(d>=bestDist)continue;
      const itemVertical=item.orientation==="vertical";

      if(vertical===itemVertical){
        let candidate;
        if(vertical){
          const side=Math.abs(dy)>4?(dy>0?1:-1):(player.lastDir||1);
          candidate={x:item.x,y:item.y+side*32,orientation:"vertical"};
        }else{
          const side=Math.abs(dx)>4?(dx>0?1:-1):(player.lastDir||1);
          candidate={x:item.x+side*32,y:item.y,orientation:"horizontal"};
        }
        if(this.isSafeForPlayer(candidate,player)){
          bestDist=d;
          best=candidate;
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
        if(cd<cornerDist&&this.isSafeForPlayer({...candidate,orientation:vertical?"vertical":"horizontal"},player)){
          cornerDist=cd;corner=candidate;
        }
      }

      if(corner&&cornerDist<bestDist){
        bestDist=cornerDist;
        best={x:corner.x,y:corner.y,orientation:vertical?"vertical":"horizontal"};
      }
    }

    const initial={x:baseX,y:baseY,orientation:vertical?"vertical":"horizontal"};
    return best&&this.isSafeForPlayer(best,player)?best:initial;
  }
}
