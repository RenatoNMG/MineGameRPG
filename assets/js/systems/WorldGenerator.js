import {Config} from "../core/Config.js";
import {Tree} from "../entities/Tree.js";
import {Stone} from "../entities/Stone.js";
import {Chicken} from "../entities/Chicken.js";

export class WorldGenerator{
  static generate({player,width,height}){
    const trees=[],stones=[],looseWood=[],chickens=[],waterPuddles=[];
    let seed=9127;
    const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296};
    const addStone=(x,y,s,type,loose=false)=>{const stone=new Stone(x,y,s,type);stone.loose=loose;stones.push(stone);};
    for(let i=0;i<Config.TREE.count;i++){
      let x=70+rand()*(width-140),y=70+rand()*(height-140),s=.8+rand()*.65;
      if(Math.hypot(x-player.x,y-player.y)<190||trees.some(t=>Math.hypot(t.x-x,(t.y+7*t.s)-y)<15*t.s+15)){i--;continue;}
      trees.push(new Tree(x,y,s,i%3,rand()<.5?-1:1));
    }
    const objectFree=(x,y,r)=>{
      if(Math.hypot(x-player.x,y-player.y)<r+35)return false;
      if(trees.some(t=>Math.hypot(t.x-x,(t.y+7*t.s)-y)<r+15*t.s))return false;
      if(stones.some(s=>!s.collected&&Math.hypot(s.x-x,s.y-y)<r+s.radius+8))return false;
      if(looseWood.some(o=>!o.collected&&Math.hypot(o.x-x,o.y-y)<r+18))return false;
      if(chickens.some(ch=>Math.hypot(ch.x-x,ch.y-y)<r+20))return false;
      if(waterPuddles.some(w=>{const c=Math.cos(-(w.angle||0)),s=Math.sin(-(w.angle||0)),dx=x-w.x,dy=y-w.y,lx=dx*c-dy*s,ly=dx*s+dy*c;const rx=Math.max(1,w.rx+r+1),ry=Math.max(1,w.ry+r+1);return (lx*lx)/(rx*rx)+(ly*ly)/(ry*ry)<1;}))return false;
      return true;
    };
    const near=[[-150,-90],[-80,120],[125,-105],[175,90],[-185,55],[210,-145],[70,175],[-170,-165]];
    near.forEach(([dx,dy],i)=>{let s=.95+(i%3)*.15,x=player.x+dx,y=player.y+dy,tries=0;while(!objectFree(x,y,18*s)&&tries++<12){x=player.x+dx+(dx>=0?1:-1)*(55+tries*12);y=player.y+dy+(dy>=0?1:-1)*(45+tries*10);}if(objectFree(x,y,18*s))addStone(x,y,s,i%3,i<3);});
    for(let i=0;i<7;i++){let x=50+rand()*(width-100),y=50+rand()*(height-100);if(!objectFree(x,y,18)){i--;continue;}looseWood.push({x,y,collected:false,variant:i%3});}
    for(let i=0;i<3;i++){let x=90+rand()*(width-180),y=90+rand()*(height-180);if(!objectFree(x,y,13)){i--;continue;}chickens.push(new Chicken(x,y,rand()<.5?-1:1));}
    for(let i=0;i<5;i++){
      let x=80+rand()*(width-160),y=80+rand()*(height-160),rx=58+rand()*38,ry=34+rand()*24,angle=(rand()-.5)*.7,treeGap=Math.max(rx,ry)+42;
      if(Math.hypot(x-player.x,y-player.y)<170||trees.some(t=>Math.hypot(t.x-x,t.y-y)<treeGap)||stones.some(s=>Math.hypot(s.x-x,s.y-y)<Math.max(rx,ry)+12)||looseWood.some(o=>!o.collected&&Math.hypot(o.x-x,o.y-y)<Math.max(rx,ry)+18)||chickens.some(ch=>Math.hypot(ch.x-x,ch.y-y)<Math.max(rx,ry)+20)){i--;continue;}
      waterPuddles.push({x,y,rx,ry,angle});
    }
    for(let i=8;i<Config.STONE.count;i++){let x=50+rand()*(width-100),y=50+rand()*(height-100),s=.65+rand()*.7;if(!objectFree(x,y,18+18*s)){i--;continue;}addStone(x,y,s,i%3);}
    return {trees,stones,looseWood,chickens,chicks:[],waterPuddles};
  }
}