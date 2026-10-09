import { useState } from 'react';
import { Github, Activity, ChevronRight, Layers, Layout, Database, ArrowRight, BarChart3, Settings } from 'lucide-react';

type ModelType = 'MF' | 'NGCF' | 'LightGCN' | 'VBPR';
type TabType = 'architecture' | 'pipeline' | 'evaluation';

const modelsInfo: Record<ModelType, { desc: string; blocks: string[] }> = {
  MF: {
    desc: 'Matrix Factorization maps users and items to a joint latent factor space, modeling interactions as inner products.',
    blocks: ['User/Item Embeddings', 'Latent Factor Interaction', 'Prediction']
  },
  NGCF: {
    desc: 'Neural Graph Collaborative Filtering integrates user-item interactions into the embedding process by exploiting high-order graph connectivity.',
    blocks: ['User-Item Graph', 'Graph Convolution', 'Embedding Aggregation', 'Prediction']
  },
  LightGCN: {
    desc: 'Simplifies GCN by discarding feature transformation and nonlinear activation, making it highly effective for recommendation.',
    blocks: ['User-Item Graph', 'Linear Neighborhood Propagation', 'Layer Aggregation', 'Prediction']
  },
  VBPR: {
    desc: 'Visual Bayesian Personalized Ranking incorporates CNN-extracted visual features from images into matrix factorization.',
    blocks: ['User/Item + Visual Features', 'Preference Scoring', 'Ranking']
  }
};

export const Projects = () => {
  const [activeModel, setActiveModel] = useState<ModelType>('LightGCN');
  const [activeTab, setActiveTab] = useState<TabType>('architecture');

  const currentInfo = modelsInfo[activeModel];

  return (
    <section id="projects" className="py-24 bg-background relative">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-textMuted text-lg leading-relaxed">
            In-depth engineering case studies and applied research implementations.
          </p>
        </div>

        <div className="space-y-16">
          {/* Project 1: MMRec */}
          <div className="glass-panel p-2 md:p-8 rounded-3xl border border-surfaceHighlight grid xl:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Content */}
            <div className="xl:col-span-4 space-y-6 p-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-secondary/10 border border-secondary/20 text-secondary text-[11px] font-mono uppercase tracking-wider">
                <Activity className="w-3.5 h-3.5" /> Core Research
              </div>
              
              <h3 className="text-2xl font-bold text-white leading-tight">MMRec — Multimodal Recommendation</h3>
              
              <div className="prose prose-invert prose-sm text-slate-400">
                <p>
                  An extensive exploration of modern recommendation architectures utilizing the <code>Clothing_5core</code> dataset. 
                  The project evaluates various approaches to understand how multimodal feature representations enhance recommendation quality over purely collaborative signals.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">PyTorch</span>
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">Dataset: Clothing_5core</span>
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">GNNs</span>
              </div>

              <div className="pt-6 flex flex-wrap gap-4 border-t border-surfaceHighlight/50">
                <a href="#lab" className="px-5 py-2.5 rounded-lg bg-white text-background text-sm font-semibold hover:bg-primary hover:text-background transition-colors flex items-center gap-2">
                  Interactive Demo <ChevronRight className="w-4 h-4" />
                </a>
                <a href="https://github.com/Vu-Viet-Phong" target="_blank" rel="noopener noreferrer" className="px-5 py-2.5 rounded-lg border border-surfaceHighlight hover:border-primary/50 text-white text-sm transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" /> Repository
                </a>
              </div>
            </div>

            {/* Right Content - Explorer */}
            <div className="xl:col-span-8 bg-[#0b111a] rounded-2xl p-6 border border-surfaceHighlight/50 flex flex-col">
              
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 mb-6 border-b border-surfaceHighlight/50 pb-4">
                <button 
                  onClick={() => setActiveTab('architecture')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'architecture' ? 'bg-primary text-background' : 'text-slate-400 hover:text-white hover:bg-surface'}`}
                >
                  <Layers className="w-4 h-4" /> Model Architectures
                </button>
                <button 
                  onClick={() => setActiveTab('pipeline')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'pipeline' ? 'bg-secondary text-white' : 'text-slate-400 hover:text-white hover:bg-surface'}`}
                >
                  <Settings className="w-4 h-4" /> Training Pipeline
                </button>
                <button 
                  onClick={() => setActiveTab('evaluation')}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${activeTab === 'evaluation' ? 'bg-yellow-500 text-background' : 'text-slate-400 hover:text-white hover:bg-surface'}`}
                >
                  <BarChart3 className="w-4 h-4" /> Evaluation Metrics
                </button>
              </div>

              {/* Tab Contents */}
              <div className="flex-1 flex flex-col gap-6 animate-fade-in-up">
                
                {activeTab === 'architecture' && (
                  <>
                    <div className="flex justify-between items-center bg-surface/50 p-2 rounded-lg border border-surfaceHighlight">
                      <div className="flex gap-1">
                        {(['MF', 'NGCF', 'LightGCN', 'VBPR'] as ModelType[]).map((m) => (
                          <button
                            key={m}
                            onClick={() => setActiveModel(m)}
                            className={`px-4 py-1.5 rounded-md text-xs font-mono transition-all ${activeModel === m ? 'bg-primary/20 text-primary font-bold border border-primary/30' : 'text-textMuted hover:text-white'}`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-surface/30 border border-surfaceHighlight/30">
                      <p className="text-sm text-slate-300 leading-relaxed">{currentInfo.desc}</p>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center p-6 bg-[#05080f] rounded-xl border border-surfaceHighlight/30 relative overflow-hidden min-h-[200px]">
                      <h5 className="absolute top-4 left-4 text-[10px] font-mono text-secondary uppercase tracking-wider">Conceptual Flow</h5>
                      
                      <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 mt-8 md:mt-4 w-full px-4">
                        {currentInfo.blocks.map((block, idx) => (
                          <div key={idx} className="flex flex-col md:flex-row items-center gap-2 md:gap-4 shrink-0">
                            <div className="bg-[#0a0f18] border border-surfaceHighlight px-4 py-3 rounded-lg text-center shadow-lg w-40 md:w-32 lg:w-40">
                              <span className="text-xs text-slate-300 font-medium block">{block}</span>
                            </div>
                            {idx < currentInfo.blocks.length - 1 && (
                              <div className="text-surfaceHighlight flex flex-col items-center">
                                <ArrowRight className="w-4 h-4 hidden md:block" />
                                <div className="w-[1px] h-4 bg-surfaceHighlight block md:hidden my-1"></div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {activeTab === 'pipeline' && (
                  <div className="flex-1 flex flex-col gap-4">
                    <div className="p-4 rounded-xl bg-surface/30 border border-surfaceHighlight/30">
                      <h4 className="text-sm font-semibold text-white mb-2">Research Implementation Workflow</h4>
                      <p className="text-xs text-slate-400">An end-to-end overview of the experimental setup used to process the Clothing_5core dataset and train GNN models.</p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Dataset Preprocessing', 'Feature Preparation', 'Model Configuration', 'Training Loop', 'Checkpoint Saving', 'Evaluation / Inference'].map((step, idx) => (
                        <div key={idx} className="bg-[#0a0f18] border border-surfaceHighlight p-4 rounded-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                           <div className="text-[2rem] font-bold text-surfaceHighlight opacity-20 absolute -right-2 -bottom-4 group-hover:text-secondary group-hover:opacity-10 transition-all">{idx + 1}</div>
                           <span className="text-xs font-medium text-slate-300 relative z-10">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'evaluation' && (
                  <div className="flex-1 flex flex-col items-center justify-center border border-dashed border-surfaceHighlight/50 rounded-xl p-8 text-center bg-surface/10">
                     <BarChart3 className="w-12 h-12 text-yellow-500/50 mb-4" />
                     <h4 className="text-lg font-semibold text-white mb-2">Experimental Results</h4>
                     <p className="text-sm text-slate-400 max-w-md">
                       Verified performance metrics (Recall@K, NDCG@K, Precision@K) are currently being documented.
                     </p>
                     <div className="mt-4 px-3 py-1.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-mono uppercase tracking-wider">
                       Awaiting Verified Publication
                     </div>
                  </div>
                )}
                
              </div>
            </div>
          </div>

          {/* Project 2: GraphRAG Framework */}
          <div className="grid xl:grid-cols-12 gap-8 items-center glass-panel p-2 md:p-8 rounded-3xl opacity-80 hover:opacity-100 transition-opacity border border-surfaceHighlight">
            <div className="xl:col-span-6 space-y-6 p-6 xl:order-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[11px] font-mono uppercase tracking-wider">
                <Layout className="w-3.5 h-3.5" /> In Development
              </div>
              
              <h3 className="text-2xl font-bold text-white leading-tight">GraphRAG Evaluation Framework</h3>
              
              <div className="prose prose-invert prose-sm text-slate-400">
                <p>
                  A structured testing environment for benchmarking hybrid retrieval pipelines that combine dense vector search with multi-hop Cypher queries in Neo4j. Designed to systematically evaluate grounding accuracy.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">Neo4j</span>
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">LLMs</span>
                <span className="px-2.5 py-1 rounded bg-surface border border-surfaceHighlight text-xs font-mono text-slate-300">Vector Search</span>
              </div>
            </div>

            <div className="xl:col-span-6 xl:order-1 h-[300px] rounded-2xl bg-[#0b111a] border border-surfaceHighlight/50 flex flex-col items-center justify-center p-8 relative overflow-hidden">
               <Database className="w-16 h-16 text-surfaceHighlight mb-4 opacity-50" />
               <span className="font-mono text-textMuted text-sm border border-dashed border-textMuted/30 px-6 py-2 rounded-full">Pipeline visualization constructing...</span>
               <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-500/5 rounded-full blur-3xl pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
