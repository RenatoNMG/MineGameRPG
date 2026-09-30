/*
 * Responsabilidade: transformar a intenção atual do NPC em uma ação simples.
 * Não pertence aqui: decisão, personalidade, memória ou IA generativa.
 * API pública: update(npc,dt).
 * Fluxo: intenção -> alvo -> movimento/ação -> resultado.
 */
export class NPCActionFeature{
  constructor(world){this.world=world;}

  update(npc,dt){
    if(!npc)return;
    try{
      const intent=npc.intent||"EXPLORE";
      const target=this._selectTarget(npc,intent);
      npc.objective={type:intent,target};
      if(target)this._moveToward(npc,target,dt);
      if(target&&this._reached(npc,target))this._complete(npc,intent,target);
    }catch(e){
      npc.objective=null;
      npc.actionResult={status:"failed",intent:npc.intent||"EXPLORE"};
    }
  }

  _selectTarget(npc,intent){
    const p=npc.perception||{};
    if(intent==="FLEE")return (p.dangers||[])[0]||null;
    if(intent==="DRINK")return (p.objects||[]).find(o=>o.type==="water")||null;
    if(intent==="EAT")return (p.objects||[]).find(o=>o.type==="food"||o.type==="resource")||null;
    return null;
  }

  _moveToward(npc,target,dt){
    const dx=(target.x||0)-npc.x,dy=(target.y||0)-npc.y;
    const distance=Math.hypot(dx,dy);
    if(distance<=1)return;
    const step=Math.min(distance,(npc.speed||18)*Math.max(0,Number.isFinite(dt)?dt:0));
    if(step<=0)return;
    const nx=npc.x+dx/distance*step,ny=npc.y+dy/distance*step;
    if(this.world.canMove(nx,ny)){npc.x=nx;npc.y=ny;}
    else if(this.world.canMove(nx,npc.y))npc.x=nx;
    else if(this.world.canMove(npc.x,ny))npc.y=ny;
  }

  _reached(npc,target){return Math.hypot((target.x||0)-npc.x,(target.y||0)-npc.y)<=22;}

  _complete(npc,intent,target){
    if(intent==="DRINK")npc.needs.thirst=100;
    else if(intent==="EAT")npc.needs.hunger=100;
    else if(intent==="REST")npc.needs.energy=100;
    npc.actionResult={status:"completed",intent,target};
    npc.intent=null;
    npc.objective=null;
  }
}
