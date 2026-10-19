# Cave Drop

A 2D physics game for the web. It is a port of my old Processing game for Android. White balls fall from the start point and bounce on the terrain. Place thin bars to guide them to the yellow goal. A bar is fixed when you release the mouse (or finger), and it cannot be removed.

Built with plain JavaScript (ES modules), HTML canvas and [Matter.js](https://brm.io/matter-js/). The package manager is [pnpm](https://pnpm.io/).

## Run it

The game loads files with `fetch`, so it needs a local server (opening `index.html` directly will not work).

```
pnpm install
pnpm start
```

Then open the address shown in the terminal.

## Project structure

```
index.html        page and canvas
styles.css        page styles
src/main.js       startup and main loop
src/config.js     game settings (size, gravity, balls, bars)
src/level.js      load levels from SVG
src/game.js       rules and physics
src/input.js      mouse and touch input
src/render.js     canvas drawing and HUD
levels/           level files (.svg)
```

## Make a level

A level is an SVG file with `viewBox="0 0 320 510"`:

- `<polygon class="terrain" points="...">`: solid obstacles (must be convex).
- `<polygon id="goal" points="...">`: the goal area.
- `<circle id="start" cx="..." cy="...">`: where balls appear.

See `levels/level1.svg` for an example. More details are in `AGENTS.md`.
