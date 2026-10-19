# Cave Drop

A 2D physics game for the web. It is a port of my old Processing game for Android. White balls fall from the start point and bounce on the terrain. Place thin bars to guide them to the yellow goal. A bar is fixed when you release the mouse (or finger), and it cannot be removed.

Built with plain JavaScript (ES modules), HTML canvas and [Matter.js](https://brm.io/matter-js/). It uses [Vite](https://vite.dev/) for development and builds, and [pnpm](https://pnpm.io/) as package manager.

## Run it

You need Node.js 20.19 or newer and pnpm.

```
pnpm install
pnpm dev
```

Then open the address shown in the terminal.

Other commands:

- `pnpm build`: create the production build in `dist/`.
- `pnpm preview`: serve the production build locally.

## Build and deploy on GitHub

The workflow `.github/workflows/build.yml` runs on every push to `main` and on every pull request. It installs the dependencies and runs `pnpm build`.

On pushes to `main` it also publishes the game to GitHub Pages: `https://<your-user>.github.io/cave-drop/`.

One-time setup: in the repository go to **Settings → Pages** and set **Source** to **GitHub Actions**.

## Project structure

```
index.html        page and canvas
styles.css        page styles
vite.config.js    Vite settings
.github/workflows/build.yml   automatic build on push
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
