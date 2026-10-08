import { motion } from 'framer-motion';
import { Network, Database, BrainCircuit, Search } from 'lucide-react';

const areas = [
  {
    icon: <BrainCircuit className="w-6 h-6 text-primary" />,
    title: 'Recommendation Systems',
    description: 'Exploring matrix factorization, neural collaborative filtering, and state-of-the-art algorithms for personalized discovery.',
    link: '#projects'
  },
  {
    icon: <Network className="w-6 h-6 text-secondary" />,
    title: 'Graph Intelligence',
    description: 'Leveraging graph neural networks to understand complex structural relationships in data ecosystems.',
    link: '#lab'
  },
  {
    icon: <Database className="w-6 h-6 text-emerald-400" />,
    title: 'Multimodal Learning',
    description: 'Fusing visual, textual, and structural representations to build robust, context-aware machine learning models.',
    link: '#projects'
  },
  {
    icon: <Search className="w-6 h-6 text-pink-400" />,
    title: 'Information Retrieval & RAG',
    description: 'Designing GraphRAG architectures and hybrid vector-graph retrieval pipelines for zero-hallucination systems.',
    link: '#lab'
  }
];

export const Research = () => {
  return (
    <section id="research" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-4">Research Areas</h2>
          <p className="text-textMuted max-w-2xl">Theoretical foundations and practical explorations across modern artificial intelligence domains.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <motion.a
              href={area.link}
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel p-6 rounded-xl group hover:border-primary/40 transition-all cursor-pointer block"
            >
              <div className="w-12 h-12 rounded-lg bg-surface flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                {area.icon}
              </div>
              <h3 className="text-lg font-semibold mb-3">{area.title}</h3>
              <p className="text-sm text-textMuted leading-relaxed">{area.description}</p>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
