// List of levels, in play order. To add a level: create the .svg file in
// levels/, import its URL here, and add one entry to LEVELS.
import { loadLevel } from "./level.js";
import level1Url from "../levels/level1.svg?url";

export const LEVELS = [{ id: 1, url: level1Url }];

// Levels are loaded once and then kept in memory.
const cache = new Map();

export async function getLevel(entry) {
  if (!cache.has(entry.id)) cache.set(entry.id, await loadLevel(entry.url));
  return cache.get(entry.id);
}
