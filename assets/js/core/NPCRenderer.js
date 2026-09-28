export class NPCRenderer{
  constructor(renderer){this.renderer=renderer;}
  drawNPC(npc){
    const c=this.renderer.ctx,phase=Math.sin(this.renderer.time*10),moving=Math.abs(npc.moveX||0)+Math.abs(npc.moveY||0)>0;
    const bob=moving?Math.abs(phase)*1.2:0,leg=moving?phase*2:0;
    c.save();c.translate(Math.floor(npc.x),Math.floor(npc.y-bob));
    c.fillStyle="#10160f";c.globalAlpha=.55;c.beginPath();c.ellipse(0,14,10,3,0,0,Math.PI*2);c.fill();c.globalAlpha=1;
    c.fillStyle="#8f6248";c.fillRect(-6,5,5,9+leg*.15);c.fillRect(1,5,5,9-leg*.15);
    c.fillStyle="#304a38";c.fillRect(-8,-7,16,14);
    c.fillStyle="#c58b62";c.beginPath();c.arc(0,-13,7,0,Math.PI*2);c.fill();
    c.fillStyle="#4a3027";c.beginPath();c.arc(0,-16,7,Math.PI,Math.PI*2);c.fill();c.restore();
  }
}
