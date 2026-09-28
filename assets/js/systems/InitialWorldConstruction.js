import {DropSystem} from "./DropSystem.js";

export class InitialWorldConstruction{
  /*
   * Esta classe somente escolhe a posição e monta a construção inicial.
   * A instância física de cada peça é criada pela mesma fábrica usada pela
   * colocação manual em DropSystem. Não existe renderização, colisão ou
   * comportamento de portão específico para o cercado inicial.
   */
  static create({player,width,height,trees,stones,looseWood,chickens,roosters,waterPuddles}){
    const makePiece=(itemId,x,y,orientation)=>DropSystem.createConstruction({itemId,x,y,orientation});
    const build=(cx,cy)=>{
      const pieces=[];
      for(const dx of [-64,-32,0,32,64])pieces.push(makePiece("fence",cx+dx,cy-48,"horizontal"));
      for(const dx of [-64,-32,32,64])pieces.push(makePiece("fence",cx+dx,cy+48,"horizontal"));
      for(const dy of [-16,16]){
        pieces.push(makePiece("fence",cx-64,cy+dy,"vertical"));
        pieces.push(makePiece("fence",cx+64,cy+dy,"vertical"));
      }
      pieces.push(makePiece("fenceGate",cx,cy+48,"horizontal"));
      return pieces.filter(Boolean);
    };

    const blocked=(x,y,r=0)=>{
      if(Math.hypot(x-player.x,y-player.y)<r+48)return true;
      if(trees.some(t=>Math.hypot(t.x-x,(t.y+7*t.s)-y)<r+22*t.s))return true;
      if(stones.some(s=>!s.collected&&Math.hypot(s.x-x,s.y-y)<r+s.radius+12))return true;
      if(looseWood.some(o=>!o.collected&&Math.hypot(o.x-x,o.y-y)<r+22))return true;
      if(chickens.some(ch=>Math.hypot(ch.x-x,ch.y-y)<r+24))return true;
      if(roosters.some(ro=>Math.hypot(ro.x-x,ro.y-y)<r+24))return true;
      if(waterPuddles.some(w=>{
        const c=Math.cos(-(w.angle||0)),s=Math.sin(-(w.angle||0)),dx=x-w.x,dy=y-w.y;
        const lx=dx*c-dy*s,ly=dx*s+dy*c,rx=Math.max(1,w.rx+r+6),ry=Math.max(1,w.ry+r+6);
        return (lx*lx)/(rx*rx)+(ly*ly)/(ry*ry)<1;
      }))return true;
      return false;
    };

    const valid=(cx,cy)=>{
      if(cx<105||cx>width-105||cy<95||cy>height-95)return false;
      const pieces=build(cx,cy);
      if(pieces.length!==14)return false;

      /*
       * Verifica cada peça e também pontos intermediários do segmento físico.
       * Assim a validação considera o tamanho real da cerca, não somente o
       * centro do cercado.
       */
      for(const piece of pieces){
        const vertical=piece.orientation==="vertical";
        const samples=vertical
          ? [[piece.x,piece.y-16],[piece.x,piece.y],[piece.x,piece.y+16]]
          : [[piece.x-16,piece.y],[piece.x,piece.y],[piece.x+16,piece.y]];
        for(const [x,y] of samples){
          if(blocked(x,y,8))return false;
        }
      }

      if(pieces.some((a,i)=>pieces.some((b,j)=>i!==j&&Math.hypot(a.x-b.x,a.y-b.y)<2)))return false;
      return true;
    };

    /*
     * Busca determinística em anéis ao redor do jogador. Primeiro tenta uma
     * região fácil de encontrar; se estiver ocupada, amplia progressivamente
     * até cobrir o mapa inteiro em uma malha de 32px.
     */
    const candidates=[];
    for(let radius=160;radius<=640;radius+=32){
      for(let x=-radius;x<=radius;x+=32){
        candidates.push([player.x+x,player.y-radius]);
        candidates.push([player.x+x,player.y+radius]);
      }
      for(let y=-radius+32;y<radius;y+=32){
        candidates.push([player.x-radius,player.y+y]);
        candidates.push([player.x+radius,player.y+y]);
      }
    }
    for(let y=96;y<=height-96;y+=32){
      for(let x=96;x<=width-96;x+=32)candidates.push([x,y]);
    }

    for(const [cx,cy] of candidates){
      if(valid(cx,cy))return build(cx,cy);
    }

    /*
     * O mapa atual é amplo e possui área livre suficiente para essa construção.
     * Se uma futura configuração impossibilitar toda a malha, não inventamos uma
     * construção parcialmente inválida: retornamos vazio para preservar colisões.
     * Com a configuração atual, a busca determinística encontra as 14 peças.
     */
    return [];
  }
}
