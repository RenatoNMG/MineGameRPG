import {NPCTask} from "../systems/NPCTask.js";

export class NPC{
  constructor({id,x,y,dir=1,speed=38,state="idle",radius=12}){
    this.id=id;
    this.x=x;
    this.y=y;
    this.dir=dir;
    this.speed=speed;
    this.state=state;
    this.radius=radius;
    this.task=null;
    this.constructionOrder=null;
  }

  createTask(data){return new NPCTask(data);}

  assignConstruction(construction){
    this.constructionOrder=construction||null;
    return this.constructionOrder;
  }
}
