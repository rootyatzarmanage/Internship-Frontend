import Header from '../components/header'
import Hero from '../cards/hero'
import Viewer from '../cards/viewer'
import Information from '../cards/information'
import EightStages from '../cards/eight-stages'
import Project from '../cards/project'
import Platform from '../cards/platform'
import WhyYatzar from '../cards/why-yatzar'
import Stakeholders from '../cards/stakeholders'
import OpenByDesign from '../cards/open-by-design'
import FrequentlyAsked from '../cards/frequently-asked'
import CallToAction from '../cards/call-to-action'
import Footer from '../components/footer'

export default function Landing() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
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
      <Footer />
    </div>
  )
}
