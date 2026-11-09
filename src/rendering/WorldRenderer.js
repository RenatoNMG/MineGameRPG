import { drawTileMap } from "../world/ForestTileMap.js";

export function drawWorld(ctx, canvas) {
  drawTileMap(ctx, canvas);

  // Elementos decorativos do cenário; colisões serão adicionadas em sistema próprio.
  const trees = [
    [90, 105], [205, 75], [390, 125], [690, 92], [850, 150],
    [145, 330], [355, 390], [760, 340], [900, 410]
  ];

  for (const [x, y] of trees) {
    // Tronco
    ctx.fillStyle = "#513b2a";
    ctx.fillRect(x - 6, y + 16, 12, 25);

    // Copa em camadas para um visual simples de floresta pixel art.
    ctx.fillStyle = "#21452d";
    ctx.fillRect(x - 25, y - 13, 50, 34);
    ctx.fillStyle = "#32643b";
    ctx.fillRect(x - 19, y - 20, 38, 29);
    ctx.fillStyle = "#477a45";
    ctx.fillRect(x - 10, y - 25, 20, 16);
  }
}
