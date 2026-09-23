import {Config} from "../core/Config.js";
import {ToolSystem} from "./ToolSystem.js";
import {Stone} from "../entities/Stone.js";

export class ResourceInteraction{
  static interact({player,world,inventory,equipped,particles}){
    const tree=world.findTree();
    if(tree){
      if(!ToolSystem.canUse(equipped,"axe")){
        particles.push({x:player.x,y:player.y-35,t:.7,text:"EQUIPE UM MACHADO"});
        return {type:"toolRequired",tool:"axe"};
      }
      player.attackCd=Config.COMBAT.attackCooldown;
      tree.hit();
      particles.push({x:tree.x,y:tree.y-35*tree.s,t:.5,text:"🪓 -1"});
      if(tree.hp===0){
        tree.drop=null;
        const offsets=[[42,0],[-42,0],[14,38],[-14,-38],[0,48],[52,18],[-52,-18],[26,-44],[-26,44],[0,-52]];
        let spawned=0;
        for(const [ox,oy] of offsets){
          if(spawned>=5)break;
          const x=tree.x+ox,y=tree.y+oy;
          if(x<30||x>world.width-30||y<30||y>world.height-30)continue;
          if(world.objectBlocks(x,y,12))continue;
          if(world.looseWood.some(w=>!w.collected&&Math.hypot(w.x-x,w.y-y)<22))continue;
          world.looseWood.push({x,y,collected:false,variant:(tree.t+spawned)%3});
          spawned++;
        }
        particles.push({x:tree.x,y:tree.y-45*tree.s,t:1,text:"+5 MADEIRAS PEQUENAS"});
      }
      return {type:"treeHit"};
    }

    const wood=world.findLooseWood();
    if(wood){
      wood.collected=true;
      player.attackCd=Config.COMBAT.attackCooldown;
      inventory.add("wood",1);
      particles.push({x:wood.x,y:wood.y-18,t:.8,text:"+1 MADEIRA"});
      return {type:"woodCollected"};
    }

    const egg=world.findEgg();
    if(egg){
      if(inventory.add("egg",1)){
        const eggIndex=world.eggs.indexOf(egg);
        if(eggIndex>=0)world.eggs.splice(eggIndex,1);
        egg.collected=true;
        player.attackCd=Config.COMBAT.attackCooldown;
        particles.push({x:egg.x,y:egg.y-18,t:.8,text:"+1 OVO"});
        return {type:"eggCollected"};
      }
      return {type:"inventoryFull"};
    }

    const stone=world.findStone();
    if(stone){
      if(stone.loose){
        player.attackCd=Config.COMBAT.attackCooldown;
        stone.collectLoose();
        inventory.add("stone",1);
        particles.push({x:stone.x,y:stone.y-28,t:.8,text:"+1 PEDRA"});
        return {type:"stoneCollected"};
      }
      if(!ToolSystem.canUse(equipped,"pickaxe")){
        particles.push({x:player.x,y:player.y-35,t:.7,text:"EQUIPE UMA PICARETA"});
        return {type:"toolRequired",tool:"pickaxe"};
      }
      player.attackCd=Config.COMBAT.attackCooldown;
      stone.hit();
      particles.push({x:stone.x,y:stone.y-28*stone.s,t:.5,text:"⛏️ -1"});
      if(stone.hp===0){
        stone.collected=true;
        stone.hp=-1;

        const offsets=[
          [38,0],[-38,0],[12,36],[-12,-36],[0,44],
          [48,16],[-48,-16],[24,-42],[-24,42],[0,-48]
        ];
        let spawned=0;
        for(const [ox,oy] of offsets){
          if(spawned>=5)break;
          const x=stone.x+ox,y=stone.y+oy;
          if(x<28||x>world.width-28||y<28||y>world.height-28)continue;
          if(world.objectBlocks(x,y,14))continue;
          const loose=new Stone(x,y,.75,stone.type);
          loose.loose=true;
          world.stones.push(loose);
          spawned++;
        }
        particles.push({x:stone.x,y:stone.y-45*stone.s,t:1,text:"+5 PEDRAS PEQUENAS"});
      }
      return {type:"stoneHit"};
    }

    return null;
  }
}
