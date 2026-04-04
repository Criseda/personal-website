import React from 'react';
import { useAuth } from '@/contexts/useAuth';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';
import ManualModePanel from '@/components/ManualModePanel';
import AutoModePanel from '@/components/AutoModePanel';
import GenerationLogsPanel from '@/components/GenerationLogsPanel';
import GenerationVisualization from '@/components/GenerationVisualization';
import ResultsPanel from '@/components/ResultsPanel';

const LofiConsole: React.FC = () => {
  const { logout } = useAuth();
  const { mode, setMode, status, isGenerating } = useMusicGenerator();

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
        {isGenerating ? (
          /* Generation View - Full viewport centered */
          <div className="fixed inset-0 top-0 flex items-center justify-center z-10 pointer-events-none">
            <div className="w-full max-w-6xl px-4 md:px-6 py-4 md:py-6 pointer-events-auto animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Visualization */}
                <div className="animate-slide-up">
                  <GenerationVisualization />
                </div>
                {/* Logs */}
                <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
                  <div className="h-96 bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg overflow-hidden">
                    <GenerationLogsPanel />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Control Panel - Normal layout when not generating */
          <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 p-4 md:p-6 w-full max-w-7xl mx-auto">
              <div className="lg:col-span-2 space-y-6 animate-fade-in">
                {/* Mode Toggle */}
                <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
                  <h2 className="text-base font-semibold mb-4 text-white">Mode</h2>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setMode('manual')}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${
                        mode === 'manual'
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-700/50 text-gray-300 hover:bg-gray-700'
                      }`}
                      disabled={isGenerating}
                    >
                      Manual
                    </button>
                    <button
                      onClick={() => setMode('auto')}
                      className={`flex-1 py-2 px-3 rounded-lg transition-all text-sm ${
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
              </div>

              {/* Results Panel / Error Display */}
              {status === 'success' && (
                <div className="lg:col-span-1 animate-fade-in">
                  <ResultsPanel />
                </div>
              )}

              {status === 'error' && (
                <div className="lg:col-span-1 animate-fade-in">
                  <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-6">
                    <h2 className="text-lg font-semibold text-red-400 mb-4">✗ Generation Failed</h2>
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
      </div>
    </AuroraBackground>
  );
};

export default LofiConsole;
