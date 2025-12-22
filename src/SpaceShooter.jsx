import React, { useState, useEffect, useRef, useCallback } from 'react';

const SpaceShooter = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [lives, setLives] = useState(3);
  const [kills, setKills] = useState(0);
  const [powerLevel, setPowerLevel] = useState(1);
  const [bossHealth, setBossHealth] = useState(0);
  const [bossMaxHealth, setBossMaxHealth] = useState(0);
  const gameLoopRef = useRef(null);
  const keysPressed = useRef({});

  const gameData = useRef({
    player: { x: 400, y: 500, width: 40, height: 40, speed: 5, fireRate: 15, health: 100 },
    bullets: [],
    enemies: [],
    asteroids: [],
    particles: [],
    enemyBullets: [],
    invincible: 0,
    lastFire: 0,
    enemiesKilledThisLevel: 0
  });

  const createParticles = (x, y, count, color) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x, y,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        life: 30,
        color
      });
    }
    gameData.current.particles.push(...particles);
  };

  const createAsteroid = () => {
    return {
      x: Math.random() * 750 + 25,
      y: -50,
      size: 20 + Math.random() * 30,
      speed: 1 + Math.random() * 2 + level * 0.3,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.1
    };
  };

  const createEnemy = (isBoss = false) => {
    if (isBoss) {
      const bossHealth = 500;
      setBossMaxHealth(bossHealth);
      setBossHealth(bossHealth);
      return {
        x: 400,
        y: 100,
        width: 100,
        height: 100,
        speed: 2,
        health: bossHealth,
        maxHealth: bossHealth,
        isBoss: true,
        fireTimer: 0,
        pattern: 0
      };
    }
    return {
      x: Math.random() * 750 + 25,
      y: -50,
      width: 30,
      height: 30,
      speed: 2 + level * 0.5,
      health: 1 + Math.floor(level / 2),
      fireTimer: Math.random() * 60
    };
  };

  const spawnWave = useCallback(() => {
    const data = gameData.current;
    
    if (level === 6) {
      if (data.enemies.length === 0) {
        const boss = createEnemy(true);
        data.enemies.push(boss);
      }
      return;
    }

    const asteroidCount = 3 + level;
    const enemyCount = 2 + Math.floor(level / 2);

    while (data.asteroids.length < asteroidCount) {
      data.asteroids.push(createAsteroid());
    }
    
    if (data.enemies.length < enemyCount && Math.random() < 0.03) {
      data.enemies.push(createEnemy());
    }
  }, [level]);

  // Update power level whenever kills change
  useEffect(() => {
    let newPowerLevel = 1;
    if (kills >= 100) newPowerLevel = 5;
    else if (kills >= 50) newPowerLevel = 4;
    else if (kills >= 25) newPowerLevel = 3;
    else if (kills >= 10) newPowerLevel = 2;
    
    setPowerLevel(newPowerLevel);
    gameData.current.player.fireRate = Math.max(8, 15 - newPowerLevel);
  }, [kills]);

  // Check for level progression
  useEffect(() => {
    if (gameState === 'playing' && level < 6) {
      const data = gameData.current;
      const killsNeeded = 15 + (level - 1) * 5; // 15, 20, 25, 30, 35 kills per level
      
      if (data.enemiesKilledThisLevel >= killsNeeded) {
        setLevel(l => l + 1);
        setGameState('levelComplete');
        data.enemiesKilledThisLevel = 0;
      }
    }
  }, [kills, level, gameState]);

  const update = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = gameData.current;
    const p = data.player;

    // Movement
    if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) p.x = Math.max(20, p.x - p.speed);
    if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) p.x = Math.min(780, p.x + p.speed);
    if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) p.y = Math.max(20, p.y - p.speed);
    if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) p.y = Math.min(580, p.y + p.speed);

    // Fire
    if (keysPressed.current[' '] && data.bullets.length < 80) {
      if (!data.lastFire || Date.now() - data.lastFire > p.fireRate * 16) {
        // Power level determines bullet pattern
        if (powerLevel === 1) {
          // Single bullet
          data.bullets.push({
            x: p.x,
            y: p.y - 20,
            speed: 10,
            damage: 1
          });
        } else if (powerLevel === 2) {
          // Double bullets
          data.bullets.push(
            { x: p.x - 10, y: p.y - 20, speed: 10, damage: 2 },
            { x: p.x + 10, y: p.y - 20, speed: 10, damage: 2 }
          );
        } else if (powerLevel === 3) {
          // Triple bullets
          data.bullets.push(
            { x: p.x - 15, y: p.y - 20, speed: 10, damage: 3 },
            { x: p.x, y: p.y - 20, speed: 10, damage: 3 },
            { x: p.x + 15, y: p.y - 20, speed: 10, damage: 3 }
          );
        } else if (powerLevel === 4) {
          // Quad bullets with wider spread
          data.bullets.push(
            { x: p.x - 25, y: p.y - 20, speed: 10, damage: 4 },
            { x: p.x - 10, y: p.y - 20, speed: 10, damage: 4 },
            { x: p.x + 10, y: p.y - 20, speed: 10, damage: 4 },
            { x: p.x + 25, y: p.y - 20, speed: 10, damage: 4 }
          );
        } else if (powerLevel >= 5) {
          // Five bullets with wide spread
          data.bullets.push(
            { x: p.x - 30, y: p.y - 20, speed: 10, damage: 5 },
            { x: p.x - 15, y: p.y - 20, speed: 10, damage: 5 },
            { x: p.x, y: p.y - 20, speed: 10, damage: 5 },
            { x: p.x + 15, y: p.y - 20, speed: 10, damage: 5 },
            { x: p.x + 30, y: p.y - 20, speed: 10, damage: 5 }
          );
        }
        data.lastFire = Date.now();
      }
    }

    // Update bullets
    data.bullets = data.bullets.filter(b => {
      b.y -= b.speed;
      return b.y > -10;
    });

    // Update asteroids
    data.asteroids = data.asteroids.filter(a => {
      a.y += a.speed;
      a.rotation += a.rotSpeed;
      
      // Collision with player
      const dx = a.x - p.x;
      const dy = a.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < a.size + 20 && data.invincible === 0) {
        createParticles(a.x, a.y, 15, '#ff6b6b');
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameState('gameover');
          return newLives;
        });
        data.invincible = 120;
        return false;
      }
      
      // Collision with bullets
      for (let b of data.bullets) {
        const bdx = a.x - b.x;
        const bdy = a.y - b.y;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
        
        if (bdist < a.size + 5) {
          createParticles(a.x, a.y, 10, '#4ecdc4');
          setScore(s => s + 10);
          setKills(k => k + 1);
          data.enemiesKilledThisLevel++;
          data.bullets = data.bullets.filter(bullet => bullet !== b);
          return false;
        }
      }
      
      return a.y < 650;
    });

    // Update enemies
    data.enemies = data.enemies.filter(e => {
      if (e.isBoss) {
        e.x += Math.sin(e.pattern) * 3;
        e.pattern += 0.05;
        e.fireTimer++;
        
        if (e.fireTimer > 30) {
          e.fireTimer = 0;
          for (let i = -2; i <= 2; i++) {
            data.enemyBullets.push({
              x: e.x + i * 20,
              y: e.y + 50,
              vx: i * 2,
              vy: 5
            });
          }
        }
      } else {
        e.y += e.speed;
        e.fireTimer++;
        
        if (e.fireTimer > 90 && Math.random() < 0.05) {
          data.enemyBullets.push({
            x: e.x,
            y: e.y + 20,
            vx: 0,
            vy: 4
          });
          e.fireTimer = 0;
        }
      }
      
      // Enemy collision with player
      const dx = e.x - p.x;
      const dy = e.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 35 && data.invincible === 0) {
        createParticles(e.x, e.y, 20, '#ff6b6b');
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameState('gameover');
          return newLives;
        });
        data.invincible = 120;
        return false;
      }
      
      // Bullet collision
      let bulletsToRemove = [];
      for (let b of data.bullets) {
        const bdx = e.x - b.x;
        const bdy = e.y - b.y;
        const bdist = Math.sqrt(bdx * bdx + bdy * bdy);
        
        if (bdist < 25) {
          e.health -= b.damage;
          createParticles(b.x, b.y, 5, '#ffd93d');
          bulletsToRemove.push(b);
          
          if (e.isBoss) {
            setBossHealth(Math.max(0, e.health));
          }
          
          if (e.health <= 0) {
            createParticles(e.x, e.y, 30, '#ff6b6b');
            setScore(s => s + (e.isBoss ? 1000 : 50));
            setKills(k => k + 1);
            
            if (!e.isBoss) {
              data.enemiesKilledThisLevel++;
            }
            
            if (e.isBoss) {
              setBossHealth(0);
              setGameState('victory');
            }
            
            // Remove bullets after processing
            data.bullets = data.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
            return false;
          }
        }
      }
      
      // Remove bullets that hit
      if (bulletsToRemove.length > 0) {
        data.bullets = data.bullets.filter(bullet => !bulletsToRemove.includes(bullet));
      }
      
      return e.y < 650;
    });

    // Update enemy bullets
    data.enemyBullets = data.enemyBullets.filter(b => {
      b.x += b.vx;
      b.y += b.vy;
      
      const dx = b.x - p.x;
      const dy = b.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 20 && data.invincible === 0) {
        createParticles(b.x, b.y, 10, '#ff6b6b');
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) setGameState('gameover');
          return newLives;
        });
        data.invincible = 120;
        return false;
      }
      
      return b.y < 650 && b.x > 0 && b.x < 800;
    });

    // Update particles
    data.particles = data.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      return p.life > 0;
    });

    if (data.invincible > 0) data.invincible--;

    spawnWave();
    draw(ctx);
  }, [spawnWave, level, powerLevel]);

  const draw = (ctx) => {
    const data = gameData.current;
    
    // Background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, 800, 600);
    
    // Stars effect
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 137.5) % 800;
      const y = (Date.now() * 0.05 + i * 20) % 600;
      ctx.fillRect(x, y, 2, 2);
    }

    // Draw particles
    data.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.fillRect(p.x, p.y, 4, 4);
    });
    ctx.globalAlpha = 1;

    // Draw bullets
    data.bullets.forEach(b => {
      ctx.fillStyle = '#4ecdc4';
      ctx.shadowColor = '#4ecdc4';
      ctx.shadowBlur = 10;
      ctx.fillRect(b.x - 2, b.y - 8, 4, 16);
    });
    ctx.shadowBlur = 0;

    // Draw enemy bullets
    data.enemyBullets.forEach(b => {
      ctx.fillStyle = '#ff6b6b';
      ctx.shadowColor = '#ff6b6b';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.shadowBlur = 0;

    // Draw asteroids
    data.asteroids.forEach(a => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(a.rotation);
      ctx.strokeStyle = '#95a5a6';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const r = a.size * (0.8 + Math.random() * 0.4);
        const x = Math.cos(angle) * r;
        const y = Math.sin(angle) * r;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    });

    // Draw enemies
    data.enemies.forEach(e => {
      if (e.isBoss) {
        ctx.fillStyle = '#e74c3c';
        ctx.shadowColor = '#e74c3c';
        ctx.shadowBlur = 20;
        ctx.fillRect(e.x - 50, e.y - 50, 100, 100);
        
        // Boss eyes
        ctx.fillStyle = '#fff';
        ctx.fillRect(e.x - 25, e.y - 10, 15, 15);
        ctx.fillRect(e.x + 10, e.y - 10, 15, 15);
        
        ctx.shadowBlur = 0;
      } else {
        ctx.fillStyle = '#e74c3c';
        ctx.shadowColor = '#e74c3c';
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

    // Draw player
    const p = data.player;
    if (data.invincible === 0 || Math.floor(data.invincible / 10) % 2 === 0) {
      ctx.fillStyle = '#4ecdc4';
      ctx.shadowColor = '#4ecdc4';
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 20);
      ctx.lineTo(p.x - 20, p.y + 20);
      ctx.lineTo(p.x, p.y + 10);
      ctx.lineTo(p.x + 20, p.y + 20);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Power level indicator
    if (powerLevel > 1) {
      ctx.fillStyle = '#ffd93d';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`⚡ POWER ${powerLevel}`, p.x - 35, p.y - 30);
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(update, 1000 / 60);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameState, update]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      if (e.key === ' ') e.preventDefault();
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setLevel(1);
    setLives(3);
    setKills(0);
    setPowerLevel(1);
    setBossHealth(0);
    setBossMaxHealth(0);
    gameData.current = {
      player: { x: 400, y: 500, width: 40, height: 40, speed: 5, fireRate: 15 },
      bullets: [],
      enemies: [],
      asteroids: [],
      particles: [],
      enemyBullets: [],
      invincible: 0,
      lastFire: 0,
      enemiesKilledThisLevel: 0
    };
  };

  const nextLevel = () => {
    gameData.current.bullets = [];
    gameData.current.enemies = [];
    gameData.current.asteroids = [];
    gameData.current.enemyBullets = [];
    gameData.current.particles = [];
    gameData.current.player.x = 400;
    gameData.current.player.y = 500;
    setGameState('playing');
  };

  const killsNeeded = level < 6 ? 15 + (level - 1) * 5 : 0;
  const killsThisLevel = gameData.current.enemiesKilledThisLevel;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          className="border-4 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-500/50"
        />
        
        {/* HUD */}
        {gameState === 'playing' && (
          <div className="absolute top-4 left-4 right-4 flex justify-between text-white font-mono">
            <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur">
              <div className="text-cyan-400 text-sm">SCORE</div>
              <div className="text-2xl font-bold">{score}</div>
            </div>
            <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur">
              <div className="text-purple-400 text-sm">LEVEL</div>
              <div className="text-2xl font-bold">{level === 6 ? 'BOSS' : level}</div>
              {level < 6 && (
                <div className="text-xs text-gray-400 mt-1">
                  {killsThisLevel}/{killsNeeded}
                </div>
              )}
            </div>
            <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur">
              <div className="text-yellow-400 text-sm">POWER</div>
              <div className="text-2xl font-bold">⚡{powerLevel}</div>
            </div>
            <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur">
              <div className="text-red-400 text-sm">LIVES</div>
              <div className="text-2xl font-bold">{'❤️'.repeat(lives)}</div>
            </div>
            <div className="bg-black/70 px-4 py-2 rounded-lg backdrop-blur">
              <div className="text-green-400 text-sm">KILLS</div>
              <div className="text-2xl font-bold">{kills}</div>
            </div>
          </div>
        )}

        {/* Boss Health Bar */}
        {gameState === 'playing' && level === 6 && bossMaxHealth > 0 && (
          <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-80">
            <div className="bg-black/70 px-3 py-2 rounded-lg backdrop-blur">
              <div className="text-red-400 text-xs font-bold mb-1 text-center">⚠️ BOSS ⚠️</div>
              <div className="w-full bg-gray-700 h-3 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-red-600 to-red-400 h-full transition-all duration-100"
                  style={{ width: `${(bossHealth / bossMaxHealth) * 100}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Menu */}
        {gameState === 'menu' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur">
            <div className="text-center space-y-8">
              <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                STELLAR STRIKE
              </h1>
              <p className="text-gray-300 text-lg">Clear 5 levels and defeat the boss</p>
              <div className="space-y-2 text-gray-400 text-sm">
                <p>⌨️ WASD or Arrow Keys to move</p>
                <p>🚀 SPACE to fire</p>
                <p>⭐ 15+ kills per level to advance</p>
                <p>⚡ Power up at 10, 25, 50, 100 kills</p>
              </div>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50"
              >
                START GAME
              </button>
            </div>
          </div>
        )}

        {/* Level Complete */}
        {gameState === 'levelComplete' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                LEVEL {level - 1} COMPLETE
              </h2>
              <p className="text-gray-300 text-xl">Score: {score}</p>
              <p className="text-gray-300 text-xl">Total Kills: {kills}</p>
              <p className="text-yellow-400 text-xl">Power Level: {powerLevel}</p>
              {level === 6 && (
                <p className="text-red-400 text-2xl font-bold animate-pulse">⚠️ BOSS INCOMING ⚠️</p>
              )}
              <button
                onClick={nextLevel}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
              >
                {level === 6 ? 'FACE THE BOSS' : 'NEXT LEVEL'}
              </button>
            </div>
          </div>
        )}

        {/* Game Over */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur">
            <div className="text-center space-y-6">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                GAME OVER
              </h2>
              <p className="text-gray-300 text-xl">Final Score: {score}</p>
              <p className="text-gray-300 text-xl">Level Reached: {level}</p>
              <p className="text-gray-300 text-xl">Total Kills: {kills}</p>
              <p className="text-yellow-400 text-xl">Max Power: {powerLevel}</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
              >
                TRY AGAIN
              </button>
            </div>
          </div>
        )}

        {/* Victory */}
        {gameState === 'victory' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur">
            <div className="text-center space-y-6">
              <h2 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-400 to-cyan-400 animate-pulse">
                🎉 VICTORY! 🎉
              </h2>
              <p className="text-gray-300 text-xl">You defeated the boss!</p>
              <p className="text-gray-300 text-2xl font-bold">Final Score: {score}</p>
              <p className="text-gray-300 text-xl">Total Kills: {kills}</p>
              <p className="text-yellow-400 text-xl">Final Power: {powerLevel}</p>
              <button
                onClick={startGame}
                className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-purple-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
              >
                PLAY AGAIN
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SpaceShooter;
