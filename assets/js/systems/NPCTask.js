export class NPCTask{
  constructor({type,objective,target=null,priority=0,steps=[]}){
    this.type=type;
    this.objective=objective;
    this.target=target;
    this.priority=priority;
    this.steps=steps;
    this.currentStep=0;
  }
  get step(){return this.steps[this.currentStep]||null;}
  nextStep(){this.currentStep++;return this.step;}
  isComplete(){return this.currentStep>=this.steps.length;}
}
