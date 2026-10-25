// Title screen: logo, START and CREDITS buttons, and balls that fall from the logo.
// The balls come from a level (levels/menu.svg) that runs in an endless game.
import menuSvg from "../../levels/menu.svg?raw";
import { W } from "../config.js";
import { Game } from "../game.js";
import { parseLevel } from "../level.js";
import { createRenderer } from "../render.js";
import { drawBackground, drawButton, inside } from "../ui.js";
import logoUrl from "../assets/logo.png";

const MENU_LEVEL = parseLevel(menuSvg);
const START_BUTTON = { x: 60, y: 250, w: 200, h: 46 };
const CREDITS_BUTTON = { x: 60, y: 316, w: 200, h: 46 };

export function createTitleScene({ ctx, canvas, goTo }) {
  const logo = new Image();
  logo.src = logoUrl;
  const renderer = createRenderer(canvas);
  let game = null;

  return {
    hint: "",
    enter() {
      game = new Game(MENU_LEVEL, { endless: true });
    },
    exit() {
      game.destroy();
      game = null;
    },
    update(now) {
      game.update(now);
    },
    draw() {
      drawBackground(ctx);
      if (logo.complete) {
        const w = 192;
        const h = (logo.naturalHeight * w) / logo.naturalWidth;
        ctx.drawImage(logo, (W - w) / 2, 40, w, h);
      }
      // The balls are drawn behind the buttons.
      renderer.drawWorld(game);
      drawButton(ctx, START_BUTTON, "START");
      drawButton(ctx, CREDITS_BUTTON, "CREDITS");
    },
    pointerDown(p) {
      if (inside(p, START_BUTTON)) goTo("levels");
      else if (inside(p, CREDITS_BUTTON)) goTo("credits");
    },
  };
}
