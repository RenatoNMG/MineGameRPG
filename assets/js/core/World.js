import {Config} from "./Config.js";
import {WorldGenerator} from "../systems/WorldGenerator.js";
import {CollisionSystem} from "../systems/CollisionSystem.js";
import {WorldQuery} from "../systems/WorldQuery.js";
import {SpawnSystem} from "../systems/SpawnSystem.js";
import {NPCNeedsSystem} from "../systems/NPCNeedsSystem.js";
import {NPCDecisionSystem} from "../systems/NPCDecisionSystem.js";
import {NPCTaskSystem} from "../systems/NPCTaskSystem.js";
import {NPCActionSystem} from "../systems/NPCActionSystem.js";
import {NPCInventorySystem} from "../systems/NPCInventorySystem.js";
import {NPCMemorySystem} from "../systems/NPCMemorySystem.js";
import {NPCSystem} from "../systems/NPCSystem.js";
import {NPCBehaviorSystem} from "../systems/NPCBehaviorSystem.js";
import {AnimalSystem} from "../systems/AnimalSystem.js";
import {TransformationSystem} from "../systems/TransformationSystem.js";

export class World{
  constructor(player){
    this.width=Config.WORLD.width;this.height=Config.WORLD.height;this.player=player;
    this.trees=[];this.stones=[];this.looseWood=[];this.npcs=[];this.chickens=[];this.roosters=[];this.chicks=[];this.eggs=[];this.waterPuddles=[];
    this.droppedItems=[];this.fences=[];this.constructionRequests=[];this.enemies=[];
    Object.assign(this,WorldGenerator.generate({player,width:this.width,height:this.height}));

    // Ordem de inicialização: primeiro todos os serviços do NPC, depois os NPCs.
    // Isso evita criar entidades que dependem de serviços ainda não montados.
    this.collision=new CollisionSystem(this);
    this.query=new WorldQuery(this);
    this.animalSystem=new AnimalSystem(this);
    this.npcInventorySystem=new NPCInventorySystem(this);
    this.npcMemorySystem=new NPCMemorySystem(this);
    this.npcNeedsSystem=new NPCNeedsSystem(this);
    this.npcActionSystem=new NPCActionSystem(this);
    this.npcTaskSystem=new NPCTaskSystem(this);
    this.npcBehaviorSystem=new NPCBehaviorSystem(this);
    this.npcDecisionSystem=new NPCDecisionSystem(this);
    this.npcSystem=new NPCSystem(this);
    this.transformationSystem=new TransformationSystem(this);
    this.spawnSystem=new SpawnSystem(this);
    this.spawnSystem.spawnInitialNPCs();
  }

  addNPC(npc){
    if(!npc)return null;
    this.npcs.push(npc);
    this.npcInventorySystem.initializeNPC(npc);
    this.npcMemorySystem.initialize(npc);
    this.npcNeedsSystem.initialize(npc);
    this.npcBehaviorSystem.setState(npc,"idle");
    return npc;
  }

  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null,ignoreRooster=null,ignoreNPC=null){return this.collision.objectBlocks(x,y,r,ignoreChicken,ignoreChick,ignoreRooster,ignoreNPC);}
  waterBlocks(x,y,r=0){return this.collision.waterBlocks(x,y,r);}
  canMove(px,py){return this.collision.canMove(px,py);}
  movePlayer(dx,dy){this.collision.movePlayer(dx,dy);}
  findWater(range=65){return this.query.findWater(range);}
  findTree(range=58){return this.query.findTree(range);}
  findLooseWood(range=50){return this.query.findLooseWood(range);}
  findEgg(range=50){return this.query.findEgg(range);}
  findStone(range=50){return this.query.findStone(range);}

  requestConstruction({itemId,x,y,orientation="horizontal"}){
    const request={itemId,x,y,orientation,assignedTo:null};
    this.constructionRequests.push(request);
    return request;
  }

  completeConstructionRequest(request){
    const index=this.constructionRequests.indexOf(request);
    if(index>=0)this.constructionRequests.splice(index,1);
  }

  releaseConstructionRequest(request){
    if(request)this.constructionRequests.find(item=>item===request)?.assignedTo=null;
  }

  spawnEnemy(){}

  update(dt){
    this.trees.forEach(t=>t.update(dt));
    this.animalSystem.update(dt);
    this.npcNeedsSystem.update(dt);
    this.npcMemorySystem.update(dt);
    this.npcDecisionSystem.update(dt);
    this.npcTaskSystem.update(dt);
    this.npcBehaviorSystem.update(dt);
    this.npcSystem.update(dt);
    this.transformationSystem.update(dt);
    this.spawnSystem.update(dt);
  }
}
