export const About = () => {
  const technologies = [
    'Python', 'PyTorch', 'Scikit-learn', 'NumPy', 'Pandas', 
    'React', 'TypeScript', 'Tailwind CSS', 'Git', 'Neo4j'
  ];

  return (
    <section id="about" className="py-24 bg-surface/30">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <div className="space-y-4 text-textMuted leading-relaxed">
              <p>
                Hi, I'm <strong className="text-white">Vu Viet Phong</strong>.
              </p>
              <p>
                I am deeply interested in Artificial Intelligence and Data Science, with a specific focus on Recommendation Systems, Graph-based Machine Learning, and Information Retrieval.
              </p>
              <p>
                My work centers around researching intelligent systems and building engineering frameworks that bridge complex theoretical models with robust, interactive applications. I enjoy exploring how multimodal data and graph structures can create more context-aware AI solutions.
              </p>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-2xl">
            <h3 className="text-lg font-semibold mb-6">Technical Stack & Tools</h3>
            <div className="flex flex-wrap gap-2">
              {technologies.map((tech) => (
                <span 
                  key={tech} 
                  className="px-3 py-1.5 rounded-lg bg-background border border-surfaceHighlight text-sm text-textMuted hover:border-primary hover:text-primary transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
