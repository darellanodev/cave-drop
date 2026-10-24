// Start the game, switch between screens (scenes) and run the main loop.
import { createCreditsScene } from "./scenes/credits.js";
import { createLevelSelectScene } from "./scenes/levelSelect.js";
import { createPlayScene } from "./scenes/play.js";
import { createTitleScene } from "./scenes/title.js";
import { W, H } from "./config.js";
import { toGame } from "./ui.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("hint");

// Draw the canvas with the real pixels of the screen, so it is sharp on phones.
// The game does not notice it: everything still uses the logical size W x H.
function resizeCanvas() {
  const rect = canvas.getBoundingClientRect();
  if (!rect.width) return;
  const scale = (rect.width * (window.devicePixelRatio || 1)) / W;
  canvas.width = Math.round(W * scale);
  canvas.height = Math.round(H * scale);
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
}
new ResizeObserver(resizeCanvas).observe(canvas);
resizeCanvas();

// Every scene has: update(now), draw(), pointerDown(p), and optionally
// enter(params), exit(), pointerMove(p), pointerUp(p), pointerCancel().
const scenes = {};
let current = null;

function goTo(name, params) {
  if (current && current.exit) current.exit();
  current = scenes[name];
  if (current.enter) current.enter(params);
  hint.textContent = current.hint;
}

Object.assign(scenes, {
  title: createTitleScene({ ctx, goTo }),
  levels: createLevelSelectScene({ ctx, goTo }),
  credits: createCreditsScene({ ctx, goTo }),
  play: createPlayScene({ canvas, goTo }),
});

// Send the pointer events to the current scene.
canvas.addEventListener("pointerdown", (e) => {
  canvas.setPointerCapture(e.pointerId);
  current.pointerDown(toGame(canvas, e));
});
canvas.addEventListener("pointermove", (e) => {
  if (current.pointerMove) current.pointerMove(toGame(canvas, e));
});
canvas.addEventListener("pointerup", (e) => {
  if (current.pointerUp) current.pointerUp(toGame(canvas, e));
});
canvas.addEventListener("pointercancel", () => {
  if (current.pointerCancel) current.pointerCancel();
});

function frame(now) {
  current.update(now);
  current.draw();
  requestAnimationFrame(frame);
}

goTo("title");
requestAnimationFrame(frame);
