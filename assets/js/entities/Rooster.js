export class Rooster{
  constructor(x,y,dir=1){this.x=x;this.y=y;this.dir=dir;this.speed=26;this.timer=.5+Math.random()*2;this.mateTimer=2+Math.random()*4;this.matingTimer=0;this.matingCooldown=0;this.carried=false;}
}