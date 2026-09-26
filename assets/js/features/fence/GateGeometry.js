/*
 * CAIXA: GEOMETRIA VISUAL DA PORTA
 *
 * Responsabilidade exclusiva: definir as duas folhas, suas dobradiças e o
 * sentido de abertura. GateFeature controla apenas o progresso da animação;
 * ItemRenderer somente desenha o resultado desta geometria.
 *
 * REGRA: as duas folhas compartilham o mesmo eixo vertical e são simétricas.
 * A folha direita usa comprimento negativo em vez de uma rotação de PI:
 * assim ela aponta para o centro sem inverter o eixo Y dos detalhes visuais.
 * Isso preserva exatamente o sentido da abertura sem criar um desnível visual.
 */
export class GateGeometry{
  static getLeaves(progress=0){
    const p=Math.max(0,Math.min(1,progress));
    const halfSpan=13;
    const leafLength=halfSpan;
    return [
      {hinge:-halfSpan,length:leafLength,angle:p*Math.PI/2},
      {hinge:halfSpan,length:-leafLength,angle:-p*Math.PI/2}
    ];
  }
}
