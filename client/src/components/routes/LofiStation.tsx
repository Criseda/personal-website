import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { AuroraBackground } from '@/components/ui/aurora-background';
import LofiLanding from '@/components/LofiLanding';
import LofiConsole from '@/components/LofiConsole';

const LofiStation: React.FC = () => {
  const { isAuthenticated, isLoading, restoreToken } = useAuth();

  useEffect(() => {
    restoreToken();
  }, [restoreToken]);

  if (isLoading) {
    return (
      <div className="w-full h-screen relative">
        <AuroraBackground fixed />
        <div className="flex items-center justify-center relative z-10 h-full">
          <div className="text-white text-lg animate-pulse">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen relative">
      <AuroraBackground fixed />
      <div className="relative z-10">
        {!isAuthenticated ? (
          <LofiLanding />
        ) : (
          <LofiConsole />
        )}
      </div>
    </div>
  );
};

export default LofiStation;
