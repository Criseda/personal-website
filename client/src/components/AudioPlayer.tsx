import React, { useRef, useState, useEffect } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { api } from '@/services/api';

interface AudioPlayerProps {
  jobId: string;
  format?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ jobId, format = 'mp3' }) => {
  const { logs } = useMusicGenerator();
  const audioRef = useRef<HTMLAudioElement>(null);
  const loadedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load audio on mount
  useEffect(() => {
    // Prevent loading twice
    if (loadedRef.current) return;
    loadedRef.current = true;

    const loadAudio = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // First check if backend is reachable
        try {
          await api.healthCheck();
        } catch (healthErr) {
          console.warn('Backend health check failed, attempting download anyway...', healthErr);
        }
        
        const blob = await api.downloadTrack(jobId, format as 'wav' | 'midi' | 'mp3');
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Failed to load audio';
        console.error('Audio loading error:', errorMsg);
        setError(errorMsg);
      } finally {
        setIsLoading(false);
      }
    };

    loadAudio();

    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
    };
  }, [jobId, format]);

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

  const handleEnded = () => {
    setIsPlaying(false);
  };

  const formatTime = (seconds: number) => {
    if (!isFinite(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/50 rounded-lg p-4 space-y-2">
        <p className="text-red-300 text-sm font-semibold">⚠️ Error Loading Audio</p>
        <p className="text-red-300 text-xs">{error}</p>
        {error.includes('Cannot reach backend') && (
          <div className="text-red-200 text-xs space-y-1">
            <p><strong>Troubleshooting:</strong></p>
            <ul className="list-disc list-inside">
              <li>Make sure the backend server is running</li>
              <li>Check that VITE_API_BASE_URL environment variable is correct</li>
              <li>Verify the server allows CORS requests</li>
              <li>Check browser console (F12) for more details</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6">
        <div className="flex items-center justify-center gap-3">
          <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
          <p className="text-white text-sm">Loading audio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black/40 backdrop-blur border border-purple-500/30 rounded-lg p-6 space-y-4">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      )}

      {/* Now Playing */}
      <div>
        <p className="text-xs text-gray-400 mb-1">Now Playing</p>
        <p className="text-white font-semibold text-sm">
          🎵 Generated Lofi Track ({format.toUpperCase()})
        </p>
      </div>

      {/* Last generation log */}
      {logs.length > 0 && (
        <div className="bg-black/50 border border-purple-500/20 rounded p-2">
          <p className="text-xs text-green-400 font-mono">
            {logs[logs.length - 1]?.message || 'Generation complete'}
          </p>
        </div>
      )}

      {/* Player Controls */}
      <div className="flex items-center justify-center gap-3">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 flex items-center justify-center text-white text-xl transition-all hover:scale-110 active:scale-95"
        >
          {isPlaying ? '⏸' : '▶'}
        </button>

        {/* Time Display */}
        <div className="flex-1">
          {/* Progress Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${
                (currentTime / duration) * 100
              }%, #374151 ${(currentTime / duration) * 100}%, #374151 100%)`,
            }}
          />

          {/* Time Labels */}
          <div className="flex justify-between mt-2 text-xs text-gray-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="text-xs text-gray-400 text-center pt-2 border-t border-purple-500/20">
        {isPlaying ? '🎶 Now Playing' : 'Click play to listen'}
      </div>
    </div>
  );
};

export default AudioPlayer;
