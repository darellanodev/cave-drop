// Title screen: logo, START and CREDITS buttons.
import { W } from "../config.js";
import { drawBackground, drawButton, inside } from "../ui.js";
import logoUrl from "../assets/logo.png";

const START_BUTTON = { x: 60, y: 250, w: 200, h: 46 };
const CREDITS_BUTTON = { x: 60, y: 316, w: 200, h: 46 };

export function createTitleScene({ ctx, goTo }) {
  const logo = new Image();
  logo.src = logoUrl;

  return {
    hint: "",
    update() {},
    draw() {
      drawBackground(ctx);
      if (logo.complete) {
        const w = 192;
        const h = (logo.naturalHeight * w) / logo.naturalWidth;
        ctx.drawImage(logo, (W - w) / 2, 40, w, h);
      }
      drawButton(ctx, START_BUTTON, "START");
      drawButton(ctx, CREDITS_BUTTON, "CREDITS");
    },
    pointerDown(p) {
      if (inside(p, START_BUTTON)) goTo("levels");
      else if (inside(p, CREDITS_BUTTON)) goTo("credits");
    },
  };
}
