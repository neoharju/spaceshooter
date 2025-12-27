import { useState, useCallback } from 'react';
import { GAME } from './constants';

export const useGameState = () => {
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(GAME.INITIAL_LEVEL);
  const [lives, setLives] = useState(GAME.INITIAL_LIVES);
  const [kills, setKills] = useState(0);
  const [powerLevel, setPowerLevel] = useState(1);
  const [bossHealth, setBossHealth] = useState(0);
  const [bossMaxHealth, setBossMaxHealth] = useState(0);

  const addScore = useCallback((points) => {
    setScore(s => s + points);
  }, []);

  const addKill = useCallback(() => {
    setKills(k => k + 1);
  }, []);

  const loseLife = useCallback(() => {
    setLives(l => {
      const newLives = l - 1;
      if (newLives <= 0) {
        setGameState('gameover');
      }
      return newLives;
    });
  }, []);

  const updateBossHealth = useCallback((health) => {
    setBossHealth(health);
  }, []);

  const defeatBoss = useCallback(() => {
    setBossHealth(0);
    setGameState('victory');
  }, []);

  const advanceLevel = useCallback(() => {
    setLevel(l => l + 1);
    setGameState('levelComplete');
  }, []);

  const resetGame = useCallback(() => {
    setScore(0);
    setLevel(GAME.INITIAL_LEVEL);
    setLives(GAME.INITIAL_LIVES);
    setKills(0);
    setPowerLevel(1);
    setBossHealth(0);
    setBossMaxHealth(0);
  }, []);

  const initializeBoss = useCallback((maxHealth) => {
    setBossMaxHealth(maxHealth);
    setBossHealth(maxHealth);
  }, []);

  return {
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
  };
};
