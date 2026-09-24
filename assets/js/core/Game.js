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
import {FenceFeature} from "../features/fence/FenceFeature.js";
import {PlayerFeature} from "../features/player/PlayerFeature.js";
import {InteractionFeature} from "../features/interaction/InteractionFeature.js";
import {DropFeature} from "../features/drops/DropFeature.js";

/*
 * ORQUESTRADOR PRINCIPAL.
 *
 * Game.js somente monta as caixas e injeta dependências.
 * REGRA PARA FUTURAS IAs: não colocar aqui regras de gameplay, itens,
 * animais, colisão, renderização ou DOM.
 */
export class Game{
  constructor(){
    this.canvas=document.querySelector("#world");
    this.player=new Player(Config.WORLD.width/2,Config.WORLD.height/2);
    this.world=new World(this.player);
    this.inventory=new Inventory(Config.INVENTORY.slots);
    this.crafting=new Crafting(this.inventory);
    this.input=new Input();
    this.particles=[];
    this.events=new EventSystem();
    this.paused=false;
    this.time=0;
    this.quickbar=[null,null,null,null,null,null];
    this.equipped=null;
    this.inventoryOpen=false;

    /* Infraestrutura + caixas de funcionalidade. */
    this.playerFeature=new PlayerFeature({player:this.player,input:this.input,world:this.world});
    this.fenceFeature=new FenceFeature({
      input:this.input,player:this.player,world:this.world,
      particles:this.particles,getEquipped:()=>this.equipped
    });
    this.interactionFeature=new InteractionFeature({
      player:this.player,world:this.world,inventory:this.inventory,input:this.input,
      particles:this.particles,getEquipped:()=>this.equipped,
      setEquipped:item=>{this.equipped=item;},
      onInventoryChanged:()=>this.ui?.renderInventory(),
      events:this.events
    });
    this.dropFeature=new DropFeature({
      player:this.player,world:this.world,inventory:this.inventory,input:this.input,
      particles:this.particles,getEquipped:()=>this.equipped,
      setEquipped:item=>{this.equipped=item;},
      getPlacement:item=>this.fenceFeature.getDropPlacement(item),
      onInventoryChanged:()=>this.ui?.renderInventory(),
      events:this.events
    });

    /* FenceFeature precisa existir antes do Renderer. */
    this.renderer=new Renderer(this.canvas,this.player,this.world,this.fenceFeature);
    this.ui=new GameUI(this);
    this.loop=new GameLoop(this);
    this.ui.renderInventory();
    this.ui.renderQuickbar();
    this.loop.start();
  }
}
