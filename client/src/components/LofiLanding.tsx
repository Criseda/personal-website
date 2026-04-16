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
    use_fedcm_for_prompt?: boolean;
    itp_support?: boolean;
  }) => void;
  prompt: (callback?: (notification: any) => void) => void;
  cancel: () => void;
  renderButton: (parent: HTMLElement, options: any) => void;
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

let firstTimeInitialization = true;

const LofiLanding: React.FC = () => {
  const { login, error, isAuthenticated } = useAuth();
  const googleButtonRef = React.useRef<HTMLDivElement>(null);

  const hasInitializedRef = React.useRef(false);

  const handleGoogleLogin = useCallback(async (response: GoogleAuthResponse) => {
    try {
      const credential = response.credential;
      if (credential) {
        console.log('Received Google credential');
        await login(credential);

        // Handle post-login redirection if any
        const pendingRedirect = localStorage.getItem('pending_lofi_redirect');
        if (pendingRedirect) {
          localStorage.removeItem('pending_lofi_redirect');
          window.location.href = pendingRedirect;
        }

        window.google?.accounts?.id?.cancel();
      }
    } catch (err) {
      console.error('Login error:', err);
    }
  }, [login]);

  React.useEffect(() => {
    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement;

    const initializeGoogle = () => {
      const gId = window.google?.accounts?.id;
      if (!gId || hasInitializedRef.current) return;

      hasInitializedRef.current = true;

      // Modernized GSI initialization with FedCM support
      gId.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
        callback: handleGoogleLogin,
        auto_select: false,
        use_fedcm_for_prompt: true,
        itp_support: true
      });

      if (firstTimeInitialization) {
        console.log('Google SDK initialized (FedCM enabled)');
        firstTimeInitialization = false;
      }

      if (googleButtonRef.current) {
        gId.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
        });
      }
    };

    if (!script) {
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
      window.google?.accounts?.id?.cancel();
      hasInitializedRef.current = false;
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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.7,
              duration: 0.8,
              ease: 'easeInOut',
            }}
            className="flex flex-col items-center gap-6 z-10 w-full max-w-sm px-4"
          >
            <div ref={googleButtonRef} className="min-h-[40px] flex justify-center w-full" />

            <div className="w-full flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              <span className="text-zinc-400 text-xs font-medium uppercase tracking-wider">or</span>
              <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
            </div>

            <a
              href="/projects/lofi-station/survey"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white border border-zinc-200 dark:border-zinc-800 rounded-xl font-semibold hover:border-purple-500/50 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-all shadow-sm group"
            >
              <svg className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 002 2m-6 9l2 2 4-4" />
              </svg>
              Fill out evaluation survey
            </a>

            {!isAuthenticated && (
              <p className="text-zinc-500 dark:text-zinc-500 text-sm font-medium">
                Note: You must sign in with Google first to take the survey.
              </p>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="text-red-400 text-center text-sm mt-4 font-medium"
              >
                Error: {error}
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <LofiFooter />
    </div>
  );
};

export default LofiLanding;
