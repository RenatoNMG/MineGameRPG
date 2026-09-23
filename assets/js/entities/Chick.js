export class Chick{
  constructor(x,y,dir=1){this.x=x;this.y=y;this.dir=dir;this.speed=32;this.timer=.5+Math.random()*2;this.growthTime=90;this.age=0;}
  update(dt,world){
    this.age+=dt;
    this.timer-=dt;
    const d=Math.hypot(this.x-world.player.x,this.y-world.player.y);
    if(d<75){
      const dx=this.x-world.player.x,dy=this.y-world.player.y,len=Math.hypot(dx,dy)||1;
      this.dir=dx<0?-1:1;
      const nx=this.x+(dx/len)*this.speed*1.8*dt;
      const ny=this.y+(dy/len)*this.speed*1.8*dt;
      if(!world.objectBlocks(nx,ny,7,null,this)){this.x=nx;this.y=ny;}
    }else{
      if(this.timer<=0){this.dir=Math.random()<.5?-1:1;this.timer=1+Math.random()*2.5;}
      const nx=this.x+this.dir*this.speed*.35*dt;
      const ny=this.y+Math.sin((this.x+this.y)*.03)*this.speed*.08*dt;
      if(!world.objectBlocks(nx,ny,7,null,this)){this.x=nx;this.y=ny;}
      else{this.dir*=-1;this.timer=.2+Math.random()*.5;}
    }
    this.x=Math.max(25,Math.min(world.width-25,this.x));
    this.y=Math.max(25,Math.min(world.height-25,this.y));
  }
}