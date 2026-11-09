/*
 * GAME LOOP = ORQUESTRADOR, NÃO DEPÓSITO DE REGRAS.
 *
 * REGRA PARA FUTURAS IAs: este arquivo só define a ordem do ciclo. Se uma
 * mecânica nova precisar de estado próprio, crie/estenda uma Feature.
 */
export class GameLoop{
  constructor(game){this.game=game;this.last=performance.now();}
  update(dt){
    const game=this.game;if(game.paused)return;game.time+=dt;
    game.playerFeature.update(dt);game.fenceFeature.update();game.gateFeature.update(dt);game.dropFeature.updateBeforeWorld();game.interactionFeature.update();
    game.world.update(dt);game.interactionFeature.afterWorldUpdate();game.dropFeature.updateAfterWorld();
    game.particles.forEach(p=>p.t-=dt);game.particles=game.particles.filter(p=>p.t>0);
    if(game.player.hp<=0){game.player.respawn();game.world.enemies=[];game.particles.push({x:game.player.x,y:game.player.y,t:1.5,text:"VOCÊ CAIU — RETORNOU"});}
    game.ui.updateHUD();
  }
  loop(now){const game=this.game,dt=Math.min(.033,(now-this.last)/1000);this.last=now;this.update(dt);game.renderer.render(game.particles,game.equipped);requestAnimationFrame(t=>this.loop(t));}
  start(){requestAnimationFrame(t=>this.loop(t));}
}
