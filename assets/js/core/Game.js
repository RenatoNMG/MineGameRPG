import {Config} from "./Config.js";
import {Player} from "../entities/Player.js";
import {World} from "./World.js";
import {Inventory} from "../systems/Inventory.js";
import {Crafting} from "../systems/Crafting.js";
import {Input} from "../systems/Input.js";
import {Renderer} from "./Renderer.js";
import {EventSystem} from "../systems/EventSystem.js";
import {GameUI} from "../systems/GameUI.js";
import {GameLoop} from "../systems/GameLoop.js";

/*
 * ORQUESTRADOR PRINCIPAL.
 *
 * REGRA PARA FUTURAS IAs: Game.js deve apenas montar os módulos e manter
 * referências entre eles. Não adicionar aqui regras de itens, receitas,
 * desenho, colisão, IA de animais ou manipulação direta do DOM.
 */
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
