import { Sparkles, Tag, CheckCircle2, XCircle, Activity, Bot } from 'lucide-react';
import { useState } from 'react';
import { calculateMatch, Intent } from '../utils/scoring';

const EXAMPLE_PROMPTS = [
  {
    text: "Find me a minimalist silk evening outfit in neutral colors.",
    intent: { style: 'Minimalist', material: 'Silk', color: 'Neutral', occasion: 'Evening' }
  },
  {
    text: "I need a bright, casual cotton dress for a summer day out.",
    intent: { style: 'Casual', material: 'Cotton', color: 'Bright', occasion: 'Day' }
  }
];

const PRODUCTS = [
  { id: 1, name: 'Minimalist Silk Slip Dress', attr: { style: 'Minimalist', material: 'Silk', occasion: 'Evening', color: 'Neutral' }, color: '#f3e5d8' },
  { id: 2, name: 'Satin A-Line Gown', attr: { style: 'Elegant', material: 'Satin', occasion: 'Evening', color: 'Neutral' }, color: '#e6e6e6' },
  { id: 3, name: 'Cotton Summer Maxi', attr: { style: 'Casual', material: 'Cotton', occasion: 'Day', color: 'Bright' }, color: '#ffd1dc' },
  { id: 4, name: 'Linen Beach Shirt', attr: { style: 'Casual', material: 'Linen', occasion: 'Day', color: 'Neutral' }, color: '#d1cec7' },
];

export const ProductShowcase = () => {
  const [activePromptIdx, setActivePromptIdx] = useState(0);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const activePrompt = EXAMPLE_PROMPTS[activePromptIdx];
  const intent = activePrompt.intent;

  const processedProducts = PRODUCTS.map(p => ({
    ...p,
    ...calculateMatch(intent, p.attr as Intent)
  })).sort((a, b) => b.score - a.score);

  return (
    <section id="products" className="py-24 bg-[#090F1C] relative border-t border-surfaceHighlight/40">
      <div className="container mx-auto px-6">
        
        <div className="mb-12 max-w-3xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Application Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Fashion Intelligence Copilot
          </h2>
          <p className="text-textMuted text-base sm:text-lg leading-relaxed mb-6 font-light">
            An explainable multimodal discovery interface translating conversational requirements into deterministic attribute scoring and verified graph retrieval.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md border border-emerald-500/20">
            <Activity className="w-3.5 h-3.5" />
            <span>Operating Mode: VERIFIED ALGORITHM (Deterministic Scoring)</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 glass-panel rounded-3xl border border-surfaceHighlight overflow-hidden shadow-2xl">
          
          {/* Left Panel: Conversational UI */}
          <div className="p-6 md:p-8 bg-[#060A14] border-b lg:border-b-0 lg:border-r border-surfaceHighlight relative flex flex-col justify-between">
            <div className="relative z-10 flex flex-col flex-1 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-surfaceHighlight/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-white text-sm">Style Copilot Engine</h3>
                    <p className="text-[10px] text-textMuted font-mono">Semantic Entity Disambiguation</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded border border-primary/20">
                  Active Prompt #{activePromptIdx + 1}
                </span>
              </div>

              {/* Chat Dialog */}
              <div className="space-y-4">
                <div className="flex justify-end">
                  <div className="bg-primary text-background px-4 py-3 rounded-2xl rounded-tr-sm max-w-[90%] shadow-lg">
                    <p className="text-xs sm:text-sm font-medium leading-relaxed">{activePrompt.text}</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-surface border border-surfaceHighlight px-4 py-4 rounded-2xl rounded-tl-sm max-w-[95%] shadow-lg space-y-3">
                    <p className="text-xs text-slate-300">
                      Query parsed into 4 explicit target attributes:
                    </p>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div className="bg-[#090F1C] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-0.5">Style</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {intent.style}
                        </span>
                      </div>
                      <div className="bg-[#090F1C] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-0.5">Material</span>
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {intent.material}
                        </span>
                      </div>
                      <div className="bg-[#090F1C] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-0.5">Color</span>
                        <span className="text-xs font-semibold text-slate-200 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {intent.color}
                        </span>
                      </div>
                      <div className="bg-[#090F1C] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-0.5">Occasion</span>
                        <span className="text-xs font-semibold text-amber-400 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {intent.occasion}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sample Queries */}
              <div className="pt-4 border-t border-surfaceHighlight/50">
                <span className="text-[10px] font-mono text-textMuted uppercase block mb-2">Switch Test Intent:</span>
                <div className="flex flex-col gap-2">
                  {EXAMPLE_PROMPTS.map((ep, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setActivePromptIdx(idx); setSelectedItemId(null); }}
                      className={`text-left text-xs p-2.5 rounded-xl border transition-all ${
                        activePromptIdx === idx 
                          ? 'bg-primary/10 border-primary text-white font-medium' 
                          : 'bg-surface/40 border-surfaceHighlight text-slate-400 hover:text-white'
                      }`}
                    >
                      {ep.text}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Ranked Candidate Products */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-white text-base">Ranked Recommendations</h3>
                <span className="text-xs font-mono text-textMuted">Weighted Scoring Engine</span>
              </div>
              
              <div className="grid gap-3">
                {processedProducts.map((p) => {
                  const isSelected = selectedItemId === p.id;
                  return (
                    <div
                      key={p.id}
                      onClick={() => setSelectedItemId(isSelected ? null : p.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-surface border-primary shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                          : 'bg-surface/50 border-surfaceHighlight hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-8 h-8 rounded-lg border border-white/20 shrink-0" 
                            style={{ backgroundColor: p.color }}
                          />
                          <div>
                            <h4 className="text-xs font-semibold text-white">{p.name}</h4>
                            <span className="text-[10px] font-mono text-textMuted">
                              {p.attr.style} • {p.attr.material} • {p.attr.color}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                            p.score >= 80 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
                              : p.score >= 50 
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' 
                              : 'bg-red-500/10 text-red-400 border border-red-500/30'
                          }`}>
                            {p.score}% Match
                          </span>
                        </div>
                      </div>

                      {/* Expandable Explanation Drawer */}
                      {isSelected && (
                        <div className="mt-3 pt-3 border-t border-surfaceHighlight space-y-2 animate-fade-in-up">
                          <div className="flex flex-wrap gap-1.5">
                            {p.matches.map((m: string, mi: number) => (
                              <span key={mi} className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                <CheckCircle2 className="w-3 h-3" /> {m}
                              </span>
                            ))}
                            {p.mismatches.map((mm: string, mmi: number) => (
                              <span key={mmi} className="inline-flex items-center gap-1 text-[10px] font-mono text-red-400 bg-red-500/10 border border-red-500/20 px-2 py-0.5 rounded">
                                <XCircle className="w-3 h-3" /> {mm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-[11px] font-mono text-textMuted border-t border-surfaceHighlight pt-3">
              *Scoring model: Material (35%) + Style (25%) + Occasion (25%) + Color (15%). Deterministic offline verification.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
