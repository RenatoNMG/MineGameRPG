export class NPC{
  constructor({id,x,y,dir=1,speed=0,state="idle"}){
    this.id=id;
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.speed=speed;
    this.state=state;
  }
}
