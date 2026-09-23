export class RoosterCarrySystem{
  static toggle({player,world,particles}){
    const carried=world.roosters.find(ro=>ro.carried);
    if(carried){
      const dropX=player.x+player.lastDir*28,dropY=player.y+8;
      if(world.objectBlocks(dropX,dropY,15,null,null)){particles.push({x:player.x,y:player.y-35,t:.7,text:"NÃO HÁ ESPAÇO PARA SOLTAR"});return {type:"roosterCarryBlocked"};}
      carried.carried=false;carried.x=dropX;carried.y=dropY;carried.dir=player.lastDir||1;
      particles.push({x:carried.x,y:carried.y-25,t:.8,text:"GALO SOLTO"});return {type:"roosterDropped"};
    }
    const rooster=world.roosters.find(ro=>Math.hypot(ro.x-player.x,ro.y-player.y)<58);
    if(!rooster)return null;
    rooster.carried=true;rooster.matingTimer=0;rooster.matingCooldown=0;
    rooster.x=player.x+player.lastDir*18;rooster.y=player.y-24;rooster.dir=player.lastDir||1;
    particles.push({x:player.x,y:player.y-45,t:.8,text:"GALO CARREGADO"});return {type:"roosterCarried"};
  }
  static update({player,world}){
    const rooster=world.roosters.find(ro=>ro.carried);if(!rooster)return;
    rooster.x=player.x+player.lastDir*18;rooster.y=player.y-24;rooster.dir=player.lastDir||1;
  }
}
