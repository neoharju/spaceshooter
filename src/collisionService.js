export const checkCircleCollision = (x1, y1, r1, x2, y2, r2) => {
  const dx = x1 - x2;
  const dy = y1 - y2;
  const distance = Math.sqrt(dx * dx + dy * dy);
  return distance < r1 + r2;
};

export const checkAsteroidPlayerCollision = (asteroid, player, radius) => {
  return checkCircleCollision(
    asteroid.x,
    asteroid.y,
    asteroid.size,
    player.x,
    player.y,
    radius
  );
};

export const checkAsteroidBulletCollision = (asteroid, bullet, bulletRadius) => {
  return checkCircleCollision(
    asteroid.x,
    asteroid.y,
    asteroid.size,
    bullet.x,
    bullet.y,
    bulletRadius
  );
};

export const checkEnemyPlayerCollision = (enemy, player, collisionRadius) => {
  return checkCircleCollision(
    enemy.x,
    enemy.y,
    collisionRadius,
    player.x,
    player.y,
    collisionRadius
  );
};

export const checkEnemyBulletCollision = (enemy, bullet, collisionRadius) => {
  return checkCircleCollision(
    enemy.x,
    enemy.y,
    collisionRadius,
    bullet.x,
    bullet.y,
    collisionRadius
  );
};

export const checkEnemyBulletPlayerCollision = (bullet, player, collisionRadius) => {
  return checkCircleCollision(
    bullet.x,
    bullet.y,
    collisionRadius,
    player.x,
    player.y,
    collisionRadius
  );
};
