// Start the game and run the main loop.
import { loadLevel } from "./level.js";
import { Game } from "./game.js";
import { setupInput } from "./input.js";
import { createRenderer } from "./render.js";

const canvas = document.getElementById("game");

async function start() {
  const level = await loadLevel("levels/level1.svg");
  const game = new Game(level);
  const input = setupInput(canvas, game);
  const renderer = createRenderer(canvas);

  function frame(now) {
    game.update(now);
    renderer.draw(game, input);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

start().catch((err) => {
  console.error(err);
  document.getElementById("hint").textContent = `Error: ${err.message}`;
});
