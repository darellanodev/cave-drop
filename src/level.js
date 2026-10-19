// Load a level from an SVG file.
// Expected elements: <polygon class="terrain">, <polygon id="goal">, <circle id="start">

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

export function parseLevel(svgText) {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const goalEl = doc.getElementById("goal");
  const startEl = doc.getElementById("start");
  if (!goalEl || !startEl)
    throw new Error(
      'Level needs an element with id="goal" and one with id="start".',
    );

  return {
    terrain: [...doc.querySelectorAll(".terrain")].map(parsePoints),
    goal: parsePoints(goalEl),
    start: { x: +startEl.getAttribute("cx"), y: +startEl.getAttribute("cy") },
  };
}

export async function loadLevel(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not load level: ${url} (${res.status})`);
  return parseLevel(await res.text());
}
