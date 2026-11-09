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
  }
}
