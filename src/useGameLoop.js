import { useEffect, useRef } from 'react';
import { GAME } from './constants';
import {
  updatePlayerPosition,
  handlePlayerFiring,
  updateBullets,
  updateAsteroids,
  updateEnemies,
  updateEnemyBullets,
  updateParticles,
  spawnWave
} from './gameEngine';
import { renderGame } from './renderer';

export const useGameLoop = (
  canvasRef,
  gameState,
  level,
  powerLevel,
  callbacks
) => {
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

  const update = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const data = gameData.current;

    // Update player
    updatePlayerPosition(data.player, keysPressed.current);
    handlePlayerFiring(data, keysPressed.current, powerLevel);

    // Update entities
    data.bullets = updateBullets(data.bullets);
    updateAsteroids(data, callbacks);
    updateEnemies(data, callbacks, level);
    updateEnemyBullets(data, callbacks);
    data.particles = updateParticles(data.particles);

    if (data.invincible > 0) data.invincible--;

    spawnWave(data, level);
    renderGame(ctx, data, powerLevel);
  };

  useEffect(() => {
    if (gameState === 'playing') {
      gameLoopRef.current = setInterval(update, 1000 / GAME.FPS);
      return () => clearInterval(gameLoopRef.current);
    }
  }, [gameState, level, powerLevel, callbacks]);

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

  return { gameData };
};
