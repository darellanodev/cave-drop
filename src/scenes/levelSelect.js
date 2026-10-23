// Level select screen: a grid with 6 columns (up to 36 levels). Only the levels in LEVELS are shown.
import { W } from "../config.js";
import { LEVELS, getLevel } from "../levels.js";
import { drawBackground, drawButton, drawText, inside } from "../ui.js";

const COLUMNS = 6;
const BOX = 40; // size of each level button
const STEP = 48; // distance between buttons
const GRID_X = (W - (STEP * (COLUMNS - 1) + BOX)) / 2;
const GRID_Y = 100;
const BACK_BUTTON = { x: 60, y: 440, w: 200, h: 46 };

// Position of the button for each level.
const buttons = LEVELS.map((entry, i) => ({
  entry,
  rect: {
    x: GRID_X + (i % COLUMNS) * STEP,
    y: GRID_Y + Math.floor(i / COLUMNS) * STEP,
    w: BOX,
    h: BOX,
  },
}));

export function createLevelSelectScene({ ctx, goTo }) {
  const scene = {
    hint: "",
    loading: false,
    update() {},
    draw() {
      drawBackground(ctx);
      drawText(ctx, "SELECT THE ROOM", W / 2, 60, { size: 22, bold: true });
      buttons.forEach(({ entry, rect }) =>
        drawButton(ctx, rect, String(entry.id), { filled: true, size: 18 }),
      );
      drawButton(ctx, BACK_BUTTON, "<<");
    },
    async pointerDown(p) {
      if (scene.loading) return;
      if (inside(p, BACK_BUTTON)) {
        goTo("title");
        return;
      }
      const hit = buttons.find((b) => inside(p, b.rect));
      if (!hit) return;
      scene.loading = true;
      try {
        goTo("play", { level: await getLevel(hit.entry) });
      } catch (err) {
        console.error(err);
        scene.hint = `Error: ${err.message}`;
        document.getElementById("hint").textContent = scene.hint;
      } finally {
        scene.loading = false;
      }
    },
  };
  return scene;
}
