// Sistema de camadas do personagem.
// Cada parte pode ser trocada sem alterar movimentação, inventário ou mundo.
export class CharacterLayerSystem {
  constructor() {
    this.layers = {
      body: true,
      hair: true,
      shirt: 'default',
      pants: 'default',
      shoes: 'default',
      accessory: null
    };
  }

  setLayer(name, value) {
    if (!(name in this.layers)) return false;
    this.layers[name] = value;
    return true;
  }

  getLayer(name) {
    return this.layers[name];
  }

  getState() {
    return { ...this.layers };
  }

  reset() {
    this.layers = {
      body: true,
      hair: true,
      shirt: 'default',
      pants: 'default',
      shoes: 'default',
      accessory: null
    };
  }
}
