import { GAME, CANVAS, PLAYER, ENEMY, BOSS, BULLET, ENEMY_BULLET, COLORS } from './constants';
import { 
  createBulletPattern, 
  createEnemy, 
  createBoss, 
  createAsteroid, 
  createEnemyBullet,
  createParticles 
} from './entityFactory';
import {
  checkAsteroidPlayerCollision,
  checkAsteroidBulletCollision,
  checkEnemyPlayerCollision,
  checkEnemyBulletCollision,
  checkEnemyBulletPlayerCollision
} from './collisionService';
import { getAsteroidCount, getEnemyCount } from './gameRules';

export const updatePlayerPosition = (player, keys) => {
  if (keys['ArrowLeft'] || keys['a']) {
    player.x = Math.max(20, player.x - player.speed);
  }
  if (keys['ArrowRight'] || keys['d']) {
    player.x = Math.min(CANVAS.WIDTH - 20, player.x + player.speed);
  }
  if (keys['ArrowUp'] || keys['w']) {
    player.y = Math.max(20, player.y - player.speed);
  }
  if (keys['ArrowDown'] || keys['s']) {
    player.y = Math.min(CANVAS.HEIGHT - 20, player.y + player.speed);
  }
};

export const handlePlayerFiring = (gameData, keys, powerLevel) => {
  const { player, bullets, lastFire } = gameData;
  
  if (keys[' '] && bullets.length < GAME.MAX_BULLETS) {
    if (!lastFire || Date.now() - lastFire > player.fireRate * 16) {
      const newBullets = createBulletPattern(player.x, player.y, powerLevel);
      gameData.bullets.push(...newBullets);
      gameData.lastFire = Date.now();
    }
  }
};

export const updateBullets = (bullets) => {
  return bullets.filter(b => {
    b.y -= b.speed;
    return b.y > -10;
  });
};

export const updateAsteroids = (gameData, callbacks) => {
  const { asteroids, player, bullets, invincible } = gameData;
  const { onLifeLost, onKill, onScoreAdd } = callbacks;
  
  gameData.asteroids = asteroids.filter(a => {
    a.y += a.speed;
    a.rotation += a.rotSpeed;
    
    // Collision with player
    if (checkAsteroidPlayerCollision(a, player, PLAYER.COLLISION_RADIUS) && invincible === 0) {
      gameData.particles.push(...createParticles(a.x, a.y, 15, COLORS.PARTICLE_EXPLOSION));
      onLifeLost();
      gameData.invincible = GAME.INVINCIBILITY_FRAMES;
      return false;
    }
    
    // Collision with bullets
    for (let b of bullets) {
      if (checkAsteroidBulletCollision(a, b, BULLET.COLLISION_RADIUS)) {
        gameData.particles.push(...createParticles(a.x, a.y, 10, COLORS.PARTICLE_ASTEROID));
        onScoreAdd(10);
        onKill();
        gameData.enemiesKilledThisLevel++;
        gameData.bullets = gameData.bullets.filter(bullet => bullet !== b);
        return false;
      }
    }
    
    return a.y < CANVAS.HEIGHT + 50;
  });
};

export const updateEnemies = (gameData, callbacks, level) => {
  const { enemies, player, bullets, invincible } = gameData;
  const { onLifeLost, onKill, onScoreAdd, onBossDefeated, onBossHealthUpdate } = callbacks;
  
  gameData.enemies = enemies.filter(e => {
    if (e.isBoss) {
      e.x += Math.sin(e.pattern) * 3;
      e.pattern += BOSS.PATTERN_SPEED;
      e.fireTimer++;
      
      if (e.fireTimer > BOSS.FIRE_INTERVAL) {
        e.fireTimer = 0;
        for (let i = -2; i <= 2; i++) {
          gameData.enemyBullets.push(createEnemyBullet(e.x + i * 20, e.y + 50, i * 2, 5));
        }
      }
    } else {
      e.y += e.speed;
      e.fireTimer++;
      
      if (e.fireTimer > ENEMY.FIRE_INTERVAL && Math.random() < ENEMY.FIRE_CHANCE) {
        gameData.enemyBullets.push(createEnemyBullet(e.x, e.y + 20, 0, 4));
        e.fireTimer = 0;
      }
    }
    
    // Enemy collision with player
    if (checkEnemyPlayerCollision(e, player, ENEMY.COLLISION_RADIUS) && invincible === 0) {
      gameData.particles.push(...createParticles(e.x, e.y, 20, COLORS.PARTICLE_EXPLOSION));
      onLifeLost();
      gameData.invincible = GAME.INVINCIBILITY_FRAMES;
      return false;
    }
    
    // Bullet collision
    let bulletsToRemove = [];
    for (let b of bullets) {
      if (checkEnemyBulletCollision(e, b, ENEMY.COLLISION_RADIUS)) {
        e.health -= b.damage;
        gameData.particles.push(...createParticles(b.x, b.y, 5, COLORS.PARTICLE_HIT));
        bulletsToRemove.push(b);
        
        if (e.isBoss) {
          onBossHealthUpdate(Math.max(0, e.health));
        }
        
        if (e.health <= 0) {
          gameData.particles.push(...createParticles(e.x, e.y, 30, COLORS.PARTICLE_EXPLOSION));
          onScoreAdd(e.isBoss ? BOSS.SCORE_VALUE : ENEMY.SCORE_VALUE);
          onKill();
          
          if (!e.isBoss) {
            gameData.enemiesKilledThisLevel++;
          }
          
          if (e.isBoss) {
            onBossHealthUpdate(0);
            onBossDefeated();
          }
          
          gameData.bullets = gameData.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
          return false;
        }
      }
    }
    
    if (bulletsToRemove.length > 0) {
      gameData.bullets = gameData.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
    }
    
    return e.y < CANVAS.HEIGHT + 50;
  });
};

export const updateEnemyBullets = (gameData, callbacks) => {
  const { enemyBullets, player, invincible } = gameData;
  const { onLifeLost } = callbacks;
  
  gameData.enemyBullets = enemyBullets.filter(b => {
    b.x += b.vx;
    b.y += b.vy;
    
    if (checkEnemyBulletPlayerCollision(b, player, ENEMY_BULLET.COLLISION_RADIUS) && invincible === 0) {
      gameData.particles.push(...createParticles(b.x, b.y, 10, COLORS.PARTICLE_EXPLOSION));
      onLifeLost();
      gameData.invincible = GAME.INVINCIBILITY_FRAMES;
      return false;
    }
    
    return b.y < CANVAS.HEIGHT + 50 && b.x > 0 && b.x < CANVAS.WIDTH;
  });
};

export const updateParticles = (particles) => {
  return particles.filter(p => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    return p.life > 0;
  });
};

export const spawnWave = (gameData, level) => {
  if (level === GAME.BOSS_LEVEL) {
    if (gameData.enemies.length === 0) {
      gameData.enemies.push(createBoss());
    }
    return;
  }

  const asteroidCount = getAsteroidCount(level);
  const enemyCount = getEnemyCount(level);

  while (gameData.asteroids.length < asteroidCount) {
    gameData.asteroids.push(createAsteroid(level));
  }
  
  if (gameData.enemies.length < enemyCount && Math.random() < ENEMY.SPAWN_CHANCE) {
    gameData.enemies.push(createEnemy(level));
  }
};
