import React, { useEffect, useState, useMemo, useRef } from 'react';
import { useAuth } from '@/contexts/useAuth';
import { api } from '@/services/api';
import { AuroraBackground } from '@/components/ui/aurora-background';
import LofiLanding from '@/components/LofiLanding';
import { Navbar } from '@/components/Navbar';
import SurveyAudioPlayer from '@/components/SurveyAudioPlayer';

const ALL_TRACKS = [
    'track_A1.mp3', 'track_A2.mp3', 'track_A3.mp3',
    'track_B1.mp3', 'track_B2.mp3', 'track_B3.mp3',
    'track_C1.mp3', 'track_C2.mp3', 'track_C3.mp3',
    'track_D1.mp3', 'track_D2.mp3', 'track_D3.mp3',
];

interface RatingScores {
    groove_score: number;
    melodic_score: number;
    sonic_score: number;
    humanness_score: number;
}

const LofiSurvey: React.FC = () => {
    const { token, isAuthenticated, isLoading: authLoading, restoreToken } = useAuth();

    const [isSurveyLoading, setIsSurveyLoading] = useState(true);
    const [hasCompleted, setHasCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [unratedTrackIds, setUnratedTrackIds] = useState<string[]>([]);
    const [hasAcceptedConsent, setHasAcceptedConsent] = useState(false);
    const [consentChecked, setConsentChecked] = useState(false);

    // Refs for each track to enable scrolling
    const trackRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const consentStorageKey = useMemo(() => {
        if (!token) return null;
        return `lofi_survey_consent_${token.slice(-16)}`;
    }, [token]);

    // Randomize tracks exactly once on component mount
    const shuffledTracks = useMemo(() => {
        const tracksInfo = [...ALL_TRACKS];
        for (let i = tracksInfo.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [tracksInfo[i], tracksInfo[j]] = [tracksInfo[j], tracksInfo[i]];
        }
        return tracksInfo;
    }, []);

    const [ratings, setRatings] = useState<Record<string, RatingScores>>({});
    const [generalFeedback, setGeneralFeedback] = useState('');

    // Auto-authenticate check
    useEffect(() => {
        restoreToken();
    }, [restoreToken]);

    // Fetch status once authenticated
    useEffect(() => {
        const fetchStatus = async () => {
            if (isAuthenticated) {
                try {
                    const status = await api.getSurveyStatus();
                    setHasCompleted(status.has_completed);
                    if (status.has_completed) {
                        setHasAcceptedConsent(true);
                    }
                } catch (err: any) {
                    setError(err.message || 'Failed to determine survey status');
                } finally {
                    setIsSurveyLoading(false);
                }
            } else if (!authLoading) {
                setIsSurveyLoading(false);
            }
        };

        fetchStatus();
    }, [isAuthenticated, authLoading]);

    useEffect(() => {
        if (!isAuthenticated || !consentStorageKey || hasCompleted) return;
        const stored = localStorage.getItem(consentStorageKey);
        if (stored === 'accepted') {
            setHasAcceptedConsent(true);
            setConsentChecked(true);
        }
    }, [isAuthenticated, consentStorageKey, hasCompleted]);

    const handleAcceptConsent = () => {
        if (!consentChecked) return;
        setHasAcceptedConsent(true);
        if (consentStorageKey) {
            localStorage.setItem(consentStorageKey, 'accepted');
        }
        window.scrollTo(0, 0);
    };

    // Handle slide changes
    const handleRatingChange = (trackName: string, field: keyof RatingScores, value: number) => {
        setRatings(prev => ({
            ...prev,
            [trackName]: {
                ...prev[trackName],
                [field]: value
            }
        }));
        // Clear error state for this track if it was previously unrated
        if (unratedTrackIds.includes(trackName)) {
            setUnratedTrackIds(prev => prev.filter(id => id !== trackName));
        }
    };

    const handleSubmit = async () => {
        // Validate all tracks handled
        const newUnrated = ALL_TRACKS.filter(track => {
            const r = ratings[track];
            return !r || !r.groove_score || !r.melodic_score || !r.sonic_score || !r.humanness_score;
        });

        setUnratedTrackIds(newUnrated);

        if (newUnrated.length > 0) {
            // Find the first unrated track in display order
            const firstUnrated = shuffledTracks.find(t => newUnrated.includes(t));
            if (firstUnrated && trackRefs.current[firstUnrated]) {
                trackRefs.current[firstUnrated]?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
            return;
        }

        setIsSubmitting(true);
        try {
            const payloadRatings = ALL_TRACKS.map((track_id) => {
                const rating = ratings[track_id];
                const categoryMatch = track_id.match(/track_([A-D])/);
                const category = categoryMatch ? categoryMatch[1] : 'Unknown';

                return {
                    track_id,
                    category,
                    groove_score: rating.groove_score,
                    melodic_score: rating.melodic_score,
                    sonic_score: rating.sonic_score,
                    humanness_score: rating.humanness_score,
                };
            });

            await api.submitSurvey({
                general_feedback: generalFeedback,
                ratings: payloadRatings
            });

            setShowSuccess(true);
            setTimeout(() => {
                setHasCompleted(true);
                setShowSuccess(false);
                window.scrollTo(0, 0);
            }, 2000);
        } catch (err: any) {
            alert('Failed to submit survey. ' + (err.message || 'Unknown error.'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading || (isAuthenticated && isSurveyLoading)) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-white dark:bg-black">
                <AuroraBackground>
                    <div className="flex items-center justify-center">
                        <div className="text-zinc-900 dark:text-white text-lg animate-pulse">Loading...</div>
                    </div>
                </AuroraBackground>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="w-full min-h-screen bg-white dark:bg-black">
                <LofiLanding />
            </div>
        );
    }

    if (hasCompleted) {
        return (
            <div className="w-full min-h-screen relative">
                <AuroraBackground fixed />
                <div className="w-full min-h-screen relative z-10 flex flex-col">
                    <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
                        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                            <div className="flex-1">
                                <Navbar />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-zinc-900 dark:text-white py-12 px-4 px-6 md:px-12 lg:px-24 flex-1">
                        <div className="max-w-2xl bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-8 text-center shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">Evaluation Complete</h1>
                            <p className="text-gray-700 dark:text-gray-300 text-lg mb-8">
                                Thank you for participating! You have successfully submitted your evaluated lofi tracks.
                            </p>
                            <a
                                href="/projects/lofi-station"
                                className="inline-block px-8 py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-900/20 transition-all hover:scale-105 active:scale-95"
                            >
                                Go back to Lofi Station
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-full min-h-screen relative bg-white dark:bg-black">
                <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
                    <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                        <div className="flex-1">
                            <Navbar />
                        </div>
                    </div>
                </div>
                <div className="flex items-center justify-center p-6" style={{ minHeight: 'calc(100vh - 80px)' }}>
                    <div className="text-red-600 dark:text-red-400 bg-red-100/50 dark:bg-red-950/50 p-6 rounded-lg border border-red-500/30">
                        <h2>Error fetching survey status.</h2>
                        <p>{error}</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!hasAcceptedConsent) {
        return (
            <div className="w-full min-h-screen relative">
                <AuroraBackground fixed />
                <div className="w-full min-h-screen text-zinc-900 dark:text-white relative z-10 transition-colors duration-300 flex flex-col">
                    <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
                        <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                            <div className="flex-1">
                                <Navbar />
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 max-w-3xl w-full mx-auto py-12 px-4 md:px-8 flex-1 flex items-center">
                        <div className="w-full bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-6 md:p-8 space-y-8 shadow-[0_0_15px_rgba(168,85,247,0.1)] dark:shadow-[0_0_15px_rgba(168,85,247,0.2)]">
                            <div className="space-y-3">
                                <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                                    Consent and Study Instructions
                                </h1>
                                <p className="text-gray-700 dark:text-gray-300">
                                    You are participating in a listening study where you will evaluate computer-generated music against human-made music.
                                </p>
                            </div>

                            <div className="space-y-4 text-gray-700 dark:text-gray-300">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Before You Begin</h2>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Use headphones whenever possible. Low-quality mobile speakers can mask micro-timing detail and bass synthesis characteristics that are important for this study.</li>
                                    <li>Rate based on what you hear, not what you expect.</li>
                                </ul>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={consentChecked}
                                        onChange={(e) => setConsentChecked(e.target.checked)}
                                        className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-purple-600 focus:ring-purple-500"
                                    />
                                    <span className="text-sm md:text-base text-gray-800 dark:text-gray-200">
                                        I understand the purpose of this study, agree to participate, and confirm I have read the listening instructions, Privacy Policy, and Terms of Service.
                                    </span>
                                </label>

                                <button
                                    onClick={handleAcceptConsent}
                                    disabled={!consentChecked}
                                    className={`w-full py-3 text-base md:text-lg font-semibold rounded-lg transition-all text-white ${consentChecked
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-900/20 dark:shadow-purple-900/50'
                                        : 'bg-purple-600/50 cursor-not-allowed opacity-75'
                                        }`}
                                >
                                    Continue to Survey
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen relative">
            <AuroraBackground fixed />
            <div className="w-full min-h-screen text-zinc-900 dark:text-white relative z-10 transition-colors duration-300 flex flex-col">
                {/* Success Overlay */}
                {showSuccess && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/20 dark:bg-black/20 backdrop-blur-md transition-all duration-500 animate-in fade-in">
                        <div className="bg-white/80 dark:bg-zinc-900/80 border border-green-500/50 p-8 rounded-2xl flex flex-col items-center gap-4 shadow-2xl shadow-green-500/20 scale-110 animate-bounce-short">
                            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/40">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                            </div>
                            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 tracking-tight">Survey Submitted!</h2>
                            <p className="text-zinc-600 dark:text-zinc-400 font-medium">Your feedback is appreciated.</p>
                        </div>
                    </div>
                )}

                <div className="w-full sticky top-0 z-50 border-b border-purple-500/20 dark:border-purple-500/40 backdrop-blur-md bg-white/40 dark:bg-black/40">
                    <div className="px-4 md:px-6 py-4 flex items-center justify-between">
                        <div className="flex-1">
                            <Navbar />
                        </div>
                    </div>
                </div>

                <div className="relative z-10 max-w-4xl mx-auto py-12 px-4 md:px-8 space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400 bg-clip-text text-transparent">
                            Lofi Music Evaluation Study
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                            Please listen to each audio clip carefully and provide ratings based on how you perceive its composition.
                        </p>
                    </div>

                    <div className="space-y-12">
                        {shuffledTracks.map((track, displayIndex) => {
                            const isUnrated = unratedTrackIds.includes(track);
                            const currentRatings = ratings[track] || {};

                            return (
                                <div
                                    key={track}
                                    ref={el => trackRefs.current[track] = el}
                                    className={`bg-white/40 dark:bg-black/40 backdrop-blur border rounded-xl p-6 md:p-8 space-y-6 shadow-lg transition-all duration-500 ${isUnrated
                                        ? 'border-red-500/50 dark:border-red-500/60 shadow-red-500/20 ring-2 ring-red-500/20'
                                        : 'border-purple-500/20 dark:border-purple-500/30 hover:border-purple-500/40 dark:hover:border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.05)] dark:shadow-[0_0_15px_rgba(168,85,247,0.1)]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Track {displayIndex + 1}</h2>
                                            {isUnrated && (
                                                <span className="text-[10px] uppercase font-bold text-red-500 bg-red-100 dark:bg-red-900/30 px-2 py-0.5 rounded border border-red-500/20 animate-pulse">Required</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Audio Player */}
                                    <SurveyAudioPlayer src={`/audio/${track}`} />

                                    {/* Rating Categories */}
                                    <div className="space-y-8 pt-2">
                                        <RatingControl
                                            label="Rhythm & Groove"
                                            description="How natural does the rhythmic timing (the groove/swing) feel?"
                                            minLabel="Stiff/Mechanical"
                                            maxLabel="Natural/Groovy"
                                            value={currentRatings.groove_score}
                                            onChange={(val) => handleRatingChange(track, 'groove_score', val)}
                                        />

                                        <RatingControl
                                            label="Melodic Intent"
                                            description="How logical or purposeful do the chords and melodies feel?"
                                            minLabel="Random/Wandering"
                                            maxLabel="Purposeful/Intentional"
                                            value={currentRatings.melodic_score}
                                            onChange={(val) => handleRatingChange(track, 'melodic_score', val)}
                                        />

                                        <RatingControl
                                            label="Sonic Quality"
                                            description="How professional or authentic is the sound design?"
                                            minLabel="Cheap/Synthetic"
                                            maxLabel="Professional/Authentic"
                                            value={currentRatings.sonic_score}
                                            onChange={(val) => handleRatingChange(track, 'sonic_score', val)}
                                        />

                                        <RatingControl
                                            label="Overall Humanness"
                                            description="Overall, how confident are you that this track was composed and produced by a human?"
                                            minLabel="Definitely a Computer"
                                            maxLabel="Definitely a Human"
                                            value={currentRatings.humanness_score}
                                            onChange={(val) => handleRatingChange(track, 'humanness_score', val)}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* General Feedback section */}
                    <div className="bg-white/40 dark:bg-black/40 backdrop-blur border border-purple-500/20 dark:border-purple-500/30 rounded-xl p-6 md:p-8 space-y-6">
                        <h2 className="text-xl font-semibold">General Feedback</h2>
                        <div className="space-y-4">
                            <label className="block text-gray-700 dark:text-gray-300">
                                For the tracks you rated low on Humanness, what specific things gave it away? (e.g., repeating too much, bad instruments, weird notes?)
                            </label>
                            <textarea
                                value={generalFeedback}
                                onChange={(e) => setGeneralFeedback(e.target.value)}
                                placeholder="Your feedback here..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:border-purple-500 rounded-lg text-zinc-900 dark:text-white resize-y outline-none transition-colors"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className={`w-full py-4 text-lg font-semibold rounded-lg transition-all text-white ${isSubmitting
                                    ? 'bg-purple-600/50 cursor-not-allowed opacity-75'
                                    : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-900/20 dark:shadow-purple-900/50'
                                    }`}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Survey'}
                            </button>
                        </div>
                    </div>
                </div>

                <style>{`
                    @keyframes bounce-short {
                        0%, 100% { transform: translateY(0) scale(1.1); }
                        50% { transform: translateY(-10px) scale(1.1); }
                    }
                    .animate-bounce-short {
                        animation: bounce-short 1s ease-in-out infinite;
                    }
                `}</style>
            </div>
        </div>
    );
};

// Helper sub-component to keep code clean
const RatingControl = ({
    label, description, minLabel, maxLabel, value, onChange
}: {
    label: string, description: string, minLabel: string, maxLabel: string, value: number | undefined, onChange: (val: number) => void
}) => {
    return (
        <div className="space-y-3">
            <div className="flex justify-between items-baseline flex-wrap gap-2">
                <label className="text-[15px] font-medium text-gray-800 dark:text-gray-200">{label}</label>
                {value && <span className="text-sm font-semibold text-purple-700 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-900/30 px-2 py-0.5 rounded border border-purple-500/20">Score: {value}</span>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>

            <div className="pt-2 pb-1 relative">
                <input
                    type="range"
                    min="1"
                    max="7"
                    step="1"
                    value={value || 4}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className={`w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-purple-600 dark:accent-purple-500 hover:accent-purple-500 dark:hover:accent-purple-400 transition-all ${!value ? 'opacity-50' : 'opacity-100'}`}
                />
                <div className="relative h-6 text-xs text-gray-500 mt-2">
                    <span className="absolute left-0 top-0">1: {minLabel}</span>
                    <span className="absolute left-1/2 top-0 -translate-x-1/2">4</span>
                    <span className="absolute right-0 top-0 text-right">7: {maxLabel}</span>
                </div>
            </div>
        </div>
    );
}

export default LofiSurvey;
