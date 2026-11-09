function overlaps(a, b) {
  return a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y;
}

function getPlayerCollider(player) {
  return {
    x: player.x - player.colliderWidth / 2,
    y: player.y - player.colliderHeight / 2 + 4,
    width: player.colliderWidth,
    height: player.colliderHeight
  };
}

export function moveWithCollisions(player, deltaX, deltaY, obstacles, worldWidth, worldHeight) {
  const startX = player.x;
  const startY = player.y;

  player.x = Math.max(player.colliderWidth / 2,
    Math.min(worldWidth - player.colliderWidth / 2, player.x + deltaX));
  let collider = getPlayerCollider(player);
  for (const obstacle of obstacles) {
    if (overlaps(collider, obstacle.collider)) {
      if (deltaX > 0) player.x = obstacle.collider.x - player.colliderWidth / 2;
      else if (deltaX < 0) player.x = obstacle.collider.x + obstacle.collider.width + player.colliderWidth / 2;
      collider = getPlayerCollider(player);
    }
  }

  player.y = Math.max(player.colliderHeight / 2,
    Math.min(worldHeight - player.colliderHeight / 2, player.y + deltaY));
  collider = getPlayerCollider(player);
  for (const obstacle of obstacles) {
    if (overlaps(collider, obstacle.collider)) {
      if (deltaY > 0) player.y = obstacle.collider.y - obstacle.collider.height / 2 + player.colliderHeight / 2 - 4;
      else if (deltaY < 0) player.y = obstacle.collider.y + obstacle.collider.height + player.colliderHeight / 2 - 4;
      collider = getPlayerCollider(player);
    }
  }

  return player.x !== startX || player.y !== startY;
}