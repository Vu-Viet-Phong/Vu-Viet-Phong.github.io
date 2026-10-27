import { useState, useEffect } from 'react';
import { Menu, X, Github, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'Home', href: '#hero', id: 'hero' },
  { name: 'AI Lab', href: '#lab', id: 'lab' },
  { name: 'Projects', href: '#projects', id: 'projects' },
  { name: 'Research', href: '#research', id: 'research' },
  { name: 'About', href: '#about', id: 'about' },
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Simple active section detection based on scroll position
      const scrollPosition = window.scrollY + 160;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_LINKS[i].id);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_LINKS[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#090F1C]/85 backdrop-blur-md py-3.5 border-b border-surfaceHighlight shadow-lg' : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo / Brand */}
        <a 
          href="#hero" 
          className="text-lg md:text-xl font-display font-bold tracking-tight text-white flex items-center gap-2 group focus:outline-none focus:ring-2 focus:ring-primary rounded-lg px-1"
        >
          <div className="w-8 h-8 rounded-lg bg-surface border border-surfaceHighlight flex items-center justify-center text-primary group-hover:border-primary/50 transition-colors">
            <Terminal className="w-4 h-4" />
          </div>
          <span>VU ANALYTICS<span className="text-primary font-mono text-base">.lab</span></span>
        </a>

        {/* Desktop Nav */}
        <nav 
          aria-label="Main Navigation" 
          className="hidden md:flex items-center space-x-1 lg:space-x-2 bg-surface/80 border border-surfaceHighlight px-3 py-1.5 rounded-full backdrop-blur-sm"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.name}
                href={link.href}
                className={`relative px-3.5 py-1.5 rounded-full text-xs font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive 
                    ? 'text-white font-semibold bg-white/10 shadow-[0_0_12px_rgba(34,211,238,0.25)]' 
                    : 'text-textMuted hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary mr-1.5 animate-pulse" />
                )}
                {link.name}
              </a>
            );
          })}
        </nav>

        {/* Right CTA / GitHub */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/Vu-Viet-Phong/Vu-Viet-Phong.github.io"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg border border-surfaceHighlight bg-surface/50 hover:border-primary/50 text-xs font-medium text-slate-300 hover:text-white transition-all group focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <Github className="w-3.5 h-3.5 text-textMuted group-hover:text-primary transition-colors" />
            <span className="font-mono">GitHub</span>
          </a>
          <a
            href="#lab"
            className="px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary hover:text-background text-xs font-semibold font-mono tracking-wide transition-all shadow-[0_0_15px_rgba(34,211,238,0.15)] focus:outline-none focus:ring-2 focus:ring-primary"
          >
            LIVE LAB
          </a>
        </div>

        {/* Mobile Toggle */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? 'Close Menu' : 'Open Menu'}
          className="md:hidden p-2 rounded-lg bg-surface border border-surfaceHighlight text-slate-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#090F1C]/95 border-b border-surfaceHighlight px-6 py-6 space-y-3 backdrop-blur-xl"
          >
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-primary/15 text-primary border border-primary/30'
                      : 'text-textMuted hover:text-white hover:bg-surface'
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
            <div className="pt-4 border-t border-surfaceHighlight/60 flex items-center justify-between">
              <a
                href="https://github.com/Vu-Viet-Phong/Vu-Viet-Phong.github.io"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs font-mono text-textMuted hover:text-white"
              >
                <Github className="w-4 h-4" /> Vu-Viet-Phong
              </a>
              <span className="text-[10px] font-mono text-primary bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                v3.2
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
