export class WorldSpawnReservation{
  /*
   * Reserva geométrica usada somente durante a geração inicial do mundo.
   * Não participa de colisão, renderização ou gameplay depois da geração.
   */
  constructor({width,height,centerX=width/2,centerY=height/2,halfWidth=144,halfHeight=112}){
    this.width=width;
    this.height=height;
    this.centerX=centerX;
    this.centerY=centerY;
    this.halfWidth=halfWidth;
    this.halfHeight=halfHeight;
  }

  static forInitialConstruction({width,height}){
    return new WorldSpawnReservation({width,height,centerX:width/2,centerY:height/2});
  }

  contains(x,y,r=0){
    return Math.abs(x-this.centerX)<=this.halfWidth+r&&Math.abs(y-this.centerY)<=this.halfHeight+r;
  }

  blocks(x,y,r=0){
    return this.contains(x,y,r);
  }
}
