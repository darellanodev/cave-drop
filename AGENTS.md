# AGENTS.md

Guide for coding agents and contributors working on Cave Drop.

## Project description

Cave Drop is a 2D physics game for the web. White balls fall from a start point, bounce on the terrain, and must reach a goal (a yellow triangle). The player places thin bars to guide the balls. A bar becomes fixed when the player releases the mouse, and it cannot be removed.

## Stack

- **Language:** plain JavaScript with ES modules. Moving to TypeScript is a future option.
- **Physics:** [Matter.js](https://brm.io/matter-js/) 0.19.0, loaded from a CDN as the global `Matter` (fixed version).
- **Rendering:** native 2D `<canvas>`, drawn by hand on every frame (`Matter.Render` is not used).
- **Levels:** SVG files in `levels/`, read with `fetch` and `DOMParser`.
- **No build step.** Package manager: **pnpm**. A local server is needed (`serve`, installed as a dev dependency).

## Project structure

```
index.html        page and canvas
styles.css        page styles
src/main.js       startup and main loop
src/config.js     game settings
src/level.js      load and parse SVG levels
src/game.js       rules and physics (no drawing)
src/input.js      mouse and touch input
src/render.js     canvas drawing and HUD
levels/*.svg      levels
```

Keep each file focused on one job:

- `game.js` knows the rules and physics. It must not draw or read the mouse.
- `render.js` only draws. It must not change the game state.
- `input.js` only turns pointer events into game actions (`game.addBar`, `game.restart`).

## How to run

The game uses `fetch` and ES modules, so it needs a local server:

```
pnpm install
pnpm start
```

## Level format (SVG)

The game uses a logical size of **320 × 510** (`viewBox="0 0 320 510"`). The canvas is scaled with CSS and keeps its proportions.

| Element                     | Meaning                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `<polygon class="terrain">` | Static obstacle. Balls bounce on it.                             |
| `<polygon id="goal">`       | Goal area. If the center of a ball enters it, the ball is saved. |
| `<circle id="start">`       | Start point (`cx`, `cy`) where balls appear.                     |

Rules for making levels:

- Use only `<polygon>` with `points="x,y x,y ..."`. This is what the loader reads.
- Terrain polygons must be **convex**. For concave shapes, split them into several polygons, or add `poly-decomp` and use `fromVertices` with decomposition.
- Do not use `transform="..."` on elements. Coordinates are read as they are.
- To support `<path>`, `<rect>` or `<circle>` as terrain, extend `src/level.js` (`Matter.Svg.pathToVertices` only works with `<path>`).

## Gameplay settings

All in `src/config.js`. Change them there before changing the logic:

- `TOTAL_BALLS`: balls per level (10).
- `MAX_LOST`: the game is lost when lost balls go above this value (5).
- `SPAWN_INTERVAL`: time between balls in ms (1200).
- `BAR_LENGTH`, `BAR_THICKNESS`: size of the player's bars (44 and 4 px).
- `GRAVITY`: gravity (0.8).

## Conventions

- Code, comments and docs are in simple English.
- Names in English (`balls`, `bars`, `saved`, `restart`).
- Always use the logical space 320 × 510. Convert pointer coordinates with `toGame()` in `src/input.js`.
- Keep CDN library versions **fixed** (never `@latest`).
- Use **pnpm** only. Do not use `npm` or `yarn`, and do not create `package-lock.json` or `yarn.lock`.
- Do not use `localStorage` without a `try/catch`.
- One export per clear purpose. Avoid circular imports.

## Physics warnings

- Bars are thin (4 px). Fast balls can pass through them (_tunneling_). Possible fixes: raise `positionIterations`, limit the maximum speed, or make the bars thicker.
- Balls and bars are added and removed with `Composite.add` / `Composite.remove`. On restart, `Game.restart()` creates a new engine. The old engine is not reused.
- Goal detection uses `Vertices.contains` on the ball position. It does not use a Matter sensor.

## Roadmap

- [ ] Level selector and more levels (`levels/level2.svg`, ...), with growing difficulty.
- [ ] Limit the number of bars per level and show a counter in the HUD.
- [ ] Special elements by `id`/`class` in the SVG (trampolines with more bounce, sensors, moving obstacles).
- [ ] Sounds (bounce, goal, lost ball).
- [ ] Save progress (finished levels, score), with `try/catch` around storage.
- [ ] PWA (`manifest.json` + service worker) to install the game on Android.
- [ ] Support `<path>`, `<rect>` and `<circle>` in the level loader.
- [ ] Basic tests for `parseLevel` and the game rules.
- [ ] Move to TypeScript and a bundler (for example Vite) if the project grows.

## Instructions for agents

- Before changing physics or rules, read **Gameplay settings** and **Physics warnings**.
- Respect the split between `game.js`, `render.js` and `input.js`.
- When adding levels, check that the SVG follows the format above.
- Always test with mouse and touch (the events are `pointer*`).
- Do not add new dependencies without a good reason. Add them with `pnpm add` (or `pnpm add -D` for dev tools).
