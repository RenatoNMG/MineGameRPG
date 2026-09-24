/*
 * RESPONSABILIDADE: calcular somente a posição da próxima cerca.
 *
 * A cerca continua sendo UM item; "orientation" é apenas estado de colocação.
 *
 * REGRA DE ENCAIXE:
 * - mesma orientação -> continua encaixando lado a lado;
 * - orientação diferente -> encaixa em uma das pontas da cerca existente,
 *   formando um canto de 90 graus;
 * - a ponta escolhida é a mais próxima do jogador.
 *
 * NÃO desenhar aqui.
 * NÃO criar fenceVertical/fenceHorizontal como itens.
 * NÃO colocar regra de cerca no GameLoop/Player.
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

      const itemVertical=item.orientation==="vertical";

      if(vertical===itemVertical){
        /* Mesmo sentido: mantém o encaixe linear já existente. */
        if(vertical){
          const side=Math.abs(dy)>4?(dy>0?1:-1):(player.lastDir||1);
          bestDist=d;
          best={
            x:item.x,
            y:item.y+side*32,
            orientation:"vertical"
          };
        }else{
          const side=Math.abs(dx)>4?(dx>0?1:-1):(player.lastDir||1);
          bestDist=d;
          best={
            x:item.x+side*32,
            y:item.y,
            orientation:"horizontal"
          };
        }
        continue;
      }

      /*
       * Sentidos diferentes: procura os quatro cantos possíveis.
       *
       * Uma cerca horizontal ocupa aproximadamente 32px no eixo X e uma
       * vertical aproximadamente 32px no eixo Y. Para formar um canto,
       * o centro da nova cerca precisa ficar 16px além do centro existente
       * nos dois eixos.
       */
      const corners=[
        {x:item.x+16,y:item.y+16},
        {x:item.x+16,y:item.y-16},
        {x:item.x-16,y:item.y+16},
        {x:item.x-16,y:item.y-16}
      ];

      let corner=null;
      let cornerDist=Infinity;
      for(const candidate of corners){
        const cd=Math.hypot(player.x-candidate.x,player.y-candidate.y);
        if(cd<cornerDist){
          cornerDist=cd;
          corner=candidate;
        }
      }

      if(cornerDist<bestDist){
        bestDist=cornerDist;
        best={
          x:corner.x,
          y:corner.y,
          orientation:vertical?"vertical":"horizontal"
        };
      }
    }

    return best||{
      x:baseX,
      y:baseY,
      orientation:vertical?"vertical":"horizontal"
    };
  }
}
