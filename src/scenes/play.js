// Play screen: one level. A new game is created every time the scene starts.
import { MENU_BUTTON } from "../config.js";
import { Game } from "../game.js";
import { createBarPlacer } from "../input.js";
import { LEVELS } from "../levels.js";
import { unlockLevel } from "../progress.js";
import { createRenderer } from "../render.js";
import { inside } from "../ui.js";

export function createPlayScene({ canvas, goTo }) {
  const renderer = createRenderer(canvas);
  let game = null;
  let placer = null;
  let levelId = 0; // number of the level that is being played
  let won = false; // true after the progress was saved for this game

  return {
    hint: "Click and drag to aim a bar. Release to fix it in place.",
    enter({ level, id }) {
      levelId = id;
      won = false;
      game = new Game(level);
      placer = createBarPlacer(game);
    },
    exit() {
      game.destroy();
      game = null;
      placer = null;
    },
    update(now) {
      game.update(now);
      // Winning a level unlocks the next one (and saves it).
      if (game.status === "YOU WIN" && !won) {
        won = true;
        unlockLevel(Math.min(levelId + 1, LEVELS.length));
      }
    },
    draw() {
      renderer.draw(game, placer);
    },
    pointerDown(p) {
      // The MENU button, or any tap after the level ends, goes back to the level select.
      if (game.status || inside(p, MENU_BUTTON)) {
        goTo("levels");
        return;
      }
      placer.down(p);
    },
    pointerMove(p) {
      placer.move(p);
    },
    pointerUp() {
      placer.up();
    },
    pointerCancel() {
      placer.cancel();
    },
  };
}
