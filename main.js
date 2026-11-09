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

  const player = { hp: 100, maxHp: 100, mana: 40, maxMana: 40 };

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

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#18251d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#d8c58a";
    ctx.font = "bold 28px system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("MineGame RPG", canvas.width / 2, 70);

    ctx.fillStyle = "#9fb49a";
    ctx.font = "16px system-ui, sans-serif";
    ctx.fillText("Mundo em construção", canvas.width / 2, 105);

    drawStatus();
  }

  function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
})();
