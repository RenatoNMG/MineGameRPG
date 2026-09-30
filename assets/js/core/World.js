import {Config} from "./Config.js";
import {WorldGenerator} from "../systems/WorldGenerator.js";
import {CollisionSystem} from "../systems/CollisionSystem.js";
import {WorldQuery} from "../systems/WorldQuery.js";
import {SpawnSystem} from "../systems/SpawnSystem.js";
import {AnimalSystem} from "../systems/AnimalSystem.js";
import {TransformationSystem} from "../systems/TransformationSystem.js";
import {NPC} from "../entities/NPC.js";
import {NPCPerceptionFeature} from "../features/npc/NPCPerceptionFeature.js";
import {NPCDecisionFeature} from "../features/npc/NPCDecisionFeature.js";
import {NPCActionFeature} from "../features/npc/NPCActionFeature.js";
import {NPCSocialFeature} from "../features/npc/NPCSocialFeature.js";
import {NPCDialogueAdapter} from "../features/npc/NPCDialogueAdapter.js";

export class World{
  constructor(player){
    this.width=Config.WORLD.width;this.height=Config.WORLD.height;this.player=player;
    this.trees=[];this.stones=[];this.looseWood=[];this.chickens=[];this.roosters=[];this.chicks=[];this.eggs=[];this.waterPuddles=[];
    this.droppedItems=[];this.fences=[];this.enemies=[];this.npcs=[];
    Object.assign(this,WorldGenerator.generate({player,width:this.width,height:this.height}));
    this.collision=new CollisionSystem(this);this.query=new WorldQuery(this);this.animalSystem=new AnimalSystem(this);this.spawnSystem=new SpawnSystem(this);this.transformationSystem=new TransformationSystem(this);this.npcPerception=new NPCPerceptionFeature(this);this.npcDecision=new NPCDecisionFeature();this.npcAction=new NPCActionFeature(this);this.npcSocial=new NPCSocialFeature();this.npcDialogue=new NPCDialogueAdapter();
    this.npcActions={execute:(npc,intent,target)=>{
      if(intent==="DRINK"){npc.needs.thirst=100;return{status:"completed",intent,target};}
      if(intent==="EAT"){npc.needs.hunger=100;if(target?.collected!==undefined)target.collected=true;return{status:"completed",intent,target};}
      if(intent==="FLEE")return{status:"completed",intent,target};
      return{status:"failed",intent,reason:"unsupported_action"};
    }};
    this.spawnNPC({id:"npc-001",name:"Alden",x:player.x+80,y:player.y,personality:{temperament:"calm",sociability:0.5},preferences:{food:true,water:true},speed:18});
  }
  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null,ignoreRooster=null){return this.collision.objectBlocks(x,y,r,ignoreChicken,ignoreChick,ignoreRooster);}
  waterBlocks(x,y,r=0){return this.collision.waterBlocks(x,y,r);}
  canMove(px,py,r=this.player.r,mover=null){return this.collision.canMove(px,py,r,mover);}
  movePlayer(dx,dy){this.collision.movePlayer(dx,dy);}
  findWater(range=65){return this.query.findWater(range);}
  findTree(range=58){return this.query.findTree(range);}
  findLooseWood(range=50){return this.query.findLooseWood(range);}
  findEgg(range=50){return this.query.findEgg(range);}
  findStone(range=50){return this.query.findStone(range);}
  _findNPCSpawnPosition(x,y,r=14){
    const valid=(px,py)=>px>=25&&py>=25&&px<=this.width-25&&py<=this.height-25&&Math.hypot(px-this.player.x,py-this.player.y)>=r+this.player.r+12&&!this.collision.objectBlocks(px,py,r)&&!this.npcs.some(n=>Math.hypot(px-n.x,py-n.y)<r+n.r+12);
    if(valid(x,y))return{x,y};
    for(let distance=35;distance<=220;distance+=25){for(let i=0;i<16;i++){const angle=i*Math.PI/8,px=x+Math.cos(angle)*distance,py=y+Math.sin(angle)*distance;if(valid(px,py))return{x:px,y:py};}}
    for(let i=0;i<200;i++){const px=25+Math.random()*(this.width-50),py=25+Math.random()*(this.height-50);if(valid(px,py))return{x:px,y:py};}
    return{x:Math.max(25,Math.min(this.width-25,x)),y:Math.max(25,Math.min(this.height-25,y))};
  }
  spawnNPC(data){const position=this._findNPCSpawnPosition(data.x,data.y,14);const npc=new NPC({...data,x:position.x,y:position.y,speed:Math.max(1,Number(data.speed)||18)});this.npcs.push(npc);this.npcSocial?.update(npc,this);return npc;}
  spawnEnemy(){}
  update(dt){this.trees.forEach(t=>t.update(dt));this.animalSystem.update(dt);this.transformationSystem.update(dt);this.spawnSystem.update(dt);this.npcs.forEach(npc=>{this.npcPerception.update(npc,dt);this.npcSocial.update(npc,this);this.npcDecision.update(npc);this.npcAction.update(npc,dt);npc.update(dt);});}
}
