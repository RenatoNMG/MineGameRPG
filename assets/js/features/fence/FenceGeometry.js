/*
 * CAIXA: GEOMETRIA FÍSICA DA CERCA
 *
 * Responsabilidade: única fonte dos números físicos de cerca/porta.
 * NÃO desenhar aqui. NÃO colocar interação aqui.
 *
 * REGRA:
 * Portão fechado bloqueia.
 * Portão aberto libera seu vão físico.
 * Cercas vizinhas continuam físicas fora do vão.
 * A colisão não depende do desenho visual.
 */
import {GateGeometry} from "./GateGeometry.js";

export class FenceGeometry{
  static getSegment(fence){
    const vertical=fence.orientation==="vertical";
    return vertical
      ? {ax:fence.x,ay:fence.y-16,bx:fence.x,by:fence.y+16}
      : {ax:fence.x-16,ay:fence.y,bx:fence.x+16,by:fence.y};
  }

  static blocksPoint(fence,x,y,r=0){
    if(fence.visual==="fenceGate"&&GateGeometry.collisionOpen(fence))return false;
    const {ax,ay,bx,by}=this.getSegment(fence);
    const thickness=4+r;
    const vx=bx-ax,vy=by-ay,wx=x-ax,wy=y-ay,lenSq=vx*vx+vy*vy;
    const t=lenSq?Math.max(0,Math.min(1,(wx*vx+wy*vy)/lenSq)):0;
    const px=ax+t*vx,py=ay+t*vy;
    return Math.hypot(x-px,y-py)<thickness;
  }

  /*
   * Consulta física do conjunto de construções.
   *
   * Quando um portão aberto está encaixado entre duas cercas, os extremos das
   * cercas continuam existindo e continuam bloqueando lateralmente. Porém,
   * esses extremos não podem fechar novamente o vão do portão para o centro do
   * jogador. A exceção pertence à geometria da construção, não ao Renderer ou
   * ao CollisionSystem.
   */
  static blocksWorld(fences,x,y,r=0){
    const list=fences||[];
    for(const fence of list){
      if(!this.blocksPoint(fence,x,y,r))continue;

      const gate=list.find(candidate=>
        GateGeometry.collisionOpen(candidate)&&
        GateGeometry.isAdjacentFence(candidate,fence)
      );

      if(gate&&GateGeometry.pointInOpening(gate,x,y))continue;
      return true;
    }
    return false;
  }

  static blocksPlayer(fence,player){return !!player&&this.blocksPoint(fence,player.x,player.y,player.r);}
}
