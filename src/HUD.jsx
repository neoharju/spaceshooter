import React from 'react';

export const HUD = ({ score, level, powerLevel, lives, kills, killsThisLevel, killsNeeded }) => {
  return (
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
  );
};

export const BossHealthBar = ({ bossHealth, bossMaxHealth }) => {
  if (bossMaxHealth <= 0) return null;
  
  return (
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
  );
};
