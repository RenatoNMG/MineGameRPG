import { TILE_SIZE, MAP_COLUMNS, MAP_ROWS, WORLD_WIDTH, WORLD_HEIGHT } from "./ForestTileMap.js";
import { getForestObjects } from "./ForestObjects.js";

const forestObjects = getForestObjects();
const solidMatrix = Array.from({ length: MAP_ROWS }, () =>
  Array.from({ length: MAP_COLUMNS }, () => [])
);

for (const object of forestObjects) {
  const box = object.collider;
  const firstColumn = Math.max(0, Math.floor(box.x / TILE_SIZE));
  const lastColumn = Math.min(MAP_COLUMNS - 1, Math.floor((box.x + box.width - 0.001) / TILE_SIZE));
  const firstRow = Math.max(0, Math.floor(box.y / TILE_SIZE));
  const lastRow = Math.min(MAP_ROWS - 1, Math.floor((box.y + box.height - 0.001) / TILE_SIZE));
  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      solidMatrix[row][column].push(box);
    }
  }
}

function intersects(a, b) {
  return a.x < b.x + b.width && a.x + a.width > b.x &&
    a.y < b.y + b.height && a.y + a.height > b.y;
}

function collidesAt(player, x, y) {
  const box = {
    x: x - player.colliderWidth / 2,
    y: y - player.colliderHeight / 2 + player.colliderOffsetY,
    width: player.colliderWidth,
    height: player.colliderHeight
  };
  const firstColumn = Math.max(0, Math.floor(box.x / TILE_SIZE));
  const lastColumn = Math.min(MAP_COLUMNS - 1, Math.floor((box.x + box.width - 0.001) / TILE_SIZE));
  const firstRow = Math.max(0, Math.floor(box.y / TILE_SIZE));
  const lastRow = Math.min(MAP_ROWS - 1, Math.floor((box.y + box.height - 0.001) / TILE_SIZE));

  for (let row = firstRow; row <= lastRow; row += 1) {
    for (let column = firstColumn; column <= lastColumn; column += 1) {
      for (const obstacle of solidMatrix[row][column]) {
        if (intersects(box, obstacle)) return true;
      }
    }
  }
  return false;
}

export function moveWithCollisions(player, deltaX, deltaY) {
  const minX = player.colliderWidth / 2;
  const maxX = WORLD_WIDTH - minX;
  const minY = player.colliderHeight / 2;
  const maxY = WORLD_HEIGHT - minY;

  const nextX = Math.max(minX, Math.min(maxX, player.x + deltaX));
  if (!collidesAt(player, nextX, player.y)) player.x = nextX;

  const nextY = Math.max(minY, Math.min(maxY, player.y + deltaY));
  if (!collidesAt(player, player.x, nextY)) player.y = nextY;
}

export { forestObjects, solidMatrix };