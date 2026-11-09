import { TILE_SIZE, MAP_COLUMNS, MAP_ROWS } from "./ForestTileMap.js";

function isForestPath(column, row) {
  const pathColumn = 35 + Math.round(Math.sin(row / 5) * 5);
  return Math.abs(column - pathColumn) <= 2 && row > 5 && row < MAP_ROWS - 5;
}

export function getForestObjects() {
  const objects = [];
  const safeColumn = Math.floor(MAP_COLUMNS / 2);
  const safeRow = Math.floor(MAP_ROWS / 2);

  for (let row = 2; row < MAP_ROWS - 2; row += 1) {
    for (let column = 2; column < MAP_COLUMNS - 2; column += 1) {
      if (isForestPath(column, row)) continue;
      if (Math.abs(column - safeColumn) <= 2 && Math.abs(row - safeRow) <= 2) continue;

      const value = (column * 13 + row * 29 + column * row * 3) % 19;
      const x = column * TILE_SIZE + 16;
      const y = row * TILE_SIZE + 16;

      if (value === 2 || value === 7) {
        objects.push({
          type: "tree",
          x,
          y,
          collider: { x: x - 9, y: y + 13, width: 18, height: 25 }
        });
      } else if ((column * 11 + row * 17 + column * row) % 37 === 5) {
        objects.push({
          type: "rock",
          x,
          y: y + 5,
          collider: { x: x - 12, y: y - 3, width: 24, height: 17 }
        });
      }
    }
  }
  return objects;
}