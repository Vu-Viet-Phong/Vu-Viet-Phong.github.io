import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Settings2, Play, GitMerge } from 'lucide-react';

export const AILab = () => {
  const [activeTab, setActiveTab] = useState<'rec' | 'rag'>('rec');

  return (
    <section id="lab" className="py-24 bg-surface/30 border-y border-surfaceHighlight/50">
      <div className="container mx-auto px-6">
        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-1 rounded-lg bg-surfaceHighlight mb-6">
            <button 
              onClick={() => setActiveTab('rec')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rec' ? 'bg-primary text-background' : 'text-textMuted hover:text-white'}`}
            >
              Recommendation Arena
            </button>
            <button 
              onClick={() => setActiveTab('rag')}
              className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'rag' ? 'bg-secondary text-background' : 'text-textMuted hover:text-white'}`}
            >
              GraphRAG Pipeline
            </button>
          </div>
          <h2 className="text-3xl font-bold mb-4">Interactive AI Lab Preview</h2>
          <p className="text-textMuted text-sm">
            Frontend demonstration interfaces illustrating architectural concepts. 
            <span className="block mt-1 text-primary/80 font-mono text-xs">Note: Illustrative Demo — Not Actual Model Predictions</span>
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-panel rounded-2xl overflow-hidden shadow-2xl">
          {activeTab === 'rec' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid md:grid-cols-3 min-h-[400px]">
              <div className="bg-surface border-r border-surfaceHighlight p-6 space-y-6">
                <div className="flex items-center gap-2 text-textMuted border-b border-surfaceHighlight pb-4">
                  <Settings2 className="w-4 h-4" /> <span className="font-medium text-sm">Parameters</span>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-textMuted">Algorithm</label>
                  <select className="w-full bg-background border border-surfaceHighlight rounded px-3 py-2 text-sm focus:outline-none focus:border-primary">
                    <option>LightGCN</option>
                    <option>NGCF</option>
                    <option>VBPR (Multimodal)</option>
                    <option>Matrix Factorization</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-mono text-textMuted">Top-K Items</label>
                  <input type="range" min="5" max="20" step="5" defaultValue="10" className="w-full accent-primary" />
                  <div className="text-right text-xs text-textMuted font-mono">K=10</div>
                </div>
                <button className="w-full py-2.5 rounded bg-primary/10 text-primary border border-primary/30 text-sm font-semibold hover:bg-primary/20 transition-colors flex justify-center items-center gap-2">
                  <Play className="w-4 h-4" /> Run Inference
                </button>
              </div>
              <div className="md:col-span-2 p-6 bg-background relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(75,213,232,0.05),transparent_50%)] pointer-events-none" />
                <h3 className="text-sm font-medium mb-6">Generated Recommendation List</h3>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded border border-surfaceHighlight bg-surface/50">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded bg-surfaceHighlight flex items-center justify-center font-mono text-xs">Item{i}</div>
                        <div>
                          <div className="text-sm font-medium">Demo Product {i}</div>
                          <div className="text-[10px] text-textMuted font-mono">Score: 0.8{9-i}</div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-textMuted" />
                    </div>
                  ))}
                  <div className="text-center pt-4 text-xs font-mono text-textMuted opacity-50">Awaiting actual backend connection...</div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'rag' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 min-h-[400px] flex flex-col justify-center bg-background">
              <div className="flex items-center justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surfaceHighlight -translate-y-1/2 z-0" />
                
                {['User Query', 'Query Intent', 'Hybrid Retrieval', 'Reranking', 'Generation'].map((step, idx) => (
                  <div key={step} className="relative z-10 flex flex-col items-center group">
                    <div className="w-12 h-12 rounded-full bg-surface border-2 border-surfaceHighlight flex items-center justify-center mb-3 group-hover:border-secondary transition-colors shadow-lg">
                      {idx === 2 ? <GitMerge className="w-5 h-5 text-secondary" /> : <div className="w-2 h-2 rounded-full bg-textMuted group-hover:bg-secondary" />}
                    </div>
                    <span className="text-xs font-mono text-textMuted whitespace-nowrap">{step}</span>
                  </div>
                ))}
              </div>
              <div className="mt-16 p-6 rounded-xl border border-dashed border-secondary/30 bg-secondary/5 text-center">
                <p className="text-sm text-textMuted">Click on a pipeline node to inspect internal representations and retrieved subgraphs. <br/>(UI framework prepared for backend integration)</p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
