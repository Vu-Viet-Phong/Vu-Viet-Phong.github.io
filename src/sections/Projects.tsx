import { motion } from 'framer-motion';
import { Github, ExternalLink, Activity } from 'lucide-react';

export const Projects = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Featured Projects</h2>
          <p className="text-textMuted max-w-2xl">Selected applied research and engineering implementations.</p>
        </div>

        <div className="space-y-12">
          {/* Project 1 */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-8 items-center glass-panel p-8 rounded-2xl"
          >
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-secondary/10 border border-secondary/20 text-secondary text-[10px] font-mono uppercase">
                <Activity className="w-3 h-3" /> Core Research
              </div>
              <h3 className="text-2xl font-bold">MMRec — Multimodal Recommendation Research</h3>
              <p className="text-textMuted leading-relaxed">
                An extensive exploration of modern recommendation architectures utilizing the Clothing_5core dataset. The project implements and evaluates various approaches including Matrix Factorization, Neural Graph Collaborative Filtering (NGCF), LightGCN, and Visual Bayesian Personalized Ranking (VBPR). Focus is placed on how multimodal feature representations enhance recommendation quality over purely collaborative signals.
              </p>
              
              <div className="flex flex-wrap gap-2">
                {['PyTorch', 'NGCF', 'LightGCN', 'VBPR', 'Matrix Factorization'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded bg-surface text-xs font-mono text-primary border border-surfaceHighlight">
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex gap-4 pt-2">
                <button className="px-5 py-2.5 rounded-lg bg-textMain text-background text-sm font-medium hover:bg-white transition-colors">
                  View Details
                </button>
                <a href="https://github.com/Vu-Viet-Phong/MMRec" target="_blank" rel="noreferrer" className="px-5 py-2.5 rounded-lg glass-panel hover:border-textMuted text-sm font-medium transition-colors flex items-center gap-2">
                  <Github className="w-4 h-4" /> Repository
                </a>
              </div>
            </div>
            
            <div className="lg:col-span-5 h-[300px] rounded-xl bg-surface border border-surfaceHighlight overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-secondary/10" />
              <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-textMuted p-6">
                <div className="w-full space-y-4">
                  <div className="flex justify-between border-b border-surfaceHighlight pb-2"><span>Model</span><span>Recall@20</span></div>
                  <div className="flex justify-between"><span>MF</span><span className="text-primary">Exploring...</span></div>
                  <div className="flex justify-between"><span>NGCF</span><span className="text-primary">Exploring...</span></div>
                  <div className="flex justify-between"><span>LightGCN</span><span className="text-primary">Exploring...</span></div>
                  <div className="flex justify-between font-bold text-white"><span>VBPR</span><span className="text-secondary">Focus</span></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Project 2 (In Dev) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid lg:grid-cols-12 gap-8 items-center glass-panel p-8 rounded-2xl opacity-75"
          >
            <div className="lg:col-span-7 space-y-6 lg:order-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 text-[10px] font-mono uppercase">
                In Development
              </div>
              <h3 className="text-2xl font-bold">GraphRAG Evaluation Framework</h3>
              <p className="text-textMuted leading-relaxed">
                A structured testing environment for benchmarking hybrid retrieval pipelines that combine dense vector search with multi-hop Cypher queries in Neo4j.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Neo4j', 'LLMs', 'Vector Search'].map(tag => (
                  <span key={tag} className="px-3 py-1 rounded bg-surface text-xs font-mono text-textMuted border border-surfaceHighlight">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-5 lg:order-1 h-[250px] rounded-xl bg-surface border border-surfaceHighlight flex items-center justify-center">
              <span className="font-mono text-textMuted text-sm border border-dashed border-textMuted/30 p-4 rounded">Work in progress</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
