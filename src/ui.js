// Small helpers shared by the menu screens: pointer position, background, buttons and text.
import { W, H } from "./config.js";

// Convert a pointer event to game coordinates.
export function toGame(canvas, e) {
  const r = canvas.getBoundingClientRect();
  return {
    x: ((e.clientX - r.left) * W) / r.width,
    y: ((e.clientY - r.top) * H) / r.height,
  };
}

// Is the point p inside the rectangle rect = { x, y, w, h }?
export function inside(p, rect) {
  return (
    p.x >= rect.x &&
    p.x < rect.x + rect.w &&
    p.y >= rect.y &&
    p.y < rect.y + rect.h
  );
}

// Twinkling triangles in the background of the menus (like the old game).
// Each triangle fades in, fades out, and then appears again somewhere else.
const TRIANGLE_COUNT = 30;
const TRIANGLE_SIZE = 26; // size of the box where each triangle is drawn
const TRIANGLE_COLOR = "100, 0, 0"; // red, green, blue (the background is #400)
const MAX_BRIGHTNESS = 255;
const FADE_SPEED = 360; // brightness per second (the old game used 6 per frame at 60 fps)

const triangles = Array.from({ length: TRIANGLE_COUNT }, () => ({
  brightness: -1, // below 0 means "not visible, appear again"
  speed: 0,
  points: [],
}));
let lastTime = null;

// A random number between a and b.
const random = (a, b) => a + Math.random() * (b - a);

function updateTriangles(now) {
  // Time since the last frame, in seconds. The limit avoids big jumps (for example after a pause).
  const dt = lastTime === null ? 0 : Math.min((now - lastTime) / 1000, 0.1);
  lastTime = now;

  for (const t of triangles) {
    if (t.brightness < 0) {
      // Appear in a new random place, away from the edges.
      const x = random(TRIANGLE_SIZE, W - TRIANGLE_SIZE);
      const y = random(TRIANGLE_SIZE, H - TRIANGLE_SIZE);
      t.points = [0, 1, 2].map(() => ({
        x: x + random(0, TRIANGLE_SIZE),
        y: y + random(0, TRIANGLE_SIZE),
      }));
      t.speed = FADE_SPEED * random(1, 3);
      t.brightness = 0;
    }
    t.brightness += t.speed * dt;
    // At full brightness, start to fade out at a random speed.
    if (t.brightness > MAX_BRIGHTNESS) {
      t.brightness = MAX_BRIGHTNESS;
      t.speed = -FADE_SPEED * random(1, 3);
    }
  }
}

// Draw the background of a menu screen. Call it first, on every frame.
export function drawBackground(ctx) {
  ctx.fillStyle = "#400";
  ctx.fillRect(0, 0, W, H);

  updateTriangles(performance.now());
  for (const t of triangles) {
    if (t.brightness <= 0) continue;
    ctx.beginPath();
    t.points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = `rgba(${TRIANGLE_COLOR}, ${t.brightness / MAX_BRIGHTNESS})`;
    ctx.fill();
  }
}

export function drawText(ctx, text, x, y, { size = 16, color = "#fff", bold = false } = {}) {
  ctx.font = `${bold ? "bold " : ""}${size}px system-ui`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);
}

// Button with cut corners, like the old title screen.
// Default: outline with white text. filled: white box with black text.
export function drawButton(
  ctx,
  rect,
  label,
  { filled = false, size = 18, fillColor = "#fff", textColor = "#000" } = {},
) {
  const { x, y, w, h } = rect;
  const c = Math.min(8, h / 3); // size of the cut corners
  ctx.beginPath();
  ctx.moveTo(x + c, y);
  ctx.lineTo(x + w - c, y);
  ctx.lineTo(x + w, y + c);
  ctx.lineTo(x + w, y + h - c);
  ctx.lineTo(x + w - c, y + h);
  ctx.lineTo(x + c, y + h);
  ctx.lineTo(x, y + h - c);
  ctx.lineTo(x, y + c);
  ctx.closePath();
  if (filled) {
    ctx.fillStyle = fillColor;
    ctx.fill();
  } else {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  drawText(ctx, label, x + w / 2, y + h / 2 + 1, {
    size,
    color: filled ? textColor : "#fff",
  });
}
