import { drawWorld } from "./src/rendering/WorldRenderer.js";
import { drawPlayer } from "./src/rendering/PlayerRenderer.js";

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

    if (moveX !== 0 || moveY !== 0) {
      const length = Math.hypot(moveX, moveY);
      moveX /= length;
      moveY /= length;
    }

    const halfWidth = player.width / 2;
    const halfHeight = player.height / 2;
    player.x += moveX * player.speed * deltaSeconds;
    player.y += moveY * player.speed * deltaSeconds;

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

  let previousFrame = 0;
  function gameLoop(timestamp) {
    const deltaSeconds = previousFrame === 0
      ? 0
      : Math.min((timestamp - previousFrame) / 1000, 0.05);
    previousFrame = timestamp;

    updatePlayer(deltaSeconds);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld(ctx, canvas);
    drawPlayer(ctx, player);
    drawStatus();

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
})();
