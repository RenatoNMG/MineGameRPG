/*
 * CAIXA: GEOMETRIA DA PORTA
 *
 * Responsabilidade: definir a geometria visual das folhas e também o espaço
 * físico que pertence ao vão da porta. A colisão continua separada do desenho.
 *
 * REGRA FÍSICA:
 * - porta fechada bloqueia;
 * - porta em abertura segue a regra de colisão existente;
 * - quando a porta entra no estado aberto de colisão, o seu vão fica livre;
 * - cercas vizinhas continuam físicas fora desse vão.
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

  /*
   * Geometria física do vão. O valor acompanha o mesmo segmento físico de
   * 32px usado pela construção, sem alterar tamanho, snap ou animação visual.
   */
  static getOpening(gate){
    return {
      x:gate.x,
      y:gate.y,
      orientation:gate.orientation==="vertical"?"vertical":"horizontal",
      halfSpan:16
    };
  }

  static collisionOpen(gate){
    return gate?.visual==="fenceGate"&&(gate.openProgress??0)>=.85;
  }

  static pointInOpening(gate,x,y){
    if(!this.collisionOpen(gate))return false;
    const opening=this.getOpening(gate);
    if(opening.orientation==="vertical")return Math.abs(y-opening.y)<=opening.halfSpan;
    return Math.abs(x-opening.x)<=opening.halfSpan;
  }

  static isAdjacentFence(gate,fence){
    if(!gate||!fence||gate===fence)return false;
    if((gate.orientation==="vertical")!==(fence.orientation==="vertical"))return false;
    const sameAxis=gate.orientation==="vertical"
      ? Math.abs(fence.x-gate.x)<1
      : Math.abs(fence.y-gate.y)<1;
    if(!sameAxis)return false;
    const distance=gate.orientation==="vertical"
      ? Math.abs(fence.y-gate.y)
      : Math.abs(fence.x-gate.x);
    return Math.abs(distance-32)<1;
  }
}
