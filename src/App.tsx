import { Navigation } from './sections/Navigation';
import { Hero } from './sections/Hero';
import { AILab } from './sections/AILab';
import { Projects } from './sections/Projects';
import { Research } from './sections/Research';
import { ProductShowcase } from './sections/ProductShowcase';
import { About } from './sections/About';
import { Footer } from './sections/Footer';

function App() {
  return (
    <div className="min-h-screen selection:bg-primary/30 selection:text-white bg-[#090F1C]">
      <Navigation />
      <main>
        <Hero />
        <AILab />
        <Projects />
        <Research />
        <ProductShowcase />
        <About />
      </main>
      <Footer />
    </div>
  );
}

export default App;
