export class Enemy{
  constructor(x,y,level){const tough=1+Math.min(2,Math.floor(level/3));this.x=x;this.y=y;this.r=13+Math.random()*4;this.hp=28*tough;this.max=this.hp;this.speed=42+Math.random()*25;this.damage=7*tough;this.dead=false;}
  update(dt,player){const dx=player.x-this.x,dy=player.y-this.y,d=Math.hypot(dx,dy);if(d>28){this.x+=dx/d*this.speed*dt;this.y+=dy/d*this.speed*dt;}else player.takeDamage(this.damage*dt);}
}