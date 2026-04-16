import React, { createContext, useState, ReactNode } from 'react';
import { api } from '@/services/api';

export type GenerationMode = 'manual' | 'auto';
export type GenerationStatus = 'idle' | 'generating' | 'success' | 'error';

export interface GenerationLog {
  id: string;
  message: string;
  timestamp: number;
}

export interface DownloadLinks {
  wav?: string;
  mp3?: string;
  midi?: string;
}

export interface MusicGeneratorContextType {
  mode: GenerationMode;
  status: GenerationStatus;
  jobId: string | null;
  logs: GenerationLog[];
  downloadLinks: DownloadLinks | null;
  error: string | null;
  isGenerating: boolean;
  isPolling: boolean;
  
  // Actions
  setMode: (mode: GenerationMode) => void;
  startManualGeneration: (params: { bpm: number; mood: string; gloom: number }) => Promise<void>;
  startAutoGeneration: (city: string) => Promise<void>;
  addLog: (message: string) => void;
  setDownloadLinks: (links: DownloadLinks) => void;
  setError: (error: string | null) => void;
  reset: () => void;
  pollJobStatus: () => Promise<void>;
}

export const MusicGeneratorContext = createContext<MusicGeneratorContextType | undefined>(undefined);

export const MusicGeneratorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<GenerationMode>('manual');
  const [status, setStatus] = useState<GenerationStatus>('idle');
  const [jobId, setJobId] = useState<string | null>(null);
  const [logs, setLogs] = useState<GenerationLog[]>([]);
  const [downloadLinks, setDownloadLinks] = useState<DownloadLinks | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(false);

  const addLog = (message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random()}`,
        message,
        timestamp: Date.now(),
      },
    ]);
  };

  const startManualGeneration = async (params: { bpm: number; mood: string; gloom: number }) => {
    try {
      setStatus('generating');
      setError(null);
      setLogs([]);
      setDownloadLinks(null);
      
      addLog(`Starting generation with BPM: ${params.bpm}, Mood: ${params.mood}, Gloom: ${params.gloom}`);
      
      const response = await api.generateMusic({
        bpm: params.bpm,
        mood: params.mood,
        gloom: params.gloom,
      });

      if (response.job_id || response.jobId) {
        const newJobId = response.job_id || response.jobId;
        setJobId(newJobId);
        addLog(`Job started: ${newJobId}`);
        
        // Start polling
        startPolling(newJobId);
      } else {
        throw new Error('No job ID returned from server');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      setStatus('error');
      addLog(`Error: ${errorMessage}`);
    }
  };

  const startAutoGeneration = async (city: string) => {
    try {
      setStatus('generating');
      setError(null);
      setLogs([]);
      setDownloadLinks(null);
      
      addLog(`Fetching vibe for ${city}...`);
      
      let response;
      try {
        response = await api.generateMusic({
          city,
        });
      } catch (apiError: any) {
        const errorMsg = apiError.message || 'API call failed';
        addLog(`Error: ${errorMsg}`);
        throw new Error(errorMsg);
      }

      if (!response) {
        throw new Error('No response from server');
      }

      const jobId = response.job_id || response.jobId;
      if (!jobId) {
        console.error('Invalid response structure:', response);
        throw new Error('No job ID in response');
      }

      setJobId(jobId);
      addLog(`Job started: ${jobId}`);
      
      // Start polling
      startPolling(jobId);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Generation failed';
      setError(errorMessage);
      setStatus('error');
      addLog(`Error: ${errorMessage}`);
    }
  };

  const startPolling = async (pollJobId: string) => {
    try {
      setIsPolling(true);
      let pollCount = 0;
      const maxPolls = 150; // 5 minutes at 2 second intervals
      
      // Poll every 2 seconds
      const pollInterval = setInterval(async () => {
        pollCount++;
        
        if (pollCount > maxPolls) {
          clearInterval(pollInterval);
          setIsPolling(false);
          addLog('Polling timeout - generation may still be processing');
          return;
        }
        
        try {
          const jobData = await api.getJobStatus(pollJobId);
          
          // Add any new logs from the server
          if (Array.isArray(jobData.logs)) {
            jobData.logs.forEach((log: string) => {
              if (!logs.some((l) => l.message === log)) {
                addLog(log);
              }
            });
          }
          
          if (jobData.status === 'completed') {
            addLog('✓ Synthesis complete!');
            
            // Build download links from available formats
            if (jobData.result) {
              setDownloadLinks({
                wav: jobData.result.wav,
                midi: jobData.result.midi,
                mp3: jobData.result.mp3,
              });
            }
            
            setStatus('success');
            clearInterval(pollInterval);
            setIsPolling(false);
          } else if (jobData.status === 'error') {
            addLog(`✗ Generation failed: ${jobData.error || 'Unknown error'}`);
            setError(jobData.error || 'Generation failed');
            setStatus('error');
            clearInterval(pollInterval);
            setIsPolling(false);
          }
          // Continue polling if status === 'processing'
        } catch (pollError) {
          console.error('Polling error:', pollError);
          // Continue polling unless it's auth-related
          if (pollError instanceof Error && pollError.message.includes('401')) {
            clearInterval(pollInterval);
            setIsPolling(false);
          }
        }
      }, 2000);
    } catch (err) {
      setIsPolling(false);
      const errorMessage = err instanceof Error ? err.message : 'Polling failed';
      setError(errorMessage);
      addLog(`Error: ${errorMessage}`);
    }
  };

  const reset = () => {
    setMode('manual');
    setStatus('idle');
    setJobId(null);
    setLogs([]);
    setDownloadLinks(null);
    setError(null);
    setIsPolling(false);
  };

  const pollJobStatus = async () => {
    if (!jobId) {
      throw new Error('No job ID available for polling');
    }
    try {
      const jobData = await api.getJobStatus(jobId);
      
      // Add any new logs from the server
      if (Array.isArray(jobData.logs)) {
        jobData.logs.forEach((log: string) => {
          if (!logs.some((l) => l.message === log)) {
            addLog(log);
          }
        });
      }
      
      // Check if generation is complete
      if (jobData.status === 'completed') {
        setStatus('success');
        if (jobData.available_formats) {
          const links: DownloadLinks = {};
          jobData.available_formats.forEach((format: string) => {
            links[format as keyof DownloadLinks] = `/download/${jobId}/${format}`;
          });
          setDownloadLinks(links);
        }
        setIsPolling(false);
        addLog('Generation complete!');
      } else if (jobData.status === 'error') {
        setStatus('error');
        setError(jobData.error || 'Generation failed');
        setIsPolling(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Polling failed';
      console.error('Poll error:', errorMessage);
      throw err;
    }
  };

  const value: MusicGeneratorContextType = {
    mode,
    status,
    jobId,
    logs,
    downloadLinks,
    error,
    isGenerating: status === 'generating',
    isPolling,
    setMode,
    startManualGeneration,
    startAutoGeneration,
    addLog,
    setDownloadLinks,
    setError,
    reset,
    pollJobStatus,
  };

  return (
    <MusicGeneratorContext.Provider value={value}>
      {children}
    </MusicGeneratorContext.Provider>
  );
};
