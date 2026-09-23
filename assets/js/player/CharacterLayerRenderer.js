// Renderizador das camadas do personagem.
// A ordem é fixa para evitar que uma roupa cubra outra camada indevidamente.
export class CharacterLayerRenderer {
  constructor(ctx) {
    this.ctx = ctx;
  }

  drawFront(x, y, bob, layers, sprite) {
    const c = this.ctx;
    // Compatibilidade: a arte frontal atual continua sendo usada como base.
    // As camadas ficam disponíveis para substituição progressiva.
    if (sprite?.complete && sprite.naturalWidth) {
      c.drawImage(sprite, Math.floor(x - 24), Math.floor(y - 32 + bob), 48, 48);
    }
  }

  drawSide(x, y, bob, layers, drawBase) {
    // A arte lateral atual continua isolada do sistema principal.
    drawBase(x, y, bob, layers);
  }
}
