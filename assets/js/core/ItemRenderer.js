export class ItemRenderer{
  constructor(renderer){this.renderer=renderer;}
  /*
   * FONTE ÚNICA DOS VISUAIS DE ITENS.
   * Mundo, inventário, quickbar e mão nunca desenham um item diretamente.
   * Para item Canvas, a UI chama createItemIcon(); ela nunca troca
   * renderer.ctx por conta própria.
   *
   * NOVO ITEM CANVAS:
   * 1) data/items/<item>.js: renderMode:"canvas" + visual:"nome";
   * 2) desenhar o visual neste arquivo;
   * 3) não adicionar emoji/icon ao item;
   * 4) todas as interfaces passam automaticamente pelo mesmo desenho.
   */
  createItemIcon(item,size=40,className=""){
    const canvas=document.createElement("canvas");canvas.width=size;canvas.height=size;canvas.className=className;
    const ctx=canvas.getContext("2d"),original=this.renderer.ctx;this.renderer.ctx=ctx;
    try{this.drawDroppedItem({...item,x:size/2,y:size/2,icon:undefined});}finally{this.renderer.ctx=original;}
    return canvas;
  }
  drawFence(item){const c=this.renderer.ctx;c.save();c.translate(item.x,item.y);c.fillStyle="rgba(10,12,10,.25)";c.beginPath();c.ellipse(0,9,18,4,0,0,Math.PI*2);c.fill();c.strokeStyle="#5b3824";c.lineWidth=4;c.beginPath();c.moveTo(-13,7);c.lineTo(-13,-8);c.moveTo(0,7);c.lineTo(0,-10);c.moveTo(13,7);c.lineTo(13,-8);c.stroke();c.lineWidth=3;c.strokeStyle="#8a5b35";c.beginPath();c.moveTo(-16,-4);c.lineTo(16,-4);c.moveTo(-16,3);c.lineTo(16,3);c.stroke();c.restore();}
  drawHeld(item,bob){if(!item)return;const c=this.renderer.ctx,p=this.renderer.player,x=p.x+p.lastDir*12,y=p.y+bob-1;c.save();c.translate(x,y);c.scale(p.lastDir,1);if(item.visual==="fence")this.drawFence({x:8,y:0});else if(item.visual==="axe"){c.strokeStyle="#6b4328";c.lineWidth=4;c.beginPath();c.moveTo(-2,9);c.lineTo(10,-9);c.stroke();c.fillStyle="#bfc5bd";c.beginPath();c.moveTo(7,-12);c.lineTo(18,-9);c.lineTo(12,-2);c.lineTo(5,-5);c.closePath();c.fill();}else if(item.visual==="pickaxe"){c.strokeStyle="#704a2b";c.lineWidth=3;c.beginPath();c.moveTo(0,10);c.lineTo(8,-7);c.stroke();c.strokeStyle="#bfc7c7";c.lineWidth=5;c.beginPath();c.moveTo(5,-7);c.lineTo(16,-13);c.stroke();c.strokeStyle="#f0f2e8";c.lineWidth=2;c.beginPath();c.moveTo(6,-7);c.lineTo(16,-13);c.stroke();}else if(item.visual==="sword"){c.strokeStyle="#704a2b";c.lineWidth=3;c.beginPath();c.moveTo(0,9);c.lineTo(5,4);c.stroke();c.strokeStyle="#bfc7c7";c.lineWidth=5;c.beginPath();c.moveTo(4,3);c.lineTo(17,-12);c.stroke();c.strokeStyle="#f0f2e8";c.lineWidth=2;c.beginPath();c.moveTo(6,1);c.lineTo(17,-12);c.stroke();c.strokeStyle="#8b6b3e";c.lineWidth=3;c.beginPath();c.moveTo(0,3);c.lineTo(9,3);c.stroke();}else if(item.visual==="torch"){c.strokeStyle="#75482c";c.lineWidth=4;c.beginPath();c.moveTo(0,10);c.lineTo(8,-7);c.stroke();c.fillStyle="#d87932";c.beginPath();c.moveTo(8,-8);c.quadraticCurveTo(3,-15,9,-20);c.quadraticCurveTo(15,-14,11,-7);c.closePath();c.fill();c.fillStyle="#f4d36b";c.beginPath();c.arc(9,-12,3,0,Math.PI*2);c.fill();}else if(item.visual==="egg"){c.fillStyle="#f2ead5";c.beginPath();c.ellipse(8,0,6,8,0,0,Math.PI*2);c.fill();c.strokeStyle="#b9ad92";c.lineWidth=1;c.stroke();}else if(item.visual==="rottenMeat"){c.rotate(-.12);c.fillStyle="#704b32";c.strokeStyle="#34261c";c.lineWidth=1.2;c.beginPath();c.moveTo(-2,6);c.quadraticCurveTo(-1,-4,5,-5);c.quadraticCurveTo(12,-6,15,0);c.quadraticCurveTo(12,6,6,7);c.quadraticCurveTo(1,8,-2,6);c.closePath();c.fill();c.stroke();c.fillStyle="#9a6840";c.beginPath();c.ellipse(4,1,3,2,.2,0,Math.PI*2);c.ellipse(10,3,2.5,1.5,-.25,0,Math.PI*2);c.fill();c.fillStyle="#4e7138";c.beginPath();c.arc(1,5,1.4,0,Math.PI*2);c.arc(12,-2,1.2,0,Math.PI*2);c.fill();}else if(item.renderMode!=="canvas"&&item.icon){c.font="20px Arial";c.textAlign="center";c.textBaseline="middle";c.fillText(item.icon,8,0);}c.restore();}
  drawFencePreview(item,valid=true){const c=this.renderer.ctx;c.save();c.translate(item.x,item.y);c.globalAlpha=.5;c.fillStyle=valid?"#73c66b":"#d95b5b";c.beginPath();c.ellipse(0,9,20,5,0,0,Math.PI*2);c.fill();c.strokeStyle=valid?"#b8f0ae":"#ffaaaa";c.lineWidth=4;c.beginPath();c.moveTo(-13,7);c.lineTo(-13,-8);c.moveTo(0,7);c.lineTo(0,-10);c.moveTo(13,7);c.lineTo(13,-8);c.stroke();c.lineWidth=3;c.beginPath();c.moveTo(-16,-4);c.lineTo(16,-4);c.moveTo(-16,3);c.lineTo(16,3);c.stroke();c.globalAlpha=.95;c.font="bold 9px Arial";c.textAlign="center";c.fillStyle=valid?"#d8ffd2":"#ffd8d8";c.fillText(valid?"SOLTAR":"BLOQUEADO",0,22);c.restore();}
  drawDroppedItem(item){
    if(item.visual==="fence"){this.drawFence({x:item.x,y:item.y});return;}
    if(item.visual==="wood"){this.renderer.drawWood({x:item.x,y:item.y,variant:item.variant??1,collected:false});return;}
    if(item.visual==="stone"){this.renderer.drawStone({x:item.x,y:item.y,type:item.type??1,radius:14,loose:true,collected:false});return;}
    if(item.visual==="egg"){this.renderer.drawEgg({x:item.x,y:item.y});return;}
    const c=this.renderer.ctx;c.save();c.translate(item.x,item.y);c.fillStyle="rgba(10,12,10,.3)";c.beginPath();c.ellipse(0,8,12,4,0,0,Math.PI*2);c.fill();
    if(item.visual==="rottenMeat"){c.rotate(-.12);c.fillStyle="#704b32";c.strokeStyle="#34261c";c.lineWidth=1.5;c.beginPath();c.moveTo(-12,3);c.quadraticCurveTo(-10,-7,-2,-8);c.quadraticCurveTo(7,-11,13,-2);c.quadraticCurveTo(10,7,2,8);c.quadraticCurveTo(-7,10,-12,3);c.closePath();c.fill();c.stroke();c.fillStyle="#9a6840";c.beginPath();c.ellipse(-4,-2,5,3,.2,0,Math.PI*2);c.ellipse(5,1,4,2.5,-.25,0,Math.PI*2);c.fill();c.fillStyle="#4e7138";c.beginPath();c.arc(-7,3,2.2,0,Math.PI*2);c.arc(7,-4,1.8,0,Math.PI*2);c.fill();c.strokeStyle="#b28a55";c.lineWidth=1;c.beginPath();c.moveTo(-9,-1);c.lineTo(-5,2);c.moveTo(2,-5);c.lineTo(6,-2);c.stroke();c.restore();return;}
    if(item.renderMode==="canvas"){c.fillStyle="#d95b5b";c.strokeStyle="#fff";c.lineWidth=2;c.strokeRect(-10,-10,20,20);c.font="bold 9px Arial";c.textAlign="center";c.textBaseline="middle";c.fillText("?",0,0);c.restore();return;}
    c.font="22px Arial";c.textAlign="center";c.textBaseline="middle";c.lineWidth=3;c.strokeStyle="rgba(16,20,15,.9)";c.strokeText(item.icon||"•",0,0);c.fillStyle="#fff";c.fillText(item.icon||"•",0,0);c.restore();
  }
}