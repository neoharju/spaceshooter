// Game configuration constants
export const CANVAS = {
  WIDTH: 800,
  HEIGHT: 600
};

export const PLAYER = {
  INITIAL_X: 400,
  INITIAL_Y: 500,
  WIDTH: 40,
  HEIGHT: 40,
  SPEED: 5,
  BASE_FIRE_RATE: 15,
  INITIAL_HEALTH: 100,
  COLLISION_RADIUS: 20
};

export const GAME = {
  FPS: 60,
  INITIAL_LIVES: 3,
  INITIAL_LEVEL: 1,
  BOSS_LEVEL: 6,
  INVINCIBILITY_FRAMES: 120,
  MAX_BULLETS: 80
};

export const POWER_LEVELS = {
  1: { minKills: 0, fireRate: 15, damage: 1 },
  2: { minKills: 20, fireRate: 13, damage: 2 },
  3: { minKills: 50, fireRate: 11, damage: 3 },
  4: { minKills: 100, fireRate: 9, damage: 4 },
  5: { minKills: 150, fireRate: 8, damage: 5 }
};

export const ENEMY = {
  WIDTH: 30,
  HEIGHT: 30,
  BASE_SPEED: 2,
  COLLISION_RADIUS: 25,
  BASE_HEALTH: 1,
  FIRE_INTERVAL: 90,
  FIRE_CHANCE: 0.05,
  SPAWN_CHANCE: 0.03,
  SCORE_VALUE: 50
};

export const BOSS = {
  WIDTH: 100,
  HEIGHT: 100,
  SPEED: 2,
  INITIAL_HEALTH: 500,
  FIRE_INTERVAL: 30,
  PATTERN_SPEED: 0.05,
  SCORE_VALUE: 1000
};

export const ASTEROID = {
  MIN_SIZE: 20,
  MAX_SIZE: 50,
  BASE_SPEED: 1,
  MAX_SPEED_VARIANCE: 2,
  ROTATION_SPEED: 0.02
};

export const BULLET = {
  SPEED: 10,
  WIDTH: 4,
  HEIGHT: 16,
  COLLISION_RADIUS: 5
};

export const ENEMY_BULLET = {
  SPEED: 4,
  COLLISION_RADIUS: 20
};

export const PARTICLE = {
  LIFE: 30,
  SPEED_VARIANCE: 8
};

export const LEVEL_PROGRESSION = {
  BASE_KILLS_REQUIRED: 30,
  KILLS_INCREMENT: 5
};

export const COLORS = {
  BACKGROUND: '#0a0e27',
  PLAYER: '#4ecdc4',
  BULLET: '#4ecdc4',
  ENEMY: '#e74c3c',
  ENEMY_BULLET: '#ff6b6b',
  ASTEROID: '#95a5a6',
  PARTICLE_EXPLOSION: '#ff6b6b',
  PARTICLE_HIT: '#ffd93d',
  PARTICLE_ASTEROID: '#4ecdc4'
};
