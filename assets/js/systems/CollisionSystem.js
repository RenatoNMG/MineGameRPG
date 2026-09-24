export class CollisionSystem{
  constructor(world){this.world=world;}

  /*
   * COLISÃO DE CERCA
   *
   * A cerca é um item colocado no mundo, mas depois de colocada passa a ser
   * um obstáculo físico. A geometria acompanha exatamente a orientação visual:
   * horizontal = segmento de 32px no eixo X;
   * vertical   = segmento de 32px no eixo Y.
   *
   * Usamos uma "cápsula" simples: distância do ponto até o segmento +
   * espessura. Isso permite que a mesma regra seja usada por jogador,
   * galinhas, galos, pintinhos e pelo teste de espaço para novos drops.
   *
   * NÃO coloque regras específicas de Player/Animal aqui. Este sistema é o
   * ponto único de consulta de colisões do mundo.
   */
  fenceBlocks(x,y,r=0){
    const fences=this.world.droppedItems||[];
    const thickness=4+r;
    for(const fence of fences){
      if(fence.id!=="fence")continue;

      const vertical=fence.orientation==="vertical";
      const ax=vertical?fence.x:fence.x-16;
      const ay=vertical?fence.y-16:fence.y;
      const bx=vertical?fence.x:fence.x+16;
      const by=vertical?fence.y+16:fence.y;

      const vx=bx-ax,vy=by-ay;
      const wx=x-ax,wy=y-ay;
      const lenSq=vx*vx+vy*vy;
      const t=lenSq?Math.max(0,Math.min(1,(wx*vx+wy*vy)/lenSq)):0;
      const px=ax+t*vx,py=ay+t*vy;

      if(Math.hypot(x-px,y-py)<thickness)return true;
    }
    return false;
  }

  waterBlocks(x,y,r=0){
    for(const water of this.world.waterPuddles){
      const dx=x-water.x,dy=y-water.y;
      const c=Math.cos(-(water.angle||0)),s=Math.sin(-(water.angle||0));
      const lx=dx*c-dy*s,ly=dx*s+dy*c;
      const rx=Math.max(1,water.rx+r+1),ry=Math.max(1,water.ry+r+1);
      if((lx*lx)/(rx*rx)+(ly*ly)/(ry*ry)<1)return true;
    }
    return false;
  }

  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null){
    const w=this.world;
    if(w.trees.some(t=>t.blocks(x,y,r)))return true;
    if(w.stones.some(s=>s.blocks(x,y,r)))return true;
    if(this.fenceBlocks(x,y,r))return true;
    if(this.waterBlocks(x,y,r))return true;
    if(w.chickens.some(ch=>ch!==ignoreChicken&&Math.hypot(ch.x-x,ch.y-y)<r+11))return true;
    if(w.chicks.some(ch=>ch!==ignoreChick&&Math.hypot(ch.x-x,ch.y-y)<r+7))return true;
    if(w.roosters.some(ro=>Math.hypot(ro.x-x,ro.y-y)<r+12))return true;
    return false;
  }

  canMove(px,py){
    const w=this.world;
    if(w.trees.some(t=>t.blocks(px,py,w.player.r)))return false;
    if(w.stones.some(s=>s.blocks(px,py,w.player.r)))return false;
    if(this.fenceBlocks(px,py,w.player.r))return false;
    if(this.waterBlocks(px,py,w.player.r+1))return false;
    return true;
  }

  movePlayer(dx,dy){
    const w=this.world,nx=w.player.x+dx,ny=w.player.y+dy;
    if(this.canMove(nx,w.player.y))w.player.x=nx;
    if(this.canMove(w.player.x,ny))w.player.y=ny;
    w.player.x=Math.max(25,Math.min(w.width-25,w.player.x));
    w.player.y=Math.max(25,Math.min(w.height-25,w.player.y));
  }
}
