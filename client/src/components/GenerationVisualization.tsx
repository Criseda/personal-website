import React from 'react';

const GenerationVisualization: React.FC = () => {
  return (
    <div className="bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-lg p-6 h-96 flex flex-col items-center justify-center overflow-hidden">
      {/* Animated bars */}
      <div className="flex items-end justify-center gap-1 h-32 w-full mb-8">
        {Array.from({ length: 32 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 bg-gradient-to-t from-purple-500 to-pink-400 rounded-sm"
            style={{
              height: `${Math.random() * 100}%`,
              animation: `pulse-bar 0.8s ease-in-out ${i * 0.05}s infinite`,
              minHeight: '4px',
            }}
          />
        ))}
      </div>

      {/* Pulsing circle */}
      <div className="relative w-24 h-24 mb-6">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full animate-pulse" />
        <div className="absolute inset-2 bg-white/80 dark:bg-black/60 backdrop-blur rounded-full flex items-center justify-center">
          <div className="text-2xl">🎵</div>
        </div>
      </div>

      {/* Status text with pulsing effect */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-2">Synthesizing...</h3>
        <div className="flex items-center justify-center gap-1">
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
          <span className="inline-block w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>

      <style>{`
        @keyframes pulse-bar {
          0%, 100% {
            height: 20%;
            opacity: 0.6;
          }
          50% {
            height: 100%;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default GenerationVisualization;
