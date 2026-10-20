// Small helpers shared by the menu screens: pointer position, buttons and text.
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

export function drawBackground(ctx) {
  ctx.fillStyle = "#400";
  ctx.fillRect(0, 0, W, H);
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
export function drawButton(ctx, rect, label, { filled = false, size = 18 } = {}) {
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
    ctx.fillStyle = "#fff";
    ctx.fill();
  } else {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  drawText(ctx, label, x + w / 2, y + h / 2 + 1, {
    size,
    color: filled ? "#000" : "#fff",
  });
}
