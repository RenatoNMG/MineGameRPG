import {createItem,getItem} from "../data/items/index.js";

export class Inventory{
  constructor(slots=20){
    this.slots=slots;
    this.items=[];

    /*
     * BOAS PRÁTICAS — INVENTÁRIO DE TESTE
     * 1. O teste altera somente o estado inicial; não alteramos maxStack
     *    dos itens reais para forçar quantidades de teste.
     * 2. Itens não empilháveis no jogo continuam com maxStack=1. Aqui usamos
     *    createItem diretamente para permitir 5 unidades apenas durante testes.
     * 3. Toda atualização deve preservar as regras reais de gameplay e evitar
     *    gambiarras que contaminem os dados dos itens.
     * 4. Ao adicionar uma mecânica, validar a cadeia: dados -> sistema -> UI
     *    -> renderização -> interação.
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
      const definition=getItem(id);
      if(!definition||this.items.length>=this.slots)continue;
      const item=createItem(id,TEST_QTY);
      if(item)this.items.push(item);
    }
  }

  qty(id){
    return this.items.find(x=>x.id===id)?.qty||0;
  }

  add(id,qty=1){
    const definition=getItem(id);
    if(!definition||qty<=0)return false;
    let item=this.items.find(x=>x.id===id);
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
