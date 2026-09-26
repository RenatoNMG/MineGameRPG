/*
 * CAIXA: GEOMETRIA VISUAL DA PORTA
 *
 * Responsabilidade exclusiva: definir as duas folhas, suas dobradiças e o
 * sentido de abertura. GateFeature controla apenas o progresso da animação;
 * ItemRenderer somente desenha o resultado desta geometria.
 *
 * REGRA: as duas folhas são simétricas e devem fechar exatamente no centro.
 * O comprimento de cada folha é metade do vão total da porta.
 */
export class GateGeometry{
  static getLeaves(progress=0){
    const p=Math.max(0,Math.min(1,progress));
    const halfSpan=13;
    const leafLength=halfSpan;
    return [
      {hinge:-halfSpan,length:leafLength,angle:p*Math.PI/2},
      {hinge:halfSpan,length:leafLength,angle:Math.PI-p*Math.PI/2}
    ];
  }
}
