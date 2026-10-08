import { useState } from 'react';
import { Search, Bot, Sliders, ChevronRight, Activity, Cpu, FileText, Database, Link as LinkIcon } from 'lucide-react';

type GraphRAGStage = 'Query' | 'Vector' | 'Graph' | 'Fusion' | 'Rerank' | 'Answer';
const stages: GraphRAGStage[] = ['Query', 'Vector', 'Graph', 'Fusion', 'Rerank', 'Answer'];

const stageData: Record<GraphRAGStage, any> = {
  Query: { 
    title: 'Query Understanding', 
    desc: 'Parsing user intent and extracting key entities for search.', 
    details: [
      { key: 'Raw Input', val: '"Find me an elegant silk evening gown for an outdoor gala."' },
      { key: 'Intent Type', val: 'Product Discovery' },
      { key: 'Entities Extracted', val: '{"Category": "Gown", "Material": "Silk", "Occasion": ["Evening", "Outdoor"]}' }
    ]
  },
  Vector: { 
    title: 'Dense Vector Retrieval', 
    desc: 'Fetching semantically similar unstructured documents via cosine similarity.', 
    details: [
      { doc: 'Doc-8492: "Emerald Evening Gown"', score: 0.89 },
      { doc: 'Doc-1123: "Silk Summer Dress"', score: 0.72 },
      { doc: 'Doc-9910: "Formal Satin Gown"', score: 0.68 }
    ]
  },
  Graph: { 
    title: 'Graph-Based Retrieval', 
    desc: 'Traversing the Neo4j Knowledge Graph to find structured multi-hop relationships.', 
    nodes: ['Product:8492', 'Material:Silk', 'Occasion:Gala'],
    edges: ['(Product:8492)-[:MADE_OF]->(Material:Silk)', '(Product:8492)-[:SUITABLE_FOR]->(Occasion:Gala)']
  },
  Fusion: { 
    title: 'Candidate Fusion', 
    desc: 'Merging vector candidates with structural graph contexts (Reciprocal Rank Fusion).', 
    details: [
      { candidate: 'Product:8492', vectorRank: 1, graphRank: 1, rrfScore: 0.032 },
      { candidate: 'Product:1123', vectorRank: 2, graphRank: 5, rrfScore: 0.018 }
    ]
  },
  Rerank: { 
    title: 'Reranking', 
    desc: 'Cross-encoder scoring to prioritize the most relevant contexts.', 
    text: 'Selected Context #1: [Product:8492] is an Emerald Evening Gown made of Silk. Suitable for Gala/Evening.'
  },
  Answer: { 
    title: 'Grounded Answer', 
    desc: 'LLM generates response explicitly citing the retrieved context.', 
    answer: 'The Emerald Evening Gown [1] perfectly matches your criteria. It is crafted from 100% Silk [2] and designed specifically for formal evening occasions like an outdoor gala [3].',
    citations: [
      '[1] Doc-8492: Product Title',
      '[2] KG Edge: Product:8492 -> Material:Silk',
      '[3] KG Edge: Product:8492 -> Occasion:Gala'
    ]
  }
};

export const AILab = () => {
  const [activeTab, setActiveTab] = useState<'graphrag' | 'arena'>('graphrag');
  const [activeStage, setActiveStage] = useState<GraphRAGStage>('Query');
  const [isSimulating, setIsSimulating] = useState(false);
  
  const [arenaModel, setArenaModel] = useState<'LightGCN' | 'NGCF'>('LightGCN');
  const [topK, setTopK] = useState(5);

  const runSimulation = () => {
    setIsSimulating(true);
    let currentIdx = 0;
    const interval = setInterval(() => {
      if (currentIdx < stages.length) {
        setActiveStage(stages[currentIdx]);
        currentIdx++;
      } else {
        clearInterval(interval);
        setIsSimulating(false);
      }
    }, 1200);
  };

  const renderInspectorContent = () => {
    const data = stageData[activeStage];
    
    switch (activeStage) {
      case 'Query':
        return (
          <div className="space-y-3">
            {data.details.map((d: any, i: number) => (
              <div key={i} className="bg-[#0a0f18] p-3 rounded-lg border border-surfaceHighlight">
                <div className="text-[10px] font-mono text-textMuted mb-1">{d.key}</div>
                <div className="text-sm text-primary font-mono">{d.val}</div>
              </div>
            ))}
          </div>
        );
      case 'Vector':
        return (
          <div className="space-y-3">
            <div className="text-[10px] font-mono text-textMuted uppercase px-2">Top-K Candidates</div>
            {data.details.map((d: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-[#0a0f18] p-3 rounded-lg border border-surfaceHighlight">
                <span className="text-sm text-slate-300">{d.doc}</span>
                <span className="text-xs font-mono text-green-400">{d.score.toFixed(2)}</span>
              </div>
            ))}
          </div>
        );
      case 'Graph':
        return (
          <div className="space-y-4">
            <div className="bg-[#0a0f18] p-4 rounded-lg border border-surfaceHighlight h-40 flex items-center justify-center relative overflow-hidden">
               <svg viewBox="0 0 100 50" className="w-full h-full max-w-[250px] opacity-80">
                  <circle cx="20" cy="25" r="8" fill="#4BD5E8" />
                  <circle cx="80" cy="10" r="6" fill="#9788EF" />
                  <circle cx="80" cy="40" r="6" fill="#9788EF" />
                  <line x1="28" y1="23" x2="74" y2="12" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 1" />
                  <line x1="28" y1="27" x2="74" y2="38" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 1" />
                  <text x="50" y="15" fontSize="4" fill="#fff" textAnchor="middle">MADE_OF</text>
                  <text x="50" y="38" fontSize="4" fill="#fff" textAnchor="middle">SUITABLE_FOR</text>
                  <text x="20" y="38" fontSize="4" fill="#4BD5E8" textAnchor="middle">Product:8492</text>
                  <text x="80" y="20" fontSize="4" fill="#9788EF" textAnchor="middle">Material:Silk</text>
                  <text x="80" y="50" fontSize="4" fill="#9788EF" textAnchor="middle">Occasion:Gala</text>
               </svg>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-textMuted uppercase">Traversed Edges</div>
              {data.edges.map((e: string, i: number) => (
                <div key={i} className="text-xs text-secondary font-mono bg-[#0a0f18] p-2 rounded border border-surfaceHighlight">{e}</div>
              ))}
            </div>
          </div>
        );
      case 'Fusion':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-mono text-textMuted uppercase border-b border-surfaceHighlight">
                <th className="pb-2">Candidate</th>
                <th className="pb-2">Vec Rank</th>
                <th className="pb-2">Graph Rank</th>
                <th className="pb-2">RRF Score</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {data.details.map((d: any, i: number) => (
                <tr key={i} className="border-b border-surfaceHighlight/30">
                  <td className="py-3 text-slate-300 font-mono">{d.candidate}</td>
                  <td className="py-3 text-slate-400">{d.vectorRank}</td>
                  <td className="py-3 text-slate-400">{d.graphRank}</td>
                  <td className="py-3 text-primary font-mono">{d.rrfScore.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Rerank':
        return (
          <div className="bg-[#0a0f18] p-4 rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(75,213,232,0.1)]">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-white">Final Context Prompt</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic border-l-2 border-primary/50 pl-3">
              {data.text}
            </p>
          </div>
        );
      case 'Answer':
        return (
          <div className="space-y-4">
            <div className="bg-primary/10 p-4 rounded-lg border border-primary/30">
              <p className="text-sm text-white leading-relaxed">{data.answer}</p>
            </div>
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-textMuted uppercase flex items-center gap-2"><LinkIcon className="w-3 h-3"/> Local Dataset Citations</div>
              {data.citations.map((c: string, i: number) => (
                <div key={i} className="text-xs text-slate-400 font-mono">{c}</div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <section id="lab" className="py-24 relative overflow-hidden bg-background">
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Interactive AI Lab</h2>
          <p className="text-textMuted text-lg leading-relaxed mb-8">
            Explore interactive pipeline simulations and recommendation behaviors.
          </p>
          <div className="inline-flex bg-surface p-1 rounded-xl border border-surfaceHighlight">
            <button 
              onClick={() => setActiveTab('graphrag')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'graphrag' ? 'bg-secondary text-white shadow-lg' : 'text-textMuted hover:text-white'}`}
            >
              GraphRAG Pipeline
            </button>
            <button 
              onClick={() => setActiveTab('arena')}
              className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab === 'arena' ? 'bg-primary text-background shadow-lg' : 'text-textMuted hover:text-white'}`}
            >
              Recommendation Arena
            </button>
          </div>
          <div className="mt-6 text-[11px] font-mono uppercase tracking-wider text-yellow-500/80 bg-yellow-500/10 inline-block px-4 py-1.5 rounded-full border border-yellow-500/20">
            Interactive Pipeline Simulation — Local Demo Dataset
          </div>
        </div>

        {activeTab === 'graphrag' && (
          <div className="glass-panel rounded-3xl border border-secondary/30 p-2 md:p-8 grid lg:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Left: Input & Flow */}
            <div className="lg:col-span-7 space-y-8 p-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-secondary" /> Test Query
                </label>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    disabled
                    value="Find me an elegant silk evening gown for an outdoor gala." 
                    className="flex-1 bg-surface border border-surfaceHighlight rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-secondary transition-colors"
                  />
                  <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/80 disabled:opacity-50 transition-all flex items-center gap-2"
                  >
                    {isSimulating ? <Activity className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    Run
                  </button>
                </div>
              </div>

              {/* Pipeline Visualizer */}
              <div className="relative pt-6">
                <div className="absolute left-6 top-10 bottom-10 w-0.5 bg-surfaceHighlight rounded-full"></div>
                <div className="space-y-6 relative">
                  {stages.map((stage, idx) => (
                    <div 
                      key={stage} 
                      onClick={() => !isSimulating && setActiveStage(stage)}
                      className={`flex items-start gap-6 cursor-pointer group transition-all ${activeStage === stage ? 'opacity-100' : 'opacity-50 hover:opacity-80'}`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 z-10 border-2 transition-colors ${activeStage === stage ? 'bg-secondary border-secondary text-white shadow-[0_0_15px_rgba(151,136,239,0.4)]' : 'bg-surface border-surfaceHighlight text-textMuted'}`}>
                        {idx + 1}
                      </div>
                      <div className={`flex-1 p-4 rounded-xl border transition-all ${activeStage === stage ? 'bg-secondary/10 border-secondary/30' : 'bg-surface/30 border-transparent group-hover:border-surfaceHighlight'}`}>
                        <h4 className="font-semibold text-white text-sm mb-1">{stageData[stage].title}</h4>
                        <p className="text-xs text-slate-400">{stageData[stage].desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Inspector */}
            <div className="lg:col-span-5 bg-[#05080f] rounded-2xl border border-surfaceHighlight p-6 flex flex-col shadow-2xl">
              <h3 className="text-sm font-semibold text-white mb-6 flex items-center gap-2 border-b border-surfaceHighlight pb-4">
                <Database className="w-4 h-4 text-secondary" /> Evidence Inspector
              </h3>
              
              <div className="flex-1 space-y-6">
                <div>
                  <h4 className="text-[10px] font-mono text-secondary uppercase mb-2">Stage: {stageData[activeStage].title}</h4>
                  <p className="text-xs text-slate-400">{stageData[activeStage].desc}</p>
                </div>

                <div className="bg-surface/50 rounded-xl border border-surfaceHighlight p-4">
                  {renderInspectorContent()}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'arena' && (
          <div className="glass-panel rounded-3xl border border-primary/30 p-2 md:p-8 grid lg:grid-cols-12 gap-8 animate-fade-in-up">
            <div className="lg:col-span-4 space-y-8 p-4 border-r border-surfaceHighlight/50">
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" /> Model Controls
                </h3>
                
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-textMuted uppercase">Algorithm</label>
                    <select 
                      value={arenaModel}
                      onChange={(e) => setArenaModel(e.target.value as 'LightGCN'|'NGCF')}
                      className="w-full bg-surface border border-surfaceHighlight rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="LightGCN">LightGCN (Graph Convolution)</option>
                      <option value="NGCF">NGCF (Neural Graph CF)</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-mono text-textMuted uppercase">Top-K Items</label>
                      <span className="text-xs font-mono text-primary">K={topK}</span>
                    </div>
                    <input 
                      type="range" min="1" max="10" value={topK} 
                      onChange={(e) => setTopK(parseInt(e.target.value))}
                      className="w-full accent-primary" 
                    />
                  </div>
                  
                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <h4 className="text-[10px] font-mono text-primary uppercase mb-2">Model Note</h4>
                    <p className="text-xs text-slate-300">
                      {arenaModel === 'LightGCN' 
                        ? 'LightGCN learns user and item embeddings by linearly propagating them on the user-item interaction graph.' 
                        : 'NGCF explicitly encodes the collaborative signal in the form of high-order connectivities.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> Generated Recommendation List
                </h3>
              </div>
              
              <div className="space-y-3">
                {[...Array(topK)].map((_, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-surface/40 border border-surfaceHighlight hover:border-primary/50 transition-colors group">
                    <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center font-mono text-xs text-textMuted group-hover:text-primary transition-colors">
                      #{i + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-white">Synthetic Product {i + 101}</h4>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-[10px] font-mono text-primary">Score: {(0.95 - i*0.05).toFixed(3)}</span>
                        <span className="text-[10px] font-mono text-textMuted">Category: {(i % 2 === 0) ? 'Apparel' : 'Accessories'}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-textMuted opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
