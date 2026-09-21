import {Config} from "./Config.js";import {Tree} from "../entities/Tree.js";import {Stone} from "../entities/Stone.js";export class World{
 constructor(player){this.width=Config.WORLD.width;this.height=Config.WORLD.height;this.player=player;this.trees=[];this.stones=[];this.enemies=[];this.spawn=0;let seed=9127;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};for(let i=0;i<Config.TREE.count;i++){let x=70+rand()*(this.width-140),y=70+rand()*(this.height-140);if(Math.hypot(x-player.x,y-player.y)<190){i--;continue;}this.trees.push(new Tree(x,y,.8+rand()*.65,i%3,rand()<.5?-1:1));}
 // Pedras: algumas ficam próximas da área inicial para o jogador perceber imediatamente o novo recurso.
 const addStone=(x,y,s,type)=>this.stones.push(new Stone(x,y,s,type));
 const near=[[-150,-90],[-80,120],[125,-105],[175,90],[-185,55],[210,-145],[70,175],[-170,-165]];
 near.forEach(([dx,dy],i)=>{
   let x=player.x+dx,y=player.y+dy;
   if(this.trees.some(t=>Math.hypot(t.x-x,t.y-y)<75)){
     x=player.x+dx+(dx>=0?55:-55);
     y=player.y+dy+(dy>=0?45:-45);
   }
   addStone(x,y,.95+(i%3)*.15,i%3);
 });
 for(let i=8;i<Config.STONE.count;i++){let x=50+rand()*(this.width-100),y=50+rand()*(this.height-100);if(Math.hypot(x-player.x,y-player.y)<130||this.trees.some(t=>Math.hypot(t.x-x,t.y-y)<55)||this.stones.some(s=>Math.hypot(s.x-x,s.y-y)<35)){i--;continue;}addStone(x,y,.65+rand()*.7,i%3);}}
 canMove(px,py){return !this.trees.some(t=>t.blocks(px,py,this.player.r))&&!this.stones.some(s=>s.blocks(px,py,this.player.r));}
 movePlayer(dx,dy){const nx=this.player.x+dx,ny=this.player.y+dy;if(this.canMove(nx,this.player.y))this.player.x=nx;if(this.canMove(this.player.x,ny))this.player.y=ny;this.player.x=Math.max(25,Math.min(this.width-25,this.player.x));this.player.y=Math.max(25,Math.min(this.height-25,this.player.y));}
 spawnEnemy(){const a=Math.random()*Math.PI*2,d=480+Math.random()*420;let x=this.player.x+Math.cos(a)*d,y=this.player.y+Math.sin(a)*d;x=Math.max(35,Math.min(this.width-35,x));y=Math.max(35,Math.min(this.height-35,y));this.enemies.push(new Enemy(x,y,this.player.level));}
 update(dt){this.trees.forEach(t=>t.update(dt));this.enemies.forEach(e=>e.update(dt,this.player));this.enemies=this.enemies.filter(e=>!e.dead);this.spawn-=dt;if(this.spawn<=0&&this.enemies.length<35){this.spawnEnemy();this.spawn=Math.max(.35,1.4-this.player.level*.08);}}
 findTree(range=95){let found=null,dist=range;for(const t of this.trees){if(t.state!=="standing")continue;const d=Math.hypot(t.x-this.player.x,t.y+7*t.s-this.player.y);if(d<dist){dist=d;found=t;}}return found;}
 findStone(range=75){let found=null,dist=range;for(const s of this.stones){if(s.collected)continue;const d=Math.hypot(s.x-this.player.x,s.y-this.player.y);if(d<dist){dist=d;found=s;}}return found;}
 collectDrops(inventory,particles){for(const t of this.trees){if(t.state==="fallen"&&t.drop&&Math.hypot(this.player.x-t.drop.x,this.player.y-t.drop.y)<30){const q=t.drop.qty;inventory.add("wood","Madeira","🪵",q);particles.push({x:t.drop.x,y:t.drop.y,t:1,text:"+"+q+" MADEIRA"});t.drop=null;}}for(const s of this.stones){if(s.collected&&s.hp===0&&Math.hypot(this.player.x-s.x,this.player.y-s.y)<32){const q=2+Math.floor(Math.random()*3);inventory.add("stone","Pedra","🪨",q);particles.push({x:s.x,y:s.y,t:1,text:"+"+q+" PEDRA"});s.hp=-1;}}}
}