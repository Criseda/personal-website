import React, { useEffect, useRef } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';

const GenerationLogsPanel: React.FC = () => {
  const { logs } = useMusicGenerator();
  const logsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs appear
  useEffect(() => {
    if (logsContainerRef.current) {
      logsContainerRef.current.scrollTop = logsContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div
      ref={logsContainerRef}
      className="bg-zinc-50/80 dark:bg-gray-900/40 backdrop-blur-sm border border-zinc-200 dark:border-gray-700/50 rounded-lg p-3 h-full overflow-y-auto font-mono text-xs text-emerald-900 dark:text-green-400 space-y-0.5 shadow-inner"
    >
      {logs.length === 0 ? (
        <div className="text-zinc-400 dark:text-gray-600 text-center py-12 tracking-wider uppercase text-[10px]">Ready to process...</div>
      ) : (
        <div className="space-y-0.5">
          {logs.map((log) => (
            <div key={log.id} className="text-emerald-900 dark:text-green-400 opacity-90 hover:opacity-100 transition-opacity">
              $ {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerationLogsPanel;
