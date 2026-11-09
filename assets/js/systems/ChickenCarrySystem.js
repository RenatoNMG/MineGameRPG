export class ChickenCarrySystem{
  static toggle({player,world,particles}){
    const carried=world.chickens.find(ch=>ch.carried);
    if(carried){
      const dropX=player.x+player.lastDir*28;
      const dropY=player.y+8;
      if(world.objectBlocks(dropX,dropY,13,carried)){
        particles.push({x:player.x,y:player.y-35,t:.7,text:"NÃO HÁ ESPAÇO PARA SOLTAR"});
        return {type:"carryBlocked"};
      }
      carried.carried=false;
      carried.x=dropX;
      carried.y=dropY;
      carried.dir=player.lastDir||1;
      particles.push({x:carried.x,y:carried.y-25,t:.8,text:"GALINHA SOLTA"});
      return {type:"chickenDropped"};
    }
    const chicken=world.chickens.find(ch=>Math.hypot(ch.x-player.x,ch.y-player.y)<58);
    if(!chicken)return null;
    chicken.carried=true;
    chicken.x=player.x+player.lastDir*18;
    chicken.y=player.y-24;
    chicken.dir=player.lastDir||1;
    particles.push({x:player.x,y:player.y-45,t:.8,text:"GALINHA CARREGADA"});
    return {type:"chickenCarried"};
  }
  static update({player,world}){
    const chicken=world.chickens.find(ch=>ch.carried);
    if(!chicken)return;
    chicken.x=player.x+player.lastDir*18;
    chicken.y=player.y-24;
    chicken.dir=player.lastDir||1;
  }
}