export const TILE_SIZE = 32;
export const MAP_COLUMNS = 75;
export const MAP_ROWS = 57;
export const WORLD_WIDTH = MAP_COLUMNS * TILE_SIZE;
export const WORLD_HEIGHT = MAP_ROWS * TILE_SIZE;

function tileAt(column, row) {
  const pathColumn = 35 + Math.round(Math.sin(row / 5) * 5);
  if (Math.abs(column - pathColumn) <= 2 && row > 5 && row < MAP_ROWS - 5) return 2;
  const noise = (column * 17 + row * 31 + column * row * 7) % 23;
  if (noise === 0 || noise === 1) return 3;
  if (noise === 4 || noise === 8 || noise === 13) return 1;
  return 0;
}
function drawGrass(ctx, x, y, dark) {
  ctx.fillStyle = dark ? "#315437" : "#38613d";
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = dark ? "#3b6541" : "#416d45";
  ctx.fillRect(x + 5, y + 7, 3, 3);
  ctx.fillRect(x + 21, y + 19, 2, 2);
}
function drawPath(ctx, x, y) {
  ctx.fillStyle = "#756b4b";
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = "#8a7c55";
  ctx.fillRect(x + 6, y + 8, 7, 3);
  ctx.fillRect(x + 20, y + 23, 5, 2);
}
function drawFlowers(ctx, x, y) {
  drawGrass(ctx, x, y, false);
  ctx.fillStyle = "#e2d28a";
  ctx.fillRect(x + 13, y + 12, 4, 4);
  ctx.fillStyle = "#d7e5bd";
  ctx.fillRect(x + 14, y + 10, 2, 2);
}
export function drawTileMap(ctx, camera, canvas) {
  const firstColumn = Math.max(0, Math.floor(camera.x / TILE_SIZE));
  const firstRow = Math.max(0, Math.floor(camera.y / TILE_SIZE));
  const lastColumn = Math.min(MAP_COLUMNS - 1, Math.ceil((camera.x + canvas.width) / TILE_SIZE));
  const lastRow = Math.min(MAP_ROWS - 1, Math.ceil((camera.y + canvas.height) / TILE_SIZE));
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      const x = column * TILE_SIZE;
      const y = row * TILE_SIZE;
      const tile = tileAt(column, row);
      if (tile === 2) drawPath(ctx, x, y);
      else if (tile === 3) drawFlowers(ctx, x, y);
      else drawGrass(ctx, x, y, tile === 1);
    }
  }
}