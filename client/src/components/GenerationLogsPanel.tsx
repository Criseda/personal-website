import React, { useEffect, useRef } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { TypewriterEffect } from '@/components/ui/typewriter-effect';

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
      className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 h-48 overflow-y-auto font-mono text-xs text-green-400 space-y-1"
    >
      {logs.length === 0 ? (
        <div className="text-gray-500">Waiting for generation to start...</div>
      ) : (
        <div className="space-y-1">
          {logs.map((log) => (
            <div key={log.id} className="text-green-400">
              $ {log.message}
            </div>
          ))}
          <div className="text-green-400">
            $ <TypewriterEffect words={[{ text: logs[logs.length - 1]?.message || '' , className: 'text-green-400' }]} />
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationLogsPanel;
