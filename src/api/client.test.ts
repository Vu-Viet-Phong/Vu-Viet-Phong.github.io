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
    expect(res.mode).toBe('LOCAL_VERIFIED_CHECKPOINT');
    expect(res.items.length).toBe(2);
    expect(res.items[0].id).toBe('item_A');
    expect(res.items[0].score).toBe(0.99);
    expect(res.items[0].latent_dot_product).toBe(0.42);
    expect(res.coldStartNotice).toContain('sleeping or spinning up');
  });
});
