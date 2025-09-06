export const GAME_WIDTH = 1000;
export const GAME_HEIGHT = 400;

export const WORLD_UNIT_TO_PIXEL = 5;

// Ground
export const GROUND_HEIGHT = 50;

// Character
export const CHARACTER_X_POSITION = 50;
export const CHARACTER_WIDTH = 40;
export const CHARACTER_HEIGHT_NORMAL = 60;
export const CHARACTER_HEIGHT_CROUCH = 30;

// Physics
export const JUMP_VELOCITY = 800;
export const GRAVITY = -2500;
export const GAME_SPEED_START = 50;
export const GAME_SPEED_INCREMENT = 0.5;

// Hurdles
export const HURDLE_WIDTH = 30;
export const HURDLE_HEIGHT_LOW = 40;
export const HURDLE_HEIGHT_HIGH = 55;
export const HURDLE_SPAWN_INTERVAL = { MIN: 2.5, MAX: 4.5 }; // in seconds at base speed

// Power-ups
export const POWERUP_WIDTH = 30;
export const POWERUP_HEIGHT = 30;
export const POWERUP_SPAWN_INTERVAL = { MIN: 10, MAX: 20 }; // in seconds
export const POWERUP_SHIELD_DURATION = 5; // in seconds
