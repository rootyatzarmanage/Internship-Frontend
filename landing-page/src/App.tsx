import AnnouncementBanner from './components/announcement-banner'
import Header from './components/header'
import Hero from './pages/hero'
import Viewer from './pages/viewer'
import Information from './pages/information'
import EightStages from './pages/eight-stages'
import Project from './pages/project'
import Platform from './pages/platform'
import WhyYatzar from './pages/why-yatzar'
import Stakeholders from './pages/stakeholders'
import OpenByDesign from './pages/open-by-design'
import FrequentlyAsked from './pages/frequently-asked'
import CallToAction from './pages/call-to-action'
import Footer from './components/footer'

export default function App() {
  return (
    <div className="min-h-screen bg-black">
      <AnnouncementBanner />
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
