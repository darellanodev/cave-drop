// Game rules and physics. This file does not draw anything.
import Matter from "matter-js";
import {
  H,
  W,
  TOTAL_BALLS,
  MAX_LOST,
  SPAWN_INTERVAL,
  BALL_RADIUS,
  BAR_LENGTH,
  BAR_THICKNESS,
  GRAVITY,
} from "./config.js";

const { Engine, Runner, Bodies, Composite, Vertices } = Matter;

export class Game {
  constructor(level) {
    this.level = level;
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
    this.status = null; // null while playing, then 'YOU WIN' or 'YOU LOSE'

    for (const poly of this.level.terrain) {
      const c = Vertices.centre(poly);
      Composite.add(
        this.engine.world,
        Bodies.fromVertices(c.x, c.y, [poly], {
          isStatic: true,
          restitution: 0.4,
        }),
      );
    }

    this.runner = Runner.create();
    Runner.run(this.runner, this.engine);
  }

  // Call once per frame. `now` is the time in ms.
  update(now) {
    if (this.status) return;

    const { start, goal } = this.level;

    if (this.spawned < TOTAL_BALLS && now - this.lastSpawn > SPAWN_INTERVAL) {
      const ball = Bodies.circle(
        start.x + (Math.random() - 0.5) * 4,
        start.y,
        BALL_RADIUS,
        {
          restitution: 0.6,
          friction: 0.01,
          frictionAir: 0.001,
        },
      );
      Composite.add(this.engine.world, ball);
      this.balls.push(ball);
      this.spawned++;
      this.lastSpawn = now;
    }

    // A ball is saved in the goal, or lost when it leaves the screen.
    this.balls = this.balls.filter((ball) => {
      const p = ball.position;
      if (Vertices.contains(goal, p)) {
        this.saved++;
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

    if (this.lost > MAX_LOST) this.status = "YOU LOSE";
    else if (this.spawned === TOTAL_BALLS && this.balls.length === 0)
      this.status = "YOU WIN";
  }

  // Place a fixed bar. It cannot be removed.
  addBar(x, y, angle) {
    const bar = Bodies.rectangle(x, y, BAR_LENGTH, BAR_THICKNESS, {
      isStatic: true,
      angle,
      restitution: 0.5,
    });
    Composite.add(this.engine.world, bar);
    this.bars.push(bar);
  }

  // Balls that are still to come or still in play.
  get ballsLeft() {
    return TOTAL_BALLS - this.spawned + this.balls.length;
  }
}
