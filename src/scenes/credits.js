// Credits screen.
import { W } from "../config.js";
import authorURL from "../assets/darellanodev_logo.png";
import { drawBackground, drawButton, drawText, inside } from "../ui.js";

const BACK_BUTTON = { x: 60, y: 420, w: 200, h: 46 };
const GITHUB_URL = "https://github.com/darellanodev/cave-drop/";
const GITHUB_LINK_AREA = { x: 20, y: 290, w: 280, h: 40 };

export function createCreditsScene({ ctx, goTo }) {
  const author = new Image();
  author.src = authorURL;
  return {
    hint: "",
    update() {},
    draw() {
      drawBackground(ctx);
      const mid = W / 2;
      drawText(ctx, "CAVE DROP", mid, 90, { size: 28, bold: true });
      drawText(ctx, "DEVELOPED BY", mid, 170);
      if (author.complete) {
        const width = 200;
        const height = (author.naturalHeight * width) / author.naturalWidth;
        ctx.drawImage(author, mid - width / 2, 200 - height / 2, width, height);
      }
      drawText(ctx, "GITHUB", mid, 280);
      drawText(ctx, "https://github.com/darellanodev/cave-drop", mid, 310, {
        size: 14,
        color: "#ff0",
      });
      drawButton(ctx, BACK_BUTTON, "CONTINUE");
    },
    pointerDown(p) {
      if (inside(p, GITHUB_LINK_AREA)) {
        window.open(GITHUB_URL, "_blank", "noopener");
        return;
      }
      if (inside(p, BACK_BUTTON)) goTo("title");
    },
  };
}
