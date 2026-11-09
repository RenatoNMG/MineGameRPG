/*
 * RESPONSABILIDADE: calcular somente a posição da próxima cerca.
 * Objetos físicos já colocados vivem em world.fences.
 *
 * REGRA DE SEGURANÇA:
 * uma posição só pode ser escolhida se o segmento físico completo da cerca
 * estiver fora do jogador. Não basta verificar apenas o centro.
 *
 * REGRA DE POSICIONAMENTO:
 * o preview deve respeitar a direção em que o jogador está olhando/movendo.
 * O snap continua sendo escolhido apenas entre posições compatíveis com essa
 * direção, evitando que uma cerca próxima atrás do jogador seja priorizada.
 */
import {FenceGeometry} from "../features/fence/FenceGeometry.js";

export class FencePlacement{
  static isSafeForPlayer(position,player){
    return !FenceGeometry.blocksPlayer(position,player);
  }

  static getBuildDirection(player){
    if(player.facing==="back")return {x:0,y:-1};
    if(player.facing==="front")return {x:0,y:1};
    return {x:player.lastDir||1,y:0};
  }

  static isInBuildDirection(player,x,y,direction){
    const dx=x-player.x,dy=y-player.y;
    return dx*direction.x+dy*direction.y>0;
  }

  static getPosition({player,world,orientation="horizontal"}){
    const vertical=orientation==="vertical";
    const direction=this.getBuildDirection(player);
    const safeOffset=40;
    const baseX=player.x+direction.x*safeOffset;
    const baseY=player.y+direction.y*safeOffset;
    let best=null,bestDist=58;
    const occupied=(x,y)=> (world.fences||[]).some(item=>Math.hypot(item.x-x,item.y-y)<2);

    for(const item of world.fences||[]){
      const d=Math.hypot(player.x-item.x,player.y-item.y);
      if(d>=72)continue;

      const itemVertical=item.orientation==="vertical";
      if(vertical===itemVertical){
        let candidate;
        if(vertical){
          const dy=player.y-item.y;
          const side=Math.abs(dy)>4?(dy>0?1:-1):direction.y||1;
          candidate={x:item.x,y:item.y+side*32,orientation:"vertical"};
        }else{
          const dx=player.x-item.x;
          const side=Math.abs(dx)>4?(dx>0?1:-1):direction.x||1;
          candidate={x:item.x+side*32,y:item.y,orientation:"horizontal"};
        }
        if(this.isInBuildDirection(player,candidate.x,candidate.y,direction)&&!occupied(candidate.x,candidate.y)&&this.isSafeForPlayer(candidate,player)){
          const snapDist=Math.hypot(player.x-candidate.x,player.y-candidate.y);
          if(snapDist<bestDist){
            bestDist=snapDist;
            best=candidate;
          }
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
        const positioned=this.isInBuildDirection(player,candidate.x,candidate.y,direction);
        if(positioned&&cd<cornerDist&&!occupied(candidate.x,candidate.y)&&this.isSafeForPlayer({...candidate,orientation:vertical?"vertical":"horizontal"},player)){
          cornerDist=cd;
          corner=candidate;
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
