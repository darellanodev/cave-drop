# AGENTS.md

Guide for coding agents and contributors working on Cave Drop.

## Project description

Cave Drop is a 2D physics game for the web. White balls fall from a start point, bounce on the terrain, and must reach a goal (a yellow triangle). The player places thin bars to guide the balls. A bar becomes fixed when the player releases the mouse, and it cannot be removed.

## Stack

- **Language:** plain JavaScript with ES modules. Moving to TypeScript is a future option.
- **Physics:** [Matter.js](https://brm.io/matter-js/), installed from npm and imported with `import Matter from "matter-js"`.
- **Rendering:** native 2D `<canvas>`, drawn by hand on every frame (`Matter.Render` is not used).
- **Levels:** SVG files in `levels/`. They are imported in `src/main.js` with `?url` and read with `fetch` and `DOMParser`.
- **Tooling:** [Vite](https://vite.dev/) for the dev server and the production build. Package manager: **pnpm**.
- **CI/CD:** GitHub Actions builds the project on every push to `main` and on pull requests. Pushes to `main` are also deployed to GitHub Pages (repository setting: Pages source = GitHub Actions).

## Project structure

```
index.html        page and canvas
styles.css        page styles
vite.config.js    Vite settings
.github/workflows/build.yml   build, and deploy to GitHub Pages
src/main.js       startup, scene switching, main loop, pointer events
src/config.js     game settings
src/levels.js     list of levels (LEVELS) and level cache
src/level.js      load and parse SVG levels
src/game.js       rules and physics (no drawing)
src/input.js      bar placing (press, rotate, release)
src/render.js     draws the game screen and HUD
src/ui.js         helpers for menu screens (buttons, text, hit test)
src/scenes/       one file per screen: title, levelSelect, credits, play
src/assets/       images (logo)
levels/*.svg      levels
```

## Screens (scenes)

The game has four screens. `main.js` shows one at a time and sends the pointer events to it.

```
title -> levels -> play
  |        ^         |
  v        |_________|  (MENU button, or tap after the level ends)
credits
```

Every scene is an object with: `update(now)`, `draw()`, `pointerDown(p)`, and optionally `enter(params)`, `exit()`, `pointerMove(p)`, `pointerUp(p)`, `pointerCancel()`. It can also have a `hint` text for the line under the canvas. A scene changes screen with `goTo(name, params)`. To add a screen, create a file in `src/scenes/` and register it in `main.js`.

Keep each file focused on one job:

- `game.js` knows the rules and physics. It must not draw or read the mouse.
- `render.js` only draws. It must not change the game state.
- `input.js` only turns pointer positions into bars (`game.addBar`). It does not listen to the browser: `main.js` sends the events.
- `scenes/*.js` are the screens. Menu screens draw with `ui.js`. The play screen uses `game.js`, `input.js` and `render.js`.

## How to run

Needs Node.js 20.19 or newer.

```
pnpm install
pnpm dev        # dev server
pnpm build      # production build in dist/
pnpm preview    # serve the production build
```

Run `pnpm build` before you finish a task. The CI runs the same command.

## Level format (SVG)

The game uses a logical size of **320 × 510** (`viewBox="0 0 320 510"`). The canvas is scaled with CSS and keeps its proportions.

| Element                     | Meaning                                                          |
| --------------------------- | ---------------------------------------------------------------- |
| `<polygon class="terrain">` | Static obstacle. Balls bounce on it.                             |
| `<polygon id="goal">`       | Goal area. If the center of a ball enters it, the ball is saved. |
| `<circle id="start">`       | Start point (`cx`, `cy`) where balls appear.                     |
| `<polygon id="teleport-in">`  | Optional. A ball that enters it moves to the exit, keeping its speed. |
| `<polygon id="teleport-out">` | Optional. Only drawn. The exit is its center (average of its points). |

Rules for making levels:

- Use only `<polygon>` with `points="x,y x,y ..."`. This is what the loader reads.
- Terrain polygons can be concave. The game splits them into convex parts with `poly-decomp` (set in `src/game.js`). Keep them simple: no crossing edges and no holes.
- A level has at most one teleport. Use both `teleport-in` and `teleport-out`, or none.
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
- Always use the logical space 320 × 510. Convert pointer coordinates with `toGame()` in `src/ui.js`.
- Install libraries with pnpm and import them. Do not load libraries from a CDN.
- To add a level: create the `.svg` file, import it with `?url` in `src/levels.js` (for example `import level2Url from "../levels/level2.svg?url"`), and add an entry to `LEVELS`. Do not use plain paths like `fetch("levels/...")`, because they break in the build.
- Use **pnpm** only. Do not use `npm` or `yarn`, and do not create `package-lock.json` or `yarn.lock`. Commit `pnpm-lock.yaml`, because the CI uses `--frozen-lockfile`.
- Do not use `localStorage` without a `try/catch`.
- One export per clear purpose. Avoid circular imports.

## Physics warnings

- Bars are thin (4 px). Fast balls can pass through them (_tunneling_). Possible fixes: raise `positionIterations`, limit the maximum speed, or make the bars thicker.
- Balls and bars are added and removed with `Composite.add` / `Composite.remove`. On restart, `Game.restart()` creates a new engine. The old engine is not reused.
- Goal detection uses `Vertices.contains` on the ball position. It does not use a Matter sensor.

## Roadmap

- [ ] Limit the number of bars per level and show a counter in the HUD.
- [ ] Special elements by `id`/`class` in the SVG (trampolines with more bounce, sensors, moving obstacles).
- [ ] Sounds (bounce, goal, lost ball).
- [ ] Save progress (finished levels, score), with `try/catch` around storage.
- [ ] PWA (`manifest.json` + service worker) to install the game on Android.
- [ ] Support `<path>`, `<rect>` and `<circle>` in the level loader.
- [ ] Basic tests for `parseLevel` and the game rules.
- [ ] Move to TypeScript if the project grows.

## Levels and the old game

Level 1 was made for this project. Level 2 is the old `cnivel3.svg`, and levels 3 to 17 are the other old levels without fire, in the old order:

| New level | Old file |
|---|---|
| 2 | `cnivel3.svg` |
| 3 | `cnivel1.svg` |
| 4 | `cnivel2.svg` |
| 5 | `cnivel4.svg` |
| 6 | `cnivel5.svg` |
| 7 | `cnivel6.svg` |
| 8 | `cnivel7.svg` |
| 9 | `cnivel8.svg` |
| 10 | `cnivel9.svg` |
| 11 | `cnivel10.svg` |
| 12 | `cnivel11.svg` |
| 13 | `cnivel12.svg` |
| 14 | `cnivel13.svg` |
| 15 | `cnivel14.svg` |
| 16 | `cnivel15.svg` |
| 17 | `cnivel16.svg` |

The old levels are 500 × 800 and use `<path>`. They were converted to 320 × 510 `<polygon>` with a scale of 0.64. The start position of the old levels came from a server, so the `start` circle of each level was chosen by hand (always at `y = 40`, under the top bar). Change it in the SVG if a level feels too easy or too hard.

The level select shows up to 5 rows of 4 buttons (20 levels). For more levels, the pages (`<<` and `>>`) must be ported first.

## Port from the old Processing version

The old Android version (2014) had more features. Already ported: title screen (START, CREDITS), level select, teleports, and 17 levels (all the old levels without fire, `cnivel1` to `cnivel16`). Still to port, in the old game:

- [ ] **Sound button** on the title screen (ON/OFF) and the sound effects (button, enter goal, lost ball, level completed or failed, teleport).
- [ ] **Levels with fire** (`cnivel17.svg` to `cnivel31.svg`, 15 levels). They need the fire object first. After that, convert them like the others.
- [ ] **Level select with caves**: pages of 16 levels with `<<` and `>>`, locked levels in red, and an `END` button after the last level.
- [ ] **Saved progress**: the highest level reached (and the sound option) kept between sessions.
- [ ] **Fire objects**: a ball that touches one is destroyed.
- [ ] **Pause dialog** while playing: CONTINUE, RESTART LEVEL, EXIT TO MENU.
- [ ] **Timer** in the HUD (`minutes:seconds:tenths`) and the time to complete the level.
- [ ] **Balls die by time**: a ball that lives too long turns grey and is lost.
- [ ] **Color flash** in the HUD when a ball is saved or lost.
- [ ] **Title screen with physics**: in the old game the title was a level where the balls fell on the logo.
- [ ] **Twinkling background triangles** on the menus.
- [ ] **Screens**: "Congratulations, all rooms completed" and connection error (the error screen is only needed if levels come from a server again).

The old source is not part of this repository. Its logic is described above, so no need to read it again.

## Instructions for agents

- Before changing physics or rules, read **Gameplay settings** and **Physics warnings**.
- Respect the split between `game.js`, `render.js`, `input.js` and the scenes.
- When adding levels, check that the SVG follows the format above.
- Always test with mouse and touch (the events are `pointer*`).
- The site is served from a sub-path (`/cave-drop/`). Keep `base: "./"` in `vite.config.js` and do not use absolute paths like `/img/a.png`.
- Do not break the CI: `pnpm install --frozen-lockfile` and `pnpm build` must pass.
- Do not add new dependencies without a good reason. Add them with `pnpm add` (or `pnpm add -D` for dev tools).
