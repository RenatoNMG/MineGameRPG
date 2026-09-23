import {Config} from "./Config.js";
import {Player} from "../entities/Player.js";
import {World} from "./World.js";
import {Inventory} from "../systems/Inventory.js";
import {Crafting} from "../systems/Crafting.js?v=2.38";
import {Input} from "../systems/Input.js";
import {Renderer} from "./Renderer.js";
import {EventSystem} from "../systems/EventSystem.js";
import {GameUI} from "../systems/GameUI.js";
import {GameLoop} from "../systems/GameLoop.js";

export class Game{
  constructor(){
    this.canvas=document.querySelector("#world");
    this.player=new Player(Config.WORLD.width/2,Config.WORLD.height/2);
    this.world=new World(this.player);
    this.inventory=new Inventory(Config.INVENTORY.slots);
    this.crafting=new Crafting(this.inventory);
    this.input=new Input();
    this.renderer=new Renderer(this.canvas,this.player,this.world);
    this.particles=[];
    this.events=new EventSystem();
    this.paused=false;
    this.time=0;
    this.quickbar=[null,null,null,null,null,null];
    this.equipped=null;
    this.inventoryOpen=false;
    this.ui=new GameUI(this);
    this.loop=new GameLoop(this);
    this.ui.renderInventory();
    this.ui.renderQuickbar();
    this.loop.start();
  }
}
