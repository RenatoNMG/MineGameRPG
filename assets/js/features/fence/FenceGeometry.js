/*
 * CAIXA: GEOMETRIA FÍSICA DA CERCA
 *
 * Responsabilidade: única fonte dos números físicos de cerca/porta.
 * NÃO desenhar aqui. NÃO colocar interação aqui.
 *
 * A porta usa a mesma geometria da cerca quando fechada. Durante a animação,
 * a colisão é liberada no final da abertura para o jogador atravessar.
 */
export class FenceGeometry{
  static getSegment(fence){
    const vertical=fence.orientation==="vertical";
    return vertical
      ? {ax:fence.x,ay:fence.y-16,bx:fence.x,by:fence.y+16}
      : {ax:fence.x-16,ay:fence.y,bx:fence.x+16,by:fence.y};
  }
  static blocksPoint(fence,x,y,r=0){
    if(fence.visual==="fenceGate"&&(fence.openProgress??0)>=.85)return false;
    const {ax,ay,bx,by}=this.getSegment(fence);
    const thickness=4+r;
    const vx=bx-ax,vy=by-ay,wx=x-ax,wy=y-ay,lenSq=vx*vx+vy*vy;
    const t=lenSq?Math.max(0,Math.min(1,(wx*vx+wy*vy)/lenSq)):0;
    const px=ax+t*vx,py=ay+t*vy;
    return Math.hypot(x-px,y-py)<thickness;
  }
  static blocksPlayer(fence,player){return !!player&&this.blocksPoint(fence,player.x,player.y,player.r);}
}
