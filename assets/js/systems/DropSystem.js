import {Config} from "../core/Config.js";
import {FencePlacement} from "./FencePlacement.js";

export class DropSystem{
  static dropItem({player,world,inventory,equipped,particles}){
    if(!equipped)return {ok:false,type:"noItem"};

    const held=inventory.get(equipped.id);
    if(!held||held.qty<1)return {ok:false,type:"empty"};

    const placement=equipped.id==="fence"?FencePlacement.getPosition({player,world}):{x:player.x+player.lastDir*28,y:player.y+8};
    const x=placement.x;
    const y=placement.y;
    if(world.objectBlocks(x,y,6)){
      particles.push({x:player.x,y:player.y-35,t:.7,text:"NÃO HÁ ESPAÇO PARA SOLTAR"});
      return {ok:false,type:"blocked"};
    }

    if(!inventory.remove(held.id,1))return {ok:false,type:"removeFailed"};

    world.droppedItems.push({...held,qty:1,x,y});
    player.attackCd=Config.COMBAT.attackCooldown;
    particles.push({x,y:y-18,t:.8,text:"ITEM SOLTO"});

    return {
      ok:true,
      type:"dropped",
      itemId:held.id,
      empty:inventory.qty(held.id)<=0
    };
  }

  static collectItem({player,world,inventory,particles}){
    let found=null;
    let dist=50;
    for(const item of world.droppedItems){
      const d=Math.hypot(item.x-player.x,item.y-player.y);
      if(d<dist){
        dist=d;
        found=item;
      }
    }

    if(!found)return false;
    if(!inventory.add(found.id,1))return false;

    found.qty--;
    particles.push({x:found.x,y:found.y-18,t:.8,text:"+1 "+(found.name||found.id).toUpperCase()});

    if(found.qty<=0){
      const index=world.droppedItems.indexOf(found);
      if(index>=0)world.droppedItems.splice(index,1);
    }

    return true;
  }

  static collectResourceDrops({player,world,inventory,particles}){
    for(const tree of world.trees){
      if(tree.state==="fallen"&&tree.drop&&Math.hypot(player.x-tree.drop.x,player.y-tree.drop.y)<30){
        const qty=tree.drop.qty;
        if(inventory.add("wood",qty)){
          particles.push({x:tree.drop.x,y:tree.drop.y,t:1,text:"+"+qty+" MADEIRA"});
          tree.drop=null;
        }
      }
    }

    for(const stone of world.stones){
      if(stone.collected&&stone.hp===0&&Math.hypot(player.x-stone.x,player.y-stone.y)<32){
        const qty=5;
        if(inventory.add("stone",qty)){
          particles.push({x:stone.x,y:stone.y,t:1,text:"+5 PEDRAS"});
          stone.hp=-1;
        }
      }
    }
  }
}
