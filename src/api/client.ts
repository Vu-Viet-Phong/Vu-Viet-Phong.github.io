/**
 * Robust API Client with Intelligent Offline Fallback & Scientific Integrity for VuAnalytics 4.0
 */

const rawBaseUrl = (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:8000';
const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
export const API_BASE_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl : `${cleanBaseUrl}/api`;
export const API_ROOT_URL = cleanBaseUrl.endsWith('/api') ? cleanBaseUrl.slice(0, -4) : cleanBaseUrl;

export interface ModelMetric {
  name: string;
  category?: 'VERIFIED_EMPIRICAL' | 'THEORETICAL_SIMULATION';
  type?: string;
  framework?: string;
  mode: 'LIVE_INFERENCE' | 'SAMPLE_SVD_INFERENCE' | 'SIMULATION' | 'LOCAL_CLIENT_CHECKPOINT' | 'OFFLINE_SAMPLE_FALLBACK';
  live: boolean;
  layers?: number;
  embedding_dim?: number;
  epochs?: number;
  final_bpr_loss?: number;
  rank?: number;
  explained_variance_ratio?: number;
  metrics: {
    'recall@10': number;
    'recall@10_std'?: number;
    'ndcg@10': number;
    'ndcg@10_std'?: number;
    seeds_evaluated?: number[];
    [key: string]: any;
  };
  primary_seed_metrics?: {
    'recall@10': number;
    'ndcg@10': number;
    evaluated_users?: number;
  };
  latency_ms: number;
  parameters: number;
  checkpoint_id?: string;
  provenance?: string;
  note?: string;
}

export interface BenchmarkData {
  metadata: {
    dataset: string;
    dataset_version?: string;
    source: string;
    license: string;
    citation?: string;
    benchmark_timestamp: string;
    primary_seed: number;
    stability_seeds?: number[];
    train_ratio: number;
    test_ratio: number;
    users_count: number;
    items_count: number;
    train_interactions_count: number;
    test_interactions_count: number;
    sparsity: number;
    checkpoint_sha256?: string;
    evaluation_protocol?: string;
  };
  empirical_models: {
    [key: string]: ModelMetric;
  };
  theoretical_simulations: {
    [key: string]: ModelMetric;
  };
}

export interface PCANode {
  id: string;
  name?: string;
  title?: string;
  category?: string;
  style?: string;
  profile?: string;
  price?: number;
  x: number;
  y: number;
  type: 'user' | 'item';
}

export interface PCAData {
  algorithm: string;
  dimension_original: number;
  dimension_projected: number;
  ranking_note?: string;
  explained_variance_ratio: number[];
  users: PCANode[];
  items: PCANode[];
  precomputed_16d_rankings?: Record<string, RecommendationItem[]>;
}

export interface RecommendationItem {
  id: string;
  name: string;
  score: number;
  category: string;
  style?: string;
  price?: number;
  latent_dot_product?: number;
  raw_latent_score?: number;
}

export interface RecommendationResponse {
  user_id: string;
  model: string;
  mode: 'LIVE_INFERENCE' | 'SAMPLE_SVD_INFERENCE' | 'SIMULATION' | 'LOCAL_CLIENT_CHECKPOINT' | 'OFFLINE_SAMPLE_FALLBACK';
  dataset?: string;
  metrics?: Record<string, any>;
  items: RecommendationItem[];
  isFallback?: boolean;
  coldStartNotice?: string;
}

export type ApiErrorType = 'TIMEOUT' | 'HTTP_ERROR' | 'NETWORK_OFFLINE';

export class ApiError extends Error {
  type: ApiErrorType;
  status?: number;

  constructor(message: string, type: ApiErrorType, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.status = status;
  }
}

let _isOnline = false;
let _isColdStarting = false;
let _lastErrorType: ApiErrorType | null = null;
let _isPollerActive = false;
let _pollerTimer: any = null;

export interface ConnectionState {
  isOnline: boolean;
  isColdStarting: boolean;
  lastErrorType: ApiErrorType | null;
}

type ConnectionListener = (state: ConnectionState) => void;
const connectionListeners: Set<ConnectionListener> = new Set();

function notifyListeners() {
  const state: ConnectionState = {
    isOnline: _isOnline,
    isColdStarting: _isColdStarting,
    lastErrorType: _lastErrorType
  };
  connectionListeners.forEach((listener) => {
    try {
      listener(state);
    } catch {
      // Ignore listener error
    }
  });
}

export const apiClient = {
  subscribeConnection(listener: ConnectionListener) {
    connectionListeners.add(listener);
    listener({
      isOnline: _isOnline,
      isColdStarting: _isColdStarting,
      lastErrorType: _lastErrorType
    });
    return () => { connectionListeners.delete(listener); };
  },

  getConnectionState(): ConnectionState {
    return {
      isOnline: _isOnline,
      isColdStarting: _isColdStarting,
      lastErrorType: _lastErrorType
    };
  },

  async pingHealth(timeoutMs: number = 2500): Promise<boolean> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${API_ROOT_URL}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (response.ok) {
        _isOnline = true;
        _isColdStarting = false;
        _lastErrorType = null;
        notifyListeners();
        return true;
      }
      _isOnline = false;
      _lastErrorType = 'HTTP_ERROR';
      _isColdStarting = false;
      notifyListeners();
      return false;
    } catch (err: any) {
      clearTimeout(timeoutId);
      _isOnline = false;
      _lastErrorType = err?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_OFFLINE';
      _isColdStarting = true;
      notifyListeners();
      return false;
    }
  },

  /**
   * Background poller with exponential backoff to detect when Render backend finishes cold-start wake up
   * Total coverage: >115 seconds, avoiding duplicate concurrent executions.
   */
  startColdStartWakePoller(maxAttempts: number = 8) {
    if (_isPollerActive || _isOnline) return;
    _isPollerActive = true;

    const backoffs = [3000, 5000, 8000, 12000, 16000, 20000, 25000, 30000];
    let attempt = 0;

    const poll = async () => {
      if (!_isPollerActive || _isOnline) {
        _isPollerActive = false;
        return;
      }

      if (attempt >= maxAttempts) {
        _isPollerActive = false;
        return;
      }

      const awake = await this.pingHealth(3000);
      if (awake) {
        console.info('[VuAnalytics] Backend successfully awakened from cold start.');
        _isPollerActive = false;
        return;
      }

      const delay = backoffs[attempt] || 30000;
      attempt++;
      _pollerTimer = setTimeout(poll, delay);
    };

    _pollerTimer = setTimeout(poll, 1500);
  },

  /**
   * Stop any active cold-start polling
   */
  stopColdStartWakePoller() {
    _isPollerActive = false;
    if (_pollerTimer) {
      clearTimeout(_pollerTimer);
      _pollerTimer = null;
    }
  },

  async get(endpoint: string, timeoutMs: number = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new ApiError(`HTTP Error: ${response.status}`, 'HTTP_ERROR', response.status);
      }
      _isOnline = true;
      _isColdStarting = false;
      _lastErrorType = null;
      notifyListeners();
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isAbort = error?.name === 'AbortError';
      const classifiedError = error instanceof ApiError
        ? error
        : new ApiError(error?.message || 'Network request failed', isAbort ? 'TIMEOUT' : 'NETWORK_OFFLINE');

      _isOnline = false;
      _lastErrorType = classifiedError.type;
      _isColdStarting = (classifiedError.type === 'TIMEOUT' || classifiedError.type === 'NETWORK_OFFLINE');
      notifyListeners();
      throw classifiedError;
    }
  },

  async post(endpoint: string, body: any, timeoutMs: number = 4000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new ApiError(`HTTP Error: ${response.status}`, 'HTTP_ERROR', response.status);
      }
      _isOnline = true;
      _isColdStarting = false;
      _lastErrorType = null;
      notifyListeners();
      return await response.json();
    } catch (error: any) {
      clearTimeout(timeoutId);
      const isAbort = error?.name === 'AbortError';
      const classifiedError = error instanceof ApiError
        ? error
        : new ApiError(error?.message || 'Network request failed', isAbort ? 'TIMEOUT' : 'NETWORK_OFFLINE');

      _isOnline = false;
      _lastErrorType = classifiedError.type;
      _isColdStarting = (classifiedError.type === 'TIMEOUT' || classifiedError.type === 'NETWORK_OFFLINE');
      notifyListeners();
      throw classifiedError;
    }
  },

  /**
   * Fetch benchmark evaluation table with seamless offline static fallback
   */
  async getBenchmarks(): Promise<{ data: BenchmarkData; isLive: boolean }> {
    try {
      const data = await this.get('/benchmarks', 2500);
      return { data, isLive: true };
    } catch {
      // Fallback to static verified artifact
      const base = (import.meta as any).env.BASE_URL || '/';
      const fallbackUrl = `${base}data/benchmark_results.json`.replace('//', '/');
      const res = await fetch(fallbackUrl);
      const data = await res.json();
      return { data, isLive: false };
    }
  },

  /**
   * Fetch PCA 2D projected embeddings with seamless offline static fallback
   */
  async getPCAEmbeddings(): Promise<{ data: PCAData; isLive: boolean }> {
    try {
      const data = await this.get('/embeddings/pca', 2500);
      return { data, isLive: true };
    } catch {
      // Fallback to static verified artifact
      const base = (import.meta as any).env.BASE_URL || '/';
      const fallbackUrl = `${base}data/embeddings_pca.json`.replace('//', '/');
      const res = await fetch(fallbackUrl);
      const data = await res.json();
      return { data, isLive: false };
    }
  },

  /**
   * Fetch model status
   */
  async getModelStatus(): Promise<{ data: any; isLive: boolean }> {
    try {
      const data = await this.get('/models/status', 2500);
      return { data, isLive: true };
    } catch {
      return {
        data: {
          service: 'vuanalytics-backend (Offline / Sleeping on Render Free Tier)',
          environment: 'offline_client_fallback',
          models: {
            LightGCN: { mode: 'LOCAL_CLIENT_CHECKPOINT', checkpoint_loaded: false, client_cached: true },
            MF: { mode: 'OFFLINE_SAMPLE_FALLBACK' },
            NGCF: { mode: 'SIMULATION' },
            VBPR: { mode: 'SIMULATION' }
          }
        },
        isLive: false
      };
    }
  },

  /**
   * Generate recommendations with truthful mode labeling and true 16D latent ranking
   */
  async getRecommendations(userId: string, model: string, topK: number = 5): Promise<RecommendationResponse> {
    try {
      const res = await this.post('/recommendations', { user_id: userId, model, top_k: topK }, 2500);
      return res;
    } catch {
      // Offline fallback: load precomputed TRUE 16D latent rankings from LightGCN checkpoint
      const base = (import.meta as any).env.BASE_URL || '/';
      const pcaRes = await fetch(`${base}data/embeddings_pca.json`.replace('//', '/'));
      const pcaData: PCAData = await pcaRes.json();
      
      const precomputed = pcaData.precomputed_16d_rankings?.[userId];
      if (precomputed && model === 'LightGCN') {
        return {
          user_id: userId,
          model: 'LightGCN',
          mode: 'LOCAL_CLIENT_CHECKPOINT',
          dataset: 'Curated Amazon Clothing Benchmark (16x20 Client Cached Checkpoint)',
          metrics: {
            top_k: topK,
            latent_space: '16-dimensional dot-product E_u^T E_i',
            offline: true
          },
          items: precomputed.slice(0, topK),
          isFallback: true,
          coldStartNotice: 'FastAPI cloud backend is offline or sleeping on Render Free Tier. Serving true 16D latent recommendations from verified local PyTorch checkpoint.'
        };
      }

      // SVD or Fallback:
      const items = (pcaData.items || []).slice(0, topK).map((it, idx) => ({
        id: it.id,
        name: it.title || it.id,
        category: it.category || 'Apparel',
        style: it.style || 'Classic',
        price: it.price || 99.0,
        score: Number((0.92 - idx * 0.04).toFixed(3)),
        raw_latent_score: Number((0.85 - idx * 0.05).toFixed(3))
      }));

      return {
        user_id: userId,
        model,
        mode: model === 'MF' ? 'OFFLINE_SAMPLE_FALLBACK' : 'SIMULATION',
        dataset: 'Curated Amazon Clothing Benchmark (16x20)',
        metrics: { top_k: topK, offline: true },
        items,
        isFallback: true,
        coldStartNotice: 'Serving deterministic client-side sample slice while backend is unavailable.'
      };
    }
  }
};
