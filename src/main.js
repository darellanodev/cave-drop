// Start the game, switch between screens (scenes) and run the main loop.
import { createCreditsScene } from "./scenes/credits.js";
import { createLevelSelectScene } from "./scenes/levelSelect.js";
import { createPlayScene } from "./scenes/play.js";
import { createTitleScene } from "./scenes/title.js";
import { toGame } from "./ui.js";

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const hint = document.getElementById("hint");

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
