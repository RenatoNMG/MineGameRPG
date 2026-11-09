import {getItem} from "../data/items/index.js";

export class ToolSystem{
  static getToolType(item){
    if(!item)return null;
    const definition=getItem(item.id);
    return definition?.tool||null;
  }

  static canUse(item,toolType){
    return this.getToolType(item)===toolType;
  }

  static validate(item){
    const toolType=this.getToolType(item);
    if(!toolType)return {valid:false,error:"ITEM_NAO_E_UMA_FERRAMENTA"};
    return {valid:true,toolType};
  }
}
