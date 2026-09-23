import {Config} from "../core/Config.js";
export class Player{
  constructor(x,y){this.x=x;this.y=y;this.r=Config.PLAYER.radius;this.hp=100;this.max=100;this.hunger=100;this.thirst=100;this.xp=0;this.next=100;this.level=1;this.gold=35;this.kills=0;this.speed=Config.PLAYER.speed;this.attackCd=0;this.moving=false;this.lastDir=1;this.facing="front";}
  updateCooldown(dt){this.attackCd=Math.max(0,this.attackCd-dt);}
  updateNeeds(dt){
    this.hunger=Math.max(0,this.hunger-dt*Config.SURVIVAL.hungerDrain);
    this.thirst=Math.max(0,this.thirst-dt*Config.SURVIVAL.thirstDrain);
    if(this.hunger<=0||this.thirst<=0)this.hp=Math.max(0,this.hp-dt*Config.SURVIVAL.starvationDamage);
  }
  move(dx,dy,dt,canMove){if(!dx&&!dy){this.moving=false;return;}this.moving=true;const n=Math.hypot(dx,dy);if(dy!==0){this.facing="front";}else if(dx!==0){this.facing="side";this.lastDir=dx>0?1:-1;}canMove(dx/n*this.speed*dt,dy/n*this.speed*dt);}
  gainXp(amount){this.xp+=amount;let leveled=false;while(this.xp>=this.next){this.xp-=this.next;this.level++;this.next=Math.floor(this.next*1.35);this.max+=15;this.hp=this.max;this.speed+=6;leveled=true;}return leveled;}
  takeDamage(amount){this.hp-=amount;}
  respawn(){this.hp=this.max*.5;this.hunger=70;this.thirst=70;this.gold=Math.max(0,this.gold-15);this.xp=0;}
}