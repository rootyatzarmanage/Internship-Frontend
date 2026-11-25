import '../website.css';
import CallToAction from '../cards/call-to-action';
import EightStages from '../cards/eight-stages';
import FrequentlyAsked from '../cards/frequently-asked';
import Hero from '../cards/hero';
import LandingScrollAnimations from '../components/animations/landing-scroll-animations';
import Information from '../cards/information';
import OpenByDesign from '../cards/open-by-design';
import Platform from '../cards/platform';
import Project from '../cards/project';
import Stakeholders from '../cards/stakeholders';
import Viewer from '../cards/viewer';
import WhyYatzar from '../cards/why-yatzar';



export default function Landing() {
  return (
    <div className='tpl-site min-h-screen bg-black'>
      <LandingScrollAnimations />
      <Hero />
      <Viewer />
      <Information />
      <EightStages />
      <Platform />
      <WhyYatzar />
      <Stakeholders />
      <OpenByDesign />
      <Project />
      <FrequentlyAsked />
      <CallToAction />
    </div>
  )
}
