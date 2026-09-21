export class Chicken{
  constructor(x,y,dir=1){this.x=x;this.y=y;this.dir=dir;this.speed=18;this.timer=.5+Math.random()*2;this.eggTimer=8+Math.random()*7;}
  update(dt,world){
    this.timer-=dt;this.eggTimer-=dt;if(this.eggTimer<=0){world.eggs.push({x:this.x,y:this.y+10});this.eggTimer=8+Math.random()*7;}
    const d=Math.hypot(this.x-world.player.x,this.y-world.player.y);
    if(d<75){
      const dx=this.x-world.player.x,dy=this.y-world.player.y,len=Math.hypot(dx,dy)||1;
      this.dir=dx<0?-1:1;
      this.x+=(dx/len)*this.speed*2.2*dt;
      this.y+=(dy/len)*this.speed*2.2*dt;
    }else{
      if(this.timer<=0){this.dir=Math.random()<.5?-1:1;this.timer=1+Math.random()*2.5;}
      this.x+=this.dir*this.speed*.35*dt;
      this.y+=Math.sin((this.x+this.y)*.03)*this.speed*.08*dt;
    }
    this.x=Math.max(30,Math.min(world.width-30,this.x));
    this.y=Math.max(30,Math.min(world.height-30,this.y));
  }
}