/*
 * CAIXA: PLAYER
 * Responsabilidade: entrada de movimento + necessidades + cooldown do jogador.
 * NÃO coloque aqui regras de itens, animais, UI ou renderização.
 *
 * Contrato para IA:
 * Input -> PlayerFeature -> Player
 * O Player continua sendo apenas estado/entidade; esta caixa coordena regras
 * temporais do jogador. O GameLoop apenas chama update().
 */
export class PlayerFeature{
  constructor({player,input,world}){this.player=player;this.input=input;this.world=world;}
  update(dt){
    this.player.updateCooldown(dt);
    this.player.updateNeeds(dt);
    const {dx,dy}=this.input.axis();
    this.player.move(dx,dy,dt,(mx,my)=>this.world.movePlayer(mx,my));
  }
}
