/*
 * CAIXA DE FUNCIONALIDADE: CERCA E PORTA DE CERCA
 *
 * Estado temporário compartilhado por construções que usam orientação.
 * Cerca e porta são itens diferentes, mas usam a mesma caixa de rotação.
 *
 * REGRA PARA FUTURAS IAs:
 * - não criar uma segunda lógica de rotação para a porta;
 * - não colocar orientação no Player;
 * - não colocar regras de construção no GameLoop;
 * - Renderer só desenha o estado recebido desta caixa.
 */
import {FencePlacement} from "../../systems/FencePlacement.js";

export class FenceFeature{
  constructor({input,player,world,particles,getEquipped}){this.input=input;this.player=player;this.world=world;this.particles=particles;this.getEquipped=getEquipped;this.orientation="horizontal";}
  isFenceLike(item){return !!item&&(item.id==="fence"||item.id==="fenceGate");}
  update(){if(!this.input.consumeRotate())return;const equipped=this.getEquipped();if(!this.isFenceLike(equipped))return;this.rotate();}
  rotate(){this.orientation=this.orientation==="vertical"?"horizontal":"vertical";this.particles.push({x:this.player.x,y:this.player.y-35,t:.7,text:"CONSTRUÇÃO: "+(this.orientation==="vertical"?"VERTICAL":"HORIZONTAL")});}
  getOrientation(){return this.orientation;}
  getItemState(item){return this.isFenceLike(item)?{...item,orientation:this.orientation}:item;}
  getPreview(){const position=FencePlacement.getPosition({player:this.player,world:this.world,orientation:this.orientation});return {...position,orientation:this.orientation};}
  getDropPlacement(item){return this.isFenceLike(item)?this.getPreview():null;}
}
