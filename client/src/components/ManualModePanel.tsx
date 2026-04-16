import React, { useState } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';

const ManualModePanel: React.FC = () => {
  const { startManualGeneration, isGenerating } = useMusicGenerator();
  const [bpm, setBpm] = useState(90);
  const [mood, setMood] = useState('chill');
  const [gloom, setGloom] = useState(0.5);

  const handleGenerate = async () => {
    await startManualGeneration({ bpm, mood, gloom });
  };

  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-lg p-6 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">Manual Controls</h2>

      {/* BPM Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-600 dark:text-gray-300">BPM</label>
          <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{bpm}</span>
        </div>
        <input
          type="range"
          min="60"
          max="120"
          value={bpm}
          onChange={(e) => setBpm(Number(e.target.value))}
          disabled={isGenerating}
          className="w-full h-2 bg-zinc-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-zinc-400 dark:text-gray-500">
          <span>60</span>
          <span>120</span>
        </div>
      </div>

      {/* Mood Select */}
      <div className="space-y-2">
        <label className="text-sm text-zinc-600 dark:text-gray-300 block">Mood</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          disabled={isGenerating}
          className="w-full px-3 py-2 bg-zinc-100 dark:bg-gray-700 border border-zinc-200 dark:border-gray-600 rounded-lg text-zinc-900 dark:text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="sunny">Sunny</option>
          <option value="chill">Chill</option>
          <option value="gloomy">Gloomy</option>
          <option value="midnight">Midnight</option>
        </select>
      </div>

      {/* Gloom Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm text-zinc-600 dark:text-gray-300">Gloom Level</label>
          <span className="text-lg font-semibold text-purple-600 dark:text-purple-400">{gloom.toFixed(2)}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={gloom}
          onChange={(e) => setGloom(Number(e.target.value))}
          disabled={isGenerating}
          className="w-full h-2 bg-zinc-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
        <div className="flex justify-between text-xs text-zinc-400 dark:text-gray-500">
          <span>Bright</span>
          <span>Gloomy</span>
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating}
        className={`w-full py-3 px-4 font-semibold rounded-lg transition-all ${isGenerating
            ? 'bg-purple-600/50 cursor-not-allowed opacity-75'
            : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500'
          }`}
      >
        {isGenerating ? '⏳ Generating...' : '▶ Generate Music'}
      </button>
    </div>
  );
};

export default ManualModePanel;
