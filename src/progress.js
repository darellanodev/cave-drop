// Saved progress: the highest level the player can play.
// It is kept in the browser (localStorage), so it is still there when the game is opened again.
const KEY = "cave-drop-progress";

function read() {
  try {
    const data = JSON.parse(localStorage.getItem(KEY));
    const n = Number(data && data.unlocked);
    if (Number.isInteger(n) && n >= 1) return n;
  } catch (err) {
    // No storage, or the saved data is not valid: start from level 1.
  }
  return 1;
}

// Kept in memory, so it is not read from the storage on every frame.
let unlocked = read();

// Highest level that can be played. Level 1 is always unlocked.
export function getUnlocked() {
  return unlocked;
}

// Unlock all the levels up to `id`. It never goes back to a lower level.
export function unlockLevel(id) {
  if (id <= unlocked) return;
  unlocked = id;
  try {
    localStorage.setItem(KEY, JSON.stringify({ unlocked }));
  } catch (err) {
    // The progress is only kept until the page is closed.
  }
}
