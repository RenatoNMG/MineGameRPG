(() => {
  "use strict";

  const canvas = document.getElementById("game-canvas");
  if (!(canvas instanceof HTMLCanvasElement)) {
    console.error("MineGame RPG: elemento #game-canvas não encontrado.");
    return;
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("MineGame RPG: não foi possível inicializar o contexto 2D.");
    return;
  }

  const player = {
    x: Math.floor(canvas.width / 2),
    y: Math.floor(canvas.height / 2) + 35,
    width: 32,
    height: 40,
    speed: 220,
    hp: 100,
    maxHp: 100,
    mana: 40,
    maxMana: 40
  };

  const keys = new Set();
  const controls = new Set([
    "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    "w", "a", "s", "d"
  ]);

  window.addEventListener("keydown", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    if (!controls.has(key)) return;
    event.preventDefault();
    keys.add(key);
  });

  window.addEventListener("keyup", (event) => {
    const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
    keys.delete(key);
  });

  window.addEventListener("blur", () => keys.clear());

  function updatePlayer(deltaSeconds) {
    let moveX = 0;
    let moveY = 0;

    if (keys.has("ArrowLeft") || keys.has("a")) moveX -= 1;
    if (keys.has("ArrowRight") || keys.has("d")) moveX += 1;
    if (keys.has("ArrowUp") || keys.has("w")) moveY -= 1;
    if (keys.has("ArrowDown") || keys.has("s")) moveY += 1;

    // Normaliza a diagonal para manter a mesma velocidade em todas as direções.
    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY);
      moveX /= length;
      moveY /= length;
    }

    const halfWidth = player.width / 2;
    const halfHeight = player.height / 2;
    player.x += moveX * player.speed * deltaSeconds;
    player.y += moveY * player.speed * deltaSeconds;

    // Mantém o sprite inteiramente dentro da área do canvas.
    player.x = Math.max(halfWidth, Math.min(canvas.width - halfWidth, player.x));
    player.y = Math.max(halfHeight, Math.min(canvas.height - halfHeight, player.y));
  }

  function drawStatus() {
    const hpValue = document.getElementById("hp-value");
    const manaValue = document.getElementById("mana-value");
    const hpBar = document.getElementById("hp-bar");
    const manaBar = document.getElementById("mana-bar");

    if (hpValue) hpValue.textContent = `${player.hp} / ${player.maxHp}`;
    if (manaValue) manaValue.textContent = `${player.mana} / ${player.maxMana}`;
    if (hpBar) hpBar.style.width = `${(player.hp / player.maxHp) * 100}%`;
    if (manaBar) manaBar.style.width = `${(player.mana / player.maxMana) * 100}%`;
  }

  function drawWorld() {
    ctx.fillStyle = "#355b3b";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let y = 18; y < canvas.height; y += 48) {
      for (let x = 18; x < canvas.width; x += 48) {
        ctx.fillStyle = ((x + y) / 48) % 2 === 0 ? "#3b6541" : "#315437";
        ctx.fillRect(x, y, 3, 3);
        ctx.fillRect(x + 15, y + 21, 2, 2);
      }
    }

    ctx.fillStyle = "#756b4b";
    ctx.fillRect(0, canvas.height - 72, canvas.width, 72);
    ctx.fillStyle = "#8a7c55";
    for (let x = 12; x < canvas.width; x += 54) {
      ctx.fillRect(x, canvas.height - 38, 22, 3);
    }
  }

  function drawPlayer() {
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

  let previousFrame = 0;
  function gameLoop(timestamp) {
    const deltaSeconds = previousFrame === 0
      ? 0
      : Math.min((timestamp - previousFrame) / 1000, 0.05);
    previousFrame = timestamp;

    updatePlayer(deltaSeconds);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld();
    drawPlayer();
    drawStatus();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();