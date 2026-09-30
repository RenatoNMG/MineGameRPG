/* Camada social: estado, memória limitada e relações. Não decide ações do NPC. */
export class NPCSocialFeature{
  constructor(){this.maxMemories=8;}
  update(npc,world){
    if(!npc)return;
    npc.social=npc.social||{state:"neutral",relationships:{},preferences:{}};
    npc.memory=Array.isArray(npc.memory)?npc.memory.slice(-this.maxMemories):[];
    if(world?.player){this.ensureRelationship(npc,world.player.id||"player");}
    if(Array.isArray(world?.npcs))for(const other of world.npcs){if(other!==npc)this.ensureRelationship(npc,other.id);}
  }
  remember(npc,event){if(!npc||!event)return;npc.memory=Array.isArray(npc.memory)?npc.memory:[];npc.memory.push({type:event.type||"event",target:event.target||null,value:event.value??null,time:Date.now()});if(npc.memory.length>this.maxMemories)npc.memory=npc.memory.slice(-this.maxMemories);}
  ensureRelationship(npc,id){if(!id)return;if(!npc.social.relationships[id])npc.social.relationships[id]={value:0,state:"neutral"};}
}
