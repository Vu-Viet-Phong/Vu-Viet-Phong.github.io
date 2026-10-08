import { motion } from 'framer-motion';
import { InteractiveGraph } from '../components/InteractiveGraph';
import { ArrowRight, Terminal } from 'lucide-react';

export const Hero = () => {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-[90vh] flex items-center">
      <div className="container mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-primary text-[10px] sm:text-xs font-mono uppercase tracking-wider">
            <Terminal className="w-3 h-3" />
            AI RESEARCH / DATA SCIENCE / ENGINEERING
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold leading-[1.1] tracking-tight">
            Engineering Intelligence from <span className="text-gradient">Data, Graphs & Models.</span>
          </h1>
          
          <p className="text-lg text-textMuted max-w-xl leading-relaxed">
            Exploring intelligent systems through machine learning, graph-based reasoning, multimodal recommendation, and data-driven engineering.
          </p>
          
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <a href="#projects" className="px-6 py-3 rounded-lg bg-textMain text-background font-medium hover:bg-white transition-colors flex items-center gap-2">
              Explore Projects <ArrowRight className="w-4 h-4" />
            </a>
            <a href="#lab" className="px-6 py-3 rounded-lg glass-panel hover:border-primary/50 text-textMain transition-colors">
              Enter AI Lab
            </a>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-[400px] lg:h-[600px] w-full rounded-2xl glass-panel relative overflow-hidden"
        >
          <InteractiveGraph />
        </motion.div>
        
      </div>
    </section>
  );
};
