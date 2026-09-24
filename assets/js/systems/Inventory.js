import {createItem,getItem} from "../data/items/index.js";

export class Inventory{
  constructor(slots=20){
    this.slots=slots;
    this.items=[];

    /*
     * BOAS PRÁTICAS — TESTES
     * O inventário de teste deve criar uma cópia independente da definição
     * do item. Nunca altere ITEMS/catalog.js apenas para facilitar testes.
     * Assim, maxStack=1 continua sendo a regra real do machado, espada etc.
     */
    this.seedTestInventory();
  }

  seedTestInventory(){
    const TEST_QTY=5;
    const testItems=[
      "wood","stone","egg","chickenMeat","rottenMeat",
      "woodenAxe","pickaxe","axe","sword","torch","potion","fence"
    ];

    for(const id of testItems){
      if(this.items.length>=this.slots)break;

      const definition=getItem(id);
      if(!definition)continue;

      /*
       * Quantidade de teste é explícita e independente de maxStack real.
       * Isso garante exatamente 5 unidades mesmo para itens não empilháveis
       * no gameplay normal.
       */
      const item=createItem(id,TEST_QTY);
      if(!item)continue;

      item.maxStack=Math.max(definition.maxStack,TEST_QTY);
      item.qty=TEST_QTY;
      this.items.push(item);
    }
  }

  qty(id){
    return this.items.find(x=>x.id===id)?.qty||0;
  }

  add(id,qty=1){
    const definition=getItem(id);
    if(!definition||qty<=0)return false;
    const item=this.items.find(x=>x.id===id);

    if(item){
      item.qty=Math.min(item.maxStack,item.qty+qty);
      return true;
    }

    if(this.items.length>=this.slots)return false;
    this.items.push(createItem(id,Math.min(qty,definition.maxStack)));
    return true;
  }

  remove(id,qty){
    const item=this.items.find(x=>x.id===id);
    if(!item||item.qty<qty)return false;
    item.qty-=qty;
    if(item.qty<=0)this.items.splice(this.items.indexOf(item),1);
    return true;
  }

  get(id){
    return this.items.find(x=>x.id===id)||null;
  }
}
