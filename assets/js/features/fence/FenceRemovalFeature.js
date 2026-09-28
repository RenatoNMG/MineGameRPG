/*
 * CAIXA DE FUNCIONALIDADE: REMOÇÃO DE CONSTRUÇÕES
 *
 * Responsabilidade exclusiva:
 * - verificar o Martelo;
 * - localizar uma cerca/portão próximo;
 * - recuperar o item original no inventário;
 * - remover a construção de world.fences somente após a recuperação.
 *
 * REGRA:
 * O Martelo é a única ferramenta que pode remover construções.
 * A operação é transacional: se o inventário não aceitar o item, a construção
 * permanece no mundo e nenhum item é perdido.
 *
 * Fluxo:
 * Input -> InteractionFeature -> FenceRemovalFeature -> Inventory/World
 */
export class FenceRemovalFeature{
  constructor({player,world,particles,inventory}){
    this.player=player;this.world=world;this.particles=particles;this.inventory=inventory;this.range=58;
  }

  getItemId(construction){
    if(construction?.visual==="fence")return "fence";
    if(construction?.visual==="fenceGate")return "fenceGate";
    return null;
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

    const itemId=this.getItemId(target);
    if(!itemId)return null;

    /*
     * Primeiro recupera o item usando o Inventory existente.
     * Só altera o mundo se a operação de inventário for aceita.
     */
    if(!this.inventory?.add(itemId,1)){
      this.particles.push({x:this.player.x,y:this.player.y-35,t:.7,text:"INVENTÁRIO CHEIO"});
      return {type:"inventoryFull",construction:target};
    }

    const index=this.world.fences.indexOf(target);
    if(index<0){
      /*
       * O alvo só é removido depois de confirmar a recuperação. Como o alvo
       * pode ter mudado entre as etapas, devolvemos o item se ele não existir.
       */
      this.inventory.remove(itemId,1);
      return null;
    }

    this.world.fences.splice(index,1);
    const type=target.visual==="fenceGate"?"gateRemoved":"fenceRemoved";
    const text=target.visual==="fenceGate"?"PORTÃO REMOVIDO":"CERCA REMOVIDA";
    this.particles.push({x:target.x,y:target.y-25,t:.7,text});
    return {type,construction:target,itemId};
  }
}
