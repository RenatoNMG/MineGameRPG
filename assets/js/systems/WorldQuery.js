export class WorldQuery{
  constructor(world){this.world=world;}

  findWater(range=65,origin=this.world.player){
    const w=this.world;
    let found=null,dist=range;
    for(const water of w.waterPuddles){
      const d=Math.hypot(water.x-origin.x,water.y-origin.y);
      if(d<dist){dist=d;found=water;}
    }
    return found;
  }

  findFood(origin=this.world.player,range=Infinity){
    const w=this.world;
    let found=null,dist=range;

    for(const egg of w.eggs){
      if(egg.collected)continue;
      const d=Math.hypot(egg.x-origin.x,egg.y-origin.y);
      if(d<dist){
        dist=d;
        found={kind:"egg",object:egg};
      }
    }

    for(const item of w.droppedItems){
      if(item.id!=="chickenMeat"&&item.id!=="rottenMeat")continue;
      const d=Math.hypot(item.x-origin.x,item.y-origin.y);
      if(d<dist){
        dist=d;
        found={kind:"droppedFood",object:item};
      }
    }

    return found;
  }

  findTree(range=58,origin=this.world.player){
    const w=this.world;
    let found=null,dist=range;
    for(const t of w.trees){
      if(t.state!=="standing")continue;
      const d=Math.hypot(t.x-origin.x,t.y+7*t.s-origin.y);
      if(d<dist){dist=d;found=t;}
    }
    return found;
  }

  findLooseWood(range=50,origin=this.world.player){
    const w=this.world;
    let found=null,dist=range;
    for(const wood of w.looseWood){
      if(wood.collected)continue;
      const d=Math.hypot(wood.x-origin.x,wood.y-origin.y);
      if(d<dist){dist=d;found=wood;}
    }
    return found;
  }

  findEgg(range=50){const w=this.world;let found=null,dist=range;for(const egg of w.eggs){if(egg.collected)continue;const d=Math.hypot(egg.x-w.player.x,egg.y-w.player.y);if(d<dist){dist=d;found=egg;}}return found;}
  findStone(range=50){const w=this.world;let found=null,dist=range;for(const s of w.stones){if(s.collected)continue;const d=Math.hypot(s.x-w.player.x,s.y-w.player.y);if(d<dist){dist=d;found=s;}}return found;}
}
