import { motion } from 'framer-motion';
import { Sparkles, Hexagon } from 'lucide-react';

export const ProductShowcase = () => {
  return (
    <section id="products" className="py-24">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden glass-panel border border-primary/20"
        >
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
          
          <div className="grid lg:grid-cols-2 gap-12 p-8 md:p-16 relative z-10">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface text-primary text-xs font-mono border border-primary/30">
                <Sparkles className="w-3 h-3" /> Product Concept
              </div>
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Fashion Intelligence Copilot</h2>
              <p className="text-textMuted text-lg leading-relaxed">
                An AI-powered discovery interface combining computer vision, natural language processing, and graph-based retrieval to understand complex fashion intents.
              </p>
              <ul className="space-y-4">
                {[
                  'Attribute extraction from natural language',
                  'Visual similarity matching via vector search',
                  'Graph-based outfit compatibility reasoning'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-textMain">
                    <Hexagon className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              {/* Fake UI Preview */}
              <div className="rounded-xl border border-surfaceHighlight bg-[#0b1320] shadow-2xl overflow-hidden flex flex-col h-full min-h-[300px]">
                <div className="h-10 bg-surface border-b border-surfaceHighlight flex items-center px-4 gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/50" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                  <div className="w-3 h-3 rounded-full bg-green-500/50" />
                  <div className="ml-4 text-[10px] font-mono text-textMuted">copilot.prototype</div>
                </div>
                <div className="p-6 flex-grow flex flex-col gap-4">
                  <div className="bg-surface/50 border border-surfaceHighlight rounded-lg p-3 text-sm text-textMuted">
                    "Find me a minimalist silk evening gown for an outdoor gala."
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 rounded bg-primary/10 text-primary text-[10px] font-mono border border-primary/20">Style: Minimalist</span>
                    <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-[10px] font-mono border border-secondary/20">Material: Silk</span>
                  </div>
                  <div className="mt-auto p-4 rounded-lg border border-dashed border-textMuted/30 text-center">
                    <span className="text-xs font-mono text-textMuted block mb-2">Prototype Interface</span>
                    <button className="px-4 py-2 rounded bg-surface border border-surfaceHighlight text-xs hover:text-primary transition-colors">
                      View Design Specification
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
