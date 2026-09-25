/*
 * CAIXA: GEOMETRIA FÍSICA DA CERCA
 *
 * Responsabilidade:
 * - única fonte dos números físicos da cerca;
 * - transformar orientação em segmento;
 * - responder colisões de ponto contra a cerca;
 * - garantir que uma cerca não seja criada atravessando o jogador.
 *
 * NÃO pertence aqui:
 * - rotação/estado -> FenceFeature;
 * - posição de colocação -> FencePlacement;
 * - desenho Canvas -> ItemRenderer;
 * - regra geral de colisão -> CollisionSystem.
 *
 * API pública: getSegment(fence), blocksPoint(fence,x,y,r), blocksPlayer(fence,player).
 *
 * Fluxo: World.fences -> CollisionSystem/FencePlacement/DropSystem -> FenceGeometry.
 */
export class FenceGeometry{
  static getSegment(fence){
    const vertical=fence.orientation==="vertical";
    return vertical
      ? {ax:fence.x,ay:fence.y-16,bx:fence.x,by:fence.y+16}
      : {ax:fence.x-16,ay:fence.y,bx:fence.x+16,by:fence.y};
  }

  static blocksPoint(fence,x,y,r=0){
    const {ax,ay,bx,by}=this.getSegment(fence);
    const thickness=4+r;
    const vx=bx-ax,vy=by-ay,wx=x-ax,wy=y-ay;
    const lenSq=vx*vx+vy*vy;
    const t=lenSq?Math.max(0,Math.min(1,(wx*vx+wy*vy)/lenSq)):0;
    const px=ax+t*vx,py=ay+t*vy;
    return Math.hypot(x-px,y-py)<thickness;
  }

  static blocksPlayer(fence,player){
    if(!player)return false;
    return this.blocksPoint(fence,player.x,player.y,player.r);
  }
}
