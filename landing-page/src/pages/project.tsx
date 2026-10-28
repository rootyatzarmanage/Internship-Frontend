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
      className="w-full bg-[#0a0a0a] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-24 2xl:px-0"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="text-base font-normal uppercase text-[#00aeef]">
          Start small. Scale with proof.
        </p>
        <h2 className="mt-6 text-4xl font-bold leading-tight tracking-[-0.025] sm:mt-8 sm:text-5xl lg:text-[76px]">
          Start With <span className="text-[#00aeef]">One</span> Project.
        </h2>
        <p className="mt-6 max-w-[900px] text-lg leading-7 text-[#ffffff] sm:mt-8 sm:text-xl sm:leading-8">
          Bring one live project into Yatzar Manage, prove the workflow on your own
          information, then expand across your portfolio.
        </p>

        <div className="mt-12 grid grid-cols-1 justify-items-center gap-6 md:grid-cols-2 lg:mt-16 lg:gap-10 2xl:gap-16">
          {steps.map((step) => (
            <article
              key={step.number}
              className="relative flex h-[560px] w-full max-w-[768px] flex-col gap-2 overflow-hidden rounded-xl border-[1.5px] border-[#525252] bg-[#0a0a0a] p-5 sm:h-[700px] sm:gap-[10px] sm:p-10"
            >
              <h3 className="text-3xl font-semibold leading-tight text-[#00aeef] sm:text-[39px]">
                {step.number}. {step.title}
              </h3>
              <p className="text-base leading-snug text-white/90 sm:text-xl">
                {step.description}
              </p>

              <img
                src={step.image}
                alt={step.alt}
                loading="lazy"
                className="absolute left-6 top-[145px] block h-[400px] w-[calc(100%_-_48px)] max-w-none rounded-tl-lg object-cover object-left-top sm:top-[150px] sm:h-[550px] 2xl:left-[100px] 2xl:w-[668px]"
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
