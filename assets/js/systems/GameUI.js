import {HUDUI} from "./HUDUI.js";
import {QuickbarUI} from "./QuickbarUI.js";
import {InventoryUI} from "./InventoryUI.js";
import {CraftUI} from "./CraftUI.js";
import {PauseUI} from "./PauseUI.js";

export class GameUI{
  constructor(game){
    this.game=game;
    this.bind();
    this.hud=new HUDUI(game,this.q.bind(this));
    this.quickbar=new QuickbarUI(game,this.q.bind(this));
    this.inventory=new InventoryUI(game,this.q.bind(this),this.quickbar);
    this.craft=new CraftUI(game,this.q.bind(this),this.inventory);
    this.pause=new PauseUI(game,this.q.bind(this));
  }
  q(id){return document.querySelector(id);}
  bind(){
    this.q("#inventoryBtn").onclick=()=>this.toggleInventory();
    this.q("#closeInventory").onclick=()=>this.toggleInventory();
    this.q("#inventoryTab").onclick=()=>this.switchTab("inventory");
    this.q("#craftTab").onclick=()=>this.switchTab("craft");
    this.q("#pause").onclick=()=>this.togglePause();
    this.q("#resume").onclick=()=>this.togglePause();
    this.q("#save").onclick=()=>{this.q("#save").textContent="Salvamento desativado durante os testes";setTimeout(()=>this.q("#save").textContent="Salvar progresso",1500)};
    document.addEventListener("game:inventory",()=>this.toggleInventory());
    document.addEventListener("game:pause",()=>this.togglePause());
  }
  togglePause(){this.pause.toggle();}
  toggleInventory(){
    this.game.inventoryOpen=!this.game.inventoryOpen;
    this.q("#inventory").classList.toggle("hidden",!this.game.inventoryOpen);
    this.game.paused=this.game.inventoryOpen;
    if(this.game.inventoryOpen){this.switchTab("inventory");this.renderInventory();}
  }
  switchTab(tab){
    const inv=tab==="inventory";
    this.q("#inventoryGrid").classList.toggle("hidden",!inv);
    this.q("#itemInfo").classList.toggle("hidden",!inv);
    this.q("#craftPanel").classList.toggle("hidden",inv);
    this.q("#inventoryTab").classList.toggle("active",inv);
    this.q("#craftTab").classList.toggle("active",!inv);
    this.q("#inventoryTab").setAttribute("aria-selected",inv);
    this.q("#craftTab").setAttribute("aria-selected",!inv);
    if(!inv)this.renderCraft();
  }
  renderInventory(){this.inventory.render();}
  renderQuickbar(){this.quickbar.render();}
  renderCraft(){this.craft.render();}
  updateHUD(){this.hud.update();}
}
