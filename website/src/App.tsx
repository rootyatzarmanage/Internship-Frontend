import SmoothScroll from './components/SmoothScroll';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Ifcview from './sections/Ifc-view';
import Experimental from './sections/Experimental';
import Footer from './sections/Footer';

function App() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Features />
        <Ifcview />  
        <Experimental />
        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default App;