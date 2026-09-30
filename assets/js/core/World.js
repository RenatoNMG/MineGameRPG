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

export class World{
  constructor(player){
    this.width=Config.WORLD.width;this.height=Config.WORLD.height;this.player=player;
    this.trees=[];this.stones=[];this.looseWood=[];this.chickens=[];this.roosters=[];this.chicks=[];this.eggs=[];this.waterPuddles=[];
    this.droppedItems=[];this.fences=[];this.enemies=[];this.npcs=[];
    Object.assign(this,WorldGenerator.generate({player,width:this.width,height:this.height}));
    this.collision=new CollisionSystem(this);this.query=new WorldQuery(this);this.animalSystem=new AnimalSystem(this);this.spawnSystem=new SpawnSystem(this);this.transformationSystem=new TransformationSystem(this);this.npcPerception=new NPCPerceptionFeature(this);this.npcDecision=new NPCDecisionFeature();this.npcAction=new NPCActionFeature(this);
    this.npcActions={execute:(npc,intent,target)=>{
      if(intent==="DRINK"){npc.needs.thirst=100;return{status:"completed",intent,target};}
      if(intent==="EAT"){npc.needs.hunger=100;if(target?.collected!==undefined)target.collected=true;return{status:"completed",intent,target};}
      if(intent==="FLEE"){return{status:"completed",intent,target};}
      return{status:"failed",intent,reason:"unsupported_action"};
    }};
    this.spawnNPC({id:"npc-001",name:"Alden",x:player.x+80,y:player.y});
  }
  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null,ignoreRooster=null){return this.collision.objectBlocks(x,y,r,ignoreChicken,ignoreChick,ignoreRooster);}
  waterBlocks(x,y,r=0){return this.collision.waterBlocks(x,y,r);}
  canMove(px,py){return this.collision.canMove(px,py);}
  movePlayer(dx,dy){this.collision.movePlayer(dx,dy);}
  findWater(range=65){return this.query.findWater(range);}
  findTree(range=58){return this.query.findTree(range);}
  findLooseWood(range=50){return this.query.findLooseWood(range);}
  findEgg(range=50){return this.query.findEgg(range);}
  findStone(range=50){return this.query.findStone(range);}
  spawnNPC(data){const npc=new NPC(data);this.npcs.push(npc);return npc;}
  spawnEnemy(){}
  update(dt){this.trees.forEach(t=>t.update(dt));this.animalSystem.update(dt);this.transformationSystem.update(dt);this.spawnSystem.update(dt);this.npcs.forEach(npc=>{this.npcPerception.update(npc,dt);this.npcDecision.update(npc);this.npcAction.update(npc,dt);npc.update(dt);});}
}
