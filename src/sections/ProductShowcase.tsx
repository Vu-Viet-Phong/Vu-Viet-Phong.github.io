import { Sparkles, Hexagon, Tag, CheckCircle2, XCircle, ChevronRight, Activity } from 'lucide-react';
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

  // Process and sort products based on current intent
  const processedProducts = PRODUCTS.map(p => ({
    ...p,
    ...calculateMatch(intent, p.attr as Intent)
  })).sort((a, b) => b.score - a.score);

  return (
    <section id="products" className="py-24 bg-background relative border-t border-surfaceHighlight/30">
      <div className="container mx-auto px-6">
        
        <div className="mb-12 max-w-3xl text-center mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] font-mono uppercase tracking-wider mb-6">
            <Sparkles className="w-3 h-3" /> Product Concept
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Fashion Intelligence Copilot</h2>
          <p className="text-textMuted text-lg leading-relaxed mb-6">
            An AI-powered discovery interface combining computer vision, natural language processing, and graph-based retrieval to understand complex fashion intents.
          </p>
          <div className="inline-flex items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-yellow-500 bg-yellow-500/10 px-3 py-1.5 rounded-md border border-yellow-500/20">
            <Activity className="w-3 h-3" /> Interactive Demo — Simulation Mode
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 glass-panel rounded-3xl border border-primary/20 overflow-hidden shadow-2xl">
          
          {/* Left Panel: Conversational UI */}
          <div className="p-4 md:p-8 bg-[#0a0f18] border-r border-surfaceHighlight relative flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none flex items-center justify-center">
              <Hexagon className="w-96 h-96" strokeWidth={0.5} />
            </div>

            <div className="relative z-10 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-surfaceHighlight/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <BotIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Style Copilot</h3>
                    <p className="text-[10px] text-textMuted font-mono">Simulation Mode</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6 overflow-y-auto pr-2 pb-4">
                <div className="flex justify-end">
                  <div className="bg-primary text-background px-5 py-3 rounded-2xl rounded-tr-sm max-w-[90%] shadow-lg">
                    <p className="text-sm font-medium leading-relaxed">{activePrompt.text}</p>
                  </div>
                </div>

                <div className="flex justify-start">
                  <div className="bg-surface border border-surfaceHighlight px-5 py-4 rounded-2xl rounded-tl-sm max-w-[95%] shadow-lg space-y-4">
                    <p className="text-sm text-slate-300">I analyzed your request. Here are the attributes I extracted to query the fashion graph:</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#0a0f18] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-1">Style</span>
                        <span className="text-xs font-semibold text-primary flex items-center gap-1"><Tag className="w-3 h-3"/> {intent.style}</span>
                      </div>
                      <div className="bg-[#0a0f18] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-1">Material</span>
                        <span className="text-xs font-semibold text-secondary flex items-center gap-1"><Tag className="w-3 h-3"/> {intent.material}</span>
                      </div>
                      <div className="bg-[#0a0f18] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-1">Color Palette</span>
                        <span className="text-xs font-semibold text-white flex items-center gap-1"><Tag className="w-3 h-3"/> {intent.color}</span>
                      </div>
                      <div className="bg-[#0a0f18] p-2.5 rounded-lg border border-surfaceHighlight">
                        <span className="block text-[9px] font-mono text-textMuted uppercase mb-1">Occasion</span>
                        <span className="text-xs font-semibold text-white flex items-center gap-1"><Tag className="w-3 h-3"/> {intent.occasion}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surfaceHighlight/50">
                <p className="text-[10px] font-mono text-textMuted uppercase mb-3">Try Example Prompts:</p>
                <div className="space-y-2">
                  {EXAMPLE_PROMPTS.map((prompt, idx) => (
                    <button 
                      key={idx}
                      onClick={() => { setActivePromptIdx(idx); setSelectedItemId(null); }}
                      className={`w-full text-left p-3 rounded-lg border text-xs transition-colors flex items-center justify-between ${activePromptIdx === idx ? 'bg-primary/10 border-primary text-white' : 'bg-surface border-surfaceHighlight text-slate-400 hover:text-white'}`}
                    >
                      <span className="truncate pr-4">{prompt.text}</span>
                      <ChevronRight className="w-3 h-3 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel: Dynamic Recommendations */}
          <div className="p-4 md:p-8 bg-surface/30">
            <h3 className="font-semibold text-white mb-6 flex items-center justify-between">
              Recommended Items
              <span className="text-[10px] font-mono text-textMuted bg-surface border border-surfaceHighlight px-2 py-1 rounded">Ranked by demo estimates</span>
            </h3>

            <div className="space-y-4">
              {processedProducts.map((p) => {
                const isSelected = selectedItemId === p.id;
                return (
                  <div 
                    key={p.id}
                    onClick={() => setSelectedItemId(isSelected ? null : p.id)}
                    className={`flex flex-col gap-4 p-4 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-surface border-primary shadow-lg' : 'bg-surface/50 border-surfaceHighlight/50 hover:border-surfaceHighlight'}`}
                  >
                    <div className="flex gap-4">
                      <div className="w-16 h-20 rounded-xl shrink-0 flex flex-col items-center justify-center border border-white/10" style={{ backgroundColor: p.color }}>
                         <Hexagon className="w-6 h-6 text-black/20" />
                      </div>
                      
                      <div className="flex-1 py-1">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-semibold text-sm ${isSelected ? 'text-primary' : 'text-white'}`}>{p.name}</h4>
                          <div className="flex flex-col items-end">
                            <span className={`text-xs font-bold ${p.score > 80 ? 'text-green-400' : p.score > 40 ? 'text-yellow-400' : 'text-red-400'}`}>{p.score}%</span>
                            <span className="text-[9px] text-textMuted uppercase font-mono">Match</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {Object.values(p.attr).map(a => (
                            <span key={a} className="px-1.5 py-0.5 rounded bg-[#0a0f18] border border-surfaceHighlight text-[10px] text-slate-400">{a}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Explanation Panel */}
                    {isSelected && (
                      <div className="pt-3 border-t border-surfaceHighlight/50 animate-fade-in-up text-xs space-y-2">
                        <div className="text-slate-300 font-medium mb-2">Detailed Relevance Breakdown:</div>
                        {p.matches.length > 0 && (
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300">
                              <strong className="text-green-400/90 font-medium">Matches:</strong> {p.matches.join(', ')}
                            </span>
                          </div>
                        )}
                        {p.mismatches.length > 0 && (
                          <div className="flex items-start gap-2">
                            <XCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                            <span className="text-slate-300">
                              <strong className="text-red-400/90 font-medium">Fails on:</strong> {p.mismatches.join('; ')}
                            </span>
                          </div>
                        )}
                        {p.score < 50 && (
                          <div className="mt-2 p-2 rounded bg-red-400/10 border border-red-400/20 text-red-300/90 text-[11px]">
                            Conclusion: This product is poorly aligned with the query intent and would normally be filtered out.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BotIcon = (props: any) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M12 8V4H8" />
    <rect width="16" height="12" x="4" y="8" rx="2" />
    <path d="M2 14h2" />
    <path d="M20 14h2" />
    <path d="M15 13v2" />
    <path d="M9 13v2" />
  </svg>
);
