// Game settings. Change gameplay values here.

// Logical size of the game. All coordinates use this space.
export const W = 320;
export const H = 510;

export const TOTAL_BALLS = 10; // balls per level
export const MAX_LOST = 5; // you lose when lost balls go above this value
export const SPAWN_INTERVAL = 1200; // ms between balls
export const BALL_LIFETIME = 8300; // ms a ball can live before it is lost (like the old game: 500 frames at 60 fps)
export const BALL_FADE_TIME = 4250; // ms before the end in which the ball turns from white to dark grey

export const BALL_RADIUS = 5;
export const BAR_LENGTH = 44;
export const BAR_THICKNESS = 4;

export const GRAVITY = 0.4;

// "MENU" button in the top bar while playing (leaves the level).
export const MENU_BUTTON = { x: 252, y: 0, w: 68, h: 34 };
