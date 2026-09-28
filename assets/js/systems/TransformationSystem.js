import {createItem} from "../data/items/index.js";
import {Chicken} from "../entities/Chicken.js";
import {Rooster} from "../entities/Rooster.js";
import {Chick} from "../entities/Chick.js";

export class TransformationSystem{
  constructor(world){
    this.world=world;
    this.eggHatchTime=90;
    this.chickGrowthTime=90;
    this.chickenLifespan=180;
    this.meatRotTime=120;
    this.rottenMeatLife=120;
  }
  update(dt){this.updateEggs(dt);this.updateChicks(dt);this.updateChickens(dt);this.updateRoosters(dt);this.updateMeat(dt);}
  updateEggs(dt){const w=this.world;for(let i=w.eggs.length-1;i>=0;i--){const egg=w.eggs[i];egg.age=(egg.age||0)+dt;if(egg.age>=this.eggHatchTime){w.chicks.push(new Chick(egg.x,egg.y,Math.random()<.5?-1:1));w.eggs.splice(i,1);}}}
  updateChicks(dt){
    const w=this.world;
    for(let i=w.chicks.length-1;i>=0;i--){
      const chick=w.chicks[i];
      chick.age=(chick.age||0)+dt;
      if(chick.age<this.chickGrowthTime)continue;

      /*
       * O sexo é decidido uma única vez no momento da transformação.
       * Criamos exatamente uma entidade adulta e removemos o pintinho na
       * mesma operação, evitando qualquer estado intermediário duplicado.
       */
      const isChicken=Math.random()<.5;
      const Adult=isChicken?Chicken:Rooster;
      const radius=isChicken?13:15;
      const candidates=[
        {x:chick.x,y:chick.y},
        {x:chick.x+18,y:chick.y},
        {x:chick.x-18,y:chick.y},
        {x:chick.x,y:chick.y+18},
        {x:chick.x,y:chick.y-18}
      ];
      const position=candidates.find(({x,y})=>{
        const px=Math.max(30,Math.min(w.width-30,x));
        const py=Math.max(30,Math.min(w.height-30,y));
        return !w.objectBlocks(px,py,radius,null,chick,null);
      })||{x:Math.max(30,Math.min(w.width-30,chick.x)),y:Math.max(30,Math.min(w.height-30,chick.y))};

      const adult=new Adult(position.x,position.y,chick.dir);
      if(isChicken)w.chickens.push(adult);
      else w.roosters.push(adult);
      w.chicks.splice(i,1);
    }
  }
  createChickenMeatDrop(x,y){
    const meat=createItem("chickenMeat",1);
    if(!meat)return null;
    return {...meat,x,y,dropAge:0};
  }
  updateChickens(dt){
    const w=this.world;
    for(let i=w.chickens.length-1;i>=0;i--){
      const chicken=w.chickens[i];
      chicken.age=(chicken.age||0)+dt;
      if(chicken.age<this.chickenLifespan)continue;

      /* Um animal adulto gera exatamente um drop antes de ser removido. */
      const meat=this.createChickenMeatDrop(chicken.x,chicken.y);
      if(meat)w.droppedItems.push(meat);
      w.chickens.splice(i,1);
    }
  }
  updateRoosters(dt){
    const w=this.world;
    for(let i=w.roosters.length-1;i>=0;i--){
      const rooster=w.roosters[i];
      rooster.age=(rooster.age||0)+dt;
      if(rooster.age<this.chickenLifespan)continue;

      /* Mesmo ciclo para o galo: uma morte, uma carne. */
      const meat=this.createChickenMeatDrop(rooster.x,rooster.y);
      if(meat)w.droppedItems.push(meat);
      w.roosters.splice(i,1);
    }
  }
  updateMeat(dt){
    const w=this.world;
    for(let i=w.droppedItems.length-1;i>=0;i--){
      const item=w.droppedItems[i];
      if(item.id!=="chickenMeat"&&item.id!=="rottenMeat")continue;
      item.dropAge=(item.dropAge||0)+dt;

      if(item.id==="chickenMeat"&&item.dropAge>=this.meatRotTime){
        /*
         * A carne catalogada é transformada na mesma entidade do mundo.
         * Depois da troca de id, esta condição não pode executar novamente.
         */
        const rotten=createItem("rottenMeat",item.qty||1);
        if(!rotten)continue;
        Object.assign(item,rotten,{x:item.x,y:item.y,dropAge:0});
      }else if(item.id==="rottenMeat"&&item.dropAge>=this.rottenMeatLife){
        w.droppedItems.splice(i,1);
      }
    }
  }
}