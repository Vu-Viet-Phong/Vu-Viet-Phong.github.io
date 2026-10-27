import { motion } from 'framer-motion';
import { InteractiveGraph } from '../components/InteractiveGraph';
import { ArrowRight, Terminal, Network, Search, BrainCircuit, Database } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-28 pb-16 lg:pt-36 lg:pb-24 overflow-hidden min-h-[90vh] flex items-center">
      {/* Subtle Lab Background Gradients */}
      <div className="absolute top-1/4 left-0 w-[450px] h-[450px] bg-primary/10 rounded-full blur-[140px] -translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[160px] translate-x-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
        
        {/* Left Column: Headline & Intro */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="lg:col-span-6 flex flex-col space-y-6"
        >
          {/* Identity Tag */}
          <div className="inline-flex items-center gap-2 self-start px-3.5 py-1.5 rounded-full border border-primary/25 bg-surface/80 text-primary text-xs font-mono tracking-wide shadow-[0_0_15px_rgba(34,211,238,0.1)] backdrop-blur-sm">
            <Terminal className="w-3.5 h-3.5 text-primary" />
            <span>Vu Viet Phong • AI Research & Engineering</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold leading-[1.08] tracking-tight text-white">
            Architecting <br className="hidden sm:inline" />
            <span className="text-gradient">Graph Intelligence</span> <br className="hidden sm:inline" />
            & Multimodal AI.
          </h1>
          
          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed font-light">
            Bridging theoretical machine learning with production-grade engineering. Exploring Graph Neural Networks, hybrid GraphRAG retrieval pipelines, and explainable multimodal recommendation.
          </p>

          {/* Core Research Focus Pills */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-w-lg">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/60 border border-surfaceHighlight text-xs text-slate-200">
              <Network className="w-4 h-4 text-secondary shrink-0" />
              <span className="truncate">Graph Neural Nets</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/60 border border-surfaceHighlight text-xs text-slate-200">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span className="truncate">Hybrid GraphRAG</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface/60 border border-surfaceHighlight text-xs text-slate-200 col-span-2 sm:col-span-1">
              <BrainCircuit className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">Multimodal RecSys</span>
            </div>
          </div>
          
          {/* Primary & Secondary Action CTAs */}
          <div className="flex flex-wrap items-center gap-3.5 pt-4">
            <a 
              href="#lab" 
              className="px-6 py-3.5 rounded-xl bg-primary text-background font-display font-semibold text-xs tracking-wider uppercase hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] hover:brightness-110 transition-all flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <span>Explore AI Lab</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a 
              href="#projects" 
              className="px-6 py-3.5 rounded-xl bg-surface/80 border border-surfaceHighlight hover:border-primary/40 text-slate-200 hover:text-white font-display font-semibold text-xs tracking-wider uppercase transition-all backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              View Projects
            </a>
          </div>

          {/* Verified Engineering Status Tag */}
          <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-textMuted">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>Stack: PyTorch • React • Cytoscape • FastAPI</span>
            </span>
          </div>
        </motion.div>

        {/* Right Column: Interactive Neural Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="lg:col-span-6 h-[460px] sm:h-[520px] lg:h-[620px] w-full relative"
        >
          {/* Scientific Corner Marks */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t border-l border-primary/30 pointer-events-none z-10" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b border-r border-secondary/30 pointer-events-none z-10" />
          
          <InteractiveGraph />
        </motion.div>
        
      </div>
    </section>
  );
};
