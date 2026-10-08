import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { Research } from './sections/Research';
import { Projects } from './sections/Projects';
import { AILab } from './sections/AILab';
import { ProductShowcase } from './sections/ProductShowcase';
import { About } from './sections/About';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen selection:bg-primary/30 selection:text-white">
      <Navigation />
      <main>
        <Hero />
        <Research />
        <Projects />
        <AILab />
        <ProductShowcase />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
