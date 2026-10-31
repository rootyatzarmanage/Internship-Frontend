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
import AnnouncementBanner from '../components/banner/announcement-banner'
import Header from '../components/header/header'
import Footer from '../components/footer/footer'
import ScrollReveal from '../components/animations/scroll-reveal'

export default function Landing() {
  return (
    <div className="min-h-screen bg-black">
      <AnnouncementBanner />
      <Header />
      <Hero />
      <ScrollReveal><Viewer /></ScrollReveal>
      <ScrollReveal delay={60}><Information /></ScrollReveal>
      <ScrollReveal delay={100}><EightStages /></ScrollReveal>
      <ScrollReveal delay={60}><Platform /></ScrollReveal>
      <ScrollReveal delay={100}><WhyYatzar /></ScrollReveal>
      <ScrollReveal delay={60}><Stakeholders /></ScrollReveal>
      <ScrollReveal delay={100}><OpenByDesign /></ScrollReveal>
      <ScrollReveal delay={60}><Project /></ScrollReveal>
      <ScrollReveal delay={100}><FrequentlyAsked /></ScrollReveal>
      <ScrollReveal delay={60}><CallToAction /></ScrollReveal>
      <Footer />
    </div>
  )
}
