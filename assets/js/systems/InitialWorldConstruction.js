import {DropSystem} from "./DropSystem.js";

export class InitialWorldConstruction{
  /*
   * Esta classe somente escolhe a posição e monta a construção inicial.
   * A instância física de cada peça é criada pela mesma fábrica usada pela
   * colocação manual em DropSystem. Não existe renderização, colisão ou
   * comportamento de portão específico para o cercado inicial.
   */
  static create({player,width,height,trees,stones,looseWood,chickens,roosters,waterPuddles,spawnReservation}){
    const build=(cx,cy)=>DropSystem.createInitialConstruction({centerX:cx,centerY:cy});

    const centerX=width/2;
    const centerY=height/2;

    /*
     * A reserva foi criada exatamente para garantir este ponto.
     * Não existe busca, anel, aleatoriedade ou fallback: a construção nasce
     * no centro geométrico do mapa. Se a reserva não contiver o centro,
     * a geração falha explicitamente em vez de mover a construção.
     */
    if(!spawnReservation||!spawnReservation.contains(centerX,centerY)){
      return [];
    }

    return build(centerX,centerY);
    /*
     * A construção inicial deve permanecer realmente próxima do centro do mapa.
     * Procuramos primeiro o centro e depois anéis concêntricos de 32px, limitados
     * a 320px de distância. Não existe fallback para o restante do mapa: se não
     * houver uma posição segura nessa região, a construção não é criada.
     */
    const candidates=[];
    const mapCenterX=width/2,mapCenterY=height/2;
    for(let radius=0;radius<=320;radius+=32){
      if(radius===0){
        candidates.push([mapCenterX,mapCenterY]);
        continue;
      }
      for(let x=-radius;x<=radius;x+=32){
        candidates.push([mapCenterX+x,mapCenterY-radius]);
        candidates.push([mapCenterX+x,mapCenterY+radius]);
      }
      for(let y=-radius+32;y<radius;y+=32){
        candidates.push([mapCenterX-radius,mapCenterY+y]);
        candidates.push([mapCenterX+radius,mapCenterY+y]);
      }
    }

    for(const [cx,cy] of candidates){
      if(spawnReservation&&!spawnReservation.contains(cx,cy))continue;
      if(valid(cx,cy))return build(cx,cy);
    }

    /*
     * O mapa atual é amplo e possui área livre suficiente para essa construção.
     * Se uma futura configuração impossibilitar toda a malha, não inventamos uma
     * construção parcialmente inválida: retornamos vazio para preservar colisões.
     * Com a configuração atual, a busca determinística encontra as 20 peças.
     */
    return [];
  }
}
