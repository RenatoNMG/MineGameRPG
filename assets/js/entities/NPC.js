export class NPC{
  constructor({id,name,x,y,direction="down",speed=18,state="idle",personality={},preferences={}}){
    this.id=id;this.name=name;this.x=x;this.y=y;this.direction=direction;this.speed=Math.max(1,Number(speed)||18);this.state=state;this.r=14;
    this.needs={hunger:100,thirst:100,energy:100};
    this.perception={objects:[],entities:[],dangers:[]};
    this.personality={...personality};
    this.preferences={...preferences};
    this.memory=[];
    this.social={state:"neutral",relationships:{},preferences:this.preferences};
  }
  update(dt){void dt;}
}
