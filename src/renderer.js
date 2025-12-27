import { CANVAS, COLORS } from './constants';

export const drawBackground = (ctx) => {
  ctx.fillStyle = COLORS.BACKGROUND;
  ctx.fillRect(0, 0, CANVAS.WIDTH, CANVAS.HEIGHT);
};

export const drawStars = (ctx) => {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
  for (let i = 0; i < 50; i++) {
    const x = (i * 137.5) % CANVAS.WIDTH;
    const y = (Date.now() * 0.05 + i * 20) % CANVAS.HEIGHT;
    ctx.fillRect(x, y, 2, 2);
  }
};

export const drawParticles = (ctx, particles) => {
  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.globalAlpha = p.life / 30;
    ctx.fillRect(p.x, p.y, 4, 4);
  });
  ctx.globalAlpha = 1;
};

export const drawBullets = (ctx, bullets) => {
  bullets.forEach(b => {
    ctx.fillStyle = COLORS.BULLET;
    ctx.shadowColor = COLORS.BULLET;
    ctx.shadowBlur = 10;
    ctx.fillRect(b.x - 2, b.y - 8, 4, 16);
  });
  ctx.shadowBlur = 0;
};

export const drawEnemyBullets = (ctx, enemyBullets) => {
  enemyBullets.forEach(b => {
    ctx.fillStyle = COLORS.ENEMY_BULLET;
    ctx.shadowColor = COLORS.ENEMY_BULLET;
    ctx.shadowBlur = 10;
    ctx.beginPath();
    ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.shadowBlur = 0;
};

export const drawAsteroids = (ctx, asteroids) => {
  asteroids.forEach(a => {
    ctx.save();
    ctx.translate(a.x, a.y);
    ctx.rotate(a.rotation);
    ctx.strokeStyle = COLORS.ASTEROID;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    // Use pre-generated points for consistent jagged shape
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const r = a.size * a.points[i]; // Use stored radius multiplier
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  });
};

export const drawEnemies = (ctx, enemies) => {
  enemies.forEach(e => {
    if (e.isBoss) {
      ctx.fillStyle = COLORS.ENEMY;
      ctx.shadowColor = COLORS.ENEMY;
      ctx.shadowBlur = 20;
      ctx.fillRect(e.x - 50, e.y - 50, 100, 100);
      
      // Boss eyes
      ctx.fillStyle = '#fff';
      ctx.fillRect(e.x - 25, e.y - 10, 15, 15);
      ctx.fillRect(e.x + 10, e.y - 10, 15, 15);
      
      ctx.shadowBlur = 0;
    } else {
      ctx.fillStyle = COLORS.ENEMY;
      ctx.shadowColor = COLORS.ENEMY;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(e.x, e.y - 15);
      ctx.lineTo(e.x - 15, e.y + 15);
      ctx.lineTo(e.x + 15, e.y + 15);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  });
};

export const drawPlayer = (ctx, player, invincible, powerLevel) => {
  if (invincible === 0 || Math.floor(invincible / 10) % 2 === 0) {
    ctx.fillStyle = COLORS.PLAYER;
    ctx.shadowColor = COLORS.PLAYER;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y - 20);
    ctx.lineTo(player.x - 20, player.y + 20);
    ctx.lineTo(player.x, player.y + 10);
    ctx.lineTo(player.x + 20, player.y + 20);
    ctx.closePath();
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  // Power level indicator
  if (powerLevel > 1) {
    ctx.fillStyle = '#ffd93d';
    ctx.font = 'bold 14px monospace';
    ctx.fillText(`⚡ POWER ${powerLevel}`, player.x - 35, player.y - 30);
  }
};

export const renderGame = (ctx, gameData, powerLevel) => {
  drawBackground(ctx);
  drawStars(ctx);
  drawParticles(ctx, gameData.particles);
  drawBullets(ctx, gameData.bullets);
  drawEnemyBullets(ctx, gameData.enemyBullets);
  drawAsteroids(ctx, gameData.asteroids);
  drawEnemies(ctx, gameData.enemies);
  drawPlayer(ctx, gameData.player, gameData.invincible, powerLevel);
};
