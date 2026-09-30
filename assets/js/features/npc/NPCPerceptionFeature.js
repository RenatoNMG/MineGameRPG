/*
 * Responsabilidade: manter necessidades e percepção simples dos NPCs.
 * Não pertence aqui: decisão, tarefas, movimento autônomo ou diálogo.
 * API pública: update(npc,dt).
 * Dependências diretas: WorldQuery e estado do World.
 * Fluxo: NPC -> percepção/necessidades -> dados para futura decisão.
 */
export class NPCPerceptionFeature{
  constructor(world){this.world=world;}
  update(npc,dt){
    if(!npc)return;
    const safeDt=Number.isFinite(dt)?Math.max(0,dt):0;
    npc.needs.hunger=Math.max(0,npc.needs.hunger-safeDt*0.35);
    npc.needs.thirst=Math.max(0,npc.needs.thirst-safeDt*0.55);
    npc.needs.energy=Math.max(0,npc.needs.energy-safeDt*0.2);
    try{
      const range=110;
      npc.perception=this.world.query.findNearby(npc,range);
      npc.perception.dangers=this.world.query.findNearbyDangers(npc,range);
    }catch(e){
      npc.perception={objects:[],entities:[],dangers:[]};
    }
  }
}
