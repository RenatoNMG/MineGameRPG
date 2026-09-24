import {Renderer} from "./Renderer.js";

// Registro central dos visuais dos itens. Novos itens devem declarar apenas o visual
// que usam no catálogo; a lógica de renderização fica concentrada aqui.
const visuals=Object.freeze({
  wood:(renderer,item)=>renderer.drawWood({x:item.x,y:item.y,variant:item.variant??1,collected:false}),
  stone:(renderer,item)=>renderer.drawStone({x:item.x,y:item.y,type:item.type??1,radius:14,loose:true,collected:false}),
  egg:(renderer,item)=>renderer.drawEgg({x:item.x,y:item.y}),
  rottenMeat:(renderer,item)=>renderer.drawRottenMeat(item),
});

export function registerItemVisual(id,draw){
  if(!id||typeof draw!=="function")throw new Error("Visual de item inválido: "+id);
  // Mantemos o registro extensível sem permitir sobrescrever a referência exportada.
  runtimeVisuals[id]=draw;
}

const runtimeVisuals={...visuals};
const originalDropped=Renderer.prototype.drawDroppedItem;

Renderer.prototype.drawRottenMeat=function(item){
  const c=this.ctx;c.save();c.translate(item.x,item.y);c.fillStyle="rgba(10,12,10,.3)";c.beginPath();c.ellipse(0,8,12,4,0,0,Math.PI*2);c.fill();c.rotate(-.12);c.fillStyle="#704b32";c.strokeStyle="#34261c";c.lineWidth=1.5;c.beginPath();c.moveTo(-12,3);c.quadraticCurveTo(-10,-7,-2,-8);c.quadraticCurveTo(7,-11,13,-2);c.quadraticCurveTo(10,7,2,8);c.quadraticCurveTo(-7,10,-12,3);c.closePath();c.fill();c.stroke();c.fillStyle="#9a6840";c.beginPath();c.ellipse(-4,-2,5,3,.2,0,Math.PI*2);c.ellipse(5,1,4,2.5,-.25,0,Math.PI*2);c.fill();c.fillStyle="#4e7138";c.beginPath();c.arc(-7,3,2.2,0,Math.PI*2);c.arc(7,-4,1.8,0,Math.PI*2);c.fill();c.strokeStyle="#b28a55";c.lineWidth=1;c.beginPath();c.moveTo(-9,-1);c.lineTo(-5,2);c.moveTo(2,-5);c.lineTo(6,-2);c.stroke();c.restore();
};

Renderer.prototype.drawFence=function(item){const c=this.ctx;c.save();c.translate(item.x,item.y);c.fillStyle="rgba(10,12,10,.25)";c.beginPath();c.ellipse(0,9,18,4,0,0,Math.PI*2);c.fill();c.strokeStyle="#5b3824";c.lineWidth=4;c.beginPath();c.moveTo(-13,7);c.lineTo(-13,-8);c.moveTo(0,7);c.lineTo(0,-10);c.moveTo(13,7);c.lineTo(13,-8);c.stroke();c.lineWidth=3;c.strokeStyle="#8a5b35";c.beginPath();c.moveTo(-16,-4);c.lineTo(16,-4);c.moveTo(-16,3);c.lineTo(16,3);c.stroke();c.restore();};

Renderer.prototype.drawFencePreview=function(item,valid=true){const c=this.ctx;c.save();c.translate(item.x,item.y);c.globalAlpha=.48;c.fillStyle=valid?"#73c66b":"#d95b5b";c.beginPath();c.ellipse(0,9,20,5,0,0,Math.PI*2);c.fill();c.strokeStyle=valid?"#9be28f":"#ff8b8b";c.lineWidth=4;c.beginPath();c.moveTo(-13,7);c.lineTo(-13,-8);c.moveTo(0,7);c.lineTo(0,-10);c.moveTo(13,7);c.lineTo(13,-8);c.stroke();c.lineWidth=3;c.beginPath();c.moveTo(-16,-4);c.lineTo(16,-4);c.moveTo(-16,3);c.lineTo(16,3);c.stroke();c.globalAlpha=.9;c.font="bold 9px Arial";c.textAlign="center";c.fillStyle=valid?"#bff2b8":"#ffd0d0";c.fillText(valid?"SOLTAR":"BLOQUEADO",0,22);c.restore();};

Renderer.prototype.drawDroppedItem=function(item){
  const draw=runtimeVisuals[item?.visual];
  if(draw){draw(this,item);return;}
  originalDropped.call(this,item);
};

export const ItemVisuals=runtimeVisuals;
