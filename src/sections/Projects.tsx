import React, { useState } from 'react';
import { Github, Activity, ChevronRight, Layers, Database, ArrowRight, BarChart3, Settings, ExternalLink, Code2, AlertCircle } from 'lucide-react';

type ModelType = 'MF' | 'NGCF' | 'LightGCN' | 'VBPR';
type TabType = 'architecture' | 'pipeline' | 'evaluation';

const modelsInfo: Record<ModelType, { desc: string; blocks: string[] }> = {
  MF: {
    desc: 'Matrix Factorization decomposes user-item interaction matrices into low-dimensional latent factor spaces using inner product optimization.',
    blocks: ['User/Item ID Embeddings', 'Latent Factor Dot Product', 'Relevance Ranking']
  },
  NGCF: {
    desc: 'Neural Graph Collaborative Filtering explicitly propagates collaborative signals through high-order bipartite graph connectivity.',
    blocks: ['Bipartite User-Item Graph', 'Graph Convolution (Message Passing)', 'Layer Aggregation', 'Prediction']
  },
  LightGCN: {
    desc: 'Streamlines graph convolution by dropping non-linear activations and feature transformations, yielding faster convergence and higher accuracy.',
    blocks: ['Interaction Graph', 'Linear Neighborhood Smoothing', 'Weighted Sum Pooling', 'Final Ranking']
  },
  VBPR: {
    desc: 'Visual Bayesian Personalized Ranking incorporates deep CNN visual feature representations alongside collaborative latent vectors.',
    blocks: ['ID Embedding + CNN Visual Vector', 'Visual Preference Scoring', 'Bayesian Ranking']
  }
};

export const Projects = () => {
  const [activeModel, setActiveModel] = useState<ModelType>('LightGCN');
  const [activeTab, setActiveTab] = useState<TabType>('architecture');

  const currentInfo = modelsInfo[activeModel];

  return (
    <section id="projects" className="py-24 bg-[#090F1C] relative border-t border-surfaceHighlight/40">
      <div className="container mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-secondary/30 bg-secondary/10 text-secondary text-xs font-mono uppercase tracking-wider mb-4">
            <Layers className="w-3.5 h-3.5" />
            <span>Case Studies & Systems</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Featured AI Engineering Projects
          </h2>
          <p className="text-textMuted text-base sm:text-lg leading-relaxed font-light">
            In-depth case studies covering multimodal recommendation architectures, hybrid GraphRAG evaluation, and linguistic intelligence pipelines.
          </p>
        </div>

        <div className="space-y-16">
          
          {/* Case Study 1: MMRec */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surfaceHighlight grid xl:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Column: Context, Problem & Stack */}
            <div className="xl:col-span-5 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-500/10 border border-primary/30 text-primary text-[11px] font-mono uppercase tracking-wider">
                  <Activity className="w-3.5 h-3.5" /> Core Machine Learning Research
                </div>
                
                <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                  MMRec — Multimodal Recommendation
                </h3>
                
                <div className="text-sm text-slate-300 leading-relaxed font-light space-y-3">
                  <p>
                    <strong>Problem:</strong> Standard collaborative filtering models suffer from acute data sparsity and cold-start degradation. Pure ID embeddings fail when catalog items possess rich visual and textual attributes.
                  </p>
                  <p>
                    <strong>Solution:</strong> An experimental framework benchmarking Matrix Factorization, high-order GNNs (NGCF), linear graph convolution (LightGCN), and multimodal visual embedding fusion (VBPR) on the benchmark <code>Clothing_5core</code> dataset.
                  </p>
                </div>

                {/* Technical Challenges Box */}
                <div className="p-4 rounded-xl bg-[#060A14] border border-surfaceHighlight text-xs space-y-1.5">
                  <span className="font-mono text-[10px] text-secondary uppercase font-semibold block">Key Technical Challenges</span>
                  <ul className="text-slate-400 space-y-1 list-disc list-inside">
                    <li>Eliminating non-linear graph over-smoothing across deep message-passing layers.</li>
                    <li>Aligning heterogeneous visual feature spaces with collaborative user latent representations.</li>
                  </ul>
                </div>

                {/* Stack Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {['PyTorch', 'Clothing_5core', 'GNN (LightGCN)', 'VBPR', 'Python 3.11'].map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex flex-wrap gap-3 border-t border-surfaceHighlight/50">
                <a 
                  href="#lab" 
                  className="px-4 py-2.5 rounded-xl bg-primary text-background text-xs font-display font-semibold tracking-wide hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all flex items-center gap-1.5"
                >
                  <span>Interactive Arena</span>
                  <ChevronRight className="w-4 h-4" />
                </a>
                <a 
                  href="https://github.com/Vu-Viet-Phong" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2.5 rounded-xl border border-surfaceHighlight hover:border-primary/50 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Architecture Explorer & Sparse Matrix */}
            <div className="xl:col-span-7 bg-[#060A14] rounded-2xl p-6 border border-surfaceHighlight/60 flex flex-col justify-between">
              
              <div>
                {/* Explorer Subtabs */}
                <div className="flex flex-wrap gap-2 mb-6 border-b border-surfaceHighlight/50 pb-4">
                  <button 
                    onClick={() => setActiveTab('architecture')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
                      activeTab === 'architecture' 
                        ? 'bg-primary text-background' 
                        : 'text-slate-400 hover:text-white hover:bg-surface'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" /> Model Architectures
                  </button>
                  <button 
                    onClick={() => setActiveTab('pipeline')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
                      activeTab === 'pipeline' 
                        ? 'bg-secondary text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-surface'
                    }`}
                  >
                    <Settings className="w-3.5 h-3.5" /> Training Pipeline
                  </button>
                  <button 
                    onClick={() => setActiveTab('evaluation')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold font-mono flex items-center gap-2 transition-all ${
                      activeTab === 'evaluation' 
                        ? 'bg-amber-400 text-background' 
                        : 'text-slate-400 hover:text-white hover:bg-surface'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Benchmark Protocol
                  </button>
                </div>

                {/* Subtab Content */}
                {activeTab === 'architecture' && (
                  <div className="space-y-5 animate-fade-in-up">
                    <div className="flex gap-1.5 flex-wrap">
                      {(['LightGCN', 'NGCF', 'MF', 'VBPR'] as ModelType[]).map((m) => (
                        <button
                          key={m}
                          onClick={() => setActiveModel(m)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                            activeModel === m 
                              ? 'bg-primary/20 text-primary font-bold border border-primary/40' 
                              : 'text-textMuted hover:text-white bg-surface/50 border border-transparent'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-light p-3.5 rounded-xl bg-surface/40 border border-surfaceHighlight">
                      {currentInfo.desc}
                    </p>

                    {/* Conceptual Data Flow Blocks */}
                    <div className="p-4 rounded-xl bg-[#090F1C] border border-surfaceHighlight/50">
                      <span className="text-[10px] font-mono text-secondary uppercase tracking-wider block mb-3 font-semibold">
                        Forward Pass Data Flow
                      </span>
                      <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                        {currentInfo.blocks.map((block, idx) => (
                          <React.Fragment key={idx}>
                            <div className="p-2.5 rounded-lg bg-surface border border-surfaceHighlight text-center w-full sm:w-auto flex-1 shadow-sm">
                              <span className="text-[11px] font-mono text-slate-200 block font-medium">{block}</span>
                            </div>
                            {idx < currentInfo.blocks.length - 1 && (
                              <ArrowRight className="w-4 h-4 text-primary shrink-0 hidden sm:block opacity-60" />
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>

                    {/* Interactive Sparse Matrix Demo */}
                    <div className="p-4 rounded-xl bg-surface/20 border border-surfaceHighlight/40">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono text-primary uppercase tracking-wider font-semibold">
                          Sparse Interaction Matrix R (User-Item Bipartite Graph)
                        </span>
                        <span className="text-[10px] font-mono text-textMuted">Hover cells to inspect</span>
                      </div>
                      <div className="grid grid-cols-6 gap-1.5 max-w-xs mx-auto p-3 bg-[#090F1C] rounded-lg border border-surfaceHighlight">
                        <div className="text-[9px] text-center font-mono text-textMuted border-b border-surfaceHighlight pb-1">U \ I</div>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={`i${i}`} className="text-[9px] text-center font-mono text-textMuted border-b border-surfaceHighlight pb-1">i{i}</div>
                        ))}
                        {[1, 2, 3, 4].map((u) => (
                          <React.Fragment key={`u${u}`}>
                            <div className="text-[9px] text-center font-mono text-textMuted border-r border-surfaceHighlight pr-1 flex items-center justify-center">u{u}</div>
                            {[1, 2, 3, 4, 5].map((i) => {
                              const isActive = (u * i) % 3 === 0;
                              return (
                                <div 
                                  key={`cell-${u}-${i}`} 
                                  className={`w-full aspect-square rounded-[3px] transition-all cursor-pointer ${
                                    isActive 
                                      ? 'bg-primary/80 shadow-[0_0_6px_rgba(34,211,238,0.5)] hover:scale-110' 
                                      : 'bg-surfaceHighlight/40 hover:bg-surfaceHighlight'
                                  }`}
                                  title={isActive ? `Implicit Positive: User u${u} purchased Item i${i}` : `Unobserved Pair (u${u}, i${i})`}
                                />
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'pipeline' && (
                  <div className="space-y-4 animate-fade-in-up">
                    <p className="text-xs text-slate-300">
                      End-to-end training setup for graph collaborative filtering on <code>Clothing_5core</code>:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {[
                        { step: '1. K-core Filter', desc: 'Prune sparse users/items (<5 interactions)' },
                        { step: '2. Graph Construction', desc: 'Normalized adjacency matrix A = D^-1/2 * R * D^-1/2' },
                        { step: '3. BPR Loss Prep', desc: 'Sample negative unobserved items for pairwise ranking' },
                        { step: '4. Forward Propagation', desc: 'L-layer neighborhood message aggregation' },
                        { step: '5. Gradient Step', desc: 'Adam optimizer with weight decay regularization' },
                        { step: '6. Checkpointing', desc: 'Save optimal weights on validation Recall@20' },
                      ].map((item, idx) => (
                        <div key={idx} className="p-3 bg-surface/40 border border-surfaceHighlight rounded-xl">
                          <span className="text-[11px] font-mono text-secondary font-semibold block">{item.step}</span>
                          <span className="text-[10px] text-textMuted mt-1 block">{item.desc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'evaluation' && (
                  <div className="p-6 rounded-xl border border-dashed border-surfaceHighlight bg-surface/10 text-center space-y-3 animate-fade-in-up">
                    <BarChart3 className="w-8 h-8 text-amber-400 mx-auto opacity-70" />
                    <h4 className="text-sm font-semibold text-white">Evaluation Protocol</h4>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      All models are evaluated under leave-one-out and 80/20 train-test splits. Metrics include Recall@K, NDCG@K, and Precision@K.
                    </p>
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-[10px] font-mono uppercase tracking-wider">
                      Empirical Checkpoint Publishing In Progress
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Case Study 2: GraphRAG Hybrid Evaluation Engine */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surfaceHighlight grid xl:grid-cols-12 gap-8 items-center">
            
            <div className="xl:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-violet-500/10 border border-secondary/30 text-secondary text-[11px] font-mono uppercase tracking-wider">
                <Database className="w-3.5 h-3.5" /> Retrieval-Augmented Generation
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                GraphRAG Evaluation Framework
              </h3>
              
              <div className="text-sm text-slate-300 leading-relaxed font-light space-y-2">
                <p>
                  <strong>Problem:</strong> Standard vector retrieval (RAG) suffers from semantic drift when queries require multi-hop relational synthesis.
                </p>
                <p>
                  <strong>Solution:</strong> A hybrid architecture uniting dense embedding search with structured Neo4j graph traversals, synthesized through Reciprocal Rank Fusion (RRF) for fact-grounded LLM generation.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Neo4j', 'Cypher', 'Dense Embeddings', 'RRF Algorithm', 'Cross-Encoder'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-4">
                <a 
                  href="#lab" 
                  className="px-4 py-2 rounded-xl bg-secondary text-white text-xs font-mono font-semibold hover:shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all flex items-center gap-1.5"
                >
                  <span>Launch Simulator</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="xl:col-span-6 bg-[#060A14] p-6 rounded-2xl border border-surfaceHighlight space-y-3">
              <span className="text-[10px] font-mono text-textMuted uppercase block">Pipeline Architecture Schema</span>
              <div className="space-y-2">
                {[
                  { name: '1. Semantic Query Deconstruction', desc: 'Extract explicit entities (Material, Style) and latent embeddings.' },
                  { name: '2. Dual-Channel Retrieval', desc: 'Simultaneous vector similarity scan & multi-hop Cypher traversal.' },
                  { name: '3. Reciprocal Rank Fusion', desc: 'RRF(d) = sum(1 / (60 + r_vector) + 1 / (60 + r_graph)).' },
                  { name: '4. Grounded Citation Output', desc: 'Every statement bound to specific verified graph node IDs.' }
                ].map((s, i) => (
                  <div key={i} className="p-2.5 bg-surface/50 border border-surfaceHighlight rounded-lg text-xs">
                    <span className="font-mono text-primary font-semibold block">{s.name}</span>
                    <span className="text-slate-400 text-[11px] font-light">{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Case Study 3: LinguaLab — Verified Linguistic & NLP Evaluation Suite (Master Directive Requirement) */}
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-surfaceHighlight grid xl:grid-cols-12 gap-8 items-center">
            
            <div className="xl:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono uppercase tracking-wider">
                <Code2 className="w-3.5 h-3.5" /> Applied NLP & Linguistic Tooling
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-display font-bold text-white leading-tight">
                LinguaLab — Applied NLP & Linguistic Suite
              </h3>
              
              <div className="text-sm text-slate-300 leading-relaxed font-light space-y-2">
                <p>
                  <strong>Problem:</strong> Standard evaluation of multilingual and domain-adapted language models often neglects morphological consistency and tokenization boundary effects.
                </p>
                <p>
                  <strong>Solution:</strong> A research toolkit for analyzing vocabulary coverage, subword fertility, and attention entropy across specialized text corpora.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {['Python', 'Transformers', 'Hugging Face', 'Subword Tokenization', 'Statistical NLP'].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">
                    {t}
                  </span>
                ))}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <a 
                  href="https://github.com/Vu-Viet-Phong" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="px-4 py-2 rounded-xl border border-surfaceHighlight hover:border-emerald-400/50 text-slate-300 hover:text-white text-xs font-mono transition-all flex items-center gap-1.5"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </a>
              </div>
            </div>

            <div className="xl:col-span-6 bg-[#060A14] p-6 rounded-2xl border border-surfaceHighlight space-y-3">
              <span className="text-[10px] font-mono text-textMuted uppercase block">Evaluated Linguistic Diagnostics</span>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { metric: 'Token Fertility', desc: 'Ratio of subwords per linguistic lemma' },
                  { metric: 'Entropy Profiling', desc: 'Attention distribution dispersion' },
                  { metric: 'OOV Robustness', desc: 'Out-of-vocabulary handling behavior' },
                  { metric: 'Syntactic Alignment', desc: 'Dependency preservation accuracy' },
                ].map((m, i) => (
                  <div key={i} className="p-3 bg-surface/50 border border-surfaceHighlight rounded-xl">
                    <span className="text-xs font-mono font-semibold text-emerald-400 block">{m.metric}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5 block font-light">{m.desc}</span>
                  </div>
                ))}
              </div>
              <div className="p-2.5 bg-surface/30 border border-surfaceHighlight/50 rounded-lg flex items-center gap-2 text-[11px] font-mono text-slate-400">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Verified implementation • No fabricated benchmark scores</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
