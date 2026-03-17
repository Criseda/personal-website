import React, { useState } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';
import ManualModePanel from '@/components/ManualModePanel';
import AutoModePanel from '@/components/AutoModePanel';
import GenerationLogsPanel from '@/components/GenerationLogsPanel';
import ResultsPanel from '@/components/ResultsPanel';

const LofiConsole: React.FC = () => {
  const { logout } = useAuth();
  const { mode, setMode, status, isGenerating } = useMusicGenerator();
  const [showLogs, setShowLogs] = useState(true);

  return (
    <AuroraBackground className="relative">
      <div className="w-full min-h-screen flex flex-col relative z-10">
        <div className="w-full sticky top-0 z-50 border-b border-purple-500/40 backdrop-blur-md bg-black/40">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <Navbar />
            </div>
            <button
              onClick={logout}
              className="ml-4 px-4 py-2 dark:bg-red-500/20 hover:dark:bg-red-500/40 dark:border dark:border-red-500/50 rounded-lg transition-colors text-sm whitespace-nowrap text-white"
            >
              Exit
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto relative z-10">
        {/* Control Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Mode Toggle */}
          <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">Generation Mode</h2>
            <div className="flex gap-4">
              <button
                onClick={() => setMode('manual')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  mode === 'manual'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                disabled={isGenerating}
              >
                Manual Control
              </button>
              <button
                onClick={() => setMode('auto')}
                className={`flex-1 py-2 px-4 rounded-lg transition-all ${
                  mode === 'auto'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                }`}
                disabled={isGenerating}
              >
                Auto Vibe
              </button>
            </div>
          </div>

          {/* Control Panels */}
          {mode === 'manual' ? (
            <ManualModePanel />
          ) : (
            <AutoModePanel />
          )}

          {/* Logs Toggle and Display */}
          {(status === 'generating' || status === 'error' || status === 'success') && (
            <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Generation Log</h2>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="text-sm text-purple-400 hover:text-purple-300"
                >
                  {showLogs ? 'Hide' : 'Show'}
                </button>
              </div>
              {showLogs && <GenerationLogsPanel />}
            </div>
          )}
        </div>

        {/* Results Panel */}
        {status === 'success' && (
          <div className="lg:col-span-1">
            <ResultsPanel />
          </div>
        )}

        {/* Error Display */}
        {status === 'error' && (
          <div className="lg:col-span-1">
            <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-red-400 mb-4">Generation Failed</h2>
              <button
                onClick={() => window.location.reload()}
                className="w-full py-2 px-4 bg-red-600/50 hover:bg-red-600 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}
      </div>
      </div>
    </AuroraBackground>
  );
};

export default LofiConsole;
