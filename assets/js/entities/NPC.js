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
    // Compatibilidade com sistemas de interação compartilhados com o jogador.
    this.r=radius;
    this.attackCd=0;
    this.task=null;
    this.constructionOrder=null;
  }

  createTask(data){return new NPCTask(data);}

  assignConstruction(construction){
    this.constructionOrder=construction||null;
    return this.constructionOrder;
  }
}
