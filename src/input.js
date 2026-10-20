// Bar placing. Press to place a bar, drag to rotate it, release to fix it.
// This file does not listen to the browser: main.js sends the pointer events.

export function createBarPlacer(game) {
  // preview = { x, y, angle } while the player is dragging, otherwise null.
  const placer = {
    preview: null,

    down(p) {
      placer.preview = { x: p.x, y: p.y, angle: 0 };
    },

    move(p) {
      if (!placer.preview) return;
      const dx = p.x - placer.preview.x;
      const dy = p.y - placer.preview.y;
      if (Math.hypot(dx, dy) > 4) placer.preview.angle = Math.atan2(dy, dx);
    },

    up() {
      if (!placer.preview) return;
      game.addBar(placer.preview.x, placer.preview.y, placer.preview.angle);
      placer.preview = null;
    },

    cancel() {
      placer.preview = null;
    },
  };
  return placer;
}
