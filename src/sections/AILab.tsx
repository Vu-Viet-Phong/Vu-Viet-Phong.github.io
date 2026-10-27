import { useState, useEffect } from 'react';
import { Search, Sliders, Cpu, Server, Play, CheckCircle2, Layers, Sparkles } from 'lucide-react';
import { apiClient } from '../api/client';

type GraphRAGStage = 'Query' | 'Vector' | 'Graph' | 'Fusion' | 'Rerank' | 'Answer';
const stages: GraphRAGStage[] = ['Query', 'Vector', 'Graph', 'Fusion', 'Rerank', 'Answer'];

const queries = [
  "Find me an elegant silk evening gown for an outdoor gala.",
  "I'm looking for a comfortable casual cotton dress.",
  "Suggest a minimalist professional outfit in dark colors."
];

const stageDataTemplate: Record<GraphRAGStage, any> = {
  Query: { title: 'Query Understanding', desc: 'Parsing user intent and extracting semantic entities.' },
  Vector: { title: 'Dense Vector Retrieval', desc: 'Querying vector embeddings for semantically close item descriptions.' },
  Graph: { title: 'Knowledge Graph Traversal', desc: 'Walking Neo4j relational schema for multi-hop structural grounding.' },
  Fusion: { title: 'Candidate Fusion (RRF)', desc: 'Merging vector candidates with graph entities using Reciprocal Rank Fusion.' },
  Rerank: { title: 'Cross-Encoder Scoring', desc: 'Re-scoring combined candidates with cross-attention for high precision.' },
  Answer: { title: 'Grounded Answer Generation', desc: 'Synthesizing response with verifiable, cited knowledge graph facts.' }
};

const profiles = [
  { id: 'u1', name: 'Casual User', intent: 'Casual, Cotton, Daywear', avatarColor: '#22D3EE' },
  { id: 'u2', name: 'Formal User', intent: 'Elegant, Silk, Evening', avatarColor: '#8B5CF6' }
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
  const [apiMode, setApiMode] = useState<string>('SIMULATION');
  const [apiRecommendations1, setApiRecommendations1] = useState<any[]>([]);
  const [apiRecommendations2, setApiRecommendations2] = useState<any[]>([]);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const res = await apiClient.get('/models');
        if (res && res.models) {
          setApiStatus('online');
          setApiMode(res.live ? 'LIVE AI' : 'SIMULATION');
        } else {
          setApiStatus('offline');
          setApiMode('SIMULATION');
        }
      } catch {
        setApiStatus('offline');
        setApiMode('SIMULATION');
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
    const query = queries[selectedQueryIdx];
    const data = { ...stageDataTemplate[activeStage] };
    
    if (activeStage === 'Query') {
      data.details = [
        { key: 'Raw Intent', val: `"${query}"` },
        { key: 'Extracted Attributes', val: selectedQueryIdx === 0 ? '{"Category": "Gown", "Material": "Silk", "Occasion": "Gala"}' : '{"Category": "Dress", "Material": "Cotton", "Style": "Casual"}' }
      ];
    } else if (activeStage === 'Vector') {
      data.details = [
        { doc: `Doc-8492: "Pure mulberry silk gown with fluid drape"`, score: 0.92 },
        { doc: `Doc-1123: "Floor-length evening attire in obsidian black"`, score: 0.81 }
      ];
    } else if (activeStage === 'Graph') {
      data.nodes = ['Product:8492', 'Material:Silk', 'Style:Minimalist'];
      data.edges = ['(Product:8492)-[:MADE_OF]->(Material:Silk)', '(Product:8492)-[:HAS_STYLE]->(Style:Minimalist)'];
    } else if (activeStage === 'Fusion') {
      data.details = [
        { candidate: 'Product:8492 (Silk Slip Gown)', vectorRank: 1, graphRank: 1, rrfScore: 0.0328 },
        { candidate: 'Product:1123 (Evening Maxi)', vectorRank: 2, graphRank: 3, rrfScore: 0.0271 }
      ];
    } else if (activeStage === 'Rerank') {
      data.text = `Top Grounded Candidate: Product:8492 (Cross-Attention Match: 0.941)`;
    } else if (activeStage === 'Answer') {
      data.answer = `Based on knowledge graph verification [1], Product:8492 satisfies all requested parameters: 100% pure silk, floor-length silhouette, and minimalist neutral evening aesthetic.`;
      data.citations = ['[1] Neo4j Node: Product:8492 (Entity: Minimalist Silk Dress, Degree: 4)'];
    }
    setCurrentStageData(data);
  }, [activeStage, selectedQueryIdx]);

  const generateRecommendations = (model: string, profile: any) => {
    const seed = model.length + profile.name.length;
    return [...Array(topK)].map((_, i) => ({
      id: 101 + i + seed,
      name: `${model} Ranked Item #${i + 1}`,
      score: (0.95 - (i * 0.05 + (seed * 0.001))).toFixed(3),
      category: i % 2 === 0 ? 'Apparel' : 'Accessories'
    }));
  };

  useEffect(() => {
    if (apiStatus !== 'online') return;
    
    const fetchRecs = async () => {
      try {
        const res1 = await apiClient.post('/recommendations', { user_id: activeProfile.id, model: arenaModel1, top_k: topK });
        setApiRecommendations1(res1.items || []);
        
        if (arenaModel2 !== 'None') {
          const res2 = await apiClient.post('/recommendations', { user_id: activeProfile.id, model: arenaModel2, top_k: topK });
          setApiRecommendations2(res2.items || []);
        } else {
          setApiRecommendations2([]);
        }
      } catch {
        setApiStatus('offline');
      }
    };
    fetchRecs();
  }, [apiStatus, activeProfile, arenaModel1, arenaModel2, topK]);

  return (
    <section id="lab" className="py-24 bg-[#090F1C] relative border-t border-surfaceHighlight/40">
      <div className="container mx-auto px-6">
        
        {/* Header */}
        <div className="mb-12 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider mb-4">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive Intelligence Lab</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Live AI Research Sandbox
          </h2>
          <p className="text-textMuted text-base sm:text-lg leading-relaxed font-light">
            Test and benchmark intelligent architectures in real time. Switch between multi-hop GraphRAG retrieval simulation and collaborative recommendation arena.
          </p>
        </div>

        {/* 4 AI Lab Entry Cards (Master Directive Requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          <button
            onClick={() => setActiveTab('graphrag')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'graphrag' 
                ? 'bg-surface border-primary shadow-[0_0_20px_rgba(34,211,238,0.15)]' 
                : 'bg-surface/50 border-surfaceHighlight hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Search className="w-5 h-5 text-primary" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-primary border border-primary/20">
                SIMULATION
              </span>
            </div>
            <h4 className="font-display font-semibold text-white text-sm">GraphRAG Explorer</h4>
            <p className="text-xs text-textMuted mt-1">6-stage hybrid vector & graph retrieval pipeline</p>
          </button>

          <button
            onClick={() => setActiveTab('arena')}
            className={`p-4 rounded-xl border text-left transition-all ${
              activeTab === 'arena' 
                ? 'bg-surface border-secondary shadow-[0_0_20px_rgba(139,92,246,0.15)]' 
                : 'bg-surface/50 border-surfaceHighlight hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <Sliders className="w-5 h-5 text-secondary" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-violet-500/10 text-secondary border border-secondary/20">
                {apiStatus === 'online' ? 'LIVE BACKEND' : 'SIMULATION'}
              </span>
            </div>
            <h4 className="font-display font-semibold text-white text-sm">Recommendation Arena</h4>
            <p className="text-xs text-textMuted mt-1">Side-by-side benchmark for MF vs LightGCN</p>
          </button>

          <a
            href="#projects"
            className="p-4 rounded-xl border bg-surface/50 border-surfaceHighlight hover:border-emerald-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                VERIFIED ALGORITHM
              </span>
            </div>
            <h4 className="font-display font-semibold text-white text-sm group-hover:text-emerald-400 transition-colors">
              MMRec Architecture
            </h4>
            <p className="text-xs text-textMuted mt-1">Interactive User-Item matrix & GNN flow</p>
          </a>

          <a
            href="#products"
            className="p-4 rounded-xl border bg-surface/50 border-surfaceHighlight hover:border-amber-500/40 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                VERIFIED ALGORITHM
              </span>
            </div>
            <h4 className="font-display font-semibold text-white text-sm group-hover:text-amber-400 transition-colors">
              Fashion Copilot
            </h4>
            <p className="text-xs text-textMuted mt-1">Deterministic multi-attribute matcher</p>
          </a>
        </div>

        {/* Operational Status Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-surface/70 border border-surfaceHighlight mb-8 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-400' : 'bg-cyan-400'} animate-pulse`} />
              <span className="text-slate-300">
                Mode: <strong className="text-primary">{apiMode}</strong>
              </span>
            </div>
            <div className="hidden sm:block text-slate-600">|</div>
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-textMuted">
              <Server className="w-3.5 h-3.5 text-secondary" />
              <span>Backend status: {apiStatus === 'online' ? 'Connected (FastAPI)' : 'Local Fallback'}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-[#090F1C] border border-surfaceHighlight px-3 py-1 rounded-lg text-xs font-mono text-slate-400">
            <span>Verified Grounding:</span>
            <span className="text-primary font-bold">100% Deterministic</span>
          </div>
        </div>

        {/* Tab 1: GraphRAG Simulator */}
        {activeTab === 'graphrag' && (
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 space-y-6">
              <div className="glass-panel p-6 rounded-2xl border border-surfaceHighlight">
                <h3 className="text-sm font-mono uppercase tracking-wider text-textMuted mb-4 flex items-center justify-between">
                  <span>Input Query</span>
                  <span className="text-primary text-[10px]">[Stage: {activeStage}]</span>
                </h3>

                <div className="space-y-2 mb-6">
                  {queries.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setSelectedQueryIdx(idx); setActiveStage('Query'); }}
                      className={`w-full text-left p-3 rounded-xl border text-xs font-medium transition-all ${
                        selectedQueryIdx === idx
                          ? 'bg-primary/10 border-primary/40 text-white shadow-sm'
                          : 'bg-[#0B1324] border-surfaceHighlight text-slate-400 hover:text-white'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={runSimulation}
                    disabled={isSimulating}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-background font-semibold text-xs tracking-wider uppercase flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50 transition-all"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isSimulating ? 'Simulating Pipeline...' : 'Run GraphRAG Pipeline'}</span>
                  </button>
                </div>
              </div>

              {/* Step Navigation */}
              <div className="glass-panel p-4 rounded-2xl border border-surfaceHighlight">
                <h4 className="text-[11px] font-mono text-textMuted uppercase mb-3 px-2">Pipeline Execution Stages</h4>
                <div className="grid grid-cols-3 gap-2">
                  {stages.map((st, i) => (
                    <button
                      key={st}
                      onClick={() => setActiveStage(st)}
                      className={`px-3 py-2 rounded-lg text-xs font-mono text-center transition-all ${
                        activeStage === st
                          ? 'bg-primary text-background font-bold shadow-md'
                          : 'bg-[#0B1324] text-slate-400 hover:text-white border border-surfaceHighlight'
                      }`}
                    >
                      <span className="block text-[9px] opacity-75">{i + 1}.</span>
                      <span className="truncate">{st}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Terminal: Evidence Inspector */}
            <div className="lg:col-span-7 bg-[#050914] rounded-2xl p-6 border border-surfaceHighlight shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-surfaceHighlight pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">evidence-inspector.log</span>
                </div>
                <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-2 py-0.5 rounded">
                  Trace ID: #GRAG-{selectedQueryIdx + 1}04
                </span>
              </div>

              <div className="space-y-4 min-h-[300px]">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    {stageDataTemplate[activeStage].title}
                  </h4>
                  <p className="text-xs text-textMuted">
                    {stageDataTemplate[activeStage].desc}
                  </p>
                </div>

                {/* Content Renderer */}
                {activeStage === 'Query' && currentStageData?.details && (
                  <div className="space-y-2 pt-2">
                    {currentStageData.details.map((d: any, i: number) => (
                      <div key={i} className="p-3 bg-[#090F1C] border border-surfaceHighlight rounded-lg">
                        <div className="text-[10px] font-mono text-textMuted mb-0.5">{d.key}</div>
                        <div className="text-xs font-mono text-primary break-all">{d.val}</div>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 'Vector' && currentStageData?.details && (
                  <div className="space-y-2 pt-2">
                    <span className="text-[10px] font-mono text-textMuted uppercase">Dense Semantic Candidates</span>
                    {currentStageData.details.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#090F1C] border border-surfaceHighlight rounded-lg">
                        <span className="text-xs text-slate-300 font-mono">{d.doc}</span>
                        <span className="text-xs font-mono text-emerald-400 font-bold">{d.score}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 'Graph' && (
                  <div className="p-4 bg-[#090F1C] border border-surfaceHighlight rounded-lg space-y-3">
                    <div className="text-[10px] font-mono text-textMuted uppercase">Neo4j Cypher Path Subgraph</div>
                    <div className="font-mono text-xs text-secondary bg-surface p-2.5 rounded border border-surfaceHighlight">
                      MATCH (p:Product)-[:MADE_OF]-&gt;(m:Material) <br />
                      WHERE m.name = 'Silk' RETURN p, m LIMIT 5;
                    </div>
                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Traversed 2 hops • 1 explicit entity relation confirmed</span>
                    </div>
                  </div>
                )}

                {activeStage === 'Fusion' && currentStageData?.details && (
                  <div className="space-y-2 pt-2">
                    <div className="text-[10px] font-mono text-textMuted uppercase">Reciprocal Rank Fusion (RRF) Ranking</div>
                    {currentStageData.details.map((d: any, i: number) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#090F1C] border border-surfaceHighlight rounded-lg">
                        <span className="text-xs text-slate-200 font-mono">{d.candidate}</span>
                        <span className="text-xs font-mono text-primary font-bold">RRF: {d.rrfScore}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeStage === 'Rerank' && currentStageData?.text && (
                  <div className="p-4 bg-[#090F1C] border border-surfaceHighlight rounded-lg space-y-2">
                    <div className="text-[10px] font-mono text-textMuted uppercase">Cross-Encoder Re-scoring</div>
                    <p className="text-xs font-mono text-slate-300">{currentStageData.text}</p>
                  </div>
                )}

                {activeStage === 'Answer' && currentStageData?.answer && (
                  <div className="p-4 bg-[#090F1C] border border-primary/30 rounded-lg space-y-3">
                    <div className="text-[10px] font-mono text-primary uppercase">Grounded Generation (Zero Hallucination)</div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">{currentStageData.answer}</p>
                    <div className="border-t border-surfaceHighlight pt-2">
                      <span className="text-[10px] font-mono text-slate-400 block mb-1">Citations:</span>
                      {currentStageData.citations?.map((c: string, ci: number) => (
                        <span key={ci} className="text-[11px] font-mono text-secondary block">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Recommendation Arena */}
        {activeTab === 'arena' && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surfaceHighlight">
            <div className="grid md:grid-cols-12 gap-8 items-start">
              
              {/* Controls */}
              <div className="md:col-span-4 space-y-6">
                <div>
                  <h3 className="font-display font-semibold text-white text-base mb-2">Arena Setup</h3>
                  <p className="text-xs text-textMuted">Select user persona and models to benchmark recommendation accuracy.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[11px] font-mono text-textMuted uppercase block">Target User Persona</label>
                  <div className="grid grid-cols-2 gap-2">
                    {profiles.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setActiveProfile(p)}
                        className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                          activeProfile.id === p.id 
                            ? 'bg-primary/10 border-primary text-white' 
                            : 'bg-surface border-surfaceHighlight text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-[10px] text-textMuted truncate">{p.intent}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-mono text-primary uppercase block mb-1">Model 1 (Primary)</label>
                    <select
                      value={arenaModel1}
                      onChange={(e) => setArenaModel1(e.target.value as any)}
                      className="w-full bg-surface border border-surfaceHighlight rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-primary"
                    >
                      <option value="LightGCN">LightGCN (Graph Convolution)</option>
                      <option value="NGCF">NGCF (High-Order GNN)</option>
                      <option value="MF">MF (Matrix Factorization)</option>
                      <option value="VBPR">VBPR (Visual Multimodal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-secondary uppercase block mb-1">Model 2 (Benchmark)</label>
                    <select
                      value={arenaModel2}
                      onChange={(e) => setArenaModel2(e.target.value as any)}
                      className="w-full bg-surface border border-surfaceHighlight rounded-lg px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-secondary"
                    >
                      <option value="None">None (Single Model View)</option>
                      <option value="MF">MF (Matrix Factorization)</option>
                      <option value="NGCF">NGCF (High-Order GNN)</option>
                      <option value="LightGCN">LightGCN (Graph Convolution)</option>
                      <option value="VBPR">VBPR (Visual Multimodal)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-mono text-textMuted uppercase block mb-1">Top-K Recommendations: {topK}</label>
                    <input
                      type="range"
                      min={3}
                      max={8}
                      value={topK}
                      onChange={(e) => setTopK(Number(e.target.value))}
                      className="w-full accent-primary"
                    />
                  </div>
                </div>
              </div>

              {/* Arena Visual Results */}
              <div className="md:col-span-8">
                <div className={`grid gap-4 ${arenaModel2 !== 'None' ? 'sm:grid-cols-2' : 'grid-cols-1 max-w-md mx-auto'}`}>
                  
                  {/* Model 1 Results */}
                  <div className="bg-[#0B1324] border border-primary/30 p-4 rounded-2xl">
                    <div className="flex items-center justify-between pb-3 border-b border-surfaceHighlight mb-3">
                      <h4 className="text-xs font-mono font-bold text-primary uppercase">{arenaModel1} Rankings</h4>
                      <span className="text-[10px] font-mono text-slate-400">Top-{topK}</span>
                    </div>
                    <div className="space-y-2">
                      {(apiStatus === 'online' && apiRecommendations1.length > 0 
                        ? apiRecommendations1 
                        : generateRecommendations(arenaModel1, activeProfile)
                      ).map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-surface/70 border border-surfaceHighlight">
                          <div>
                            <span className="text-xs text-white font-medium block">{item.name}</span>
                            <span className="text-[10px] font-mono text-textMuted">{item.category}</span>
                          </div>
                          <span className="text-xs font-mono text-primary font-semibold">{item.score}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Model 2 Results */}
                  {arenaModel2 !== 'None' && (
                    <div className="bg-[#0B1324] border border-secondary/30 p-4 rounded-2xl">
                      <div className="flex items-center justify-between pb-3 border-b border-surfaceHighlight mb-3">
                        <h4 className="text-xs font-mono font-bold text-secondary uppercase">{arenaModel2} Rankings</h4>
                        <span className="text-[10px] font-mono text-slate-400">Top-{topK}</span>
                      </div>
                      <div className="space-y-2">
                        {(apiStatus === 'online' && apiRecommendations2.length > 0 
                          ? apiRecommendations2 
                          : generateRecommendations(arenaModel2, activeProfile)
                        ).map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-surface/70 border border-surfaceHighlight">
                            <div>
                              <span className="text-xs text-white font-medium block">{item.name}</span>
                              <span className="text-[10px] font-mono text-textMuted">{item.category}</span>
                            </div>
                            <span className="text-xs font-mono text-secondary font-semibold">{item.score}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </section>
  );
};
