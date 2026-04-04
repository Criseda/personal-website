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
      className="bg-gray-900/30 border border-gray-700/50 rounded-lg p-3 h-full overflow-y-auto font-mono text-xs text-green-400 space-y-0.5"
    >
      {logs.length === 0 ? (
        <div className="text-gray-600 text-center py-8">Waiting...</div>
      ) : (
        <div className="space-y-0.5">
          {logs.map((log) => (
            <div key={log.id} className="text-green-400 opacity-90 hover:opacity-100 transition-opacity">
              $ {log.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenerationLogsPanel;
