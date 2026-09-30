/*
 * Responsabilidade: transformar estado/percepção do NPC em uma intenção simples.
 * Não pertence aqui: executar ações, mover, pathfinding, diálogo ou memória.
 * API pública: update(npc).
 * Dependências diretas: estado de necessidades e percepção do NPC.
 * Fluxo: percepção/necessidades -> decisão -> intenção.
 */
export class NPCDecisionFeature{
  update(npc){
    if(!npc)return null;
    try{
      const needs=npc.needs||{};
      const perception=npc.perception||{};
      const dangers=Array.isArray(perception.dangers)?perception.dangers:[];
      let intent="EXPLORE";
      if(dangers.length>0)intent="FLEE";
      else if(needs.thirst<=25)intent="DRINK";
      else if(needs.hunger<=25)intent="EAT";
      else if(needs.energy<=25)intent="REST";
      npc.intent=intent;
      return intent;
    }catch(e){
      npc.intent="EXPLORE";
      return npc.intent;
    }
  }
}
