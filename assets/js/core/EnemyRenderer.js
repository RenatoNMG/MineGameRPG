export class EnemyRenderer{
 constructor(renderer){this.renderer=renderer;}
 drawEnemy(e){const c=this.renderer.ctx;c.fillStyle="#191510";c.beginPath();c.arc(e.x,e.y,e.r+3,0,7);c.fill();c.fillStyle="#a8584e";c.beginPath();c.arc(e.x,e.y,e.r,0,7);c.fill();c.fillStyle="#ddd";c.fillRect(e.x-5,e.y-3,3,3);c.fillRect(e.x+2,e.y-3,3,3);c.fillStyle="#38211f";c.fillRect(e.x-e.r,e.y-e.r-8,e.r*2,3);c.fillStyle="#b96a60";c.fillRect(e.x-e.r,e.y-e.r-8,e.r*2*(e.hp/e.max),3);}
}
