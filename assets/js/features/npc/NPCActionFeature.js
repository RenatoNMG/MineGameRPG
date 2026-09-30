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
      const target=this._selectTarget(npc,intent);
      npc.objective={type:intent,target};
      if(intent==="REST"){
        if(npc.needs.energy>=95)this._complete(npc,intent,null);
        else npc.needs.energy=Math.min(100,npc.needs.energy+Math.max(0,dt)*8);
        return;
      }
      if(intent==="EXPLORE")return;
      if(!target){npc.actionResult={status:"failed",intent,reason:"target_not_found"};npc.intent=null;npc.objective=null;return;}
      this._moveToward(npc,target,dt);
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
  _moveToward(npc,target,dt){
    const dx=target.x-npc.x,dy=target.y-npc.y,distance=Math.hypot(dx,dy);
    if(distance<=1)return;
    const step=Math.min(distance,(npc.speed||18)*Math.max(0,Number.isFinite(dt)?dt:0));
    if(step<=0)return;
    const nx=npc.x+dx/distance*step,ny=npc.y+dy/distance*step;
    if(this.world.canMove(nx,ny)){npc.x=nx;npc.y=ny;}
    else if(this.world.canMove(nx,npc.y))npc.x=nx;
    else if(this.world.canMove(npc.x,ny))npc.y=ny;
    npc.direction=Math.abs(dx)>=Math.abs(dy)?(dx<0?"left":"right"):(dy<0?"up":"down");
  }
  _reached(npc,target){return Math.hypot(target.x-npc.x,target.y-npc.y)<=22;}
  _perform(npc,intent,target){
    const result=this.world.npcActions?.execute(npc,intent,target);
    if(!result||result.status!=="completed"){npc.actionResult=result||{status:"failed",intent};return;}
    npc.actionResult=result;npc.intent=null;npc.objective=null;
  }
}
