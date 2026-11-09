import { Camera } from "./src/rendering/Camera.js";
import { drawWorld } from "./src/rendering/WorldRenderer.js";
import { drawPlayer } from "./src/rendering/PlayerRenderer.js";
import { WORLD_WIDTH, WORLD_HEIGHT } from "./src/world/ForestTileMap.js";
import { moveWithCollisions } from "./src/world/Collision.js";

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
    x: WORLD_WIDTH / 2,
    y: WORLD_HEIGHT / 2,
    width: 32,
    height: 40,
    colliderWidth: 18,
    colliderHeight: 18,
    colliderOffsetY: 5,
    speed: 220,
    hp: 100,
    maxHp: 100,
    mana: 40,
    maxMana: 40
  };
  const camera = new Camera(canvas.width, canvas.height, WORLD_WIDTH, WORLD_HEIGHT);
  const keys = new Set();
  const controls = new Set(["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d"]);

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
    const deltaX = moveX * player.speed * deltaSeconds;
    const deltaY = moveY * player.speed * deltaSeconds;
    moveWithCollisions(player, deltaX, deltaY);
  }

  function drawStatus() {
    const hpValue = document.getElementById("hp-value");
    const manaValue = document.getElementById("mana-value");
    const hpBar = document.getElementById("hp-bar");
    const manaBar = document.getElementById("mana-bar");
    if (hpValue) hpValue.textContent = player.hp + " / " + player.maxHp;
    if (manaValue) manaValue.textContent = player.mana + " / " + player.maxMana;
    if (hpBar) hpBar.style.width = (player.hp / player.maxHp * 100) + "%";
    if (manaBar) manaBar.style.width = (player.mana / player.maxMana * 100) + "%";
  }

  let previousFrame = 0;
  function gameLoop(timestamp) {
    const deltaSeconds = previousFrame === 0 ? 0 : Math.min((timestamp - previousFrame) / 1000, 0.05);
    previousFrame = timestamp;
    updatePlayer(deltaSeconds);
    camera.follow(player);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
    drawWorld(ctx, camera, canvas);
    drawPlayer(ctx, player);
    ctx.restore();
    drawStatus();
    requestAnimationFrame(gameLoop);
  }
  camera.follow(player);
  requestAnimationFrame(gameLoop);
})();