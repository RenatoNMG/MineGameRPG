import {Config} from "./Config.js?v=216";
import {Player} from "../entities/Player.js?v=216";
import {World} from "./World.js?v=216";
import {Inventory} from "../systems/Inventory.js?v=216";
import {Crafting} from "../systems/Crafting.js?v=216";
import {Input} from "../systems/Input.js?v=216";
import {Renderer} from "./Renderer.js?v=216";
import {EventSystem} from "../systems/EventSystem.js?v=216";
import {GameUI} from "../systems/GameUI.js?v=216";
import {GameLoop} from "../systems/GameLoop.js?v=216";

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
