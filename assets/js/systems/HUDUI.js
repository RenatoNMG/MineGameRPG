export class HUDUI{
  constructor(game,query){this.game=game;this.q=query;}
  update(){
    const game=this.game,q=this.q;
    q("#hp").style.width=Math.max(0,game.player.hp/game.player.max*100)+"%";
    q("#hunger").style.width=Math.max(0,game.player.hunger)+"%";
    q("#thirst").style.width=Math.max(0,game.player.thirst)+"%";
    q("#xp").style.width=game.player.xp/game.player.next*100+"%";
    q("#level").textContent="Lv."+game.player.level;
    q("#gold").textContent=game.player.gold;
    q("#kills").textContent=game.player.kills;
    q("#enemyCount").textContent=game.world.enemies.length;
    q("#timer").textContent=new Date(game.time*1000).toISOString().slice(14,19);
    q("#zone").textContent=game.player.level>=5?"MINA ABANDONADA":game.player.level>=3?"RUÍNAS DE ELDOR":"FLORESTA SOMBRIA";
  }
}
