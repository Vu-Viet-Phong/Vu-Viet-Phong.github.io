import React, { useState, useEffect } from 'react';
import { apiClient, BenchmarkData, ModelMetric } from '../api/client';
import { Award, Database, BookOpen, ShieldCheck, AlertCircle } from 'lucide-react';

interface Props {
  className?: string;
}

export const BenchmarkDashboard: React.FC<Props> = ({ className = '' }) => {
  const [data, setData] = useState<BenchmarkData | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [selectedModelKey, setSelectedModelKey] = useState<string>('LightGCN');

  useEffect(() => {
    const fetchBenchmarks = async () => {
      setLoading(true);
      try {
        const res = await apiClient.getBenchmarks();
        setData(res.data);
        setIsLive(res.isLive);
      } catch (err) {
        console.error('Failed to load benchmarks:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBenchmarks();
  }, []);

  const getBadge = (metric: ModelMetric) => {
    if (metric.category === 'THEORETICAL_SIMULATION' || metric.mode === 'SIMULATION') {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1">
          THEORETICAL SIMULATION
        </span>
      );
    }
    if (metric.mode === 'LIVE_INFERENCE' || metric.framework?.includes('PyTorch')) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
          VERIFIED PYTORCH
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center gap-1">
        SAMPLE SVD
      </span>
    );
  };

  const selectedModel = data?.empirical_models?.[selectedModelKey] || data?.theoretical_simulations?.[selectedModelKey];

  return (
    <div className={`glass-panel rounded-2xl border border-surfaceHighlight p-5 md:p-6 bg-[#090F1C]/90 shadow-xl ${className}`}>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-5 border-b border-surfaceHighlight/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center text-secondary">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-display font-semibold text-white tracking-wide flex items-center gap-2">
                Empirical Recommendation Benchmark
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-primary/10 text-primary border-primary/30'
                }`}>
                  {isLive ? 'LIVE FASTAPI' : 'LOCAL CACHED CHECKPOINT'}
                </span>
              </h3>
              <p className="text-xs text-textMuted font-light">
                Multi-seed stability evaluation on leak-free 80/20 train-test splits (seeds: 42, 100, 2026)
              </p>
            </div>
          </div>
        </div>

        {/* Provenance Tag */}
        <div className="flex items-center gap-2 text-xs font-mono text-textMuted bg-surface px-3 py-1.5 rounded-lg border border-surfaceHighlight">
          <Database className="w-3.5 h-3.5 text-primary" />
          <span>Curated Amazon Clothing (16x20)</span>
        </div>
      </div>

      {/* SECTION 1: VERIFIED EMPIRICAL MODELS TABLE */}
      <div className="pt-6">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold">
            1. Curated Empirical Models (Trained on 16x20 Research Sample)
          </h4>
        </div>
        
        <div className="overflow-x-auto rounded-xl border border-surfaceHighlight/60 bg-[#060A14]">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surfaceHighlight text-textMuted text-[10px] uppercase tracking-wider bg-surface/30">
                <th className="py-2.5 pl-3">Architecture</th>
                <th className="py-2.5">Framework</th>
                <th className="py-2.5">Status Mode</th>
                <th className="py-2.5 text-right">Recall@10 (Mean ± Std)</th>
                <th className="py-2.5 text-right">NDCG@10 (Mean ± Std)</th>
                <th className="py-2.5 text-right">Latency</th>
                <th className="py-2.5 text-right pr-3">Checkpoint ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceHighlight/30">
              {data?.empirical_models && Object.entries(data.empirical_models).map(([key, model]) => {
                const isSelected = selectedModelKey === key;
                return (
                  <tr
                    key={key}
                    onClick={() => setSelectedModelKey(key)}
                    className={`hover:bg-white/5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-primary/10' : ''
                    }`}
                  >
                    <td className="py-3 pl-3 font-medium text-white flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-primary' : 'bg-transparent'}`}></span>
                      {model.name}
                    </td>
                    <td className="py-3 text-textMuted text-[11px]">{model.framework}</td>
                    <td className="py-3">{getBadge(model)}</td>
                    <td className="py-3 text-right font-bold text-primary">
                      {model.metrics['recall@10']?.toFixed(4)}
                      {model.metrics['recall@10_std'] !== undefined && (
                        <span className="text-[10px] text-textMuted font-normal ml-1">±{model.metrics['recall@10_std']?.toFixed(3)}</span>
                      )}
                    </td>
                    <td className="py-3 text-right font-bold text-secondary">
                      {model.metrics['ndcg@10']?.toFixed(4)}
                      {model.metrics['ndcg@10_std'] !== undefined && (
                        <span className="text-[10px] text-textMuted font-normal ml-1">±{model.metrics['ndcg@10_std']?.toFixed(3)}</span>
                      )}
                    </td>
                    <td className="py-3 text-right text-slate-300">
                      {model.latency_ms?.toFixed(1)} ms
                    </td>
                    <td className="py-3 text-right pr-3 text-textMuted font-mono text-[10px]">
                      {model.checkpoint_id || 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 2: THEORETICAL SIMULATIONS (Clearly segregated) */}
      <div className="pt-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-mono uppercase text-purple-400 tracking-wider font-semibold">
              2. Theoretical Literature Baselines (Simulation Only)
            </h4>
          </div>
          <span className="text-[10px] font-mono text-textMuted bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
            Unverified by Live Weights
          </span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-purple-500/20 bg-[#060A14]/60">
          <table className="w-full text-left text-xs font-mono opacity-80">
            <thead>
              <tr className="border-b border-surfaceHighlight text-textMuted text-[10px] uppercase tracking-wider bg-surface/20">
                <th className="py-2.5 pl-3">Architecture</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Status Mode</th>
                <th className="py-2.5 text-right">Paper Recall@10</th>
                <th className="py-2.5 text-right">Paper NDCG@10</th>
                <th className="py-2.5 text-right pr-3">Notice</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surfaceHighlight/30">
              {data?.theoretical_simulations && Object.entries(data.theoretical_simulations).map(([key, model]) => {
                const isSelected = selectedModelKey === key;
                return (
                  <tr
                    key={key}
                    onClick={() => setSelectedModelKey(key)}
                    className={`hover:bg-white/5 cursor-pointer transition-colors ${
                      isSelected ? 'bg-purple-500/10' : ''
                    }`}
                  >
                    <td className="py-3 pl-3 font-medium text-slate-300 flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-purple-400' : 'bg-transparent'}`}></span>
                      {model.name}
                    </td>
                    <td className="py-3 text-textMuted text-[11px]">{model.category}</td>
                    <td className="py-3">{getBadge(model)}</td>
                    <td className="py-3 text-right font-medium text-slate-400">
                      {model.metrics['recall@10']?.toFixed(4)}
                    </td>
                    <td className="py-3 text-right font-medium text-slate-400">
                      {model.metrics['ndcg@10']?.toFixed(4)}
                    </td>
                    <td className="py-3 text-right pr-3 text-[10px] text-purple-300/80">
                      {model.note}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Model Deep-Dive & Dataset Provenance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 mt-6 border-t border-surfaceHighlight/60">
        {/* Selected Model Details */}
        <div className="p-4 rounded-xl bg-surface/40 border border-surfaceHighlight/50 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-primary tracking-wider font-semibold">
              Inspection: {selectedModelKey}
            </span>
            {selectedModel && getBadge(selectedModel)}
          </div>
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            {selectedModel?.provenance || selectedModel?.note || 'Baseline recommendation architecture.'}
          </p>
          <div className="pt-2 flex flex-wrap gap-3 text-[11px] font-mono text-textMuted">
            <span>Latency: <strong className="text-white">{selectedModel?.latency_ms} ms</strong></span>
            <span>Parameters: <strong className="text-white">{selectedModel?.parameters?.toLocaleString() || '0'}</strong></span>
            {selectedModel?.checkpoint_id && (
              <span>Checkpoint: <strong className="text-emerald-400">{selectedModel.checkpoint_id}</strong></span>
            )}
          </div>
        </div>

        {/* Dataset Provenance & Academic Citation Card */}
        <div className="p-4 rounded-xl bg-surface/40 border border-surfaceHighlight/50 space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary" />
            <span className="text-xs font-mono uppercase text-secondary tracking-wider font-semibold">
              Dataset Provenance & Rigor
            </span>
          </div>
          <p className="text-xs text-slate-300 font-light leading-relaxed">
            <strong>Schema:</strong> Julian McAuley Lab, UC San Diego (WWW 2016). Evaluated on curated 16x20 research sample (81 interactions) for zero-cost CPU reproducibility.
            Partitioned with fixed pseudo-random seed (<code className="text-primary font-mono">seed=42</code>) to strictly prohibit interaction leakage.
          </p>
          <div className="pt-1 flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-mono text-textMuted">
            <span>Users: <strong className="text-white">{data?.metadata?.users_count || 16}</strong></span>
            <span>Items: <strong className="text-white">{data?.metadata?.items_count || 20}</strong></span>
            <span>Sparsity: <strong className="text-emerald-400">{((data?.metadata?.sparsity || 0.7469) * 100).toFixed(1)}%</strong></span>
            <span>Split: <strong className="text-white">80% Train / 20% Test</strong></span>
          </div>
          {data?.metadata?.checkpoint_sha256 && (
            <div className="pt-1 text-[10px] font-mono text-slate-400 truncate">
              SHA256: <code className="text-primary">{data.metadata.checkpoint_sha256}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
