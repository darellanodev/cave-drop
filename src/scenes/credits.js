// Credits screen.
import { W } from "../config.js";
import { drawBackground, drawButton, drawText, inside } from "../ui.js";

const BACK_BUTTON = { x: 60, y: 420, w: 200, h: 46 };

export function createCreditsScene({ ctx, goTo }) {
  return {
    hint: "",
    update() {},
    draw() {
      drawBackground(ctx);
      const mid = W / 2;
      drawText(ctx, "CAVE DROP", mid, 90, { size: 28, bold: true });
      drawText(ctx, "DEVELOPED BY", mid, 170);
      drawText(ctx, "DANIEL ARELLANO ALIAGA", mid, 200);
      drawText(ctx, "THANK YOU", mid, 280);
      drawText(ctx, "FOR ALL YOUR SUPPORT", mid, 310);
      drawButton(ctx, BACK_BUTTON, "CONTINUE");
    },
    pointerDown(p) {
      if (inside(p, BACK_BUTTON)) goTo("title");
    },
  };
}
