const TILE_SIZE = 32;

// 30 x 17 tiles: 0 = grama, 1 = grama escura, 2 = terra batida, 3 = flores.
const FOREST_MAP = [
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0],
  [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],
  [0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0],
  [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
  [0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0],
  [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0],
  [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0],
  [0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
  [0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2],
  [2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
];

function drawGrass(ctx, x, y, variation) {
  ctx.fillStyle = variation ? "#315437" : "#38613d";
  ctx.fillRect(x, y, TILE_SIZE, TILE_SIZE);
  ctx.fillStyle = variation ? "#3b6541" : "#416d45";
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
  drawGrass(ctx, x, y, 0);
  ctx.fillStyle = "#e2d28a";
  ctx.fillRect(x + 13, y + 12, 4, 4);
  ctx.fillStyle = "#d7e5bd";
  ctx.fillRect(x + 14, y + 10, 2, 2);
}

export function drawTileMap(ctx, canvas) {
  const rows = Math.ceil(canvas.height / TILE_SIZE);
  const columns = Math.ceil(canvas.width / TILE_SIZE);

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const tile = FOREST_MAP[row]?.[column] ?? 0;
      const x = column * TILE_SIZE;
      const y = row * TILE_SIZE;

      if (tile === 2) drawPath(ctx, x, y);
      else if (tile === 3) drawFlowers(ctx, x, y);
      else drawGrass(ctx, x, y, tile === 1);
    }
  }
}
