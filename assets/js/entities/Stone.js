export class Stone{
  constructor(x,y,s=1,type=0){
    this.x=x;this.y=y;this.s=s;this.type=type;
    this.collected=false;
    this.hp=3;this.maxHp=3;
    this.radius=18*s;
  }
  hit(){
    if(this.collected)return false;
    this.hp=Math.max(0,this.hp-1);
    if(this.hp===0)this.collected=true;
    return true;
  }
  collect(){return this.hit();}
  blocks(px,py,playerRadius){
    if(this.collected)return false;
    const r=this.radius,dx=px-this.x,dy=py-this.y;
    return dx*dx+dy*dy<(playerRadius+r)**2;
  }
}