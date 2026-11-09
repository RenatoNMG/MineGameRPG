import { drawTileMap, TILE_SIZE, MAP_COLUMNS, MAP_ROWS } from "../world/ForestTileMap.js";
function hasTree(column, row) {
  const value = (column * 13 + row * 29 + column * row * 3) % 19;
  return value === 2 || value === 7;
}
function drawTree(ctx, x, y) {
  ctx.fillStyle = "#513b2a";
  ctx.fillRect(x - 6, y + 16, 12, 25);
  ctx.fillStyle = "#21452d";
  ctx.fillRect(x - 25, y - 13, 50, 34);
  ctx.fillStyle = "#32643b";
  ctx.fillRect(x - 19, y - 20, 38, 29);
  ctx.fillStyle = "#477a45";
  ctx.fillRect(x - 10, y - 25, 20, 16);
}
export function drawWorld(ctx, camera, canvas) {
  drawTileMap(ctx, camera, canvas);
  const firstColumn = Math.max(0, Math.floor(camera.x / TILE_SIZE) - 1);
  const firstRow = Math.max(0, Math.floor(camera.y / TILE_SIZE) - 1);
  const lastColumn = Math.min(MAP_COLUMNS - 1, Math.ceil((camera.x + canvas.width) / TILE_SIZE) + 1);
  const lastRow = Math.min(MAP_ROWS - 1, Math.ceil((camera.y + canvas.height) / TILE_SIZE) + 1);
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      if (hasTree(column, row)) drawTree(ctx, column * TILE_SIZE + 16, row * TILE_SIZE + 16);
    }
  }
}