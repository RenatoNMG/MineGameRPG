export class PauseUI{
  constructor(game,query){this.game=game;this.q=query;}
  toggle(){if(this.game.inventoryOpen)return;this.game.paused=!this.game.paused;this.q("#paused").classList.toggle("hidden",!this.game.paused);}
}
