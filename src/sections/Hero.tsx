import { motion } from 'framer-motion';
import { InteractiveGraph } from '../components/InteractiveGraph';
import { ArrowRight, Terminal, Network, Search, BrainCircuit } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden min-h-screen flex items-center">
      {/* Subtle Background Glows */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* Left Column - Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:col-span-5 flex flex-col space-y-8"
        >
          {/* Identity Tag */}
          <div className="inline-flex flex-col items-start gap-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-[11px] sm:text-xs font-mono uppercase tracking-wider shadow-[0_0_15px_rgba(75,213,232,0.1)]">
              <Terminal className="w-3.5 h-3.5" />
              Vu Viet Phong — AI Engineer & Data Scientist
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
            Engineering Intelligence from <br className="hidden lg:block" />
            <span className="text-gradient">Data, Graphs & Models.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-xl leading-relaxed">
            Exploring intelligent systems through machine learning, graph-based reasoning, multimodal recommendation, and data-driven engineering.
          </p>

          {/* Research Focus Strip */}
          <div className="flex flex-wrap items-center gap-4 py-2 border-y border-white/5">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Network className="w-4 h-4 text-secondary" />
              Graph Neural Networks
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <Search className="w-4 h-4 text-primary" />
              Information Retrieval
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              Multimodal RecSys
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <a href="#projects" className="px-7 py-3.5 rounded-xl bg-white text-background font-semibold hover:bg-primary hover:text-background hover:shadow-[0_0_20px_rgba(75,213,232,0.4)] transition-all flex items-center gap-2 group">
              Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#lab" className="px-7 py-3.5 rounded-xl glass-panel border border-white/10 hover:border-primary/50 text-white transition-all hover:bg-white/5">
              Enter AI Lab
            </a>
          </div>
        </motion.div>

        {/* Right Column - Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-7 h-[500px] lg:h-[700px] w-full relative"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/30 rounded-tl-3xl pointer-events-none z-10" />
          <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-secondary/30 rounded-br-3xl pointer-events-none z-10" />
          
          <InteractiveGraph />
        </motion.div>
        
      </div>
    </section>
  );
};
