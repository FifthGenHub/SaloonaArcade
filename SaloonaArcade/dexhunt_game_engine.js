
// DexHunt Core Duel Engine (Rebuilt from DexHunt2.html + New Logic)

let duelStarted = false;
let duelTimeout;
let drawTime = 0;
let bestDraw = localStorage.getItem("bestDraw") || null;
let saloona = parseInt(localStorage.getItem("saloonaBalance")) || 0;

// DOM Elements
const bang = document.getElementById("bang");
const countdown = document.getElementById("countdown");
const quickDraw = document.getElementById("quickDraw");
const gameLog = document.getElementById("log");
const gunshot = document.getElementById("gunshot");
const winSound = document.getElementById("winSound");
const loseSound = document.getElementById("loseSound");
const resetSound = document.getElementById("resetSound");
const drawSound = document.getElementById("drawSound");
const startSound = document.getElementById("startSound");

function startDuel() {
  if (duelStarted) return;
  duelStarted = true;

  // Reset UI
  bang.style.display = "none";
  countdown.textContent = "";
  countdown.style.display = "block";
  quickDraw.style.display = "none";
  gameLog.textContent = "Get ready...";

  resetSound.play();

  // Random delay before BANG
  const wait = 1000 + Math.random() * 3000;
  duelTimeout = setTimeout(() => {
    showBang();
  }, wait);
}

function showBang() {
  drawSound.play();
  drawTime = performance.now();
  bang.style.display = "block";
  countdown.style.display = "none";
  quickDraw.style.display = "block";
  quickDraw.textContent = "🔥 DRAW!";
}

function shoot() {
  if (!duelStarted) return;

  const clickTime = performance.now();
  const reaction = Math.floor(clickTime - drawTime);

  if (drawTime === 0) {
    // Too early!
    document.getElementById("toosoon").play();
    gameLog.textContent = "Too soon, cowboy! You shot before the signal.";
    resetDuel();
    return;
  }

  gunshot.play();

  if (reaction <= 600) {
    winSound.play();
    const reward = 5 + Math.floor(Math.max(0, 300 - reaction) / 25);
    saloona += reward;
    localStorage.setItem("saloonaBalance", saloona);
    gameLog.textContent = `🎯 Hit in ${reaction}ms! You earned ${reward} $SALOONA.`;

    if (!bestDraw || reaction < bestDraw) {
      bestDraw = reaction;
      localStorage.setItem("bestDraw", bestDraw);
    }
  } else {
    loseSound.play();
    gameLog.textContent = `Too slow! You drew in ${reaction}ms.`;
  }

  resetDuel();
}

function resetDuel() {
  duelStarted = false;
  drawTime = 0;
  bang.style.display = "none";
  quickDraw.style.display = "none";
  clearTimeout(duelTimeout);
}
