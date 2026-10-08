import { useState, useEffect } from 'react';
import { Menu, X, Github } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Research', href: '#research' },
    { name: 'Projects', href: '#projects' },
    { name: 'AI Lab', href: '#lab' },
    { name: 'Products', href: '#products' },
    { name: 'About', href: '#about' },
  ];

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'glass-panel py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold tracking-tight">
          VU ANALYTICS<span className="text-primary">.</span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
          {navLinks.map((link) => (
            <a key={link.name} href={link.href} className="text-textMuted hover:text-textMain transition-colors">
              {link.name}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center">
          <a href="https://github.com/Vu-Viet-Phong" target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surfaceHighlight hover:border-primary/50 text-sm transition-all group">
            <Github className="w-4 h-4 text-textMuted group-hover:text-primary transition-colors" />
            <span className="font-mono">GitHub</span>
          </a>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-textMuted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full glass-panel border-t border-surfaceHighlight flex flex-col p-6 space-y-4 md:hidden"
          >
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-textMuted hover:text-primary transition-colors">
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
