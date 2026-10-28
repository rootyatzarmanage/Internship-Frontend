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
      className="w-full scroll-mt-20 bg-[#0a0a0a] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="text-base font-normal uppercase text-[#00aeef]">
          Start small. Scale with proof.
        </p>
        <h2 className="mt-8 text-[76px] font-bold leading-tight tracking-[-0.025]">
          Start With <span className="text-[#00aeef]">One</span> Project.
        </h2>
        <p className="mt-8 max-w-[900px] leading-8 text-xl text-[#ffffff]">
          Bring one live project into Yatzar Manage, prove the workflow on your own
          information, then expand across your portfolio.
        </p>

        <div className="mt-12 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:mt-16 lg:gap-10 2xl:gap-16">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative flex h-[700px] w-full max-w-[768px] flex-col gap-[10px] overflow-hidden rounded-xl border-[1.5px] border-[#525252] bg-[#0a0a0a] p-10"
            >
              <h3 className="text-[39px] font-semibold leading-tight text-[#00aeef]">
                {step.number}. {step.title}
              </h3>
              <p className="text-xl leading-snug text-white/90">
                {step.description}
              </p>

              <img
                src={step.image}
                alt={step.alt}
                loading="lazy"
                className="absolute left-[100px] top-[150px] block h-[550px] w-[668px] max-w-none rounded-tl-lg object-cover object-left-top"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}