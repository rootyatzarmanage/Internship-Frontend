import SmoothScroll from './components/SmoothScroll';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Work from './sections/Work';
import Experimental from './sections/Experimental';
import Footer from './sections/Footer';

function App() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Features />
        <Work />  
        <Experimental />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default App;
