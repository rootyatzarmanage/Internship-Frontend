import SmoothScroll from './components/SmoothScroll';
import Hero from './sections/Hero';
import Features from './sections/Features';
import Ifcview from './sections/Ifc-view';
import Footer from './sections/Footer';

function App() {
  return (
    <SmoothScroll>
      <main>
        <Hero />
        <Features />
        <Ifcview />  
        <Footer />
      </main>
    </SmoothScroll>
  );
}

export default App;