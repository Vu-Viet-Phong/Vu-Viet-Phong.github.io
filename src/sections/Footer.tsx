import { Github } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-surfaceHighlight bg-background py-12">
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-xl font-bold tracking-tight text-white">
            VU ANALYTICS<span className="text-primary">.</span>
          </div>
          <p className="text-sm text-textMuted">Interactive AI Research Studio</p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-textMuted">
          <a href="#hero" className="hover:text-primary transition-colors">Home</a>
          <a href="#projects" className="hover:text-primary transition-colors">Projects</a>
          <a href="#lab" className="hover:text-primary transition-colors">AI Lab</a>
          <a href="#about" className="hover:text-primary transition-colors">About</a>
        </div>

        <div className="flex items-center gap-6 text-textMuted">
          <a href="https://github.com/Vu-Viet-Phong/Vu-Viet-Phong.github.io" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2 text-sm">
            <Github className="w-5 h-5" /> Repository
          </a>
        </div>
      </div>
      
      <div className="container mx-auto px-6 mt-8 pt-8 border-t border-surfaceHighlight/50 flex flex-col md:flex-row justify-between items-center text-xs text-textMuted">
        <p>© {new Date().getFullYear()} Vu Viet Phong. All rights reserved.</p>
        <p className="font-mono mt-2 md:mt-0">vuanalytics.me <span className="px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 text-[10px] tracking-wider uppercase">Build V3.1</span></p>
      </div>
    </footer>
  );
};
