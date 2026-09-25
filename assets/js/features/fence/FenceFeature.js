/*
 * CAIXA DE FUNCIONALIDADE: CERCA E PORTA DE CERCA
 *
 * Esta classe é a dona do estado temporário específico das construções:
 * orientação, rotação e cálculo do preview.
 *
 * REGRA PARA FUTURAS IAs:
 * - cerca e porta são itens diferentes, mas compartilham a mesma mecânica;
 * - não criar uma segunda lógica de rotação para a porta;
 * - não coloque fenceOrientation no Player;
 * - não coloque regras de construção no GameLoop;
 * - não faça o Renderer descobrir como a construção funciona.
 *
 * O fluxo da caixa é:
 * Input -> FenceFeature -> estado/preview -> Renderer/DropSystem.
 */
import {FencePlacement} from "../../systems/FencePlacement.js";

export class FenceFeature{
  constructor({input,player,world,particles,getEquipped}){
    this.input=input;
    this.player=player;
    this.world=world;
    this.particles=particles;
    this.getEquipped=getEquipped;
    this.orientation="horizontal";
  }

  isFenceLike(item){return !!item&&(item.id==="fence"||item.id==="fenceGate");}

  update(){
    if(!this.input.consumeRotate())return;
    const equipped=this.getEquipped();
    if(!this.isFenceLike(equipped))return;
    this.rotate();
  }

  rotate(){
    this.orientation=this.orientation==="vertical"?"horizontal":"vertical";
    this.particles.push({x:this.player.x,y:this.player.y-35,t:.7,text:"CONSTRUÇÃO: "+(this.orientation==="vertical"?"VERTICAL":"HORIZONTAL")});
  }

  getOrientation(){return this.orientation;}

  getItemState(item){
    if(!this.isFenceLike(item))return item;
    return {...item,orientation:this.orientation};
  }

  getPreview(){
    const position=FencePlacement.getPosition({
      player:this.player,
      world:this.world,
      orientation:this.orientation
    });
    return {...position,orientation:this.orientation};
  }

  getDropPlacement(item){
    if(!this.isFenceLike(item))return null;
    return this.getPreview();
  }
}
