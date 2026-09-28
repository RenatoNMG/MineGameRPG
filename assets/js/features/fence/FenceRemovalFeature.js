/*
 * CAIXA DE FUNCIONALIDADE: REMOÇÃO DE CONSTRUÇÕES
 *
 * Responsabilidade exclusiva:
 * - verificar o Martelo;
 * - localizar uma cerca/portão próximo;
 * - remover somente essa construção de world.fences.
 *
 * REGRA:
 * O Martelo é a única ferramenta que pode remover construções.
 * Não devolver a construção ao inventário nesta etapa.
 *
 * Fluxo:
 * Input -> InteractionFeature -> FenceRemovalFeature -> World
 */
export class FenceRemovalFeature{
  constructor({player,world,particles}){
    this.player=player;this.world=world;this.particles=particles;this.range=58;
  }
  remove(equipped){
    if(!equipped||equipped.id!=="hammer")return null;
    let target=null,best=this.range;
    for(const construction of this.world.fences||[]){
      if(construction.visual!=="fence"&&construction.visual!=="fenceGate")continue;
      const distance=Math.hypot(this.player.x-construction.x,this.player.y-construction.y);
      if(distance<best){best=distance;target=construction;}
    }
    if(!target)return null;
    const index=this.world.fences.indexOf(target);
    if(index<0)return null;
    this.world.fences.splice(index,1);
    const type=target.visual==="fenceGate"?"gateRemoved":"fenceRemoved";
    const text=target.visual==="fenceGate"?"PORTÃO REMOVIDO":"CERCA REMOVIDA";
    this.particles.push({x:target.x,y:target.y-25,t:.7,text});
    return {type,construction:target};
  }
}
