/*
 * CAIXA: COMPORTAMENTO DA PORTA DE CERCA
 *
 * Responsabilidade exclusiva:
 * - encontrar uma porta próxima;
 * - iniciar abrir/fechar;
 * - atualizar a animação de 0 (fechada) a 1 (aberta).
 *
 * A porta é dividida visualmente em duas folhas. O Renderer desenha as duas
 * partes usando openProgress; esta caixa NÃO desenha nada.
 *
 * REGRA PARA FUTURAS IAs:
 * não colocar animação da porta no GameLoop nem no Renderer. O GameLoop apenas
 * chama update() e o Renderer apenas lê openProgress.
 */
export class GateFeature{
  constructor({player,world,particles}){
    this.player=player;this.world=world;this.particles=particles;
    this.speed=3.5;
  }
  update(dt){
    for(const gate of this.world.fences||[]){
      if(gate.visual!=="fenceGate")continue;
      if(gate.openProgress===undefined)gate.openProgress=0;
      const target=gate.gateOpen?1:0;
      const delta=this.speed*dt;
      if(gate.openProgress<target)gate.openProgress=Math.min(target,gate.openProgress+delta);
      else if(gate.openProgress>target)gate.openProgress=Math.max(target,gate.openProgress-delta);
    }
  }
  interact(){
    let target=null,best=58;
    for(const gate of this.world.fences||[]){
      if(gate.visual!=="fenceGate")continue;
      const d=Math.hypot(this.player.x-gate.x,this.player.y-gate.y);
      if(d<best){best=d;target=gate;}
    }
    if(!target)return false;
    target.gateOpen=!target.gateOpen;
    this.particles.push({x:target.x,y:target.y-25,t:.7,text:target.gateOpen?"PORTA ABRINDO":"PORTA FECHANDO"});
    return true;
  }
}
