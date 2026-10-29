import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiClient } from './client';

describe('apiClient', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back to static benchmark artifact with segregated empirical models', async () => {
    const mockBenchmarkData = {
      metadata: {
        dataset: 'Amazon Review Data (Clothing, Shoes & Jewelry 5-core)',
        dataset_version: 'UCSD 5-core Release (He & McAuley, WWW 2016)',
        users_count: 16,
        items_count: 20,
        checkpoint_sha256: '515a953096dbdf8d924b5ddf0f08fec7da0b50f599f7749f5a7f1451c12f57e9'
      },
      empirical_models: {
        LightGCN: {
          name: 'LightGCN (PyTorch)',
          category: 'VERIFIED_EMPIRICAL',
          mode: 'LIVE_INFERENCE',
          metrics: { 'recall@10': 0.7083, 'ndcg@10': 0.2435 }
        }
      },
      theoretical_simulations: {
        NGCF: {
          name: 'Neural Graph Collaborative Filtering (NGCF)',
          category: 'THEORETICAL_SIMULATION',
          mode: 'SIMULATION',
          metrics: { 'recall@10': 0.7320, 'ndcg@10': 0.5840 }
        }
      }
    };

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/benchmarks')) {
        return Promise.reject(new Error('Connection refused'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockBenchmarkData)
      });
    });

    const res = await apiClient.getBenchmarks();
    expect(res.isLive).toBe(false);
    expect(res.data.metadata.dataset).toContain('Amazon');
    expect(res.data.metadata.checkpoint_sha256).toBe('515a953096dbdf8d924b5ddf0f08fec7da0b50f599f7749f5a7f1451c12f57e9');
    expect(res.data.empirical_models.LightGCN.category).toBe('VERIFIED_EMPIRICAL');
    expect(res.data.theoretical_simulations.NGCF.category).toBe('THEORETICAL_SIMULATION');
  });

  it('falls back to static PCA embeddings on network failure', async () => {
    const mockPCAData = {
      algorithm: 'LightGCN_PyTorch',
      dimension_original: 16,
      dimension_projected: 2,
      explained_variance_ratio: [0.45, 0.25],
      users: [{ id: 'usr_00', name: 'Elena', x: 0.1, y: 0.2, type: 'user' }],
      items: [{ id: 'B00004SR8W', title: 'Ray-Ban', x: 0.12, y: 0.22, type: 'item' }]
    };

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/embeddings/pca')) {
        return Promise.reject(new Error('Network error'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPCAData)
      });
    });

    const res = await apiClient.getPCAEmbeddings();
    expect(res.isLive).toBe(false);
    expect(res.data.users.length).toBe(1);
    expect(res.data.items[0].id).toBe('B00004SR8W');
  });

  it('computes offline recommendations using precomputed true 16D latent rankings', async () => {
    const mockPCAData = {
      algorithm: 'LightGCN_PyTorch',
      dimension_original: 16,
      dimension_projected: 2,
      explained_variance_ratio: [0.45, 0.25],
      users: [{ id: 'usr_00', name: 'Elena', x: 0.0, y: 0.0, type: 'user' }],
      items: [
        { id: 'item_A', title: 'Silk Shirt', category: 'Apparel', price: 120, x: 0.1, y: 0.1, type: 'item' },
        { id: 'item_B', title: 'Rain Jacket', category: 'Outerwear', price: 75, x: 2.0, y: 2.0, type: 'item' }
      ],
      precomputed_16d_rankings: {
        usr_00: [
          { id: 'item_A', name: 'Silk Shirt', category: 'Apparel', price: 120, score: 0.99, latent_dot_product: 0.42 },
          { id: 'item_B', name: 'Rain Jacket', category: 'Outerwear', price: 75, score: 0.72, latent_dot_product: 0.15 }
        ]
      }
    };

    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/recommendations')) {
        return Promise.reject(new Error('Backend sleeping'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPCAData)
      });
    });

    const res = await apiClient.getRecommendations('usr_00', 'LightGCN', 2);
    expect(res.isFallback).toBe(true);
    expect(res.mode).toBe('LOCAL_CLIENT_CHECKPOINT');
    expect(res.items.length).toBe(2);
    expect(res.items[0].id).toBe('item_A');
    expect(res.items[0].score).toBe(0.99);
    expect(res.items[0].latent_dot_product).toBe(0.42);
    expect(res.coldStartNotice).toContain('sleeping on Render Free Tier');
  });

  it('correctly labels MF offline fallback as OFFLINE_SAMPLE_FALLBACK', async () => {
    const mockPCAData = {
      users: [],
      items: [
        { id: 'item_1', title: 'Classic Blazer', category: 'Apparel', price: 120 }
      ]
    };
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.includes('/recommendations')) {
        return Promise.reject(new Error('Server offline'));
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPCAData)
      });
    });

    const res = await apiClient.getRecommendations('usr_00', 'MF', 1);
    expect(res.isFallback).toBe(true);
    expect(res.mode).toBe('OFFLINE_SAMPLE_FALLBACK');
    expect(res.coldStartNotice).toContain('sample slice');
  });

  it('differentiates TIMEOUT, HTTP_ERROR, and NETWORK_OFFLINE error types', async () => {
    // 1. Timeout error
    const abortErr = new Error('The operation was aborted');
    abortErr.name = 'AbortError';
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(abortErr));
    try {
      await apiClient.get('/timeout-test', 50);
    } catch (err: any) {
      expect(err.type).toBe('TIMEOUT');
    }

    // 2. HTTP Error 500
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.resolve({
      ok: false,
      status: 500
    }));
    try {
      await apiClient.get('/500-test', 50);
    } catch (err: any) {
      expect(err.type).toBe('HTTP_ERROR');
      expect(err.status).toBe(500);
    }

    // 3. Network Offline
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(new TypeError('Failed to fetch')));
    try {
      await apiClient.get('/network-err-test', 50);
    } catch (err: any) {
      expect(err.type).toBe('NETWORK_OFFLINE');
    }
  });

  it('manages cold-start wake poller lifecycle and avoids duplicate pollers', async () => {
    vi.useFakeTimers();
    let pollCount = 0;
    globalThis.fetch = vi.fn().mockImplementation(() => {
      pollCount++;
      return Promise.reject(new Error('Server down'));
    });

    // Start poller
    apiClient.startColdStartWakePoller(4);
    // Call again to verify singleton guard (should not double count)
    apiClient.startColdStartWakePoller(4);

    await vi.advanceTimersByTimeAsync(2000); // Initial 1500ms delay triggers attempt 1
    expect(pollCount).toBe(1);

    await vi.advanceTimersByTimeAsync(3500); // Next delay 3000ms triggers attempt 2
    expect(pollCount).toBe(2);

    // Stop poller cleanly
    apiClient.stopColdStartWakePoller();
    await vi.advanceTimersByTimeAsync(10000);
    // Count should not increase after stop
    expect(pollCount).toBe(2);

    vi.useRealTimers();
  });

  it('tracks online and cold-starting states via pingHealth and subscribers', async () => {
    let capturedState: any = null;
    const unsub = apiClient.subscribeConnection((state) => {
      capturedState = state;
    });

    // Test ping failure (sleeping)
    globalThis.fetch = vi.fn().mockImplementation(() => Promise.reject(new Error('Connection timeout')));
    const awake1 = await apiClient.pingHealth(100);
    expect(awake1).toBe(false);
    expect(capturedState.isOnline).toBe(false);
    expect(capturedState.isColdStarting).toBe(true);

    // Test ping success (awake)
    globalThis.fetch = vi.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: 'ok', service: 'vuanalytics-backend' })
      })
    );
    const awake2 = await apiClient.pingHealth(100);
    expect(awake2).toBe(true);
    expect(capturedState.isOnline).toBe(true);
    expect(capturedState.isColdStarting).toBe(false);

    unsub();
  });
});
