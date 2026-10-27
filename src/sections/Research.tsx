import { Network, Database, BrainCircuit, Search } from 'lucide-react';

const areas = [
  {
    title: 'Recommendation Systems',
    icon: <Database className="w-5 h-5 text-primary" />,
    description: 'Investigating high-order graph collaborative filtering, matrix factorization, and multimodal representation learning for personalized discovery.',
    link: '#projects',
    tags: ['LightGCN', 'NGCF', 'BPR Loss']
  },
  {
    title: 'Graph Intelligence & GNNs',
    icon: <Network className="w-5 h-5 text-secondary" />,
    description: 'Exploiting relational topology and topological embeddings to capture complex structural dependencies across bipartite and heterogeneous networks.',
    link: '#projects',
    tags: ['Graph Convolutions', 'Heterogeneous Graphs', 'Message Passing']
  },
  {
    title: 'Multimodal Representation',
    icon: <BrainCircuit className="w-5 h-5 text-emerald-400" />,
    description: 'Fusing visual semantic features from deep CNNs with structural user-item interaction signals into a unified latent metric space.',
    link: '#projects',
    tags: ['VBPR', 'Feature Alignment', 'Latent Spaces']
  },
  {
    title: 'Information Retrieval & GraphRAG',
    icon: <Search className="w-5 h-5 text-amber-400" />,
    description: 'Architecting zero-hallucination retrieval pipelines uniting dense vector similarity search with Neo4j multi-hop graph traversal.',
    link: '#lab',
    tags: ['Hybrid Search', 'Reciprocal Rank Fusion', 'Knowledge Graphs']
  }
];

export const Research = () => {
  return (
    <section id="research" className="py-24 bg-[#090F1C] relative border-t border-surfaceHighlight/40">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider mb-4">
            <BrainCircuit className="w-3.5 h-3.5" />
            <span>Research & Foundations</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4 text-white">
            Core Research Domains
          </h2>
          <p className="text-textMuted text-base sm:text-lg leading-relaxed font-light">
            Theoretical machine learning principles underpinning intelligent systems, graph architectures, and information retrieval.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <a
              key={index}
              href={area.link}
              className="glass-panel p-6 rounded-2xl group hover:border-primary/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-10 h-10 rounded-xl bg-surface border border-surfaceHighlight flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-lg">
                  {area.icon}
                </div>
                <h3 className="text-lg font-display font-semibold text-white mb-2 group-hover:text-primary transition-colors">
                  {area.title}
                </h3>
                <p className="text-xs text-textMuted leading-relaxed font-light mb-4">
                  {area.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-4 border-t border-surfaceHighlight/50">
                {area.tags.map((t) => (
                  <span key={t} className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-surfaceHighlight text-slate-300">
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
};
