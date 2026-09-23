import {Config} from "../core/Config.js";
import {ToolSystem} from "./ToolSystem.js";

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
      if(tree.hp===0)particles.push({x:tree.x,y:tree.y-45*tree.s,t:1,text:"🌳 ÁRVORE DERRUBADA"});
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
      if(stone.hp===0)particles.push({x:stone.x,y:stone.y-38*stone.s,t:1,text:"🪨 PEDRA QUEBRADA"});
      return {type:"stoneHit"};
    }

    return null;
  }
}
