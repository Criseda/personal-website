import React from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';
import ManualModePanel from '@/components/ManualModePanel';
import AutoModePanel from '@/components/AutoModePanel';
import GenerationLogsPanel from '@/components/GenerationLogsPanel';
import GenerationVisualization from '@/components/GenerationVisualization';
import ResultsPanel from '@/components/ResultsPanel';
import LofiFooter from '@/components/LofiFooter';

const LofiConsole: React.FC = () => {
  const { mode, setMode, status, isGenerating } = useMusicGenerator();

  return (
    <div className="w-full min-h-screen relative">
      <AuroraBackground fixed />
      <div className="w-full min-h-screen flex flex-col relative z-10">
        <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
          <div className="px-4 md:px-6 py-4 flex items-center justify-between">
            <div className="flex-1">
              <Navbar />
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isGenerating ? (
          /* Generation View - Centered in flex area */
          <div className="flex-1 flex items-center justify-center z-10 animate-fade-in py-12">
            <div className="w-full max-w-6xl px-4 md:px-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Visualization */}
                <div className="animate-slide-up">
                  <GenerationVisualization />
                </div>
                {/* Logs */}
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <div className="h-96 bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-lg overflow-hidden">
                    <GenerationLogsPanel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Control Panel - Normal layout when not generating */
          <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10 pt-4">
            <div className="w-full max-w-7xl mx-auto px-4 md:px-6 mb-4">
              <a
                href="/projects"
                className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur border border-zinc-200 dark:border-gray-800 flex items-center justify-center group-hover:border-purple-500/50 transition-all">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                </div>
                <span>Back to Projects</span>
              </a>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto pt-0">
              <div className="lg:col-span-2 space-y-6 animate-fade-in">
                {/* Mode Toggle */}
                <div className="bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-lg p-6">
                  <h2 className="text-base font-semibold mb-4 text-zinc-900 dark:text-white">Mode</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMode('manual')}
                      className={`flex-1 py-2.5 px-3 rounded-lg transition-all text-sm font-semibold border ${mode === 'manual'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-900/20'
                        : 'bg-white/50 dark:bg-gray-700/50 text-zinc-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border-zinc-200 dark:border-transparent'
                        }`}
                      disabled={isGenerating}
                    >
                      Manual
                    </button>
                    <button
                      onClick={() => setMode('auto')}
                      className={`flex-1 py-2.5 px-3 rounded-lg transition-all text-sm font-semibold border ${mode === 'auto'
                        ? 'bg-purple-600 text-white border-purple-600 shadow-md shadow-purple-900/20'
                        : 'bg-white/50 dark:bg-gray-700/50 text-zinc-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 border-zinc-200 dark:border-transparent'
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
              </div>

              {/* Results Panel / Error Display */}
              {status === 'success' && (
                <div className="lg:col-span-1 animate-fade-in">
                  <ResultsPanel />
                </div>
              )}

              {status === 'error' && (
                <div className="lg:col-span-1 animate-fade-in">
                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-500/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">✗ Generation Failed</h2>
                    <button
                      onClick={() => window.location.reload()}
                      className="w-full py-2 px-4 bg-red-600/50 hover:bg-red-600 rounded-lg transition-colors text-sm"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Custom animations */}
        <style>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          
          @keyframes slideUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
          }
          
          .animate-slide-up {
            animation: slideUp 0.6s ease-out forwards;
          }
        `}</style>
        <LofiFooter />
      </div>
    </div>
  );
};

export default LofiConsole;
