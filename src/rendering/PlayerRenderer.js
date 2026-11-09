export function drawPlayer(ctx, player) {
  const x = Math.round(player.x);
  const y = Math.round(player.y);
  ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
  ctx.beginPath();
  ctx.ellipse(x, y + 4, 17, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#302b2a";
  ctx.fillRect(x - 10, y - 5, 7, 10);
  ctx.fillRect(x + 3, y - 5, 7, 10);
  ctx.fillStyle = "#4b6e9c";
  ctx.fillRect(x - 11, y - 17, 22, 15);
  ctx.fillStyle = "#d6b56f";
  ctx.fillRect(x - 3, y - 17, 6, 15);
  ctx.fillStyle = "#c58b55";
  ctx.fillRect(x - 16, y - 16, 5, 13);
  ctx.fillRect(x + 11, y - 16, 5, 13);
  ctx.fillStyle = "#e0b184";
  ctx.fillRect(x - 9, y - 34, 18, 17);
  ctx.fillStyle = "#59402f";
  ctx.fillRect(x - 10, y - 37, 20, 7);
  ctx.fillRect(x - 8, y - 41, 16, 5);
  ctx.fillStyle = "#292522";
  ctx.fillRect(x - 5, y - 28, 3, 3);
  ctx.fillRect(x + 3, y - 28, 3, 3);
}