import {WaterInteraction} from "./WaterInteraction.js";
import {ResourceInteraction} from "./ResourceInteraction.js";

export class EnvironmentInteraction{
  static interact(context){
    const water=WaterInteraction.interact(context);
    if(water)return water;
    const resource=ResourceInteraction.interact(context);
    if(resource)return resource;
    return null;
  }
}
