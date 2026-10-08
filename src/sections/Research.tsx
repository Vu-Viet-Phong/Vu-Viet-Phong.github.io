import { Network, Database, BrainCircuit, Search, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const areas = [
  {
    title: 'Recommendation Systems',
    icon: <Database className="w-6 h-6 text-primary" />,
    description: 'Exploring matrix factorization, neural collaborative filtering, and state-of-the-art algorithms for personalized discovery.',
    link: '#projects',
    viz: (
      <div className="flex items-center justify-center h-24 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 60" className="w-full h-full max-w-[150px]">
          <circle cx="20" cy="30" r="8" fill="#4BD5E8" className="animate-pulse" />
          <circle cx="80" cy="15" r="6" fill="#9788EF" />
          <circle cx="80" cy="45" r="6" fill="#9788EF" />
          <path d="M 28 30 Q 50 15 74 15" fill="none" stroke="#4BD5E8" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
          <path d="M 28 30 Q 50 45 74 45" fill="none" stroke="#4BD5E8" strokeWidth="2" strokeDasharray="4 4" className="opacity-50" />
        </svg>
      </div>
    )
  },
  {
    title: 'Graph Intelligence',
    icon: <Network className="w-6 h-6 text-secondary" />,
    description: 'Leveraging graph neural networks to understand complex structural relationships in data ecosystems.',
    link: '#projects',
    viz: (
      <div className="flex items-center justify-center h-24 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 60" className="w-full h-full max-w-[150px]">
          <circle cx="50" cy="30" r="10" fill="#9788EF" />
          <circle cx="20" cy="15" r="5" fill="#30415d" />
          <circle cx="80" cy="15" r="5" fill="#30415d" />
          <circle cx="20" cy="45" r="5" fill="#30415d" />
          <circle cx="80" cy="45" r="5" fill="#30415d" />
          <line x1="25" y1="18" x2="42" y2="25" stroke="#9788EF" strokeWidth="1.5" />
          <line x1="75" y1="18" x2="58" y2="25" stroke="#9788EF" strokeWidth="1.5" />
          <line x1="25" y1="42" x2="42" y2="35" stroke="#9788EF" strokeWidth="1.5" />
          <line x1="75" y1="42" x2="58" y2="35" stroke="#9788EF" strokeWidth="1.5" />
        </svg>
      </div>
    )
  },
  {
    title: 'Multimodal Learning',
    icon: <BrainCircuit className="w-6 h-6 text-green-400" />,
    description: 'Fusing visual, textual, and structural representations to build robust, context-aware machine learning models.',
    link: '#projects',
    viz: (
      <div className="flex items-center justify-center h-24 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 60" className="w-full h-full max-w-[150px]">
          <rect x="15" y="10" width="15" height="15" rx="3" fill="#4BD5E8" opacity="0.6" />
          <path d="M 15 40 L 30 40 L 30 42 L 15 42 Z M 15 45 L 25 45 L 25 47 L 15 47 Z" fill="#9788EF" />
          <path d="M 35 17 Q 50 30 65 30" fill="none" stroke="#4BD5E8" strokeWidth="1.5" />
          <path d="M 35 43 Q 50 30 65 30" fill="none" stroke="#9788EF" strokeWidth="1.5" />
          <rect x="65" y="20" width="20" height="20" rx="4" fill="#30415d" stroke="#fff" strokeWidth="1" />
        </svg>
      </div>
    )
  },
  {
    title: 'Information Retrieval & RAG',
    icon: <Search className="w-6 h-6 text-pink-400" />,
    description: 'Designing GraphRAG architectures and hybrid vector-graph retrieval pipelines for grounded, citation-supported retrieval.',
    link: '#projects',
    viz: (
      <div className="flex items-center justify-center h-24 mt-4 opacity-70 group-hover:opacity-100 transition-opacity">
        <svg viewBox="0 0 100 60" className="w-full h-full max-w-[150px]">
          <path d="M 10 30 L 25 30 L 30 20 L 40 40 L 45 30 L 60 30" fill="none" stroke="#pink-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="stroke-pink-400" />
          <rect x="65" y="22" width="25" height="16" rx="2" fill="none" stroke="#4BD5E8" strokeWidth="1.5" strokeDasharray="2 2" />
          <text x="77.5" y="34" fontSize="8" fill="#4BD5E8" textAnchor="middle">Ctx</text>
        </svg>
      </div>
    )
  }
];

export const Research = () => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <section id="research" className="py-24 bg-background relative border-t border-surfaceHighlight/30">
      <div className="container mx-auto px-6">
        
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Research Areas</h2>
          <p className="text-textMuted text-lg leading-relaxed">
            Theoretical foundations and practical explorations across modern artificial intelligence domains.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {areas.map((area, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredIdx(index)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="glass-panel p-6 rounded-2xl group hover:border-primary/40 hover:bg-surfaceHighlight/10 transition-all block relative overflow-hidden"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-surface border border-surfaceHighlight flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  {area.icon}
                </div>
                <h3 className="text-lg font-semibold mb-3 text-white group-hover:text-primary transition-colors">{area.title}</h3>
                <p className="text-sm text-textMuted leading-relaxed min-h-[80px]">{area.description}</p>
              </div>
              
              <div className="border-t border-surfaceHighlight/50 pt-4 mt-2">
                {area.viz}
              </div>

              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex items-center text-[10px] uppercase font-mono text-primary gap-1">
                Explore <ChevronRight className="w-3 h-3" />
              </div>

              {/* Hover gradient backdrop */}
              <div 
                className={`absolute inset-0 bg-gradient-to-b from-transparent to-primary/5 pointer-events-none transition-opacity duration-500 ${hoveredIdx === index ? 'opacity-100' : 'opacity-0'}`} 
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
