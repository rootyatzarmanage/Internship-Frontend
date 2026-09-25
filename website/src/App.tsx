import SmoothScroll from './components/SmoothScroll';
import Hero from './sections/Hero';
import About from './sections/About';
import Work from './sections/Work';
import Experimental from './sections/Experimental';
import Footer from './sections/Footer';

function App() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <About />
        <Work />  
        <Experimental />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default App;
