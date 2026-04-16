import React, { useRef, useState, useEffect } from 'react';

interface SurveyAudioPlayerProps {
    src: string;
}

const SurveyAudioPlayer: React.FC<SurveyAudioPlayerProps> = ({ src }) => {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(0.8);
    const [isMuted, setIsMuted] = useState(false);

    // Sync volume with audio element
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = isMuted ? 0 : volume;
        }
    }, [volume, isMuted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }
    };

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = parseFloat(e.target.value);
        setCurrentTime(newTime);
        if (audioRef.current) {
            audioRef.current.currentTime = newTime;
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVal = parseFloat(e.target.value);
        setVolume(newVal);
        if (newVal > 0) setIsMuted(false);
    };

    const formatTime = (seconds: number) => {
        if (!isFinite(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`w-full bg-white/40 dark:bg-black/40 backdrop-blur border rounded-lg p-4 space-y-3 transition-all duration-300 ${isPlaying
            ? 'border-purple-500/50 shadow-md shadow-purple-500/10'
            : 'border-zinc-200 dark:border-gray-800'
            }`}>
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
            />

            <div className="flex items-center gap-4">
                {/* Play/Pause icon button */}
                <button
                    onClick={togglePlay}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white transition-all transform hover:scale-105 active:scale-95 flex-shrink-0 ${isPlaying
                        ? 'bg-purple-600 shadow-lg shadow-purple-500/30'
                        : 'bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 dark:hover:bg-zinc-600'
                        }`}
                >
                    {isPlaying ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
                    ) : (
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    )}
                </button>

                {/* Controls and Info */}
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex justify-between items-center mb-1">
                        <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isPlaying ? 'text-purple-600 dark:text-purple-400' : 'text-zinc-500'}`}>
                                {isPlaying ? 'Playing' : 'Ready'}
                            </span>
                            {isPlaying && (
                                <div className="flex items-end gap-0.5 h-2.5">
                                    {[0.1, 0.3, 0.2, 0.4].map((delay, i) => (
                                        <div
                                            key={i}
                                            className="w-0.5 bg-purple-500 rounded-full animate-bounce"
                                            style={{ height: '100%', animationDelay: `${delay}s`, animationDuration: '0.6s' }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 tabular-nums">
                                {formatTime(currentTime)} / {formatTime(duration)}
                            </span>

                            {/* Volume Control */}
                            <div className="flex items-center gap-1.5 group relative">
                                <button
                                    onClick={() => setIsMuted(!isMuted)}
                                    className="text-zinc-400 hover:text-purple-500 transition-colors"
                                >
                                    {isMuted || volume === 0 ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15L4 13.414V10.586L5.586 9m1.414 7.414L11 21V3L7 7H4v10h3l4 4z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" /></svg>
                                    ) : volume < 0.5 ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M5.586 15L4 13.414V10.586L5.586 9m1.414 7.414L11 21V3L7 7H4v10h3l4 4z" /></svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072M19.071 4.929a10 10 0 010 14.142M5.586 15L4 13.414V10.586L5.586 9m1.414 7.414L11 21V3L7 7H4v10h3l4 4z" /></svg>
                                    )}
                                </button>
                                <div className="w-0 group-hover:w-20 h-1 flex items-center transition-all duration-300 overflow-hidden relative">
                                    <div className="absolute inset-0 bg-zinc-300 dark:bg-zinc-800 rounded-full" />
                                    <div
                                        className="absolute inset-y-0 left-0 bg-purple-600 rounded-full"
                                        style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                                    />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={isMuted ? 0 : volume}
                                        onChange={handleVolumeChange}
                                        className="w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Slider */}
                    <div className="relative w-full h-1.5 flex items-center group/slider audio-progress-container">
                        {/* Background Track */}
                        <div className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden text-transparent">
                            {/* Filled Progress */}
                            <div
                                className="h-full bg-purple-600"
                                style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
                            />
                        </div>

                        {/* Custom Thumb - perfectly synced with the line */}
                        <div
                            className="absolute w-3 h-3 bg-purple-600 border-2 border-white dark:border-zinc-900 rounded-full shadow-md z-20 pointer-events-none transition-transform group-hover/slider:scale-110"
                            style={{
                                left: `${(currentTime / (duration || 1)) * 100}%`,
                                transform: 'translateX(-50%)'
                            }}
                        />

                        {/* Invisible Input on top to handle interactions */}
                        <input
                            type="range"
                            min="0"
                            max={duration || 0}
                            step="0.01"
                            value={currentTime}
                            onChange={handleSeek}
                            className="absolute inset-0 w-full h-full bg-transparent appearance-none cursor-pointer z-30"
                        />
                    </div>
                </div>
            </div>

            <style>{`
        /* Hide native thumb only for the sync-optimized progress slider */
        .audio-progress-container input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
        
        .audio-progress-container input[type='range']::-moz-range-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }

        .audio-progress-container input[type='range']::-ms-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          background: transparent;
          border: 0;
          cursor: pointer;
        }
      `}</style>
        </div>
    );
};

export default SurveyAudioPlayer;
