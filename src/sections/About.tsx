import { Github, Mail, MapPin, GraduationCap, Code2, ExternalLink } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-[#090F1C] relative border-t border-surfaceHighlight/40">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Bio & Intro */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono uppercase tracking-wider mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Engineer Profile</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-6 tracking-tight text-white">
                About the Engineer
              </h2>
              
              <div className="text-slate-300 text-base leading-relaxed space-y-4 font-light">
                <p>
                  I am <strong className="text-white font-medium">Vu Viet Phong</strong>, an AI Engineer and Data Scientist specializing in Recommendation Architectures, Graph Neural Networks (GNNs), and Information Retrieval.
                </p>
                <p>
                  My engineering journey focuses on closing the gap between academic machine learning research and resilient software engineering. Through VuAnalytics, I build open, transparent demonstrations of complex AI systems—such as hybrid GraphRAG pipelines, bipartite graph message passing, and explainable multimodal ranking.
                </p>
                <p>
                  I emphasize deterministic verification, reproducible evaluation metrics, and clean system design over black-box heuristics.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-surfaceHighlight/50">
              <a 
                href="https://github.com/Vu-Viet-Phong" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg bg-surface border border-surfaceHighlight hover:border-primary/40"
              >
                <Github className="w-4 h-4 text-primary" />
                <span>github.com/Vu-Viet-Phong</span>
              </a>
              <a 
                href="mailto:contact@vuanalytics.me" 
                className="flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors px-3 py-2 rounded-lg bg-surface border border-surfaceHighlight hover:border-primary/40"
              >
                <Mail className="w-4 h-4 text-primary" />
                <span>contact@vuanalytics.me</span>
              </a>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 px-3 py-2 rounded-lg bg-surface/50 border border-surfaceHighlight">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Vietnam</span>
              </div>
            </div>
          </div>

          {/* Technical Profile Cards */}
          <div className="lg:col-span-5 space-y-5">
            <div className="glass-panel p-6 rounded-2xl border border-surfaceHighlight">
              <h3 className="font-display font-semibold text-white text-sm mb-4 flex items-center gap-2 border-b border-surfaceHighlight pb-3">
                <Code2 className="w-4 h-4 text-primary" /> Core Competencies
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] font-mono text-textMuted uppercase tracking-wider mb-2">Specializations</h4>
                  <ul className="space-y-1.5 text-xs text-slate-300 font-light">
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Graph Neural Networks (LightGCN, NGCF)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Multimodal Collaborative Filtering (VBPR)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> GraphRAG & Hybrid Information Retrieval
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Full-Stack AI Product Engineering
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[10px] font-mono text-textMuted uppercase tracking-wider mb-2">Technical Toolchain</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {['Python', 'PyTorch', 'FastAPI', 'Neo4j', 'Docker', 'React', 'TypeScript', 'Tailwind CSS', 'Git'].map((s) => (
                      <span key={s} className="px-2.5 py-1 bg-[#060A14] border border-surfaceHighlight rounded-md text-[11px] text-slate-300 font-mono">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel p-5 rounded-2xl border border-surfaceHighlight flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-display font-medium text-xs">Academic & Applied Research</h4>
                  <p className="text-[10px] text-textMuted mt-0.5">Focus on Deep Learning & Recommendation Systems</p>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-textMuted group-hover:text-primary transition-colors" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
