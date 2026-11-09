import {getItem} from "../data/items/index.js";
import {getItemBehavior,useItem} from "./ItemBehaviorSystem.js";

/*
 * RESPONSABILIDADE: porta de entrada das regras de item.
 *
 * Este sistema NÃO desenha itens, NÃO monta UI e NÃO contém uma lista de
 * itens. O catálogo em data/items é a fonte dos dados; ItemBehaviorSystem é
 * a fonte dos comportamentos.
 *
 * REGRA PARA FUTURAS IAs:
 * se um novo item puder ser descrito apenas por dados, crie um arquivo em
 * data/items/ e registre-o no catalog.js. Não adicione if/else neste arquivo.
 * Só altere este sistema quando a regra geral de validação/uso mudar.
 */
export class ItemSystem{
  static validate(id){
    const item=getItem(id);
    if(!item)return {valid:false,error:"ITEM_NAO_CADASTRADO"};
    const required=["id","name","category","maxStack","visual"];
    const missing=required.filter(key=>item[key]===undefined||item[key]===null);
    if(missing.length)return {valid:false,error:"ITEM_INCOMPLETO:"+missing.join(",")};
    if(item.id!==id)return {valid:false,error:"ID_DIVERGENTE"};
    if(!Number.isInteger(item.maxStack)||item.maxStack<1)return {valid:false,error:"MAX_STACK_INVALIDO"};
    if(item.renderMode==="canvas"&&item.icon!==undefined)return {valid:false,error:"CANVAS_NAO_PODE_TER_ICON"};
    return {valid:true,item};
  }

  static canUse(item){
    if(!item)return false;
    const check=this.validate(item.id);
    if(!check.valid)return false;
    return !!getItemBehavior(item);
  }

  static use(item,player,inventory,world=null){
    if(!this.canUse(item)||inventory.qty(item.id)<=0)return false;

    // O comportamento só é confirmado como consumível depois que seu efeito
    // foi executado com sucesso. Assim um item não some se uma ação falhar.
    const used=useItem({item,player,inventory,world});
    if(!used)return false;

    return inventory.remove(item.id,1);
  }
}
