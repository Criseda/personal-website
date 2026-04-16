import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/useAuth';
import { AuroraBackground } from '@/components/ui/aurora-background';
import { Navbar } from '@/components/Navbar';
import LofiFooter from '@/components/LofiFooter';

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string;
    callback: (response: GoogleAuthResponse) => void;
    auto_select?: boolean;
  }) => void;
  prompt: (callback: (notification: GoogleNotification) => void) => void;
  cancel: () => void;
  renderButton: (parent: HTMLElement, options: any) => void;
}

interface GoogleNotification {
  isNotDisplayed: () => boolean;
  isSkippedMoment: () => boolean;
  isDismissedMoment: () => boolean;
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

// Global flag to track if initialization has happened at least once on the window object
let firstTimeInitialization = true;

const LofiLanding: React.FC = () => {
  const { login, error, isAuthenticated } = useAuth();
  const googleButtonRef = React.useRef<HTMLDivElement>(null);

  const handleGoogleLogin = useCallback(async (response: GoogleAuthResponse) => {
    try {
      const credential = response.credential;
      if (credential) {
        console.log('Received Google credential');
        await login(credential);
        // Explicitly cancel prompt after successful login
        window.google?.accounts?.id?.cancel();
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [login]);

  // Load Google Sign-In script and initialize
  React.useEffect(() => {
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement;
    let promptTimer: NodeJS.Timeout | null = null;

    const initializeGoogle = () => {
      console.log('initializeGoogle called. Auth:', isAuthenticated);

      const gId = window.google?.accounts?.id;
      if (!gId) return;

      // Always initialize to ensure the callback is fresh and points to this component instance
      // Google GSI is generally okay with re-initialization on the same page for SPAs
      gId.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleLogin,
        auto_select: false,
      });

      if (firstTimeInitialization) {
        console.log('Google SDK initialized');
        firstTimeInitialization = false;
      }

      // Render the Google Sign-In button
      if (googleButtonRef.current) {
        gId.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
        console.log('Google Sign-In button rendered');
      }

      // DELAYED PROMPT: Wait for 1.5s to ensure session restoration has finished
      if (!isAuthenticated) {
        promptTimer = setTimeout(() => {
          if (!isAuthenticated) {
            console.log('Triggering Google One Tap prompt...');
            window.google?.accounts?.id?.prompt((notification) => {
              console.log('Google prompt notification:', notification);
              if (notification.isNotDisplayed() || notification.isSkippedMoment() || notification.isDismissedMoment()) {
                console.log('Google prompt was not displayed, skipped, or dismissed');
              }
            });
          }
        }, 1500);
      }
    };

    if (!script) {
      console.log('Creating Google GSI script...');
      script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = initializeGoogle;
      document.head.appendChild(script);
    } else if (window.google?.accounts?.id) {
      initializeGoogle();
    }

    return () => {
      if (promptTimer) {
        clearTimeout(promptTimer);
      }
      window.google?.accounts?.id?.cancel();
    };
  }, [isAuthenticated, handleGoogleLogin]);

  return (
    <div className="w-full min-h-screen flex flex-col relative">
      <AuroraBackground fixed />
      <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
        <div className="px-4 md:px-6 py-4">
          <Navbar />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: 'easeInOut',
          }}
          className="flex flex-col items-center justify-center gap-8"
        >
          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            id="app-name"
            className="text-5xl md:text-7xl font-bold text-center text-zinc-900 dark:text-white drop-shadow-lg"
          >
            Lofi Station
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.5,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="text-lg md:text-xl text-zinc-600 dark:text-gray-300 text-center max-w-2xl px-4"
          >
            An intelligent platform for rule-based music generation.
            Lofi Station helps people create algorithmic lofi compositions.
            <br />
            <span className="text-sm mt-4 block opacity-80">
              Read our <a href="/projects/lofi-station/privacy" className="underline hover:text-purple-500">Privacy Policy</a> to learn how we protect your data.
            </span>
          </motion.p>

          {/* Google Sign-In Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="mt-8"
          >
            <div ref={googleButtonRef} />
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className="text-red-400 text-center text-sm mt-4"
            >
              Error: {error}
            </motion.div>
          )}
        </motion.div>
      </div>
      <LofiFooter />
    </div>
  );
};

export default LofiLanding;
