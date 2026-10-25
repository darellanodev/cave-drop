// Game rules and physics. This file does not draw anything.
import Matter from "matter-js";
import decomp from "poly-decomp";
import {
  H,
  W,
  TOTAL_BALLS,
  MAX_LOST,
  SPAWN_INTERVAL,
  BALL_LIFETIME,
  BALL_RADIUS,
  BAR_LENGTH,
  BAR_THICKNESS,
  GRAVITY,
} from "./config.js";

const { Engine, Events, Runner, Bodies, Body, Composite, Vertices } = Matter;

// Needed to split concave terrain into convex parts.
Matter.Common.setDecomp(decomp);

Matter.Resolver._restingThresh = 0.1;

// Make a static body from a polygon of the level.
function createStaticBody(poly, options) {
  const c = Vertices.centre(poly);
  const body = Bodies.fromVertices(
    c.x,
    c.y,
    [poly],
    { isStatic: true, ...options },
    true,
  );
  // A static body made of several parts can end up shifted.
  // Move it so that it matches the polygon of the level.
  Body.translate(body, {
    x: Math.min(...poly.map((p) => p.x)) - body.bounds.min.x,
    y: Math.min(...poly.map((p) => p.y)) - body.bounds.min.y,
  });
  return body;
}

export class Game {
  // endless: the game never ends. It keeps making balls and does not count
  // the lost ones (used for the title screen).
  constructor(level, { endless = false } = {}) {
    this.level = level;
    this.endless = endless;
    this.runner = null;
    this.restart();
  }

  restart() {
    if (this.runner) Runner.stop(this.runner);

    this.engine = Engine.create({
      positionIterations: 10,
      velocityIterations: 8,
    });
    this.engine.gravity.y = GRAVITY;

    this.balls = [];
    this.bars = [];
    this.spawned = 0;
    this.lost = 0;
    this.saved = 0;
    this.lastSpawn = 0;
    this.lastUpdate = null; // time of the previous frame, to count the life of the balls
    this.status = null; // null while playing, then 'YOU WIN' or 'YOU LOSE'

    for (const poly of this.level.terrain) {
      Composite.add(
        this.engine.world,
        createStaticBody(poly, { restitution: 0.8 }),
      );
    }

    // Fire is solid like the terrain. A ball that touches it is marked as burned.
    for (const poly of this.level.fire) {
      Composite.add(
        this.engine.world,
        createStaticBody(poly, { restitution: 0.8, isFire: true }),
      );
    }
    Events.on(this.engine, "collisionStart", (event) => {
      for (const pair of event.pairs) {
        const a = pair.bodyA.parent;
        const b = pair.bodyB.parent;
        if (a.isFire && b.label === "ball") b.burned = true;
        if (b.isFire && a.label === "ball") a.burned = true;
      }
    });

    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  // Call once per frame. `now` is the time in ms.
  update(now) {
    if (this.status) return;

    // Time since the previous frame. The limit avoids big jumps (for example
    // when the tab was hidden), so the balls do not die while the game is paused.
    const dt =
      this.lastUpdate === null ? 0 : Math.min(now - this.lastUpdate, 100);
    this.lastUpdate = now;

    const { start, goal, teleport } = this.level;

    const canSpawn = this.endless || this.spawned < TOTAL_BALLS;
    if (canSpawn && now - this.lastSpawn > SPAWN_INTERVAL) {
      const ball = Bodies.circle(
        start.x + (Math.random() - 0.5) * 4,
        start.y,
        BALL_RADIUS,
        {
          label: "ball",
          restitution: 0.8,
          friction: 0,
          frictionAir: 0,
        },
      );
      ball.life = BALL_LIFETIME; // ms left before the ball is lost
      Composite.add(this.engine.world, ball);
      this.balls.push(ball);
      this.spawned++;
      this.lastSpawn = now;
    }

    // A ball is saved in the goal, or lost when it leaves the screen, touches fire
    // or runs out of life.
    // A ball that enters the teleport moves to the exit and keeps its speed.
    this.balls = this.balls.filter((ball) => {
      const p = ball.position;
      ball.life -= dt;
      if (ball.burned) {
        this.lost++;
        Composite.remove(this.engine.world, ball);
        return false;
      }
      if (Vertices.contains(goal, p)) {
        this.saved++;
        Composite.remove(this.engine.world, ball);
        return false;
      }
      if (teleport && Vertices.contains(teleport.in, p)) {
        Body.setPosition(ball, teleport.exit);
        return true;
      }
      if (ball.life <= 0) {
        this.lost++;
        Composite.remove(this.engine.world, ball);
        return false;
      }
      if (p.y > H + 20 || p.x < -20 || p.x > W + 20) {
        this.lost++;
        Composite.remove(this.engine.world, ball);
        return false;
      }
      return true;
    });

    if (this.endless) return;
    if (this.lost > MAX_LOST) this.status = "YOU LOSE";
    else if (this.spawned === TOTAL_BALLS && this.balls.length === 0)
      this.status = "YOU WIN";
  }

  // Place a fixed bar. It cannot be removed.
  addBar(x, y, angle) {
    const bar = Bodies.rectangle(x, y, BAR_LENGTH, BAR_THICKNESS, {
      isStatic: true,
      angle,
      restitution: 0.7,
    });
    Composite.add(this.engine.world, bar);
    this.bars.push(bar);
  }

  // Stop the physics. Call this when the game is not used anymore.
  destroy() {
    if (this.runner) Runner.stop(this.runner);
    this.runner = null;
  }

  // Balls that are still to come or still in play.
  get ballsLeft() {
    return TOTAL_BALLS - this.spawned + this.balls.length;
  }
}
