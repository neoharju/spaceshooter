import React from 'react';

export const MenuScreen = ({ onStart }) => (
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
        onClick={onStart}
        className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg shadow-cyan-500/50"
      >
        START GAME
      </button>
    </div>
  </div>
);

export const LevelCompleteScreen = ({ level, score, kills, powerLevel, onNext }) => (
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
        onClick={onNext}
        className="px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
      >
        {level === 6 ? 'FACE THE BOSS' : 'NEXT LEVEL'}
      </button>
    </div>
  </div>
);

export const GameOverScreen = ({ score, level, kills, powerLevel, onRestart }) => (
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
        onClick={onRestart}
        className="px-8 py-4 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
      >
        TRY AGAIN
      </button>
    </div>
  </div>
);

export const VictoryScreen = ({ score, kills, powerLevel, onRestart }) => (
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
        onClick={onRestart}
        className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-purple-500 text-white text-xl font-bold rounded-lg hover:scale-110 transition-transform shadow-lg"
      >
        PLAY AGAIN
      </button>
    </div>
  </div>
);
