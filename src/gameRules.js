import { POWER_LEVELS, LEVEL_PROGRESSION, GAME } from './constants';

export const calculatePowerLevel = (kills) => {
  if (kills >= POWER_LEVELS[5].minKills) return 5;
  if (kills >= POWER_LEVELS[4].minKills) return 4;
  if (kills >= POWER_LEVELS[3].minKills) return 3;
  if (kills >= POWER_LEVELS[2].minKills) return 2;
  return 1;
};

export const calculateFireRate = (powerLevel) => {
  return POWER_LEVELS[powerLevel]?.fireRate || POWER_LEVELS[1].fireRate;
};

export const getKillsRequiredForLevel = (level) => {
  if (level >= GAME.BOSS_LEVEL) return 0;
  return LEVEL_PROGRESSION.BASE_KILLS_REQUIRED + (level - 1) * LEVEL_PROGRESSION.KILLS_INCREMENT;
};

export const shouldAdvanceLevel = (level, killsThisLevel) => {
  if (level >= GAME.BOSS_LEVEL) return false;
  return killsThisLevel >= getKillsRequiredForLevel(level);
};

export const getAsteroidCount = (level) => {
  return 3 + level;
};

export const getEnemyCount = (level) => {
  return 2 + Math.floor(level / 2);
};
