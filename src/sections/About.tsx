import { Github, Mail, MapPin, GraduationCap, Code2, Link as LinkIcon } from 'lucide-react';

export const About = () => {
  return (
    <section id="about" className="py-24 bg-[#0a0f18] relative border-t border-surfaceHighlight/30">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          
          {/* Bio & Intro */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-white">
                About Me
              </h2>
              <div className="w-16 h-1 bg-primary rounded-full mb-8"></div>
              
              <div className="prose prose-invert prose-lg text-slate-300 leading-relaxed">
                <p>
                  Hi, I'm <strong className="text-white">Vu Viet Phong</strong>. I am an AI Engineer and Data Scientist deeply passionate about building intelligent systems that bridge theoretical research with practical engineering.
                </p>
                <p>
                  My work primarily centers around <strong className="text-white">Recommendation Systems</strong>, <strong className="text-white">Graph Neural Networks (GNNs)</strong>, and <strong className="text-white">Information Retrieval</strong>. I enjoy exploring how complex relational data and multimodal features can be leveraged to create more context-aware, personalized AI solutions.
                </p>
                <p>
                  Through this interactive research studio, I aim to showcase applied engineering concepts—such as hybrid GraphRAG pipelines and multimodal representations—in a transparent and accessible way.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 border-t border-surfaceHighlight/50">
              <a href="https://github.com/Vu-Viet-Phong" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" /> GitHub Profile
              </a>
              <a href="mailto:contact@vuanalytics.me" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors">
                <Mail className="w-5 h-5" /> contact@vuanalytics.me
              </a>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <MapPin className="w-5 h-5" /> Vietnam
              </div>
            </div>
          </div>

          {/* Technical Profile */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="glass-panel p-8 rounded-3xl border border-surfaceHighlight">
              <h3 className="font-semibold text-white mb-6 flex items-center gap-2 border-b border-surfaceHighlight pb-4">
                <Code2 className="w-5 h-5 text-primary" /> Technical Profile
              </h3>
              
              <div className="space-y-6">
                <div>
                  <h4 className="text-[11px] font-mono text-textMuted uppercase tracking-wider mb-3">Core Domains</h4>
                  <ul className="space-y-2 text-sm text-slate-300">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-primary" /> Machine Learning & Deep Learning</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-secondary" /> Graph Neural Networks</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-pink-400" /> Information Retrieval (RAG)</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Recommendation Architectures</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-[11px] font-mono text-textMuted uppercase tracking-wider mb-3">Frameworks & Tools</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Python', 'PyTorch', 'Scikit-learn', 'Neo4j', 'Pandas', 'NumPy', 'React', 'TypeScript', 'Tailwind CSS', 'Git'].map(skill => (
                      <span key={skill} className="px-3 py-1.5 bg-surface border border-surfaceHighlight rounded-lg text-xs text-slate-300 font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="glass-panel p-6 rounded-2xl border border-surfaceHighlight flex items-center justify-between group cursor-pointer hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm">Academic Research</h4>
                  <p className="text-xs text-textMuted mt-1">Focus on AI & Data Science</p>
                </div>
              </div>
              <LinkIcon className="w-4 h-4 text-textMuted group-hover:text-primary transition-colors" />
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
