// Mouse and touch input. Press to place a bar, drag to rotate it, release to fix it.
import { W, H } from "./config.js";

export function setupInput(canvas, game) {
  const input = { preview: null }; // preview = { x, y, angle } while the player is dragging

  // Convert pointer position to game coordinates.
  const toGame = (e) => {
    const r = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - r.left) * W) / r.width,
      y: ((e.clientY - r.top) * H) / r.height,
    };
  };

  canvas.addEventListener("pointerdown", (e) => {
    if (game.status) {
      game.restart();
      return;
    }
    canvas.setPointerCapture(e.pointerId);
    const p = toGame(e);
    input.preview = { x: p.x, y: p.y, angle: 0 };
  });

  canvas.addEventListener("pointermove", (e) => {
    if (!input.preview) return;
    const p = toGame(e);
    const dx = p.x - input.preview.x;
    const dy = p.y - input.preview.y;
    if (Math.hypot(dx, dy) > 4) input.preview.angle = Math.atan2(dy, dx);
  });

  canvas.addEventListener("pointerup", () => {
    if (!input.preview) return;
    game.addBar(input.preview.x, input.preview.y, input.preview.angle);
    input.preview = null;
  });

  canvas.addEventListener("pointercancel", () => {
    input.preview = null;
  });

  return input;
}
