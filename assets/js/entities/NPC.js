export class NPC{
  constructor({id,name,x,y,direction="down",speed=0,state="idle"}){
    this.id=id;this.name=name;this.x=x;this.y=y;this.direction=direction;this.speed=speed;this.state=state;this.r=14;
  }
  update(dt){void dt;}
}
