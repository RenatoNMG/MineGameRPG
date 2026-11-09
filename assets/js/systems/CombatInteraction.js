import {Config} from "../core/Config.js";

export class CombatInteraction{
  static interact({player,world,equipped,particles}){
    const enemy=world.enemies.find(e=>Math.hypot(e.x-player.x,e.y-player.y)<65);
    if(enemy&&(!equipped||equipped.id!=="sword")){particles.push({x:player.x,y:player.y-35,t:.7,text:"FABRIQUE E EQUIPE UMA ESPADA"});return {type:"weaponRequired",weapon:"sword"};}
    if(!enemy)return null;
    player.attackCd=Config.COMBAT.attackCooldown;
    const damage=25+player.level*6;
    enemy.hp-=damage;
    particles.push({x:enemy.x,y:enemy.y,t:.35,text:"-"+damage});
    if(enemy.hp<=0){enemy.dead=true;player.kills++;player.gold+=3+Math.floor(Math.random()*7);player.gainXp(25);particles.push({x:enemy.x,y:enemy.y,t:.7,text:"+25 XP"});}
    return {type:"enemyHit"};
  }
}