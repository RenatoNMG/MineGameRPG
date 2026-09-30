/* Interface desacoplada para diálogo. Implementações externas podem substituir o provider. */
export class NPCDialogueAdapter{
  constructor(provider=null){this.provider=provider;}
  async respond(npc,world,input=""){
    const context={identity:{id:npc?.id,name:npc?.name},personality:npc?.personality||{},preferences:npc?.social?.preferences||{},relationship:this._relationship(npc,world?.player),memories:(npc?.memory||[]).slice(-4),situation:{state:npc?.state,intent:npc?.intent||null,objective:npc?.objective?.type||null},input:String(input||"")};
    try{if(this.provider?.respond)return await this.provider.respond(context);return this.localFallback(context);}catch(e){return this.localFallback(context);}
  }
  _relationship(npc,player){const id=player?.id||"player";return npc?.social?.relationships?.[id]||{value:0,state:"neutral"};}
  localFallback(context){return context.input?`${context.identity.name || "NPC"}: Olá.`:"Olá.";}
}
