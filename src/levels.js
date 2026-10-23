// List of levels, in play order. To add a level: create the .svg file in
// levels/, import its URL here, and add one entry to LEVELS.
import { loadLevel } from "./level.js";
import level1Url from "../levels/level1.svg?url";
import level2Url from "../levels/level2.svg?url";
import level3Url from "../levels/level3.svg?url";
import level4Url from "../levels/level4.svg?url";
import level5Url from "../levels/level5.svg?url";
import level6Url from "../levels/level6.svg?url";
import level7Url from "../levels/level7.svg?url";
import level8Url from "../levels/level8.svg?url";
import level9Url from "../levels/level9.svg?url";
import level10Url from "../levels/level10.svg?url";
import level11Url from "../levels/level11.svg?url";
import level12Url from "../levels/level12.svg?url";
import level13Url from "../levels/level13.svg?url";
import level14Url from "../levels/level14.svg?url";
import level15Url from "../levels/level15.svg?url";
import level16Url from "../levels/level16.svg?url";
import level17Url from "../levels/level17.svg?url";
import level18Url from "../levels/level18.svg?url";
import level19Url from "../levels/level19.svg?url";
import level20Url from "../levels/level20.svg?url";
import level21Url from "../levels/level21.svg?url";
import level22Url from "../levels/level22.svg?url";
import level23Url from "../levels/level23.svg?url";
import level24Url from "../levels/level24.svg?url";
import level25Url from "../levels/level25.svg?url";
import level26Url from "../levels/level26.svg?url";
import level27Url from "../levels/level27.svg?url";
import level28Url from "../levels/level28.svg?url";
import level29Url from "../levels/level29.svg?url";
import level30Url from "../levels/level30.svg?url";
import level31Url from "../levels/level31.svg?url";
import level32Url from "../levels/level32.svg?url";

export const LEVELS = [
  { id: 1, url: level1Url },
  { id: 2, url: level2Url },
  { id: 3, url: level3Url },
  { id: 4, url: level4Url },
  { id: 5, url: level5Url },
  { id: 6, url: level6Url },
  { id: 7, url: level7Url },
  { id: 8, url: level8Url },
  { id: 9, url: level9Url },
  { id: 10, url: level10Url },
  { id: 11, url: level11Url },
  { id: 12, url: level12Url },
  { id: 13, url: level13Url },
  { id: 14, url: level14Url },
  { id: 15, url: level15Url },
  { id: 16, url: level16Url },
  { id: 17, url: level17Url },
  { id: 18, url: level18Url },
  { id: 19, url: level19Url },
  { id: 20, url: level20Url },
  { id: 21, url: level21Url },
  { id: 22, url: level22Url },
  { id: 23, url: level23Url },
  { id: 24, url: level24Url },
  { id: 25, url: level25Url },
  { id: 26, url: level26Url },
  { id: 27, url: level27Url },
  { id: 28, url: level28Url },
  { id: 29, url: level29Url },
  { id: 30, url: level30Url },
  { id: 31, url: level31Url },
  { id: 32, url: level32Url },
];

// Levels are loaded once and then kept in memory.
const cache = new Map();

export async function getLevel(entry) {
  if (!cache.has(entry.id)) cache.set(entry.id, await loadLevel(entry.url));
  return cache.get(entry.id);
}
