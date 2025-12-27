import React, { useRef, useEffect, useCallback } from 'react';
import { CANVAS, GAME, BOSS } from './constants';
import { createPlayer } from './entityFactory';
import { calculatePowerLevel, calculateFireRate, shouldAdvanceLevel, getKillsRequiredForLevel } from './gameRules';
import { useGameState } from './useGameState';
import { useGameLoop } from './useGameLoop';
import { HUD, BossHealthBar } from './HUD';
import { MenuScreen, LevelCompleteScreen, GameOverScreen, VictoryScreen } from './GameMenus';

const SpaceShooter = () => {
  const canvasRef = useRef(null);
  const {
    gameState,
    setGameState,
    score,
    level,
    lives,
    kills,
    powerLevel,
    setPowerLevel,
    bossHealth,
    bossMaxHealth,
    addScore,
    addKill,
    loseLife,
    updateBossHealth,
    defeatBoss,
    advanceLevel,
    resetGame,
    initializeBoss
  } = useGameState();

  // Create callbacks for game engine
  const callbacks = {
    onLifeLost: loseLife,
    onKill: addKill,
    onScoreAdd: addScore,
    onBossDefeated: defeatBoss,
    onBossHealthUpdate: updateBossHealth
  };

  const { gameData } = useGameLoop(canvasRef, gameState, level, powerLevel, callbacks);

  // Update power level when kills change
  useEffect(() => {
    const newPowerLevel = calculatePowerLevel(kills);
    setPowerLevel(newPowerLevel);
    if (gameData.current) {
      gameData.current.player.fireRate = calculateFireRate(newPowerLevel);
    }
  }, [kills, setPowerLevel]);

  // Check for level progression
  useEffect(() => {
    if (gameState === 'playing' && level < GAME.BOSS_LEVEL) {
      if (shouldAdvanceLevel(level, gameData.current.enemiesKilledThisLevel)) {
        advanceLevel();
        gameData.current.enemiesKilledThisLevel = 0;
      }
    }
  }, [kills, level, gameState, advanceLevel]);

  // Initialize boss health when boss spawns
  useEffect(() => {
    if (level === GAME.BOSS_LEVEL && gameState === 'playing') {
      // Check periodically for boss spawn
      const checkBoss = setInterval(() => {
        if (gameData.current.enemies.length > 0 && gameData.current.enemies[0].isBoss) {
          const boss = gameData.current.enemies[0];
          if (bossMaxHealth === 0) {
            initializeBoss(boss.maxHealth);
          }
          clearInterval(checkBoss);
        }
      }, 100);
      
      return () => clearInterval(checkBoss);
    }
  }, [level, gameState, initializeBoss, bossMaxHealth]);

  const startGame = useCallback(() => {
    setGameState('playing');
    resetGame();
    gameData.current = {
      player: createPlayer(),
      bullets: [],
      enemies: [],
      asteroids: [],
      particles: [],
      enemyBullets: [],
      invincible: 0,
      lastFire: 0,
      enemiesKilledThisLevel: 0
    };
  }, [setGameState, resetGame]);

  const nextLevel = useCallback(() => {
    gameData.current.bullets = [];
    gameData.current.enemies = [];
    gameData.current.asteroids = [];
    gameData.current.enemyBullets = [];
    gameData.current.particles = [];
    gameData.current.player.x = CANVAS.WIDTH / 2;
    gameData.current.player.y = CANVAS.HEIGHT - 100;
    setGameState('playing');
  }, [setGameState]);

  const killsNeeded = getKillsRequiredForLevel(level);
  const killsThisLevel = gameData.current.enemiesKilledThisLevel;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={CANVAS.WIDTH}
          height={CANVAS.HEIGHT}
          className="border-4 border-cyan-400 rounded-lg shadow-2xl shadow-cyan-500/50"
        />
        
        {/* HUD */}
        {gameState === 'playing' && (
          <>
            <HUD
              score={score}
              level={level}
              powerLevel={powerLevel}
              lives={lives}
              kills={kills}
              killsThisLevel={killsThisLevel}
              killsNeeded={killsNeeded}
            />
            {level === GAME.BOSS_LEVEL && (
              <BossHealthBar bossHealth={bossHealth} bossMaxHealth={bossMaxHealth} />
            )}
          </>
        )}

        {/* Game States */}
        {gameState === 'menu' && <MenuScreen onStart={startGame} />}
        
        {gameState === 'levelComplete' && (
          <LevelCompleteScreen
            level={level}
            score={score}
            kills={kills}
            powerLevel={powerLevel}
            onNext={nextLevel}
          />
        )}
        
        {gameState === 'gameover' && (
          <GameOverScreen
            score={score}
            level={level}
            kills={kills}
            powerLevel={powerLevel}
            onRestart={startGame}
          />
        )}
        
        {gameState === 'victory' && (
          <VictoryScreen
            score={score}
            kills={kills}
            powerLevel={powerLevel}
            onRestart={startGame}
          />
        )}
      </div>
    </div>
  );
};

export default SpaceShooter;
