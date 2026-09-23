import {DropSystem} from "./DropSystem.js";
import {ItemInteraction} from "./ItemInteraction.js";
import {EnvironmentInteraction} from "./EnvironmentInteraction.js";
import {CombatInteraction} from "./CombatInteraction.js";

export class InteractionSystem{
  static interact(context){
    const dropped=DropSystem.collectItem(context);
    if(dropped)return {type:"itemCollected"};
    const item=ItemInteraction.interact(context);
    if(item)return item;
    const environment=EnvironmentInteraction.interact(context);
    if(environment)return environment;
    const combat=CombatInteraction.interact(context);
    if(combat)return combat;
    return {type:"none"};
  }
}