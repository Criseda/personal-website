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
      <div className="w-full h-screen flex items-center justify-center bg-black">
        <AuroraBackground>
          <div className="flex items-center justify-center">
            <div className="text-white text-lg animate-pulse">Loading...</div>
          </div>
        </AuroraBackground>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-black">
      {!isAuthenticated ? (
        <LofiLanding />
      ) : (
        <LofiConsole />
      )}
    </div>
  );
};

export default LofiStation;
