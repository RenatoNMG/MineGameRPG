/*
 * Responsabilidade: transformar intenção em ação através da API mínima do World.
 * Não decide o objetivo e não implementa sistemas de inventário/coleta próprios.
 */
export class NPCActionFeature{
  constructor(world){this.world=world;}
  update(npc,dt){
    if(!npc)return;
    try{
      const intent=npc.intent||"EXPLORE";
      if(intent==="REST"){
        npc.objective={type:intent,target:null};
        if(npc.needs.energy>=95)this._complete(npc,intent,null);
        else npc.needs.energy=Math.min(100,npc.needs.energy+Math.max(0,dt)*8);
        return;
      }
      if(intent==="EXPLORE"){
        if(npc.exploreCooldown>0){npc.exploreCooldown=Math.max(0,npc.exploreCooldown-dt);return;}
        if(!npc.objective?.target||this._reached(npc,npc.objective.target)){
          npc.objective={type:"EXPLORE",target:this._chooseExploreTarget(npc)};
          npc.blockedSteps=0;
          if(!npc.objective.target){npc.actionResult={status:"failed",intent,reason:"no_free_destination"};return;}
        }
        if(!this._moveToward(npc,npc.objective.target,dt)){
          npc.blockedSteps=(npc.blockedSteps||0)+1;
          if(npc.blockedSteps>=8){npc.objective=null;npc.blockedSteps=0;npc.exploreCooldown=0.25;}
        }else npc.blockedSteps=0;
        if(npc.objective?.target&&this._reached(npc,npc.objective.target)){
          npc.actionResult={status:"completed",intent,target:npc.objective.target};
          npc.objective=null;npc.blockedSteps=0;npc.exploreCooldown=0.4;
        }
        return;
      }
      const target=this._selectTarget(npc,intent);
      npc.objective={type:intent,target};
      if(!target){npc.actionResult={status:"failed",intent,reason:"target_not_found"};npc.intent=null;npc.objective=null;return;}
      if(this._moveToward(npc,target,dt)){npc.blockedSteps=0;}
      else{npc.blockedSteps=(npc.blockedSteps||0)+1;if(npc.blockedSteps>=8){npc.actionResult={status:"failed",intent,reason:"target_inaccessible"};npc.intent=null;npc.objective=null;npc.blockedSteps=0;return;}}
      if(this._reached(npc,target))this._perform(npc,intent,target);
    }catch(e){npc.objective=null;npc.actionResult={status:"failed",intent:npc.intent||"EXPLORE"};}
  }
  _selectTarget(npc,intent){
    const p=npc.perception||{},objects=Array.isArray(p.objects)?p.objects:[];
    if(intent==="FLEE")return (p.dangers||[])[0]?.entity||null;
    if(intent==="DRINK")return objects.find(o=>o.type==="water")?.entity||null;
    if(intent==="EAT")return objects.find(o=>o.type==="egg"||o.type==="wood")?.entity||null;
    return null;
  }
  _chooseExploreTarget(npc){
    for(let i=0;i<12;i++){
      const angle=Math.random()*Math.PI*2,distance=35+Math.random()*65;
      const target={x:npc.x+Math.cos(angle)*distance,y:npc.y+Math.sin(angle)*distance};
      if(this._canMove(npc,target.x,target.y))return target;
    }
    return null;
  }
  _canMove(npc,x,y){return this.world.canMove(x,y,npc.r,npc);}
  _moveToward(npc,target,dt){
    const dx=target.x-npc.x,dy=target.y-npc.y,distance=Math.hypot(dx,dy);
    if(distance<=1)return true;
    const step=Math.min(distance,npc.speed*Math.max(0,Number.isFinite(dt)?dt:0));
    if(step<=0)return false;
    const ux=dx/distance,uy=dy/distance;
    const candidates=[
      [npc.x+ux*step,npc.y+uy*step],
      [npc.x+ux*step*0.65,npc.y+uy*step*0.65],
      [npc.x+ux*step,npc.y],
      [npc.x,npc.y+uy*step],
      [npc.x+Math.cos(Math.atan2(dy,dx)+Math.PI/4)*step,npc.y+Math.sin(Math.atan2(dy,dx)+Math.PI/4)*step],
      [npc.x+Math.cos(Math.atan2(dy,dx)-Math.PI/4)*step,npc.y+Math.sin(Math.atan2(dy,dx)-Math.PI/4)*step],
      [npc.x+Math.cos(Math.atan2(dy,dx)+Math.PI/2)*step,npc.y+Math.sin(Math.atan2(dy,dx)+Math.PI/2)*step],
      [npc.x+Math.cos(Math.atan2(dy,dx)-Math.PI/2)*step,npc.y+Math.sin(Math.atan2(dy,dx)-Math.PI/2)*step]
    ];
    for(const [x,y] of candidates){
      if(this._canMove(npc,x,y)){
        npc.x=x;npc.y=y;
        npc.direction=Math.abs(dx)>=Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");
        return true;
      }
    }
    return false;
  }
  _reached(npc,target){return !!target&&Math.hypot(target.x-npc.x,target.y-npc.y)<=22;}
  _perform(npc,intent,target){
    const result=this.world.npcActions?.execute(npc,intent,target);
    if(!result||result.status!=="completed"){npc.actionResult=result||{status:"failed",intent};return;}
    npc.actionResult=result;npc.intent=null;npc.objective=null;npc.blockedSteps=0;
  }
  _complete(npc,intent,target){npc.actionResult={status:"completed",intent,target};npc.intent=null;npc.objective=null;}
}
