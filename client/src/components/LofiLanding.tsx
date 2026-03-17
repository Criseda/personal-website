import React, { useState, useCallback } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleAuthResponse) => void;
  }) => void;
  prompt: (callback: (notification: GoogleNotification) => void) => void;
}

interface GoogleNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
}

interface GoogleAuthResponse {
  credential: string;
}

declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: GoogleAccountsId;
      };
    };
  }
}

const LofiLanding: React.FC = () => {
  const { login, error } = useAuth();
  const [initialized, setInitialized] = useState(false);
  const googleButtonRef = React.useRef<HTMLDivElement>(null);

  const handleGoogleLogin = useCallback(async (response: GoogleAuthResponse) => {
    try {
      const credential = response.credential;
      if (credential) {
        console.log('Received Google credential:', {
          length: credential.length,
          preview: credential.substring(0, 50) + '...',
          type: 'JWT' // Google One Tap returns a JWT
        });
        await login(credential);
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [login]);

  // Load Google Sign-In script and initialize only once
  React.useEffect(() => {
    if (initialized) return; // Prevent re-initialization

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log('Google Sign-In script loaded');
      // Initialize Google Sign-In only once
      if (window.google?.accounts?.id && !initialized) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
          callback: handleGoogleLogin,
        });
        setInitialized(true);
        console.log('Google Sign-In initialized');
        
        // Render the Google Sign-In button to the DOM
        if (googleButtonRef.current) {
          (window.google?.accounts?.id as any).renderButton(googleButtonRef.current, {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
          });
          console.log('Google Sign-In button rendered');
        }
        
        // Also show the One Tap prompt as a fallback
        window.google.accounts.id.prompt((notification) => {
          console.log('Google prompt notification:', notification);
        });
      }
    };
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <AuroraBackground className="absolute inset-0 z-0" />
      <div className="w-full sticky top-0 z-50 border-b border-purple-500/40 backdrop-blur-md bg-black/40">
        <div className="px-4 md:px-6 py-4">
          <Navbar />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
          <div className="flex flex-col items-center justify-center gap-8">
          <h1 className="text-5xl md:text-7xl font-bold text-center text-white drop-shadow-lg">
            Lofi Station
          </h1>
          
          <p className="text-lg md:text-xl text-gray-300 text-center max-w-md">
            Generate ambient lofi music tailored to your mood and environment
          </p>

          <div className="mt-8">
            <div ref={googleButtonRef} />
          </div>

          {error && (
            <div className="text-red-400 text-center text-sm mt-4">
              Error: {error}
            </div>
          )}
          </div>
        </div>
    </div>
  );
};

export default LofiLanding;
