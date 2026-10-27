import { Github, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-surfaceHighlight/60 bg-[#060A14] py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-lg font-display font-bold tracking-tight text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-primary" />
            <span>VU ANALYTICS<span className="text-primary font-mono">.lab</span></span>
          </div>
          <p className="text-xs text-textMuted font-light">Interactive AI Research & Engineering Studio</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-mono text-textMuted">
          <a href="#hero" className="hover:text-primary transition-colors">Home</a>
          <a href="#lab" className="hover:text-primary transition-colors">AI Lab</a>
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#research" className="hover:text-primary transition-colors">Research</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </div>

        <div className="flex items-center gap-4 text-textMuted">
          <a 
            href="https://github.com/Vu-Viet-Phong/Vu-Viet-Phong.github.io" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors flex items-center gap-2 text-xs font-mono px-3 py-1.5 rounded-lg bg-surface border border-surfaceHighlight hover:border-primary/40"
          >
            <Github className="w-4 h-4 text-primary" />
            <span>Repository</span>
          </a>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-8 pt-6 border-t border-surfaceHighlight/40 flex flex-col sm:flex-row justify-between items-center text-[11px] font-mono text-textMuted gap-2">
        <p>© {new Date().getFullYear()} Vu Viet Phong. All rights reserved.</p>
        <div className="flex items-center gap-3">
          <span>vuanalytics.me</span>
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/25 text-[10px] tracking-wider uppercase font-semibold">
            Build V3.2 Rebirth
          </span>
        </div>
      </div>
    </footer>
  );
};
