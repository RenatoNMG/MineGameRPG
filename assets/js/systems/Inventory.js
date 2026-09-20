export class Inventory{
  constructor(slots=20){this.slots=slots;this.items=[{id:"potion",name:"Poção de vida",icon:"🧪",qty:3,max:10},{id:"wood",name:"Madeira",icon:"🪵",qty:5,max:99}];}
  qty(id){return this.items.find(x=>x.id===id)?.qty||0;}
  add(id,name,icon,qty,max=99){let item=this.items.find(x=>x.id===id);if(item)item.qty=Math.min(item.max||max,item.qty+qty);else if(this.items.length<this.slots)this.items.push({id,name,icon,qty,max});}
  remove(id,qty){const item=this.items.find(x=>x.id===id);if(!item||item.qty<qty)return false;item.qty-=qty;if(item.qty<=0)this.items.splice(this.items.indexOf(item),1);return true;}
  get(id){return this.items.find(x=>x.id===id)||null;}
}