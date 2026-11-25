import { Fragment, useEffect, useState } from 'react';
import { superadminPricingApi } from '@/api/superadmin-pricing';
import { useAuthStore } from '@/stores/auth-store';
import type { PricingConfig } from '@/features/pricing/types';
import { normalizePricing, vis, savAmt, fmtN } from '@/features/pricing/utils';

type BillingCycle = 'yearly' | 'half-yearly'

type Plan = {
  name: string
  description: string
  tier: string
  yearlyPrice: number
  halfYearlyPrice: number
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
    yearlyPrice: 100000,
    halfYearlyPrice: 60000,
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
    yearlyPrice: 100000,
    halfYearlyPrice: 60000,
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
    yearlyPrice: 200000,
    halfYearlyPrice: 120000,
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
  {
    feature: 'Workspace',
    values: ['1 shared', '1 shared', '1 shared', '1 shared'],
  },
  {
    feature: 'Projects',
    values: ['1 PIM + 1 AIM', 'Unlimited', 'Unlimited', 'Unlimited'],
  },
  {
    feature: 'Members',
    values: ['Up to 5', 'Unlimited', 'Unlimited', 'Unlimited'],
  },
  { feature: 'Storage', values: ['2 GB', '100 GB', '100 GB', '100 GB'] },
  {
    feature: 'CDE (Common Data Environment)',
    values: [true, true, true, true],
  },
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
    answer:
      'PIM is project information. It covers managing a project while you build, from defining requirements through design, execution and handover.',
  },
  {
    question: 'What is AIM?',
    answer:
      'PIM is project information, managed while you build. AIM is asset information, managed after you build. In Yatzar Manage the same record moves from PIM to AIM at handover, so nothing is recreated.',
  },
  {
    question: 'How Does Billing Work?',
    answer:
      'Stages and information flows follow ISO 19650. Data moves in the open standards IFC, BCF, IDS and COBie.',
  },
  {
    question: 'What Does The Free Plan Include?',
    answer:
      'Start with one live project. We hold a 30 minute discovery call, run a 30 day pilot on your own project information, convert its handover into a live asset record, and then roll out to more projects.',
  },
  {
    question: 'Which Plan Should We Choose?',
    answer:
      'Yatzar Manage is designed with Indian project, procurement and commercial workflows in mind, including GST, TDS and MSME handling in procurement and payment.',
  },
]

function formatPrice(price: number) {
  return new Intl.NumberFormat('en-IN').format(price)
}

function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className='flex flex-col gap-3 p-2 text-base leading-6 text-white/90 lg:text-base'>
      {features.map((feature) => (
        <li key={feature} className='flex items-start gap-3'>
          <svg
            className='mt-1 h-5 w-6 shrink-0'
            viewBox='0 0 20 20'
            fill='none'
            aria-hidden='true'
          >
            <path
              d='M2.5 10.5 7.2 15 17.5 4.5'
              stroke='#00AEEF'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <span>{feature}</span>
        </li>
      ))}
    </ul>
  )
}

export default function Pricing() {
  const [config, setConfig] = useState<PricingConfig | null>(null)
  const [loadFailed, setLoadFailed] = useState(false)
  const [activeTabId, setActiveTabId] = useState<string>('t2')
  const [reloadKey, setReloadKey] = useState(0)
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const user = useAuthStore((state) => state.user)

  // Single source of truth: always fetch the live config from the backend on
  // every page load, for EVERY visitor (signed-in, anonymous or incognito).
  // No localStorage cache and no compiled-in default — static content must
  // never render, so all users always see the same, latest DB content.
  useEffect(() => {
    let cancelled = false
    superadminPricingApi
      .getPublicPricing()
      .then((data) => {
        if (cancelled) return
        if (data && data.plans && data.plans.length > 0) {
          const normalized = normalizePricing(data)
          setConfig(normalized)
          const yearly = normalized.tabs.find(
            (t) =>
              t.label.toLowerCase().includes('yearly') &&
              !t.label.toLowerCase().includes('half')
          )
          const chosen =
            (normalized.active &&
            normalized.tabs.some((t) => t.id === normalized.active)
              ? normalized.active
              : undefined) ||
            yearly?.id ||
            normalized.tabs[0]?.id ||
            't2'
          setActiveTabId(chosen)
        } else {
          setLoadFailed(true)
        }
      })
      .catch(() => {
        if (!cancelled) setLoadFailed(true)
      })
    return () => {
      cancelled = true
    }
  }, [reloadKey])

  // Nothing static to show while loading or on failure — only a loading
  // state and an error + retry path, never old/default pricing content.
  if (!config) {
    if (loadFailed) {
      return (
        <div className='tpl-site flex min-h-[70vh] flex-col items-center justify-center gap-4 bg-black px-5 text-center text-white'>
          <p className='text-lg font-semibold'>
            Unable to load pricing right now.
          </p>
          <p className='text-sm text-neutral-400'>
            Please check your connection and try again.
          </p>
          <button
            type='button'
            onClick={() => {
              setLoadFailed(false)
              setReloadKey((k) => k + 1)
            }}
            className='cursor-pointer rounded-lg bg-[#00A6F4] px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-[#0ea5e9]'
          >
            Retry
          </button>
        </div>
      )
    }
    return (
      <div className='tpl-site flex min-h-[70vh] items-center justify-center bg-black px-5 text-center text-white'>
        <p className='animate-pulse text-sm tracking-wide text-neutral-400'>
          Loading pricing…
        </p>
      </div>
    )
  }

  const tabs = config.tabs && config.tabs.length > 0 ? config.tabs : [
    { id: 't1', label: 'Half-yearly', period: '/ 6 months', badge: '' },
    { id: 't2', label: 'Yearly', period: '/ year', badge: 'Save 16.7%' },
  ]
  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0]
  const isYearly = activeTab.label.toLowerCase().includes('yearly') && !activeTab.label.toLowerCase().includes('half')

  const halfYearlyTab =
    tabs.find((t) => t.label.toLowerCase().includes('half')) || tabs[0]
  const yearlyTab = tabs.find((t) => t.label.toLowerCase().includes('yearly') && !t.label.toLowerCase().includes('half')) || tabs[1] || tabs[0]

  const choosePimPlan = () => {
    const destination = 'workspace-admin/billing/upgrade?type=pim'
    if (user && user.exp * 1000 > Date.now()) {
      window.location.assign(destination)
      return
    }
    window.location.assign('/sign-in')
  }

  const curSymbol = config.cur || '₹'
  const allPlans = config.plans || []
  const visiblePlans = allPlans.filter((p) => vis(activeTab, p))
  const comparisonPlans = allPlans
  const compareCategories = config.compareCategories || []

  return (
    <div className='tpl-site min-h-screen bg-black text-white'>
      <main
        id='pricing'
        className='px-5 pt-10 pb-0 sm:px-8 sm:pt-14 lg:px-12 lg:pt-[72px] 2xl:px-0'
      >
        <div className='mx-auto max-w-[1400px]'>
          <header className='mx-auto text-center'>
            <p className='font-regular text-base tracking-wide text-[#00A6F4] uppercase'>
              Yatzar Manage pricing
            </p>
            <h1 className='pricing-page-title mt-6 text-3xl leading-[1.08] font-medium tracking-tight min-[380px]:text-4xl sm:text-5xl lg:text-[56px]'>
              One platform for the whole asset lifecycle
            </h1>
            <p className='mt-4 text-base sm:mt-5 sm:text-base'>
              Manage project information while you build and asset information
              after you build, from brief to renewal.
            </p>

            {tabs && tabs.length > 1 && (
              <div
                className='mx-auto mt-8 mb-8 flex w-max max-w-full items-center justify-center gap-1 rounded-lg border border-[#333333] bg-[#1a1a1a] p-1'
                aria-label='Billing cycle'
              >
                {tabs.map((tab) => {
                  const isTabActive = tab.id === activeTab.id
                  return (
                    <button
                      key={tab.id}
                      type='button'
                      aria-pressed={isTabActive}
                      onClick={() => setActiveTabId(tab.id)}
                      className={`flex cursor-pointer items-center gap-1.5 rounded-md px-4 py-2 text-xs font-medium transition sm:text-sm ${
                        isTabActive
                          ? 'bg-white font-semibold text-black shadow-xs'
                          : 'text-neutral-300 hover:text-white'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {tab.badge && (
                        <span className='font-medium text-emerald-500'>
                          ({tab.badge})
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </header>

          <div className='mx-auto mt-10 grid max-w-[1400px] grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4'>
            {visiblePlans.map((plan) => {
              const isFree = plan.name.toLowerCase() === 'free' || plan.current
              const planPriceObj = plan.prices?.[activeTab.id] || {
                p: isFree ? '0' : '',
                r: '',
                n: '',
              }
              const sv = savAmt(planPriceObj)
              const priceStr = planPriceObj.p || (isFree ? '0' : '')
              const periodText = isFree
                ? '/ forever'
                : activeTab.period || (isYearly ? '/ year' : '/ 6 months')
              const tierText =
                plan.tier || (isFree ? 'Starter' : 'Professional')

              const activeFeats = (config.features || [])
                .filter((f) => Boolean(plan.feat && plan.feat[f.id]))
                .map((f) => f.text)

              const featuresToRender =
                activeFeats.length > 0
                  ? activeFeats
                  : isFree
                    ? freeFeatures
                    : []

              const buttonLabel = isFree
                ? plan.btn && plan.btn !== 'Get Started Free'
                  ? plan.btn
                  : 'current plan'
                : plan.btn && !plan.btn.startsWith('Choose')
                  ? plan.btn
                  : `Upgrade to ${plan.name}`

              return (
                <article
                  key={plan.id || plan.name}
                  className='relative flex flex-col justify-between rounded-2xl border border-white/5 bg-[#2a2b2f] p-6 text-white shadow-xl transition-all duration-200'
                >
                  {plan.popular && (
                    <div className='absolute top-4 right-4 flex items-center gap-1 rounded-full border border-[#00A6F4]/40 bg-[#B8E6FE] px-3 py-1 text-[11px] font-semibold text-[#008cd2]'>
                      ★ Most Popular
                    </div>
                  )}

                  <div>
                    <h2 className='text-xl font-bold tracking-tight text-white'>
                      {plan.name}
                    </h2>
                    <p className='mt-1 min-h-[34px] text-xs leading-relaxed text-neutral-400'>
                      {plan.desc}
                    </p>

                    <div className='mt-5 mb-5'>
                      <div
                        className={`mb-1.5 flex h-5 items-center gap-2 ${
                          sv > 0 ? '' : 'invisible'
                        }`}
                      >
                        <s className='text-xs text-neutral-400 line-through opacity-75'>
                          {curSymbol}
                          {planPriceObj.r}
                        </s>
                        <span className='rounded-full bg-emerald-500/20 px-2 py-0.5 text-[11px] font-semibold text-emerald-400'>
                          Save {curSymbol}
                          {fmtN(sv)}
                        </span>
                      </div>
                      <div className='flex items-baseline gap-1'>
                        <span className='text-xl font-medium text-neutral-300'>
                          {curSymbol}
                        </span>
                        <span className='text-3xl font-bold tracking-tight text-white sm:text-4xl'>
                          {priceStr}
                        </span>
                        <span className='ml-1 text-xs font-normal text-neutral-400'>
                          {periodText}
                        </span>
                      </div>
                      <div className='mt-1 text-xs font-medium text-neutral-400'>
                        {tierText}
                      </div>
                    </div>

                    {isFree ? (
                      <button
                        type='button'
                        disabled
                        className='w-full cursor-default rounded-lg border border-neutral-600 bg-transparent px-4 py-2.5 text-center text-xs font-semibold text-neutral-200'
                      >
                        {buttonLabel}
                      </button>
                    ) : plan.name === 'PIM' ? (
                      <button
                        type='button'
                        onClick={choosePimPlan}
                        className='w-full cursor-pointer rounded-lg bg-[#00A6F4] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-xs transition hover:bg-[#0095dc]'
                      >
                        {buttonLabel}
                      </button>
                    ) : (
                      <button
                        type='button'
                        onClick={() =>
                          window.location.assign(
                            'workspace-admin/billing/upgrade?type=pim'
                          )
                        }
                        className='w-full cursor-pointer rounded-lg bg-[#00A6F4] px-4 py-2.5 text-center text-xs font-semibold text-white shadow-xs transition hover:bg-[#0095dc]'
                      >
                        {buttonLabel}
                      </button>
                    )}

                    <ul className='mt-6 flex flex-col gap-2.5'>
                      {featuresToRender.map((feature) => (
                        <li
                          key={feature}
                          className='flex items-center gap-2.5 text-xs leading-snug text-neutral-200'
                        >
                          <span className='flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#00A6F4] text-white'>
                            <svg
                              className='h-2.5 w-2.5 stroke-current'
                              viewBox='0 0 12 12'
                              fill='none'
                            >
                              <path
                                d='M2.5 6.5L4.8 9L9.5 3.5'
                                strokeWidth='2.2'
                                strokeLinecap='round'
                                strokeLinejoin='round'
                              />
                            </svg>
                          </span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              )
            })}
          </div>

          <aside className='mt-12 flex flex-col gap-4 rounded-xl border border-white/20 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6'>
            <div>
              <h2 className='pb-2 text-xl'>Need more than 100 GB?</h2>
              <p className='text-base text-white/80'>
                Add storage in 500 GB blocks to any paid plan. Storage add-ons
                aren't available on the Free plan.
              </p>
            </div>
            <h2>
              ₹18000 per 500 GB / 6 months &nbsp;&nbsp;&nbsp;&nbsp;
              <a
                href='/contact'
                className='inline-flex h-10 shrink-0 items-center justify-center rounded-md border border-white/25 px-4 text-sm transition hover:bg-white/10'
              >
                Add Storage
              </a>
            </h2>
          </aside>

          <section className='relative left-1/2 mt-12 w-screen -translate-x-1/2 bg-[#171717] px-5 py-12 sm:px-8 lg:px-12'>
            <div className='mx-auto max-w-[1208px]'>
              <h4 className='mt-4 text-center text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-[30px]'>
                Compare plans
              </h4>

              <div className='mt-8 overflow-x-auto rounded-2xl border border-white/20'>
                <table className='w-full min-w-[760px] table-fixed border-collapse text-base leading-6 lg:text-base lg:leading-6'>
                  <colgroup>
                    <col className='w-[40%]' />
                    {comparisonPlans.map((p) => (
                      <col
                        key={p.id}
                        style={{
                          width: `${60 / (comparisonPlans.length || 1)}%`,
                        }}
                      />
                    ))}
                  </colgroup>
                  <thead className='bg-[#141414]'>
                    <tr>
                      <th
                        scope='col'
                        className='px-6 py-3.5 text-left font-medium text-white'
                      >
                        Feature
                      </th>
                      {comparisonPlans.map((p, idx) => {
                        const isHighlighted =
                          idx === comparisonPlans.length - 1 || p.popular
                        return (
                          <th
                            key={p.id}
                            scope='col'
                            className={`px-4 py-3.5 text-center font-medium ${
                              isHighlighted
                                ? 'bg-[#0b2028] text-[#00aeef]'
                                : 'text-white'
                            }`}
                          >
                            {p.name}
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {compareCategories.map((cat) => (
                      <Fragment key={cat.id}>
                        <tr className='border-t border-white/10 bg-[#0a0a0a]'>
                          <th
                            className='px-6 py-3.5 text-left font-medium text-[#00AFEF]'
                            colSpan={comparisonPlans.length + 1}
                          >
                            {cat.name}
                          </th>
                        </tr>
                        {cat.rows.map((row) => (
                          <tr
                            key={row.id}
                            className='border-t border-white/5 transition-colors duration-150 hover:bg-white/[0.035]'
                          >
                            <th
                              scope='row'
                              className='px-6 py-3.5 text-left text-sm font-medium text-neutral-200'
                            >
                              {row.name}
                            </th>
                            {comparisonPlans.map((p, idx) => {
                              const isHighlighted =
                                idx === comparisonPlans.length - 1 || p.popular
                              const val = String(row.values?.[p.id] ?? '').trim()
                              const isCheck =
                                val === '✓' || val.toLowerCase() === 'true' || val.toLowerCase() === 'yes'
                              const isDash =
                                val === '–' || val === '-' || val.toLowerCase() === 'false' || val === ''
                              const isUnlimited =
                                val.toLowerCase().includes('unlimited')

                              return (
                                <td
                                  key={p.id}
                                  className={`px-4 py-3.5 text-center ${
                                    isHighlighted
                                      ? 'border-x border-[#00aeef]/20 bg-[#00aeef]/[0.03]'
                                      : ''
                                  }`}
                                >
                                  {isCheck ? (
                                    <div className='mx-auto flex h-6 w-6 items-center justify-center rounded-full bg-[#00aeef]/15 text-[#00aeef] shadow-[0_0_10px_rgba(0,174,239,0.25)]'>
                                      <svg
                                        className='h-3.5 w-3.5'
                                        viewBox='0 0 20 20'
                                        fill='none'
                                        aria-label='Included'
                                      >
                                        <path
                                          d='M3.5 10.5 7.8 14.8 16.5 5.5'
                                          stroke='currentColor'
                                          strokeWidth='2'
                                          strokeLinecap='round'
                                          strokeLinejoin='round'
                                        />
                                      </svg>
                                    </div>
                                  ) : isDash ? (
                                    <span
                                      className='select-none text-base font-light text-white/25'
                                      aria-label='Not included'
                                    >
                                      –
                                    </span>
                                  ) : isUnlimited ? (
                                    <span className='inline-block rounded-md border border-[#00aeef]/30 bg-[#00aeef]/10 px-2.5 py-0.5 text-xs font-semibold text-[#00aeef] shadow-xs'>
                                      {val}
                                    </span>
                                  ) : (
                                    <span className='text-xs font-medium text-neutral-300'>
                                      {val}
                                    </span>
                                  )}
                                </td>
                              )
                            })}
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className='w-full bg-black py-12 text-white'>
            <div className='mx-auto w-full max-w-[1208px]'>
              <p className='text-base font-normal text-[#00aeef] uppercase'>
                Questions
              </p>
              <h2 className='mt-4 text-4xl leading-tight font-bold tracking-[0.02em] sm:text-5xl lg:text-[56px]'>
                Pricing Questions.
              </h2>

              <div className='mt-8 w-full border-t border-white/20'>
                {pricingFaqs.map((item, index) => {
                  const open = openFaqIndex === index
                  const panelId = `pricing-faq-panel-${index}`
                  const buttonId = `pricing-faq-button-${index}`

                  return (
                    <div
                      key={item.question}
                      className={`border-b ${open ? 'border-white/30' : 'border-white/20'}`}
                    >
                      <h3>
                        <button
                          id={buttonId}
                          type='button'
                          onClick={() =>
                            setOpenFaqIndex((current) =>
                              current === index ? null : index
                            )
                          }
                          aria-expanded={open}
                          aria-controls={panelId}
                          className='flex w-full items-center justify-between gap-6 py-5 text-left lg:py-5'
                        >
                          <span className='text-lg leading-7 font-normal sm:text-xl lg:text-xl'>
                            {item.question}
                          </span>
                          <svg
                            viewBox='0 0 24 24'
                            className={`h-6 w-6 shrink-0 transition-colors duration-300 ${open ? 'text-[#00aeef]' : 'text-white'}`}
                            fill='none'
                            stroke='currentColor'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            aria-hidden='true'
                          >
                            <line x1='5' y1='12' x2='19' y2='12' />
                            <line
                              x1='12'
                              y1='5'
                              x2='12'
                              y2='19'
                              className={`origin-center transition-all duration-300 ${open ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}
                            />
                          </svg>
                        </button>
                      </h3>
                      <div
                        id={panelId}
                        role='region'
                        aria-labelledby={buttonId}
                        className={`grid transition-[grid-template-rows] duration-300 ease-out ${open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                      >
                        <div className='overflow-hidden'>
                          <p className='max-w-[1000px] pr-2 pb-6 text-base leading-[1.7] text-white/90 sm:pr-10 lg:pb-5 lg:text-base lg:leading-7'>
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
        id='cta'
        className='w-full bg-[linear-gradient(90deg,#00BCFF_0%,#00A6F4_25%,#0084D1_50%,#00598A_75%,#052F4A_100%)] px-5 py-20 text-center text-white sm:px-8 lg:px-12'
      >
        <div className='mx-auto flex w-full max-w-[900px] flex-col items-center gap-8'>
          <p className='text-base tracking-[0.02em] text-white/90 uppercase'>
            Not Sure Which Plan ?
          </p>

          <h2 className='text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl lg:text-[76px]'>
            Book A Demo And We
            <br />
            Will Help You Choose.
          </h2>

          <p className='max-w-[740px] text-lg leading-relaxed text-white/95 sm:text-xl'>
            We will look at your projects and assets and recommend a starting
            plan.
          </p>

          <button
            type='button'
            onClick={handleBookDemo}
            className='group inline-flex cursor-pointer items-center justify-center gap-0 rounded-[4px] bg-[#fafafa] px-8 py-[18px] text-xl text-[#00a6f4] shadow-[0_0_0_rgba(0,0,0,0)] transition-all duration-300 ease-out hover:gap-3 hover:bg-white hover:text-[#00a6f4] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white active:scale-[0.97] active:shadow-none motion-safe:hover:-translate-y-0.5'
          >
            <span className='text-xl font-bold'>Book a Demo</span>
            <svg
              viewBox='0 0 24 24'
              className='h-0 w-0 -translate-x-2 opacity-0 transition-all duration-300 ease-out group-hover:h-5 group-hover:w-5 group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:h-5 group-focus-visible:w-5 group-focus-visible:translate-x-0 group-focus-visible:opacity-100'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
              aria-hidden='true'
            >
              <path d='M5 12h14' />
              <path d='M13 6l6 6-6 6' />
            </svg>
          </button>
        </div>
      </section>
    </div>
  )
}
