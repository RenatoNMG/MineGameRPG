import {Config} from "./Config.js";
import {WorldGenerator} from "../systems/WorldGenerator.js";
import {CollisionSystem} from "../systems/CollisionSystem.js";
import {WorldQuery} from "../systems/WorldQuery.js";
import {SpawnSystem} from "../systems/SpawnSystem.js";
import {AnimalSystem} from "../systems/AnimalSystem.js";
import {TransformationSystem} from "../systems/TransformationSystem.js";

export class World{
  constructor(player){
    this.width=Config.WORLD.width;this.height=Config.WORLD.height;this.player=player;
    this.trees=[];this.stones=[];this.looseWood=[];this.chickens=[];this.roosters=[];this.chicks=[];this.eggs=[];this.waterPuddles=[];
    /* Drops são coletáveis; fences são objetos físicos permanentes. */
    this.droppedItems=[];this.fences=[];this.enemies=[];
    Object.assign(this,WorldGenerator.generate({player,width:this.width,height:this.height}));
    this.collision=new CollisionSystem(this);this.query=new WorldQuery(this);this.animalSystem=new AnimalSystem(this);this.spawnSystem=new SpawnSystem(this);this.transformationSystem=new TransformationSystem(this);
  }
  objectBlocks(x,y,r=0,ignoreChicken=null,ignoreChick=null){return this.collision.objectBlocks(x,y,r,ignoreChicken,ignoreChick);}
  waterBlocks(x,y,r=0){return this.collision.waterBlocks(x,y,r);}
  canMove(px,py){return this.collision.canMove(px,py);}
  movePlayer(dx,dy){this.collision.movePlayer(dx,dy);}
  findWater(range=65){return this.query.findWater(range);}
  findTree(range=58){return this.query.findTree(range);}
  findLooseWood(range=50){return this.query.findLooseWood(range);}
  findEgg(range=50){return this.query.findEgg(range);}
  findStone(range=50){return this.query.findStone(range);}
  spawnEnemy(){}
  update(dt){this.trees.forEach(t=>t.update(dt));this.animalSystem.update(dt);this.transformationSystem.update(dt);this.spawnSystem.update(dt);}
}