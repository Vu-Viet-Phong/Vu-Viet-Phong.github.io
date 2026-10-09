import { useState, useEffect } from 'react';
import { Search, Bot, Sliders, Activity, Cpu, Database, User, Server, WifiOff } from 'lucide-react';
import { apiClient } from '../api/client';

type GraphRAGStage = 'Query' | 'Vector' | 'Graph' | 'Fusion' | 'Rerank' | 'Answer';
const stages: GraphRAGStage[] = ['Query', 'Vector', 'Graph', 'Fusion', 'Rerank', 'Answer'];

const queries = [
  "Find me an elegant silk evening gown for an outdoor gala.",
  "I'm looking for a comfortable casual cotton dress.",
  "Suggest a minimalist professional outfit in dark colors."
];

const stageDataTemplate: Record<GraphRAGStage, any> = {
  Query: { title: 'Query Understanding', desc: 'Parsing user intent and extracting key entities.' },
  Vector: { title: 'Dense Vector Retrieval', desc: 'Fetching semantically similar unstructured documents.' },
  Graph: { title: 'Graph-Based Retrieval', desc: 'Traversing the Neo4j KG to find structured multi-hop relationships.' },
  Fusion: { title: 'Candidate Fusion', desc: 'Merging vector candidates with structural graph contexts (RRF).' },
  Rerank: { title: 'Reranking', desc: 'Cross-encoder scoring to prioritize contexts.' },
  Answer: { title: 'Grounded Answer', desc: 'LLM generates response explicitly citing retrieved context.' }
};

const profiles = [
  { id: 'u1', name: 'Casual User', intent: 'Casual, Cotton, Daywear', avatarColor: '#4BD5E8' },
  { id: 'u2', name: 'Formal User', intent: 'Elegant, Silk, Evening', avatarColor: '#9788EF' }
];

export const AILab = () => {
  const [activeTab, setActiveTab] = useState<'graphrag' | 'arena'>('graphrag');
  
  // GraphRAG State
  const [selectedQueryIdx, setSelectedQueryIdx] = useState(0);
  const [activeStage, setActiveStage] = useState<GraphRAGStage>('Query');
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStageData, setCurrentStageData] = useState<any>(null);

  // Arena State
  const [activeProfile, setActiveProfile] = useState(profiles[0]);
  const [arenaModel1, setArenaModel1] = useState<'MF'|'NGCF'|'LightGCN'|'VBPR'>('LightGCN');
  const [arenaModel2, setArenaModel2] = useState<'MF'|'NGCF'|'LightGCN'|'VBPR'|'None'>('None');
  const [topK, setTopK] = useState(5);
  
  // API State
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiMode, setApiMode] = useState<string>('DEMO MODE');
  const [apiRecommendations1, setApiRecommendations1] = useState<any[]>([]);
  const [apiRecommendations2, setApiRecommendations2] = useState<any[]>([]);
  const [isLoadingRecs, setIsLoadingRecs] = useState(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        // Just checking model status route
        const res = await apiClient.get('/models');
        if (res && res.status) {
          setApiStatus('online');
          setApiMode(res.status.includes('Simulation') ? 'DEMO MODE (Backend)' : 'LIVE INFERENCE');
        } else {
          setApiStatus('offline');
        }
      } catch (e) {
        setApiStatus('offline');
      }
    };
    checkApi();
  }, []);

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

  useEffect(() => {
    // Generate deterministic mock data based on query and stage
    const query = queries[selectedQueryIdx];
    const data = { ...stageDataTemplate[activeStage] };
    
    if (activeStage === 'Query') {
      data.details = [
        { key: 'Raw Input', val: `"${query}"` },
        { key: 'Extracted Entities', val: selectedQueryIdx === 0 ? '{"Category": "Gown", "Material": "Silk"}' : '{"Category": "Dress", "Material": "Cotton"}' }
      ];
    } else if (activeStage === 'Vector') {
      data.details = [
        { doc: `Doc-8492: "Match for ${selectedQueryIdx}"`, score: 0.89 },
        { doc: `Doc-1123: "Alternative"`, score: 0.72 }
      ];
    } else if (activeStage === 'Graph') {
      data.nodes = ['Product:8492', 'Material:Silk'];
      data.edges = ['(Product:8492)-[:MADE_OF]->(Material:Silk)'];
    } else if (activeStage === 'Fusion') {
      data.details = [{ candidate: 'Product:8492', vectorRank: 1, graphRank: 1, rrfScore: 0.032 }];
    } else if (activeStage === 'Rerank') {
      data.text = `Selected Context: [Product:8492] matches ${query}`;
    } else if (activeStage === 'Answer') {
      data.answer = `Based on the graph, the Product:8492 [1] perfectly matches your criteria.`;
      data.citations = ['[1] Doc-8492: Product Node (source_id: neo4j_8492)'];
    }
    setCurrentStageData(data);
  }, [activeStage, selectedQueryIdx]);

  const generateRecommendations = (model: string, profile: any) => {
    // Deterministic mock generation (Fallback)
    const seed = model.length + profile.name.length;
    return [...Array(topK)].map((_, i) => ({
      id: 101 + i + seed,
      name: `Synthetic ${model} Item ${i + 1}`,
      score: (0.95 - (i * (0.05 + (seed*0.001)))).toFixed(3),
      category: i % 2 === 0 ? 'Apparel' : 'Accessories'
    }));
  };

  useEffect(() => {
    if (apiStatus !== 'online') return;
    
    const fetchRecs = async () => {
      setIsLoadingRecs(true);
      try {
        const res1 = await apiClient.post('/recommendations', { user_id: activeProfile.id, model: arenaModel1, top_k: topK });
        setApiRecommendations1(res1.items || []);
        
        if (arenaModel2 !== 'None') {
          const res2 = await apiClient.post('/recommendations', { user_id: activeProfile.id, model: arenaModel2, top_k: topK });
          setApiRecommendations2(res2.items || []);
        } else {
          setApiRecommendations2([]);
        }
      } catch (e) {
        console.warn("API fallback to local mock");
        setApiStatus('offline');
      } finally {
        setIsLoadingRecs(false);
      }
    };
    fetchRecs();
  }, [apiStatus, activeProfile, arenaModel1, arenaModel2, topK]);

  const renderInspectorContent = () => {
    if (!currentStageData) return null;
    const data = currentStageData;
    
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
                  <circle cx="80" cy="25" r="6" fill="#9788EF" />
                  <line x1="28" y1="25" x2="74" y2="25" stroke="#fff" strokeWidth="0.5" strokeDasharray="1 1" />
                  <text x="50" y="23" fontSize="4" fill="#fff" textAnchor="middle">RELATIONSHIP</text>
                  <text x="20" y="38" fontSize="4" fill="#4BD5E8" textAnchor="middle">Product</text>
                  <text x="80" y="38" fontSize="4" fill="#9788EF" textAnchor="middle">Attribute</text>
               </svg>
            </div>
          </div>
        );
      case 'Fusion':
        return (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-mono text-textMuted uppercase border-b border-surfaceHighlight">
                <th className="pb-2">Candidate</th>
                <th className="pb-2">RRF Score</th>
              </tr>
            </thead>
            <tbody className="text-xs">
              {data.details.map((d: any, i: number) => (
                <tr key={i} className="border-b border-surfaceHighlight/30">
                  <td className="py-3 text-slate-300 font-mono">{d.candidate}</td>
                  <td className="py-3 text-primary font-mono">{d.rrfScore.toFixed(3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        );
      case 'Rerank':
        return (
          <div className="bg-[#0a0f18] p-4 rounded-lg border border-primary/30 shadow-[0_0_15px_rgba(75,213,232,0.1)]">
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
              <div className="text-[10px] font-mono text-textMuted uppercase">Evidence Citations</div>
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
        </div>

        {activeTab === 'graphrag' && (
          <div className="glass-panel rounded-3xl border border-secondary/30 p-2 md:p-8 grid lg:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Left: Input & Flow */}
            <div className="lg:col-span-7 space-y-8 p-4">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-white flex items-center gap-2">
                  <Search className="w-4 h-4 text-secondary" /> Select Test Query
                </label>
                <select 
                  value={selectedQueryIdx}
                  onChange={(e) => { setSelectedQueryIdx(Number(e.target.value)); setActiveStage('Query'); }}
                  disabled={isSimulating}
                  className="w-full bg-surface border border-surfaceHighlight rounded-xl px-4 py-3 text-sm text-slate-300 focus:outline-none focus:border-secondary transition-colors"
                >
                  {queries.map((q, idx) => (
                    <option key={idx} value={idx}>{q}</option>
                  ))}
                </select>
                <div className="pt-2">
                  <button 
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="w-full px-6 py-3 bg-secondary text-white rounded-xl font-medium hover:bg-secondary/80 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                  >
                    {isSimulating ? <Activity className="w-4 h-4 animate-spin" /> : <Cpu className="w-4 h-4" />}
                    Run Execution Pipeline
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
                        <h4 className="font-semibold text-white text-sm mb-1">{stageDataTemplate[stage].title}</h4>
                        <p className="text-xs text-slate-400">{stageDataTemplate[stage].desc}</p>
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
                  <h4 className="text-[10px] font-mono text-secondary uppercase mb-2">Stage: {stageDataTemplate[activeStage].title}</h4>
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
              
              {/* Profile Selector */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" /> Test Profile
                </h3>
                <div className="flex gap-2">
                  {profiles.map(p => (
                    <button 
                      key={p.id}
                      onClick={() => setActiveProfile(p)}
                      className={`flex-1 p-3 rounded-xl border transition-all ${activeProfile.id === p.id ? 'bg-primary/10 border-primary text-white' : 'bg-surface border-surfaceHighlight text-slate-400 hover:text-white'}`}
                    >
                      <div className="text-xs font-semibold mb-1">{p.name}</div>
                      <div className="text-[9px] font-mono opacity-80">{p.intent}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" /> Model Comparison
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-textMuted uppercase">Model 1 (Primary)</label>
                    <select 
                      value={arenaModel1}
                      onChange={(e) => setArenaModel1(e.target.value as any)}
                      className="w-full bg-surface border border-surfaceHighlight rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="MF">Matrix Factorization (MF)</option>
                      <option value="NGCF">NGCF (Neural Graph CF)</option>
                      <option value="LightGCN">LightGCN</option>
                      <option value="VBPR">VBPR (Visual BPR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-mono text-textMuted uppercase">Model 2 (Optional)</label>
                    <select 
                      value={arenaModel2}
                      onChange={(e) => setArenaModel2(e.target.value as any)}
                      className="w-full bg-surface border border-surfaceHighlight rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-primary"
                    >
                      <option value="None">-- None --</option>
                      <option value="MF">Matrix Factorization (MF)</option>
                      <option value="NGCF">NGCF (Neural Graph CF)</option>
                      <option value="LightGCN">LightGCN</option>
                      <option value="VBPR">VBPR (Visual BPR)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-4 border-t border-surfaceHighlight/50">
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
            </div>

            <div className="lg:col-span-8 p-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-primary" /> Recommendation Inference
                </h3>
                <div className="flex items-center gap-2">
                  {apiStatus === 'online' ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-green-500/10 border border-green-500/20 text-green-500 text-[9px] font-mono uppercase tracking-wider">
                      <Server className="w-3 h-3" /> {apiMode}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[9px] font-mono uppercase tracking-wider" title="Backend unreachable. Using local deterministic fallback.">
                      <WifiOff className="w-3 h-3" /> Local Demo
                    </span>
                  )}
                </div>
              </div>
              
              <div className={`grid gap-6 ${arenaModel2 !== 'None' ? 'grid-cols-2' : 'grid-cols-1 max-w-lg mx-auto'}`}>
                {/* Model 1 Results */}
                <div>
                  <h4 className="text-xs font-mono text-primary uppercase mb-4 text-center border-b border-surfaceHighlight pb-2">{arenaModel1} Ranking</h4>
                  <div className={`space-y-3 ${isLoadingRecs ? 'opacity-50' : ''}`}>
                    {(apiStatus === 'online' && apiRecommendations1.length > 0 ? apiRecommendations1 : generateRecommendations(arenaModel1, activeProfile)).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 border border-surfaceHighlight hover:border-primary/50 transition-colors group">
                        <div className="w-8 h-8 rounded bg-surface flex items-center justify-center font-mono text-[10px] text-textMuted group-hover:text-primary">
                          #{i + 1}
                        </div>
                        <div className="flex-1">
                          <h5 className="text-xs font-semibold text-white">{item.name}</h5>
                          <div className="text-[9px] font-mono text-primary mt-0.5">Score: {item.score}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Model 2 Results */}
                {arenaModel2 !== 'None' && (
                  <div>
                    <h4 className="text-xs font-mono text-secondary uppercase mb-4 text-center border-b border-surfaceHighlight pb-2">{arenaModel2} Ranking</h4>
                    <div className={`space-y-3 ${isLoadingRecs ? 'opacity-50' : ''}`}>
                      {(apiStatus === 'online' && apiRecommendations2.length > 0 ? apiRecommendations2 : generateRecommendations(arenaModel2, activeProfile)).map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface/40 border border-surfaceHighlight hover:border-secondary/50 transition-colors group">
                          <div className="w-8 h-8 rounded bg-surface flex items-center justify-center font-mono text-[10px] text-textMuted group-hover:text-secondary">
                            #{i + 1}
                          </div>
                          <div className="flex-1">
                            <h5 className="text-xs font-semibold text-white">{item.name}</h5>
                            <div className="text-[9px] font-mono text-secondary mt-0.5">Score: {item.score}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
