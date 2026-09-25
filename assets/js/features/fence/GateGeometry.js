/*
 * CAIXA: GEOMETRIA VISUAL DA PORTA
 *
 * Responsabilidade exclusiva: definir onde ficam as duas folhas quando a porta
 * está fechada e em qual sentido cada folha abre.
 *
 * REGRA: GateFeature controla estado/animação; ItemRenderer somente desenha.
 * Assim uma correção visual não altera colisão ou comportamento da porta.
 */
export class GateGeometry{
  static getLeaves(progress=0){
    const p=Math.max(0,Math.min(1,progress));
    return [
      {hinge:-13, length:13, angle:-p*Math.PI/2},
      {hinge:13, length:13, angle:Math.PI+p*Math.PI/2}
    ];
  }
}
