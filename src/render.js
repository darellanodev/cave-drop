// Draw the game on the canvas.
import { W, H, BAR_LENGTH, BALL_RADIUS, MAX_LOST } from "./config.js";

export function createRenderer(canvas) {
  const ctx = canvas.getContext("2d");

  function drawPolygon(points, color) {
    ctx.beginPath();
    points.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawCircle(x, y, r, color) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function drawBar(x, y, angle, color) {
    const dx = (Math.cos(angle) * BAR_LENGTH) / 2;
    const dy = (Math.sin(angle) * BAR_LENGTH) / 2;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(x - dx, y - dy);
    ctx.lineTo(x + dx, y + dy);
    ctx.stroke();
  }

  function drawHud(game) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, W, 34);
    ctx.font = "14px system-ui";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(`${game.ballsLeft} LEFT`, 10, 17);
    ctx.fillStyle = "#f33";
    ctx.fillRect(100, 0, 100, 34);
    ctx.fillStyle = "#fff";
    ctx.fillText(`${game.lost}/${MAX_LOST + 1} LOST`, 106, 17);
    ctx.fillStyle = "#ff0";
    ctx.fillText(`★ ${game.saved}`, 215, 17);
  }

  function drawEndScreen(text) {
    ctx.fillStyle = "rgba(0,0,0,.65)";
    ctx.fillRect(0, 200, W, 100);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px system-ui";
    ctx.fillText(text, W / 2, 238);
    ctx.font = "14px system-ui";
    ctx.fillText("Tap to restart", W / 2, 272);
    ctx.textAlign = "left";
  }

  return {
    draw(game, input) {
      const { terrain, goal, start } = game.level;
      ctx.fillStyle = "#400";
      ctx.fillRect(0, 0, W, H);
      terrain.forEach((poly) => drawPolygon(poly, "#8a8fb5"));
      drawPolygon(goal, "#ff0");
      drawCircle(start.x, start.y, 6, "#000");
      game.bars.forEach((b) =>
        drawBar(b.position.x, b.position.y, b.angle, "#fff"),
      );
      if (input.preview)
        drawBar(
          input.preview.x,
          input.preview.y,
          input.preview.angle,
          "rgba(255,255,255,.5)",
        );
      game.balls.forEach((b) =>
        drawCircle(b.position.x, b.position.y, BALL_RADIUS, "#fff"),
      );
      drawHud(game);
      if (game.status) drawEndScreen(game.status);
    },
  };
}
