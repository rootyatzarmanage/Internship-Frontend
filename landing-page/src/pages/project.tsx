import discoveryImage from '../assets/discovery.png'
import pilotImage from '../assets/pilot.png'
import handoverImage from '../assets/handover.png'
import rolloutImage from '../assets/rollout.png'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    description: 'A 30 minute discussion about your projects, assets and goals.',
    image: discoveryImage,
    alt: 'Yatzar Manage resources dashboard',
  },
  {
    number: '02',
    title: 'Pilot',
    description: 'One live project on Yatzar Manage for 30 days.',
    image: pilotImage,
    alt: 'Yatzar Manage project model viewer',
  },
  {
    number: '03',
    title: 'Handover',
    description: 'Project information becomes a structured asset record.',
    image: handoverImage,
    alt: 'Yatzar Manage asset data handover',
  },
  {
    number: '04',
    title: 'Rollout',
    description: 'More projects, assets and teams.',
    image: rolloutImage,
    alt: 'Yatzar Manage project documents',
  },
]

export default function Project() {
  return (
    <section
      id="project"
      className="w-full scroll-mt-20 bg-[#0a0a0a] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#00aeef]">
          Start small. Scale with proof.
        </p>
        <h2 className="mt-3 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-[44px]">
          Start With <span className="text-[#00aeef]">One</span> Project.
        </h2>
        <p className="mt-4 max-w-[560px] text-[13px] leading-[1.65] text-white/80">
          Bring one live project into Yatzar Manage, prove the workflow on your own
          information, then expand across your portfolio.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
          {steps.map((step) => (
            <article
              key={step.number}
              className="flex flex-col overflow-hidden rounded-[10px] border border-white/20 bg-[#0a0a0a]"
            >
              <div className="px-5 pb-5 pt-5 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
                <h3 className="text-xl font-semibold leading-7 text-[#00aeef] lg:text-2xl">
                  {step.number}. {step.title}
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-white/85 lg:text-sm">
                  {step.description}
                </p>
              </div>

              {/* Screenshot is inset on the left and cropped by the card's right/bottom edges */}
              <div className="ml-5 h-[220px] overflow-hidden rounded-tl-md border-l border-t border-white/15 bg-black sm:ml-6 sm:h-[280px] lg:ml-8 lg:h-[380px] xl:h-[440px] 2xl:h-[500px]">
                <img
                  src={step.image}
                  alt={step.alt}
                  loading="lazy"
                  className="block h-auto w-[115%] max-w-none"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}