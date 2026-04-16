import axios, { AxiosInstance, AxiosError } from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.criseda.com';
const TOKEN_KEY = 'lofi_auth_token';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: add Bearer token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    // Log network errors separately
    if (!error.response) {
      console.error('Network Error - Backend unreachable:', {
        message: error.message,
        code: error.code,
        config: {
          url: error.config?.url,
          baseURL: error.config?.baseURL,
          method: error.config?.method,
        },
      });
    }

    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      Cookies.remove(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/projects/lofi-station';
    }
    return Promise.reject(error);
  }
);

// API Methods
export const api = {
  // Auth endpoints
  login: async (googleToken: string) => {
    console.log('Sending to /auth/social:', {
      provider: 'google',
      token: googleToken.substring(0, 20) + '...'
    });
    try {
      // 1. Fixed: Added provider: 'google'
      const response = await apiClient.post('/auth/social', {
        provider: 'google',
        token: googleToken
      });
      // 2. Fixed: Destructured 'access_token' instead of 'jwt' to match backend
      const { access_token } = response.data;

      if (access_token) {
        Cookies.set(TOKEN_KEY, access_token, { expires: 7 });
        localStorage.setItem(TOKEN_KEY, access_token);
      }
      return response.data;
    } catch (error: any) {
      console.error('Login error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  logout: () => {
    Cookies.remove(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  // Music generation endpoints
  generateMusic: async (params: {
    city?: string;
    bpm?: number;
    mood?: string;
    gloom?: number;
  }) => {
    console.log('Starting music generation:', params);
    try {
      const response = await apiClient.post('/generate', params);
      console.log('Generation started:', response.data);
      if (!response.data) {
        throw new Error('Empty response from server');
      }
      return response.data; // Should contain job_id and jobId
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || error.message || 'Generation failed';
      console.error('Generation error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: errorMsg,
      });
      throw new Error(errorMsg);
    }
  },

  getJobStatus: async (jobId: string) => {
    try {
      const response = await apiClient.get(`/job/${jobId}`);
      return response.data; // Contains status, logs, metadata, available_formats, etc.
    } catch (error: any) {
      console.error('Job status error:', error.response?.data);
      throw error;
    }
  },

  downloadTrack: async (jobId: string, format: 'wav' | 'midi' | 'mp3') => {
    try {
      console.log(`Downloading ${format} for job ${jobId}`);
      console.log('API Base URL:', API_BASE_URL);
      console.log('Full download URL:', `${API_BASE_URL}/download/${jobId}/${format}`);

      const response = await apiClient.get(`/download/${jobId}/${format}`, {
        responseType: 'blob',
      });

      // Verify we got a blob with correct type
      console.log('Download response:', {
        status: response.status,
        contentType: response.headers['content-type'],
        blobSize: response.data.size,
        blobType: response.data.type,
      });

      // Check if we got an error page instead of audio
      if (response.data.type === 'text/html' || response.data.type === 'text/plain') {
        const text = await response.data.text();
        console.error('Received HTML/text error instead of audio:', text);
        throw new Error(`Server returned error: ${text.substring(0, 100)}`);
      }

      return response.data;
    } catch (error: any) {
      // Handle network errors specifically
      if (!error.response) {
        console.error('Network Error - Backend unreachable:', {
          message: error.message,
          code: error.code,
          url: `${API_BASE_URL}/download/${jobId}/${format}`,
        });
        throw new Error(
          `Cannot reach backend at ${API_BASE_URL}. Make sure the server is running and CORS is enabled.`
        );
      }

      console.error('Download error:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
      });
      throw new Error(error.response?.data?.detail || error.message || 'Download failed');
    }
  },

  // Health check to verify backend is reachable
  healthCheck: async () => {
    try {
      console.log('Checking backend health at:', API_BASE_URL);
      const response = await apiClient.get('/health');
      console.log('Backend is healthy:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Backend health check failed:', {
        message: error.message,
        status: error.response?.status,
        url: `${API_BASE_URL}/health`,
      });
      throw new Error(`Backend at ${API_BASE_URL} is not reachable`);
    }
  },

  // Verify token is valid
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify');
      return response.data;
    } catch (error) {
      Cookies.remove(TOKEN_KEY);
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  },

  // Survey endpoints
  getSurveyStatus: async () => {
    try {
      const response = await apiClient.get('/survey/status');
      return response.data; // { has_completed: true/false }
    } catch (error) {
      console.error('Failed to get survey status', error);
      throw error;
    }
  },

  submitSurvey: async (payload: {
    general_feedback: string;
    ratings: Array<{
      track_id: string;
      category: string;
      groove_score: number;
      melodic_score: number;
      sonic_score: number;
      humanness_score: number;
    }>;
  }) => {
    try {
      const response = await apiClient.post('/survey/submit', payload);
      return response.data;
    } catch (error) {
      console.error('Failed to submit survey', error);
      throw error;
    }
  },
};

export default apiClient;
