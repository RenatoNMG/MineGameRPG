import {createItem,getItem} from "../data/items/index.js";
export class Inventory{
  constructor(slots=20){this.slots=slots;this.items=[];this.seedTestInventory();}
  seedTestInventory(){
    /* Regra de teste: até 5 unidades por item, respeitando maxStack do catálogo. */
    const TEST_QTY=5;
    const testItems=["wood","stone","egg","chickenMeat","rottenMeat","woodenAxe","pickaxe","axe","sword","torch","potion","fence","fenceGate"];
    for(const id of testItems){if(this.items.length>=this.slots)break;const definition=getItem(id);if(!definition)continue;const item=createItem(id,Math.min(TEST_QTY,definition.maxStack));if(item)this.items.push(item);}
  }
  qty(id){return this.items.find(x=>x.id===id)?.qty||0;}
  add(id,qty=1){const definition=getItem(id);if(!definition||qty<=0)return false;const item=this.items.find(x=>x.id===id);if(item){item.qty=Math.min(item.maxStack,item.qty+qty);return true;}if(this.items.length>=this.slots)return false;this.items.push(createItem(id,Math.min(qty,definition.maxStack)));return true;}
  remove(id,qty){const item=this.items.find(x=>x.id===id);if(!item||item.qty<qty)return false;item.qty-=qty;if(item.qty<=0)this.items.splice(this.items.indexOf(item),1);return true;}
  get(id){return this.items.find(x=>x.id===id)||null;}
}
