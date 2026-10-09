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
          
          <h1 className="text-5xl md:text-6xl lg:text-[5rem] font-extrabold leading-[1.05] tracking-tighter text-white drop-shadow-sm">
            Engineering <br className="hidden lg:block" /> Intelligence from <br className="hidden lg:block" />
            <span className="text-gradient drop-shadow-[0_0_20px_rgba(75,213,232,0.3)]">Data, Graphs & Models.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-300 max-w-xl leading-relaxed font-light">
            Architecting intelligent systems through advanced machine learning, graph-based reasoning, multimodal recommendation, and data-driven engineering.
          </p>

          {/* Research Focus Strip */}
          <div className="flex flex-wrap items-center gap-4 py-3 border-y border-white/10 bg-white/5 px-4 rounded-lg backdrop-blur-sm shadow-inner">
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
              <Network className="w-4 h-4 text-secondary" />
              Graph Neural Networks
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-primary/50" />
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
              <Search className="w-4 h-4 text-primary" />
              Information Retrieval
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-purple-400/50" />
            <div className="flex items-center gap-2 text-xs md:text-sm font-semibold text-slate-200 tracking-wide">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              Multimodal RecSys
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#projects" className="px-8 py-4 rounded-xl bg-white text-background font-bold text-sm tracking-wide uppercase hover:bg-primary hover:text-background hover:shadow-[0_0_25px_rgba(75,213,232,0.5)] transition-all flex items-center gap-2 group">
              Explore Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </a>
            <a href="#lab" className="px-8 py-4 rounded-xl glass-panel border border-white/10 hover:border-primary/50 text-white font-bold text-sm tracking-wide uppercase transition-all hover:bg-white/10 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]">
              Enter AI Lab
            </a>
          </div>
        </motion.div>

        {/* Right Column - Graph */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="lg:col-span-7 h-[600px] lg:h-[800px] w-full relative -mr-10 lg:-mr-20"
        >
          {/* Decorative Corner Borders */}
          <div className="absolute top-10 left-10 w-24 h-24 border-t-2 border-l-2 border-primary/40 rounded-tl-[40px] pointer-events-none z-10" />
          <div className="absolute bottom-10 right-10 w-24 h-24 border-b-2 border-r-2 border-secondary/40 rounded-br-[40px] pointer-events-none z-10" />
          
          <div className="absolute top-1/4 -left-8 px-4 py-2 bg-background/80 backdrop-blur-md border border-white/10 rounded-lg shadow-xl z-20 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-300">Live Simulation</span>
          </div>

          <InteractiveGraph />
        </motion.div>
        
      </div>
    </section>
  );
};
