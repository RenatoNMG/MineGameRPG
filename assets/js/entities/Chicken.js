export class Chicken{
  constructor(x,y,dir=1){this.x=x;this.y=y;this.dir=dir;this.carried=false;this.speed=24;this.timer=.5+Math.random()*2;this.eggTimer=20+Math.random()*40;this.age=0;this.lifespan=180;}
  update(dt,world){
    if(this.carried)return false;
    this.age+=dt;
    this.timer-=dt;
    this.eggTimer-=dt;
    const d=Math.hypot(this.x-world.player.x,this.y-world.player.y);
    if(d<75){
      const dx=this.x-world.player.x,dy=this.y-world.player.y,len=Math.hypot(dx,dy)||1;
      this.dir=dx<0?-1:1;
      const nx=this.x+(dx/len)*this.speed*2.2*dt;
      const ny=this.y+(dy/len)*this.speed*2.2*dt;
      if(!world.objectBlocks(nx,ny,13,this)){this.x=nx;this.y=ny;}
    }else{
      if(this.timer<=0){this.dir=Math.random()<.5?-1:1;this.timer=1+Math.random()*2.5;}
      const nx=this.x+this.dir*this.speed*.35*dt;
      const ny=this.y+Math.sin((this.x+this.y)*.03)*this.speed*.08*dt;
      if(!world.objectBlocks(nx,ny,13,this)){this.x=nx;this.y=ny;}
      else{
        const side=this.dir*(Math.random()<.5?1:-1);
        const sx=this.x,sy=this.y+side*this.speed*.6*dt;
        const bx=this.x-this.dir*this.speed*.6*dt,by=this.y+side*this.speed*.6*dt;
        if(!world.objectBlocks(sx,sy,13,this)){this.y=sy;}
        else if(!world.objectBlocks(bx,by,13,this)){this.x=bx;this.y=by;}
        else{this.dir*=-1;this.timer=.2+Math.random()*.5;}
      }
    }
    this.x=Math.max(30,Math.min(world.width-30,this.x));
    this.y=Math.max(30,Math.min(world.height-30,this.y));
    if(this.eggTimer<=0&&world.eggs.length<20){
      const ex=this.x-this.dir*14,ey=this.y+8;if(!world.objectBlocks(ex,ey,6,this)&&!world.eggs.some(e=>Math.hypot(e.x-ex,e.y-ey)<18))world.eggs.push({x:ex,y:ey});
      this.eggTimer=15+Math.random()*20;
    }else if(this.eggTimer<=0){
      this.eggTimer=3+Math.random()*5;
    }
    return this.age>=this.lifespan;
  }
}