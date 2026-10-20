// Play screen: one level. A new game is created every time the scene starts.
import { MENU_BUTTON } from "../config.js";
import { Game } from "../game.js";
import { createBarPlacer } from "../input.js";
import { createRenderer } from "../render.js";
import { inside } from "../ui.js";

export function createPlayScene({ canvas, goTo }) {
  const renderer = createRenderer(canvas);
  let game = null;
  let placer = null;

  return {
    hint: "Click and drag to aim a bar. Release to fix it in place.",
    enter({ level }) {
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
