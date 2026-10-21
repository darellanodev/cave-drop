// Load a level from an SVG file.
// Expected elements: <polygon class="terrain">, <polygon id="goal">, <circle id="start">
// Optional: <polygon id="teleport-in"> and <polygon id="teleport-out"> (a teleport).

function parsePoints(el) {
  return el
    .getAttribute("points")
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return { x, y };
    });
}

// Average of the points of a polygon.
function center(points) {
  const sum = points.reduce((a, p) => ({ x: a.x + p.x, y: a.y + p.y }), {
    x: 0,
    y: 0,
  });
  return { x: sum.x / points.length, y: sum.y / points.length };
}

export function parseLevel(svgText) {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const goalEl = doc.getElementById("goal");
  const startEl = doc.getElementById("start");
  if (!goalEl || !startEl)
    throw new Error(
      'Level needs an element with id="goal" and one with id="start".',
    );

  // A level can have one teleport: balls that enter `in` come out at `exit`.
  const teleportInEl = doc.getElementById("teleport-in");
  const teleportOutEl = doc.getElementById("teleport-out");
  let teleport = null;
  if (teleportInEl && teleportOutEl) {
    const out = parsePoints(teleportOutEl);
    teleport = { in: parsePoints(teleportInEl), out, exit: center(out) };
  }

  return {
    terrain: [...doc.querySelectorAll(".terrain")].map(parsePoints),
    goal: parsePoints(goalEl),
    start: { x: +startEl.getAttribute("cx"), y: +startEl.getAttribute("cy") },
    teleport,
  };
}

export async function loadLevel(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load level: ${url} (${res.status})`);
  return parseLevel(await res.text());
}
