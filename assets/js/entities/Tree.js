export class Tree{
  constructor(x,y,s,t,dir){this.x=x;this.y=y;this.s=s;this.t=t;this.hp=3;this.maxHp=3;this.state="standing";this.fall=0;this.fallDir=dir;this.drop=null;}
  hit(){if(this.state!=="standing")return false;this.hp=Math.max(0,this.hp-1);if(this.hp===0){this.state="falling";this.fall=0;this.drop={x:this.x,y:this.y+8*this.s,qty:3+Math.floor(Math.random()*3)};}return true;}
  update(dt){if(this.state==="falling"){this.fall=Math.min(1,this.fall+dt/.45);if(this.fall>=1)this.state="fallen";}}
  blocks(px,py,playerRadius){if(this.state!=="standing"&&this.state!=="falling")return false;const r=15*this.s;const dx=px-this.x,dy=py-(this.y+7*this.s);return dx*dx+dy*dy<(playerRadius+r)**2;}
}