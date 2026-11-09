export function drawWorld(ctx, canvas) {
  ctx.fillStyle = "#355b3b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let y = 18; y < canvas.height; y += 48) {
    for (let x = 18; x < canvas.width; x += 48) {
      ctx.fillStyle = ((x + y) / 48) % 2 === 0 ? "#3b6541" : "#315437";
      ctx.fillRect(x, y, 3, 3);
      ctx.fillRect(x + 15, y + 21, 2, 2);
    }
  }

  // Trilha inicial atravessando a parte inferior do mapa.
  ctx.fillStyle = "#756b4b";
  ctx.fillRect(0, canvas.height - 72, canvas.width, 72);
  ctx.fillStyle = "#8a7c55";
  for (let x = 12; x < canvas.width; x += 54) {
    ctx.fillRect(x, canvas.height - 38, 22, 3);
  }

  // Árvores decorativas para dar escala e profundidade ao cenário.
  const trees = [
    [90, 105], [205, 75], [390, 125], [690, 92], [850, 150],
    [145, 330], [355, 390], [760, 340], [900, 410]
  ];
  for (const [x, y] of trees) {
    ctx.fillStyle = "#513b2a";
    ctx.fillRect(x - 5, y + 18, 10, 22);
    ctx.fillStyle = "#21452d";
    ctx.beginPath();
    ctx.arc(x, y + 8, 25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#32643b";
    ctx.beginPath();
    ctx.arc(x - 8, y, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#477a45";
    ctx.beginPath();
    ctx.arc(x + 8, y + 2, 13, 0, Math.PI * 2);
    ctx.fill();
  }
}
