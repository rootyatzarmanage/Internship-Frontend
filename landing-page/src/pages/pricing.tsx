import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import Header from '../components/header'
import Footer from '../components/footer'

type BillingCycle = 'yearly' | 'half-yearly'

type Plan = {
  name: string
  description: string
  tier: string
  yearlyPrice: number
  halfYearlyPrice: number
  yearlyTotal: number
  halfYearlyTotal: number
  features: string[]
  buttonLabel: string
  featured?: boolean
}
const handleBookDemo = () => {
    document.getElementById('book-demo')?.scrollIntoView({ behavior: 'smooth' })
  }
const plans: Plan[] = [
  {
    name: 'PIM',
    description: 'For growing BIM teams managing multiple projects.',
    tier: 'Professional',
    yearlyPrice: 4000,
    halfYearlyPrice: 5000,
    yearlyTotal: 48000,
    halfYearlyTotal: 30000,
    features: [
      '1 (shared) workspace',
      'Unlimited projects',
      'Unlimited users',
      '100 GB storage',
      'Everything in Free',
      '4D scheduling',
      'Scope management',
      'Cost module',
    ],
    buttonLabel: 'Choose PIM',
  },
  {
    name: 'AIM',
    description: 'Full BIM suite for large scale construction operations.',
    tier: 'Professional',
    yearlyPrice: 8000,
    halfYearlyPrice: 10000,
    yearlyTotal: 96000,
    halfYearlyTotal: 60000,
    features: [
      '1 (shared) workspace',
      'Unlimited projects',
      'Unlimited users',
      '100 GB storage',
      'Everything in Free',
      '5D cost management',
      'Clash detection',
      'API access',
    ],
    buttonLabel: 'Choose AIM',
  },
  {
    name: 'PIM + AIM',
    description: 'Full BIM suite for large scale construction operations.',
    tier: 'Max',
    yearlyPrice: 10000,
    halfYearlyPrice: 12500,
    yearlyTotal: 120000,
    halfYearlyTotal: 75000,
    features: [
      '1 (shared) workspace',
      'Unlimited projects',
      'Unlimited users',
      '100 GB storage',
      'Everything in PIM and AIM',
      '5D cost management',
      'Clash detection',
      'API access',
    ],
    buttonLabel: 'Choose PIM + AIM',
  },
]

const freeFeatures = [
  '1 (shared) workspace',
  'One PIM project and one AIM project',
  'Up to 5 members',
  '2 GB storage',
  'CDE',
  'IFC viewer',
  'BCF export',
  'Team management',
]

const comparisonRows: { feature: string; values: (string | boolean)[] }[] = [
  { feature: 'Workspace', values: ['1 shared', '1 shared', '1 shared', '1 shared'] },
  { feature: 'Projects', values: ['1 PIM + 1 AIM', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { feature: 'Members', values: ['Up to 5', 'Unlimited', 'Unlimited', 'Unlimited'] },
  { feature: 'Storage', values: ['2 GB', '100 GB', '100 GB', '100 GB'] },
  { feature: 'CDE (Common Data Environment)', values: [true, true, true, true] },
  { feature: 'IFC Viewer', values: [true, true, true, true] },
  { feature: 'BCF Export', values: [true, true, true, true] },
  { feature: 'Team Management', values: [true, true, true, true] },
  { feature: '4D Scheduling', values: [false, true, false, true] },
  { feature: 'Scope Management', values: [false, true, false, true] },
  { feature: 'Cost Module', values: [false, true, false, true] },
  { feature: '5D Cost Management', values: [false, false, true, true] },
  { feature: 'Clash Detection', values: [false, false, true, true] },
  { feature: 'API Access', values: [false, false, true, true] },
]

const pricingFaqs = [
  {
    question: 'What Is PIM?',
    answer: 'PIM is project information. It covers managing a project while you build, from defining requirements through design, execution and handover.'
  },
  {
    question: 'What is AIM?',
    answer: 'PIM is project information, managed while you build. AIM is asset information, managed after you build. In Yatzar Manage the same record moves from PIM to AIM at handover, so nothing is recreated.'
  },
  {
    question: 'How Does Billing Work?',
    answer: 'Stages and information flows follow ISO 19650. Data moves in the open standards IFC, BCF, IDS and COBie.'
  },
  {
    question: 'What Does The Free Plan Include?',
    answer: 'Start with one live project. We hold a 30 minute discovery call, run a 30 day pilot on your own project information, convert its handover into a live asset record, and then roll out to more projects.'
  },
  {
    question: 'Which Plan Should We Choose?',
    answer: 'Yatzar Manage is designed with Indian project, procurement and commercial workflows in mind, including GST, TDS and MSME handling in procurement and payment.'
  }
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN').format(price)
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="flex flex-col gap-3 text-base p-2 leading-7 text-white/90 sm:gap-4 lg:text-xl lg:leading-[34px]">
      {features.map((feature) => (
        <li key={feature} className="flex items-start gap-3">
          <svg className="mt-1 h-5 w-6 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M2.5 10.5 7.2 15 17.5 4.5" stroke="#00AEEF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('yearly')
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main id="pricing" className="px-5 pb-12 pt-10 sm:px-8 sm:pt-14 lg:px-12 lg:pt-16 2xl:px-0">
        <div className="mx-auto max-w-[1600px]">
          <header className="mx-auto text-center">
            <p className="text-base font-regular uppercase tracking-wide text-[#00A6F4]">Pricing</p>
            <h1 className="mt-8 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[76px]">
              Plans For Every Stage
              <br className="hidden sm:block" /> Of The Asset Lifecycle.
            </h1>
            <p className="mt-8 text-[20px] sm:text-base">
              Choose project information, asset information, or both. Pay yearly or half yearly.
            </p>

            <div className="relative mx-auto mt-[60px] mb-[60px] flex h-[70px] w-full max-w-[365px] items-center rounded-full border border-[#737373] p-[5px]" aria-label="Billing cycle">
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute top-[5px] bottom-[5px] left-[5px] w-[calc(50%-5px)] rounded-full bg-[#00A6F4] transition-transform duration-300 ease-in-out ${billingCycle === 'half-yearly' ? 'translate-x-full' : 'translate-x-0'}`}
              />
              <button
                type="button"
                aria-pressed={billingCycle === 'yearly'}
                onClick={() => setBillingCycle('yearly')}
                className={`relative z-10 inline-flex h-full min-w-0 flex-1 items-center justify-center rounded-full text-center transition-colors duration-300 hover:cursor-pointer ${billingCycle === 'yearly' ? 'text-white' : 'text-white/80'}`}
              >
                <span className="inline-flex items-center justify-center gap-1 whitespace-nowrap">
                  <span className="text-xl font-bold leading-[34px]">Yearly</span>
                  <span className="text-base font-xs leading-5">Save 20%</span>
                </span>
              </button>
              <button
                type="button"
                aria-pressed={billingCycle === 'half-yearly'}
                onClick={() => setBillingCycle('half-yearly')}
                className={`relative z-10 inline-flex h-full min-w-0 flex-1 items-center justify-center rounded-full px-2 text-center font-semibold transition-colors duration-300 sm:px-4 sm:text-lg hover:cursor-pointer ${billingCycle === 'half-yearly' ? 'text-white' : 'text-white/80'}`}
              >
                <span className="font-bold text-xl" style={{ fontWeight: 700 }}>Half Yearly</span>
            </button>
            </div>
          </header>

          <div className="mt-[60px] grid grid-cols-1 gap-4 sm:grid-cols-2 xl:mt-10 xl:grid-cols-4 xl:gap-[30px]">
            <article className="flex h-full w-full max-w-[377px] justify-self-center flex-col gap-4 rounded-xl border border-[#525252] bg-[#171717] px-4 py-7 lg:min-h-[914px]">
              <h2 className="text-[25px] font-medium">Free</h2>
              <p className="min-h-[56px] text-base leading-7 text-white/80 lg:min-h-[68px] lg:text-xl lg:leading-[34px]">
                For individuals exploring BIM project management.
              </p>
              <div className="flex items-start gap-3 lg:gap-5">
                <span className="text-lg lg:text-2xl">₹</span>
                <span className="text-[76px] font-semibold leading-none tracking-[-0.02em]">0</span>
              </div>
              <p className="text-base uppercase text-[#00A6F4] lg:text-base">Starter</p>
              <p className="text-base lg:text-xl">Free Forever</p>
              <Link to="/" hash="cta" className="flex h-12 mb-4 items-center justify-center rounded-xl border border-white/20 text-base transition hover:bg-white/10 lg:h-[66px] lg:text-xl">
                Get Started Free
              </Link>
              <FeatureList features={freeFeatures} />
            </article>

            {plans.map((plan) => {
              const yearly = billingCycle === 'yearly'
              const price = yearly ? plan.yearlyPrice : plan.halfYearlyPrice
              const total = yearly ? plan.yearlyTotal : plan.halfYearlyTotal

              return (
                <article key={plan.name} className="flex h-full w-full max-w-[377px] justify-self-center flex-col gap-4 rounded-xl border border-[#525252] bg-[#171717] px-4 py-7 lg:min-h-[914px]">
                  <h2 className="text-[25px] font-medium">{plan.name}</h2>
                  <p className="min-h-[56px] text-base leading-7 lg:min-h-[68px] lg:text-xl lg:leading-[34px]">{plan.description}</p>
                  <div className="flex items-start gap-3 lg:gap-5">
                    <span className="text-lg lg:text-2xl">₹</span>
                    <span className="text-6xl font-semibold leading-[83px] tracking-[-0.02em] lg:text-[80px]">{formatPrice(price)}</span>
                  </div>
                  <p className="text-base uppercase text-[#00A6F4] lg:text-base">{plan.tier}</p>
                  <p className="min-h-[56px] text-base leading-7 lg:min-h-[68px] lg:text-xl lg:leading-[34px]">
                    per month, billed every {yearly ? 'year' : '6 months'}: <span className="block">₹{formatPrice(total)}</span>
                  </p>
                  <Link to="/" hash="cta" className="flex h-12 mb-4 items-center justify-center rounded-xl bg-[#00A6F4] px-3 text-center text-base font-semibold transition hover:bg-[#078fc1] lg:h-[66px] lg:text-xl">
                    {plan.buttonLabel}
                  </Link>
                  <FeatureList features={plan.features} />
                </article>
              )
            })}
          </div>
          <aside className="mt-8 flex flex-col gap-4 rounded-xl mt-[60px] border border-white/20 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h2 className="text-[25px] pb-[13px]">Need A Setup For A Large Portfolio?</h2>
              <p className="mt-1 text-xl">Talk to us about teams, projects and assets across several organisations.</p>
            </div>
            <Link to="/" hash="cta" className="inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-white/25 px-4 text-sm transition hover:bg-white/10">
              Talk To Us
            </Link>
          </aside>

          <section className="relative left-1/2 mt-[80px] w-screen -translate-x-1/2 bg-[#171717] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
            <div className="mx-auto max-w-[1600px]">
              <p className="text-base uppercase tracking-wide text-[#00aeef]">Compare Plans</p>
              <h2 className="mt-8 text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[76px]">
                Everything Side By Side.
              </h2>

              <div className="mt-8 overflow-x-auto rounded-2xl border border-white/20">
                <table className="w-full min-w-[760px] table-fixed border-collapse text-base leading-7 lg:text-xl lg:leading-[34px]">
                  <colgroup>
                    <col className="w-[40%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                    <col className="w-[15%]" />
                  </colgroup>
                  <thead className="bg-[#141414]">
                    <tr>
                      <th scope="col" className="px-6 py-4 text-left font-medium text-white lg:py-5">Feature</th>
                      <th scope="col" className="px-4 py-4 text-center font-medium text-white lg:py-5">Free</th>
                      <th scope="col" className="px-4 py-4 text-center font-medium text-white lg:py-5">PIM</th>
                      <th scope="col" className="px-4 py-4 text-center font-medium text-white lg:py-5">AIM</th>
                      <th scope="col" className="bg-[#0b2028] px-4 py-4 text-center font-medium text-[#00aeef] lg:py-5">PIM + AIM</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonRows.map((row) => (
                      <tr key={row.feature} className="border-t border-white/10 bg-[#0a0a0a]">
                        <th scope="row" className="px-6 py-4 text-left font-normal text-white lg:py-5">{row.feature}</th>
                        {row.values.map((value, index) => (
                          <td
                            key={`${row.feature}-${index}`}
                            className={`px-4 py-4 text-center lg:py-5 ${index === 3 ? 'bg-[#09212D]' : ''} ${typeof value === 'boolean' ? (value ? 'text-[#00aeef]' : 'text-white/35') : 'text-white/75'}`}
                          >
                            {typeof value === 'boolean' ? (
                              value ? (
                                <svg className="mx-auto h-4 w-4" viewBox="0 0 20 20" fill="none" aria-label="Included">
                                  <path d="M2.5 10.5 7.2 15 17.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <span aria-label="Not included">–</span>
                              )
                            ) : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="py-16 w-full bg-black text-white">
            <div className="mx-auto w-full max-w-[1600px]">
              <p className="text-base font-normal uppercase text-[#00aeef]">Questions</p>
              <h2 className="mt-6 text-4xl font-bold leading-tight tracking-[0.02em] sm:mt-8 sm:text-5xl lg:text-[76px]">
                Pricing Questions.
              </h2>

              <div className="mt-8 w-full max-w-[1200px] border-t border-white/20 lg:mt-12">
                {pricingFaqs.map((item, index) => {
                  const open = openFaqIndex === index
                  const panelId = `pricing-faq-panel-${index}`
                  const buttonId = `pricing-faq-button-${index}`

                  return (
                    <div key={item.question} className={`border-b ${open ? 'border-white/30' : 'border-white/20'}`}>
                      <h3>
                        <button
                          id={buttonId}
                          type="button"
                          onClick={() => setOpenFaqIndex((current) => (current === index ? null : index))}
                          aria-expanded={open}
                          aria-controls={panelId}
                          className="flex w-full items-center justify-between gap-6 py-5 text-left lg:py-[25px]"
                        >
                          <span className="text-lg font-normal leading-7 sm:text-xl lg:text-2xl">{item.question}</span>
                          <svg
                            viewBox="0 0 24 24"
                            className={`h-6 w-6 shrink-0 transition-colors duration-300 ${open ? 'text-[#00aeef]' : 'text-white'}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            aria-hidden="true"
                          >
                            <line x1="5" y1="12" x2="19" y2="12" />
                            <line x1="12" y1="5" x2="12" y2="19" className={`origin-center transition-all duration-300 ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`} />
                          </svg>
                        </button>
                      </h3>
                      <div
                        id={panelId}
                        role="region"
                        aria-labelledby={buttonId}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <div className="overflow-hidden">
                          <p className="max-w-[1000px] pb-6 pr-2 text-base leading-[1.7] text-white/90 sm:pr-10 lg:pb-5 lg:text-xl lg:leading-[34px]">
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
        </div>
      </main>
      <section
      id="cta"
      className="w-full bg-[linear-gradient(90deg,#00BCFF_0%,#00A6F4_25%,#0084D1_50%,#00598A_75%,#052F4A_100%)] px-5 py-20 text-center text-white sm:px-8 lg:px-12"
    >
      <div className="mx-auto flex w-full max-w-[900px] flex-col items-center gap-8">
        <p className="text-base uppercase tracking-[0.02em] text-white/90">
          Not Sure Which Plan ?
        </p>

        <h2 className="text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-[76px]">
          Book A Demo And We 
          <br />
          Will Help You Choose.
        </h2>

        <p className="max-w-[740px] text-lg leading-relaxed text-white/95 sm:text-xl">
          We will look at your projects and assets and recommend a starting plan.
        </p>

        <button
        type="button"
        onClick={handleBookDemo}
        className="group inline-flex cursor-pointer items-center justify-center gap-0 rounded-[4px] bg-[#fafafa] px-8 py-[18px] text-xl text-[#00a6f4] shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-300 ease-out hover:gap-3 hover:bg-white hover:text-[#00a6f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] active:shadow-none motion-safe:hover:-translate-y-0.5"
      >
        <span className="font-bold text-xl">Book a Demo</span>
        <svg
          viewBox="0 0 24 24"
          className="h-0 w-0 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:h-5 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:h-5 group-focus-visible:w-5 group-focus-visible:translate-x-0 group-focus-visible:opacity-100"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14" />
          <path d="M13 6l6 6-6 6" />
        </svg>
      </button>
      </div>
    </section>
      <Footer />
    </div>
  )
}
