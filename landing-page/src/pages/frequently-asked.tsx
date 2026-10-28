import { useState } from 'react'

const faqs = [
  {
    question: 'What is Yatzar Manage ?',
    answer:
      'Yatzar Manage is a digital project and asset management platform for the built environment. It keeps one record of an asset from the first brief, through design, construction and handover, and into operation and renewal.',
  },
  {
    question: 'What are PIM and AIM?',
    answer:
      'PIM is project information, managed while you build. AIM is asset information, managed after you build. In Yatzar Manage the same record moves from PIM to AIM at handover, so nothing is recreated.',
  },
  {
    question: 'Which open standards does Yatzar Manage use?',
    answer:
      'Stages and information flows follow ISO 19650. Data moves in the open standards IFC, BCF, IDS and COBie.',
  },
  {
    question: 'How do we start?',
    answer:
      'Start with one live project. We hold a 30 minute discovery call, run a 30 day pilot on your own project information, convert its handover into a live asset record, and then roll out to more projects.',
  },
  {
    question: 'Is it built for Indian projects?',
    answer:
      'Yatzar Manage is designed with Indian project, procurement and commercial workflows in mind, including GST, TDS and MSME handling in procurement and payment.',
  },
]

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 shrink-0 transition-colors duration-300 ${
        open ? 'text-[#00aeef]' : 'text-white'
      }`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <line
        x1="12"
        y1="5"
        x2="12"
        y2="19"
        className={`origin-center transition-all duration-300 ${
          open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
        }`}
      />
    </svg>
  )
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index))

  return (
    <section
      id="faq"
      className="w-full scroll-mt-20 bg-[#181818] px-5 py-16 text-white sm:px-8 lg:px-12 lg:py-20 2xl:px-0"
    >
      <div className="mx-auto w-full max-w-[1600px]">
        <p className="text-base font-normal uppercase text-[#00aeef]">
          Questions
        </p>
        <h2 className="mt-8 text-[76px] font-bold leading-tight tracking-[0.02em]">
          Frequently Asked <span className="text-[#00aeef]">Questions</span>.
        </h2>

        <div className="mt-8 w-full max-w-[1200px] border-t border-white/20 lg:mt-12">
          {faqs.map((item, index) => {
            const open = openIndex === index
            const panelId = `faq-panel-${index}`
            const buttonId = `faq-button-${index}`

            return (
              <div
                key={item.question}
                className={`border-b ${open ? 'border-white/30' : 'border-white/20'}`}
              >
                <h3>
                  <button
                    id={buttonId}
                    type="button"
                    onClick={() => toggle(index)}
                    aria-expanded={open}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left lg:py-[25px]"
                  >
                    <span className="text-lg font-normal leading-7 sm:text-xl lg:text-2xl">
                      {item.question}
                    </span>
                    <ToggleIcon open={open} />
                  </button>
                </h3>

                {/* Smooth height animation using CSS grid rows (no JS measuring) */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[1000px] pb-6 pr-10 text-base leading-[1.7] text-white/90 lg:pb-5 lg:text-xl lg:leading-[34px]">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}