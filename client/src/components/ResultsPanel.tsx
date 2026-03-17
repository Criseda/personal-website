import React, { useState } from 'react';
import { useMusicGenerator } from '@/contexts/useMusicGenerator';
import { api } from '@/services/api';
import AudioPlayer from '@/components/AudioPlayer';

const ResultsPanel: React.FC = () => {
  const { reset, jobId } = useMusicGenerator();
  const [downloadingFormat, setDownloadingFormat] = useState<string | null>(null);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  const handleDownload = async (format: string) => {
    try {
      setDownloadingFormat(format);
      setDownloadError(null);
      const blob = await api.downloadTrack(jobId || '', format as 'wav' | 'midi' | 'mp3');
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `lofi-station-${jobId}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Download failed';
      setDownloadError(errorMsg);
      console.error('Download error:', err);
    } finally {
      setDownloadingFormat(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Audio Player */}
      {jobId && (
        <AudioPlayer jobId={jobId} format="mp3" />
      )}

      {/* Download Section */}
      <div className="bg-black/40 backdrop-blur border border-green-500/30 rounded-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold text-green-400 mb-4">✓ Synthesis Complete</h2>

        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleDownload('mp3')}
            disabled={downloadingFormat === 'mp3'}
            className="w-full py-3 px-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all text-sm font-semibold text-white flex items-center justify-center gap-2"
          >
            {downloadingFormat === 'mp3' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Downloading MP3...
              </>
            ) : (
              <>
                📥 Download MP3
              </>
            )}
          </button>

          <button
            onClick={() => handleDownload('wav')}
            disabled={downloadingFormat === 'wav'}
            className="w-full py-2 px-4 bg-green-600/30 border border-green-500/50 hover:bg-green-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            {downloadingFormat === 'wav' ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </>
            ) : (
              <>
                📥 Download WAV
              </>
            )}
          </button>

          <button
            onClick={() => handleDownload('midi')}
            disabled={downloadingFormat === 'midi'}
            className="w-full py-2 px-4 bg-blue-600/30 border border-blue-500/50 hover:bg-blue-600/50 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2"
          >
            {downloadingFormat === 'midi' ? (
              <>
                <div className="w-3 h-3 border-2 border-gray-300 border-t-transparent rounded-full animate-spin"></div>
                Downloading...
              </>
            ) : (
              <>
                📥 Download MIDI
              </>
            )}
          </button>
        </div>

        {downloadError && (
          <div className="bg-red-900/20 border border-red-500/50 rounded p-3">
            <p className="text-red-300 text-sm">Error: {downloadError}</p>
          </div>
        )}

        <button
          onClick={reset}
          className="w-full py-2 px-4 bg-purple-600/30 border border-purple-500/50 hover:bg-purple-600/50 rounded-lg transition-colors text-sm font-semibold text-white"
        >
          Generate Another
        </button>

        {jobId && (
          <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-xs text-gray-400">
            <p>Job ID: {jobId}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;
