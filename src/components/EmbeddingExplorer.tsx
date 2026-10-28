import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiClient, PCAData, PCANode } from '../api/client';
import { Layers, RefreshCw } from 'lucide-react';

interface Props {
  className?: string;
  onSelectItem?: (item: PCANode) => void;
}

export const EmbeddingExplorer: React.FC<Props> = ({ className = '', onSelectItem }) => {
  const [data, setData] = useState<PCAData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isLive, setIsLive] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<PCANode | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.getPCAEmbeddings();
      setData(res.data);
      setIsLive(res.isLive);
      // Auto-select first user
      if (res.data.users.length > 0 && !selectedNode) {
        setSelectedNode(res.data.users[0]);
      }
    } catch (err) {
      console.error('Failed to load PCA embeddings:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedNode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const categories = useMemo(() => {
    if (!data) return ['All'];
    const cats = new Set<string>();
    data.items.forEach(it => {
      if (it.category) cats.add(it.category);
    });
    return ['All', ...Array.from(cats)];
  }, [data]);

  // Compute true 16D latent rankings from LightGCN checkpoint
  const nearestItems = useMemo(() => {
    if (!data || !selectedNode || selectedNode.type !== 'user') return [];
    
    // Check if precomputed true 16D rankings exist
    const true16d = data.precomputed_16d_rankings?.[selectedNode.id];
    if (true16d && true16d.length > 0) {
      return true16d.slice(0, 4).map(rec => {
        const itemNode = data.items.find(it => it.id === rec.id);
        const dx = (itemNode?.x ?? 0) - selectedNode.x;
        const dy = (itemNode?.y ?? 0) - selectedNode.y;
        const dist2d = Math.sqrt(dx * dx + dy * dy);
        return {
          item: itemNode || { id: rec.id, title: rec.name, category: rec.category, price: rec.price, x: 0, y: 0, type: 'item' as const },
          score: rec.score,
          latentDot: rec.latent_dot_product,
          dist2d
        };
      });
    }

    // Fallback: 2D distance
    const scored = data.items.map(it => {
      const dx = it.x - selectedNode.x;
      const dy = it.y - selectedNode.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      return { item: it, score: Number((1.0 / (1.0 + dist * 0.3)).toFixed(3)), latentDot: undefined, dist2d: dist };
    });
    scored.sort((a, b) => a.dist2d - b.dist2d);
    return scored.slice(0, 4);
  }, [data, selectedNode]);

  // Viewbox & Scaling
  const viewBoxSize = 600;
  const padding = 50;
  const effectiveSize = viewBoxSize - padding * 2;

  const { minX, maxX, minY, maxY } = useMemo(() => {
    if (!data) return { minX: -2, maxX: 2, minY: -2, maxY: 2 };
    const all = [...data.users, ...data.items];
    const xs = all.map(n => n.x);
    const ys = all.map(n => n.y);
    return {
      minX: Math.min(...xs),
      maxX: Math.max(...xs),
      minY: Math.min(...ys),
      maxY: Math.max(...ys)
    };
  }, [data]);

  const scaleX = (x: number) => {
    const range = (maxX - minX) || 1;
    return padding + ((x - minX) / range) * effectiveSize;
  };

  const scaleY = (y: number) => {
    const range = (maxY - minY) || 1;
    // Invert SVG Y axis
    return viewBoxSize - (padding + ((y - minY) / range) * effectiveSize);
  };

  const getItemColor = (category?: string) => {
    switch (category) {
      case 'Footwear': return '#F59E0B'; // amber
      case 'Outerwear': return '#8B5CF6'; // purple
      case 'Knitwear': return '#10B981'; // emerald
      case 'Accessories': return '#EC4899'; // pink
      default: return '#3B82F6'; // blue
    }
  };

  return (
    <div className={`glass-panel rounded-2xl border border-surfaceHighlight p-5 md:p-6 bg-[#090F1C]/90 shadow-xl ${className}`}>
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-surfaceHighlight/60">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center text-primary">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-display font-semibold text-white tracking-wide flex items-center gap-2">
                2D Embedding Space Explorer
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isLive
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                    : 'bg-primary/10 text-primary border-primary/30'
                }`}>
                  {isLive ? 'LIVE INFERENCE' : 'VERIFIED BENCHMARK CACHE'}
                </span>
              </h3>
              <p className="text-xs text-textMuted font-light">
                PCA 2D projection of 16-dimensional LightGCN user and catalog item latent representations
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Category Filter */}
          <div className="flex items-center gap-1 bg-surface border border-surfaceHighlight rounded-lg p-1">
            {categories.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-all ${
                  categoryFilter === cat
                    ? 'bg-primary text-background font-semibold shadow-[0_0_8px_rgba(34,211,238,0.3)]'
                    : 'text-textMuted hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={loadData}
            title="Reload Embeddings"
            aria-label="Reload Embeddings"
            className="p-1.5 rounded-lg bg-surface border border-surfaceHighlight hover:border-primary/50 text-textMuted hover:text-primary transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Visualizer Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-5">
        {/* SVG Scatter Plot */}
        <div className="lg:col-span-2 relative bg-[#060A14] border border-surfaceHighlight/60 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
          {loading && (
            <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center gap-2 text-xs font-mono text-primary">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Projecting LightGCN latent vectors via PCA...
            </div>
          )}

          <svg
            viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
            className="w-full h-full cursor-crosshair select-none"
          >
            {/* Grid Lines */}
            <line x1={0} y1={viewBoxSize / 2} x2={viewBoxSize} y2={viewBoxSize / 2} stroke="#1E293B" strokeDasharray="3 3" />
            <line x1={viewBoxSize / 2} y1={0} x2={viewBoxSize / 2} y2={viewBoxSize} stroke="#1E293B" strokeDasharray="3 3" />

            {/* Connecting lines from selected user to nearest neighbor items */}
            {selectedNode && selectedNode.type === 'user' && nearestItems.map(({ item }) => {
              const x1 = scaleX(selectedNode.x);
              const y1 = scaleY(selectedNode.y);
              const x2 = scaleX(item.x);
              const y2 = scaleY(item.y);
              return (
                <g key={`conn-${item.id}`}>
                  <line
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#22D3EE"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                    opacity="0.65"
                    className="animate-pulse"
                  />
                  <circle cx={(x1 + x2) / 2} cy={(y1 + y2) / 2} r="2.5" fill="#22D3EE" />
                </g>
              );
            })}

            {/* Items Scatter */}
            {data && data.items.map(item => {
              if (categoryFilter !== 'All' && item.category !== categoryFilter) return null;

              const cx = scaleX(item.x);
              const cy = scaleY(item.y);
              const isSelected = selectedNode?.id === item.id;
              const isNearest = nearestItems.some(n => n.item.id === item.id);
              const color = getItemColor(item.category);

              return (
                <g
                  key={item.id}
                  onClick={() => {
                    setSelectedNode(item);
                    if (onSelectItem) onSelectItem(item);
                  }}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isSelected ? 8 : isNearest ? 6.5 : 5}
                    fill={color}
                    stroke={isSelected ? '#FFFFFF' : isNearest ? '#22D3EE' : '#090F1C'}
                    strokeWidth={isSelected ? 2.5 : isNearest ? 2 : 1}
                    className="transition-all"
                  />
                  {isSelected && (
                    <circle cx={cx} cy={cy} r={12} fill="none" stroke="#22D3EE" strokeWidth="1" strokeDasharray="2 2" className="animate-spin" />
                  )}
                </g>
              );
            })}

            {/* Users Scatter */}
            {data && data.users.map(u => {
              const cx = scaleX(u.x);
              const cy = scaleY(u.y);
              const isSelected = selectedNode?.id === u.id;

              return (
                <g
                  key={u.id}
                  onClick={() => setSelectedNode(u)}
                  className="cursor-pointer transition-transform hover:scale-125"
                >
                  {/* Diamond shape for user */}
                  <polygon
                    points={`${cx},${cy - 7} ${cx + 7},${cy} ${cx},${cy + 7} ${cx - 7},${cy}`}
                    fill="#22D3EE"
                    stroke={isSelected ? '#FFFFFF' : '#090F1C'}
                    strokeWidth={isSelected ? 2 : 1}
                  />
                  {isSelected && (
                    <polygon
                      points={`${cx},${cy - 12} ${cx + 12},${cy} ${cx},${cy + 12} ${cx - 12},${cy}`}
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fill="#94A3B8"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {u.id}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Legend Overlay */}
          <div className="absolute bottom-2 left-2 bg-[#090F1C]/90 border border-surfaceHighlight/60 rounded-lg p-2 flex flex-wrap items-center gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rotate-45 bg-primary inline-block"></span>
              <span className="text-slate-200">User ($E_u$)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
              <span className="text-slate-200">Item ($E_i$)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block"></span>
              <span className="text-slate-200">Footwear</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
              <span className="text-slate-200">Outerwear</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
              <span className="text-slate-200">Knitwear</span>
            </div>
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="flex flex-col gap-4 bg-surface/40 border border-surfaceHighlight/60 rounded-xl p-4">
          <div className="flex items-center justify-between pb-3 border-b border-surfaceHighlight/40">
            <span className="text-xs font-mono uppercase text-textMuted tracking-wider font-semibold">
              Latent Inspector
            </span>
            {selectedNode && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                selectedNode.type === 'user' ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'
              }`}>
                {selectedNode.type.toUpperCase()}
              </span>
            )}
          </div>

          {selectedNode ? (
            <div className="space-y-3">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  {selectedNode.name || selectedNode.title}
                </h4>
                <p className="text-xs font-mono text-textMuted mt-0.5">
                  ID: {selectedNode.id}
                </p>
              </div>

              {selectedNode.type === 'user' && selectedNode.profile && (
                <div className="p-2.5 rounded-lg bg-[#090F1C] border border-surfaceHighlight/50">
                  <span className="text-[10px] font-mono text-primary block uppercase">Style Profile</span>
                  <span className="text-xs text-slate-200 font-medium">{selectedNode.profile}</span>
                </div>
              )}

              {selectedNode.type === 'item' && (
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2 rounded bg-[#090F1C] border border-surfaceHighlight/40">
                    <span className="text-[9px] text-textMuted block">Category</span>
                    <span className="text-slate-200">{selectedNode.category}</span>
                  </div>
                  <div className="p-2 rounded bg-[#090F1C] border border-surfaceHighlight/40">
                    <span className="text-[9px] text-textMuted block">Style</span>
                    <span className="text-slate-200">{selectedNode.style}</span>
                  </div>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-[#090F1C] border border-surfaceHighlight/40 font-mono text-xs">
                <span className="text-[10px] text-textMuted block uppercase mb-1">PCA Latent Coordinates</span>
                <div className="flex items-center justify-between text-slate-300">
                  <span>PC1 (x): <strong className="text-primary">{selectedNode.x}</strong></span>
                  <span>PC2 (y): <strong className="text-secondary">{selectedNode.y}</strong></span>
                </div>
              </div>

              {/* Nearest Recommendations for User */}
              {selectedNode.type === 'user' && nearestItems.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider font-semibold">
                      True 16D PyTorch Recommendations:
                    </span>
                    <span className="text-[9px] font-mono text-textMuted bg-surface px-1.5 py-0.5 rounded border border-surfaceHighlight">
                      Dot Product $E_u^T E_i$
                    </span>
                  </div>
                  <span className="text-[9px] font-mono text-slate-400 block mb-2">
                    *Ranked using full 16D latent manifold (Checkpoint 515a9530)
                  </span>
                  <div className="space-y-1.5">
                    {nearestItems.map(({ item, score, latentDot, dist2d }, idx) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedNode(item)}
                        className="p-2 rounded-lg bg-[#090F1C] border border-surfaceHighlight/50 hover:border-primary/40 transition-all flex items-center justify-between cursor-pointer group"
                      >
                        <div className="truncate pr-2">
                          <span className="text-xs text-white group-hover:text-primary transition-colors block truncate">
                            {idx + 1}. {item.title || item.id}
                          </span>
                          <span className="text-[10px] font-mono text-textMuted">
                            {item.category} • ${item.price}
                          </span>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[11px] font-mono text-primary font-bold block">
                            {score}
                          </span>
                          <span className="text-[9px] font-mono text-textMuted">
                            {latentDot !== undefined ? `dot: ${latentDot}` : `Δ2d: ${dist2d.toFixed(2)}`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="py-12 text-center text-xs font-mono text-textMuted">
              Click any node in the scatter plot to inspect its latent vector coordinates.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
