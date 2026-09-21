export class Stone{
  constructor(x,y,s=1,type=0){
    this.x=x;
    this.y=y;
    this.s=s;
    this.type=type;
    this.collected=false;
    this.radius=18*s;
  }

  collect(){
    if(this.collected)return false;
    this.collected=true;
    return true;
  }

  blocks(px,py,playerRadius){
    if(this.collected)return false;
    const r=this.radius;
    const dx=px-this.x;
    const dy=py-this.y;
    return dx*dx+dy*dy<(playerRadius+r)**2;
  }
}