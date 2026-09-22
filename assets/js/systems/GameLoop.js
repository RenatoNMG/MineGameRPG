import {InteractionSystem} from "./InteractionSystem.js";
import {DropSystem} from "./DropSystem.js";

export class GameLoop{
  constructor(game){this.game=game;this.last=performance.now();}
  start(){requestAnimationFrame(t=>this.loop(t));}
  dropItem(){const game=this.game;if(game.paused)return;const result=DropSystem.dropItem({player:game.player,world:game.world,inventory:game.inventory,equipped:game.equipped,particles:game.particles});if(!result.ok&&result.type==="empty"){game.equipped=null;game.ui.renderQuickbar();return;}if(result.ok){if(result.empty)game.equipped=null;game.ui.renderInventory();game.events.emit("itemDropped",{itemId:result.itemId});}}
  attack(){const game=this.game;if(game.paused||game.player.attackCd>0)return;const result=InteractionSystem.interact({player:game.player,world:game.world,inventory:game.inventory,equipped:game.equipped,particles:game.particles});if(result.type==="itemUsed"&&game.inventory.qty(result.itemId)<=0)game.equipped=null;if(result.type==="itemCollected"||result.type==="itemUsed")game.ui.renderInventory();if(result.type!=="none")game.events.emit(result.type,result);}
  update(dt){const game=this.game;if(game.paused)return;game.time+=dt;game.player.updateCooldown(dt);game.player.updateNeeds(dt);const {dx,dy}=game.input.axis();game.player.move(dx,dy,dt,(mx,my)=>game.world.movePlayer(mx,my));if(game.input.consumeDrop())this.dropItem();if(game.input.consumeAttack())this.attack();game.world.update(dt);DropSystem.collectResourceDrops({player:game.player,world:game.world,inventory:game.inventory,particles:game.particles});game.particles.forEach(p=>p.t-=dt);game.particles=game.particles.filter(p=>p.t>0);if(game.player.hp<=0){game.player.respawn();game.world.enemies=[];game.particles.push({x:game.player.x,y:game.player.y,t:1.5,text:"VOCÊ CAIU — RETORNOU"});}game.ui.updateHUD();}
  loop(now){const game=this.game;const dt=Math.min(.033,(now-this.last)/1000);this.last=now;this.update(dt);game.renderer.render(game.particles,game.equipped);requestAnimationFrame(t=>this.loop(t));}
}
