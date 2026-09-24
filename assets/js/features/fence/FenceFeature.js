/*
 * CAIXA DE FUNCIONALIDADE: CERCA
 *
 * Esta classe é a dona de TODO o estado temporário específico da cerca:
 * orientação, rotação e cálculo do preview.
 *
 * REGRA PARA FUTURAS IAs:
 * - não coloque fenceOrientation no Player;
 * - não coloque regras de cerca no GameLoop;
 * - não faça o Renderer descobrir como a cerca funciona;
 * - não crie fenceVertical/fenceHorizontal como itens diferentes.
 *
 * O fluxo da caixa é:
 * Input -> FenceFeature -> estado/preview -> Renderer/DropSystem.
 *
 * Assim, para alterar a cerca, a IA pode começar por esta caixa sem precisar
 * reentender o jogo inteiro.
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

  update(){
    if(!this.input.consumeRotate())return;
    const equipped=this.getEquipped();
    if(!equipped||equipped.id!=="fence")return;
    this.rotate();
  }

  rotate(){
    this.orientation=this.orientation==="vertical"?"horizontal":"vertical";
    this.particles.push({
      x:this.player.x,
      y:this.player.y-35,
      t:.7,
      text:"CERCA: "+(this.orientation==="vertical"?"VERTICAL":"HORIZONTAL")
    });
  }

  getOrientation(){
    return this.orientation;
  }

  getItemState(item){
    if(!item||item.id!=="fence")return item;
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
    if(!item||item.id!=="fence")return null;
    return this.getPreview();
  }
}
