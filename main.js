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
    hp: 100,
    maxHp: 100,
    mana: 40,
    maxMana: 40
  };

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

    // Textura discreta de grama em padrão, sem imagens externas.
    for (let y = 18; y < canvas.height; y += 48) {
      for (let x = 18; x < canvas.width; x += 48) {
        ctx.fillStyle = ((x + y) / 48) % 2 === 0 ? "#3b6541" : "#315437";
        ctx.fillRect(x, y, 3, 3);
        ctx.fillRect(x + 15, y + 21, 2, 2);
      }
    }

    // Pequeno caminho para dar referência de escala ao personagem.
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

    // Sombra no chão.
    ctx.fillStyle = "rgba(0, 0, 0, 0.28)";
    ctx.beginPath();
    ctx.ellipse(x, y + 4, 17, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Sprite provisório em pixel art: botas, pernas, túnica, braços e cabeça.
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

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawWorld();
    drawPlayer();
    drawStatus();
  }

  function gameLoop() {
    render();
    requestAnimationFrame(gameLoop);
  }

  gameLoop();
})();
