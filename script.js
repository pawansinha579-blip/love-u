const noButton = document.querySelector("#no-button");
const yesButton = document.querySelector("#yes-button");
const replayButton = document.querySelector("#replay-button");
const musicButton = document.querySelector("#music-button");
const backgroundSong = document.querySelector("#background-song");
const apologyPage = document.querySelector("#apology");
const lovePage = document.querySelector("#love-letter");
const floaties = document.querySelector(".floaties");
const confettiLayer = document.querySelector(".confetti-layer");
const loveLines = [...document.querySelectorAll(".love-line")];
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
let noButtonMoveTimer;

const randomBetween = (min, max) => Math.random() * (max - min) + min;

function createFloatingHearts() {
  const hearts = ["♥", "♡", "❤"];
  const colors = ["#e681a6", "#ca8ab4", "#d596bc", "#ef9bb4", "#b99bd3"];
  const count = window.innerWidth < 600 ? 12 : 20;

  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = hearts[i % hearts.length];
    heart.style.left = `${randomBetween(2, 98)}%`;
    heart.style.fontSize = `${randomBetween(10, 21)}px`;
    heart.style.setProperty("--duration", `${randomBetween(8, 16)}s`);
    heart.style.setProperty("--delay", `${randomBetween(-16, 0)}s`);
    heart.style.setProperty("--drift", `${randomBetween(-65, 65)}px`);
    heart.style.setProperty("--heart-color", colors[i % colors.length]);
    floaties.append(heart);
  }
}

function moveNoButton() {
  const bounds = noButton.getBoundingClientRect();
  const yesBounds = yesButton.getBoundingClientRect();
  const margin = 12;
  const safeDistance = 36;
  const maxX = Math.max(margin, window.innerWidth - bounds.width - margin);
  const maxY = Math.max(margin, window.innerHeight - bounds.height - margin);
  let x = margin;
  let y = margin;

  for (let attempt = 0; attempt < 40; attempt += 1) {
    x = randomBetween(margin, maxX);
    y = randomBetween(margin, maxY);
    const overlapsYes =
      x < yesBounds.right + safeDistance &&
      x + bounds.width > yesBounds.left - safeDistance &&
      y < yesBounds.bottom + safeDistance &&
      y + bounds.height > yesBounds.top - safeDistance;
    if (!overlapsYes) break;
  }

  noButton.classList.add("is-running");
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.transform = `rotate(${randomBetween(-12, 12)}deg)`;
  noButton.style.pointerEvents = "none";
  window.clearTimeout(noButtonMoveTimer);
  noButtonMoveTimer = window.setTimeout(() => {
    if (!noButton.hidden) noButton.style.pointerEvents = "";
  }, 350);
}

function burstHearts(x, y) {
  const colors = ["#e85f91", "#f18eae", "#bd88c7", "#f3b2c8", "#d45d91"];
  for (let i = 0; i < 30; i += 1) {
    const heart = document.createElement("span");
    const angle = (Math.PI * 2 * i) / 30;
    const distance = randomBetween(65, 185);
    heart.className = "heart-burst";
    heart.textContent = i % 4 === 0 ? "♡" : "♥";
    heart.style.setProperty("--x", `${x}px`);
    heart.style.setProperty("--y", `${y}px`);
    heart.style.setProperty("--dx", `${Math.cos(angle) * distance}px`);
    heart.style.setProperty("--dy", `${Math.sin(angle) * distance}px`);
    heart.style.setProperty("--spin", `${randomBetween(-55, 55)}deg`);
    heart.style.setProperty("--color", colors[i % colors.length]);
    heart.style.fontSize = `${randomBetween(13, 27)}px`;
    document.body.append(heart);
    heart.addEventListener("animationend", () => heart.remove(), { once: true });
  }
}

function sprinkleConfetti() {
  const colors = ["#ed8eaf", "#c89ad4", "#ffd27c", "#e7a5bc", "#a99bdc", "#fff"];
  for (let i = 0; i < 100; i += 1) {
    const piece = document.createElement("span");
    piece.className = "confetti-piece";
    piece.style.setProperty("--x", `${randomBetween(0, 100)}vw`);
    piece.style.setProperty("--size", `${randomBetween(5, 10)}px`);
    piece.style.setProperty("--color", colors[i % colors.length]);
    piece.style.setProperty("--duration", `${randomBetween(1.8, 3.3)}s`);
    piece.style.setProperty("--delay", `${randomBetween(0, 0.8)}s`);
    piece.style.setProperty("--spin", `${randomBetween(300, 900)}deg`);
    confettiLayer.append(piece);
    piece.addEventListener("animationend", () => piece.remove(), { once: true });
  }
}

function revealLovePage() {
  apologyPage.classList.remove("is-active");
  apologyPage.setAttribute("aria-hidden", "true");
  noButton.hidden = true;
  lovePage.classList.add("is-active");
  lovePage.setAttribute("aria-hidden", "false");

  const initialDelay = reducedMotion.matches ? 0 : 350;
  loveLines.forEach((line, index) => {
    window.setTimeout(() => line.classList.add("is-visible"), initialDelay + index * 480);
  });
  window.setTimeout(() => {
    lovePage.querySelector(".forever").classList.add("is-visible");
  }, initialDelay + loveLines.length * 480);
  lovePage.querySelector("#love-title").focus({ preventScroll: true });
}

async function playBackgroundSong() {
  try {
    await backgroundSong.play();
    musicButton.hidden = false;
    musicButton.textContent = "Pause our song ♫";
    musicButton.setAttribute("aria-pressed", "true");
  } catch (error) {
    musicButton.hidden = false;
    musicButton.textContent =
      error.name === "NotAllowedError" ? "Tap to play our song ♫" : "Tap to retry our song ♫";
    musicButton.setAttribute("aria-pressed", "false");
    if (error.name !== "NotAllowedError") {
      console.error("The background song could not be played.", error);
    }
  }
}

musicButton.addEventListener("click", () => {
  if (backgroundSong.paused) {
    playBackgroundSong();
  } else {
    backgroundSong.pause();
    musicButton.textContent = "Play our song ♫";
    musicButton.setAttribute("aria-pressed", "false");
  }
});

noButton.addEventListener("pointerenter", moveNoButton);
noButton.addEventListener("pointerdown", (event) => {
  event.preventDefault();
  moveNoButton();
});
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});
window.addEventListener("resize", () => {
  if (noButton.classList.contains("is-running")) moveNoButton();
});

yesButton.addEventListener("click", () => {
  const buttonBounds = yesButton.getBoundingClientRect();
  const x = buttonBounds.left + buttonBounds.width / 2;
  const y = buttonBounds.top + buttonBounds.height / 2;
  burstHearts(x, y);
  sprinkleConfetti();
  window.setTimeout(revealLovePage, reducedMotion.matches ? 150 : 850);
});

replayButton.addEventListener("click", () => {
  loveLines.forEach((line) => line.classList.remove("is-visible"));
  lovePage.querySelector(".forever").classList.remove("is-visible");
  lovePage.classList.remove("is-active");
  lovePage.setAttribute("aria-hidden", "true");
  noButton.hidden = false;
  noButton.classList.remove("is-running");
  noButton.removeAttribute("style");
  apologyPage.classList.add("is-active");
  apologyPage.setAttribute("aria-hidden", "false");
});

createFloatingHearts();
playBackgroundSong();
