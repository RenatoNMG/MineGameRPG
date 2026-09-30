export class WorldQuery{
  constructor(world){this.world=world;}
  findWater(range=65){const w=this.world;let found=null,dist=range;for(const water of w.waterPuddles){const d=Math.hypot(water.x-w.player.x,water.y-w.player.y);if(d<dist){dist=d;found=water;}}return found;}
  findTree(range=58){const w=this.world;let found=null,dist=range;for(const t of w.trees){if(t.state!=="standing")continue;const d=Math.hypot(t.x-w.player.x,t.y+7*t.s-w.player.y);if(d<dist){dist=d;found=t;}}return found;}
  findLooseWood(range=50){const w=this.world;let found=null,dist=range;for(const wood of w.looseWood){if(wood.collected)continue;const d=Math.hypot(wood.x-w.player.x,wood.y-w.player.y);if(d<dist){dist=d;found=wood;}}return found;}
  findEgg(range=50){const w=this.world;let found=null,dist=range;for(const egg of w.eggs){if(egg.collected)continue;const d=Math.hypot(egg.x-w.player.x,egg.y-w.player.y);if(d<dist){dist=d;found=egg;}}return found;}
  findStone(range=50){const w=this.world;let found=null,dist=range;for(const s of w.stones){if(s.collected)continue;const d=Math.hypot(s.x-w.player.x,s.y-w.player.y);if(d<dist){dist=d;found=s;}}return found;}
  findNearby(origin,range=110){
    const w=this.world,near=(items,type)=>items.filter(o=>o&&Math.hypot(o.x-origin.x,o.y-origin.y)<=range).map(o=>({type,entity:o}));
    return {objects:[...near(w.trees,"tree"),...near(w.stones,"stone"),...near(w.looseWood.filter(o=>!o.collected),"wood"),...near(w.waterPuddles,"water"),...near(w.eggs.filter(o=>!o.collected),"egg"),...near(w.fences,"fence")],entities:[...near(w.chickens,"chicken"),...near(w.chicks,"chick"),...near(w.roosters,"rooster"),...near(w.npcs.filter(o=>o!==origin),"npc"),...near([w.player],"player")]};
  }
  findNearbyDangers(origin,range=110){const w=this.world;return (w.enemies||[]).filter(e=>Math.hypot(e.x-origin.x,e.y-origin.y)<=range).map(e=>({type:"enemy",entity:e}));}
}
