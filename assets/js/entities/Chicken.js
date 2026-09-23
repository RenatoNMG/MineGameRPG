export class Chicken{
  constructor(x,y,dir=1){
    this.x=x;this.y=y;this.dir=dir;this.carried=false;this.speed=24;
    this.timer=.5+Math.random()*2;
    this.age=0;this.lifespan=180;
    this.matingEggTimer=null;
    this.matingEggLocked=false;
    this.matingEggPending=false;
  }
  update(dt,world){
    if(this.carried)return false;
    this.age+=dt;
    this.timer-=dt;
    return this.age>=this.lifespan;
  }
}