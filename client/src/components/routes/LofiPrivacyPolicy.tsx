import React from 'react';
import { Navbar } from '@/components/Navbar';
import { motion } from 'framer-motion';

const LofiPrivacyPolicy: React.FC = () => {
    return (
        <div className="w-full min-h-screen relative bg-zinc-50 dark:bg-zinc-950">
            {/* Simple gradient background for responsiveness and crawler-friendliness */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-purple-500/5 pointer-events-none" />

            <div className="w-full min-h-screen flex flex-col relative z-10">
                <div className="w-full border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
                    <div className="px-4 md:px-6 py-4">
                        <Navbar />
                    </div>
                </div>
                <div className="flex-1 flex flex-col items-center py-12 px-4 md:px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="w-full max-w-4xl bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-purple-500/20 dark:border-purple-500/30 rounded-2xl p-8 md:p-12 shadow-2xl"
                    >
                        <div className="flex justify-start mb-8">
                            <a
                                href="/projects/lofi-station"
                                className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 transition-colors group"
                            >
                                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Back to Lofi Station
                            </a>
                        </div>
                        <h1 className="text-4xl font-bold mb-8 text-zinc-900 dark:text-white text-center">Privacy Policy for Lofi Station</h1>

                        <div className="space-y-6 text-zinc-700 dark:text-zinc-300 leading-relaxed text-sm md:text-base">
                            <section>
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">1. Information We Collect</h2>
                                <p>
                                    When you use our Google Sign-In feature, we only request and store the most basic information provided by your Google Account profile:
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Your full name</li>
                                    <li>Your email address</li>
                                    <li>Your profile picture (for display purposes within the app)</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">2. Survey Participation</h2>
                                <p>
                                    Our Lofi Station evaluation survey collects ratings and feedback regarding generated music tracks. This data includes:
                                </p>
                                <ul className="list-disc ml-6 mt-2 space-y-1">
                                    <li>Track ratings (Rhythm, Melody, Sonic Quality, Humanness)</li>
                                    <li>General qualitative feedback</li>
                                    <li>Timestamp of participation</li>
                                </ul>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">3. How We Use Your Data</h2>
                                <p>
                                    Your profile information is used strictly for session management and to provide access to the Lofi Station features.
                                </p>
                                <p className="mt-2">
                                    Survey data is collected for the purpose of a scientific evaluation of rule-based music generation. This data is handled with strict confidentiality and is only accessible to the primary researcher (Laurențiu Cristian Preda).
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">4. Data Sharing and Security</h2>
                                <p>
                                    We do not sell, trade, or share your personal information with third parties. Your data is stored securely and is used solely for the internal purposes mentioned above.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-3">5. Cookies</h2>
                                <p>
                                    We use essential cookies to maintain your login session. These do not track your behavior on external websites and are used only for authentication within the Lofi Station application.
                                </p>
                            </section>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default LofiPrivacyPolicy;
