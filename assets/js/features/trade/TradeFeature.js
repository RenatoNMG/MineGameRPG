import {getItem} from "../../data/items/index.js";
const PRICES=Object.freeze({wood:5,stone:3,egg:8,chickenMeat:12,rottenMeat:2,woodenAxe:20,pickaxe:35,axe:45,sword:60,potion:25,torch:4});
export class TradeFeature{
 constructor({inventory,money}){this.inventory=inventory;this.money=money;this.npc=null;this.root=null;this._build();}
 isMerchant(npc){return !!npc?.trade?.profession&&Array.isArray(npc.trade.stock);}
 interact(npc){if(!this.isMerchant(npc))return false;this.npc=npc;this._render();return true;}
 close(){if(this.root)this.root.classList.add("hidden");this.npc=null;}
 buy(itemId){const npc=this.npc,entry=npc?.trade?.stock?.find(x=>x.id===itemId);if(!entry||entry.qty<1)return false;const price=Number(entry.price);if(!Number.isInteger(price)||price<0||!this.money.canAfford(price)||!this.inventory.add(itemId,1))return false;if(!this.money.spend(price)){this.inventory.remove(itemId,1);return false;}entry.qty--;this._render();return true;}
 _build(){this.root=document.createElement("div");this.root.id="tradePanel";this.root.className="trade-panel hidden";this.root.innerHTML='<div class="trade-box"><div class="trade-head"><b id="tradeTitle">COMÉRCIO</b><button id="tradeClose">×</button></div><div id="tradeMoney"></div><div id="tradeItems"></div></div>';document.querySelector("#game")?.appendChild(this.root);this.root.querySelector("#tradeClose").onclick=()=>this.close();}
 _render(){const npc=this.npc;if(!npc)return;this.root.querySelector("#tradeTitle").textContent=`COMÉRCIO — ${npc.name}`;this.root.querySelector("#tradeMoney").textContent=`◆ Dinheiro: ${this.money.getBalance()}`;const box=this.root.querySelector("#tradeItems");box.innerHTML="";for(const entry of npc.trade.stock){const item=getItem(entry.id);if(!item)continue;const row=document.createElement("div");row.className="trade-item";row.innerHTML=`<span>${item.visual||"◆"} ${item.name}</span><span>${entry.qty} unidades</span><b>$${entry.price}</b><button>COMPRAR</button>`;row.querySelector("button").onclick=()=>this.buy(entry.id);box.appendChild(row);}this.root.classList.remove("hidden");}
 static createTrade(profession,ids){return {profession,stock:ids.map(id=>({id,qty:5,price:PRICES[id]??10}))};}
}
