export class MoneySystem{
  constructor(initialBalance=0){this._balance=MoneySystem._normalize(initialBalance);}
  static _normalize(amount){return Number.isInteger(amount)&&amount>=0?amount:0;}
  getBalance(){return this._balance;}
  add(amount){if(!Number.isInteger(amount)||amount<0)return false;this._balance+=amount;return true;}
  canAfford(amount){return Number.isInteger(amount)&&amount>=0&&this._balance>=amount;}
  remove(amount){if(!Number.isInteger(amount)||amount<0||!this.canAfford(amount))return false;this._balance-=amount;return true;}
  spend(amount){return this.remove(amount);}
  transfer(amount,target){if(!this.remove(amount)||!target||typeof target.add!=="function"){if(this.canAfford(0))this._balance+=amount;return false;}if(!target.add(amount)){this._balance+=amount;return false;}return true;}
}
