import { PLAYER, ENEMY, BOSS, ASTEROID, BULLET, PARTICLE, CANVAS } from './constants';

export const createPlayer = () => ({
  x: PLAYER.INITIAL_X,
  y: PLAYER.INITIAL_Y,
  width: PLAYER.WIDTH,
  height: PLAYER.HEIGHT,
  speed: PLAYER.SPEED,
  fireRate: PLAYER.BASE_FIRE_RATE,
  health: PLAYER.INITIAL_HEALTH
});

export const createBullet = (x, y, damage) => ({
  x,
  y,
  speed: BULLET.SPEED,
  damage
});

export const createBulletPattern = (playerX, playerY, powerLevel) => {
  const bullets = [];
  const y = playerY - 20;

  switch (powerLevel) {
    case 1:
      bullets.push(createBullet(playerX, y, 1));
      break;
    case 2:
      bullets.push(
        createBullet(playerX - 10, y, 2),
        createBullet(playerX + 10, y, 2)
      );
      break;
    case 3:
      bullets.push(
        createBullet(playerX - 15, y, 3),
        createBullet(playerX, y, 3),
        createBullet(playerX + 15, y, 3)
      );
      break;
    case 4:
      bullets.push(
        createBullet(playerX - 25, y, 4),
        createBullet(playerX - 10, y, 4),
        createBullet(playerX + 10, y, 4),
        createBullet(playerX + 25, y, 4)
      );
      break;
    default: // Power level 5+
      bullets.push(
        createBullet(playerX - 30, y, 5),
        createBullet(playerX - 15, y, 5),
        createBullet(playerX, y, 5),
        createBullet(playerX + 15, y, 5),
        createBullet(playerX + 30, y, 5)
      );
  }

  return bullets;
};

export const createEnemy = (level) => ({
  x: Math.random() * 750 + 25,
  y: -50,
  width: ENEMY.WIDTH,
  height: ENEMY.HEIGHT,
  speed: ENEMY.BASE_SPEED + level * 0.5,
  health: ENEMY.BASE_HEALTH + Math.floor(level / 2),
  fireTimer: Math.random() * 60
});

export const createBoss = () => {
  const health = BOSS.INITIAL_HEALTH;
  return {
    x: 400,
    y: 100,
    width: BOSS.WIDTH,
    height: BOSS.HEIGHT,
    speed: BOSS.SPEED,
    health,
    maxHealth: health,
    isBoss: true,
    fireTimer: 0,
    pattern: 0
  };
};

export const createAsteroid = (level) => {
  // Create consistent jagged shape for each asteroid
  const points = [];
  for (let i = 0; i < 8; i++) {
    points.push(0.8 + Math.random() * 0.4); // Random radius multiplier for each point
  }
  
  return {
    x: Math.random() * 750 + 25,
    y: -50,
    size: ASTEROID.MIN_SIZE + Math.random() * (ASTEROID.MAX_SIZE - ASTEROID.MIN_SIZE),
    speed: ASTEROID.BASE_SPEED + Math.random() * ASTEROID.MAX_SPEED_VARIANCE + level * 0.3,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * ASTEROID.ROTATION_SPEED,
    points // Store the shape
  };
};

export const createEnemyBullet = (x, y, vx = 0, vy = 4) => ({
  x,
  y,
  vx,
  vy
});

export const createParticle = (x, y, color) => ({
  x,
  y,
  vx: (Math.random() - 0.5) * PARTICLE.SPEED_VARIANCE,
  vy: (Math.random() - 0.5) * PARTICLE.SPEED_VARIANCE,
  life: PARTICLE.LIFE,
  color
});

export const createParticles = (x, y, count, color) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    particles.push(createParticle(x, y, color));
  }
  return particles;
};
