import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, Star } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

type Billing = "monthly" | "yearly";

type Plan = {
  name: string;
  description: string;
  tier: string;
  monthly: number;
  yearly: number;
  cta: string;
  current?: boolean; // the plan the user is on: outlined, disabled button
  popularIn?: Billing[]; // billing modes where the "Most Popular" badge shows
  features: string[];
};

const PLANS: Plan[] = [
  {
    name: "Free",
    description: "For individuals exploring BIM project management.",
    tier: "Starter",
    monthly: 0,
    yearly: 0,
    cta: "current plan",
    current: true,
    features: [
      "1 (shared) Workspace",
      "One PIM Project + AIM Project",
      "Up to 5 members",
      "2 GB Storage",
      "CDE (Common Data Environment)",
      "IFC Viewer",
      "BCF Export",
      "Team Management",
    ],
  },
  {
    name: "PIM",
    description: "For growing BIM teams managing multiple projects.",
    tier: "Professional",
    monthly: 5000,
    yearly: 50000,
    cta: "Upgrade to PIM",
    popularIn: ["yearly"],
    features: [
      "1 (shared) Workspace",
      "Unlimited Projects",
      "Unlimited users",
      "100 GB storage",
      "Everything in Starter",
      "4D Scheduling",
      "Scope Management",
      "Cost Module",
    ],
  },
  {
    name: "AIM",
    description: "Full BIM suite for large-scale construction operations.",
    tier: "Professional",
    monthly: 10000,
    yearly: 100000,
    cta: "Upgrade to AIM",
    features: [
      "1 (shared) Workspace",
      "Unlimited Projects",
      "Unlimited users",
      "100 GB storage",
      "Everything in Professional",
      "5D Cost management",
      "Clash Detection",
      "API Access",
    ],
  },
  {
    name: "PIM + AIM",
    description: "Full BIM suite for large-scale construction operations.",
    tier: "Max",
    monthly: 12500,
    yearly: 125000,
    cta: "Upgrade to PIM + AIM",
    popularIn: ["monthly"],
    features: [
      "1 (shared) Workspace",
      "Unlimited Projects",
      "Unlimited users",
      "100 GB storage",
      "Everything in both starter and professional",
      "5D Cost management",
      "Clash Detection",
      "API Access",
    ],
  },
];

// en-IN grouping gives 1,00,000 / 1,25,000 like your design
const formatPrice = (n: number) => new Intl.NumberFormat("en-IN").format(n);

export default function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const sectionRef = useRef<HTMLElement>(null);
  const firstRender = useRef(true);

  // entrance animation
  useEffect(() => {
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        })
        .fromTo(
          ".plans-title",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 }
        )
        .fromTo(
          ".plans-toggle",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6 },
          "-=0.5"
        )
        .fromTo(
          ".plan-card",
          { y: 48, opacity: 0, scale: 0.96 },
          { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1 },
          "-=0.3"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // small price animation each time the toggle changes
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (!sectionRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".price-anim",
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [billing]);

  const yearly = billing === "yearly";

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#171717] px-5 py-14 text-white sm:px-8 sm:py-20 xl:px-[4vw]"
    >
      <div className="mx-auto max-w-[1400px]">
        <h2 className="plans-title text-center text-[clamp(34px,5vw,56px)] font-semibold leading-[1.05] tracking-[-0.045em]">
          We Offer You
        </h2>

        {/* billing toggle */}
        <div className="plans-toggle mt-6 flex justify-center sm:mt-8">
          <div
            role="group"
            aria-label="Billing period"
            className="relative grid w-[260px] grid-cols-2 rounded-lg border border-white/30 p-[3px] text-[12px] sm:w-[300px] sm:text-[13px]"
          >
            {/* sliding pill */}
            <span
              aria-hidden="true"
              className={`absolute inset-y-[3px] left-[3px] w-[calc(50%-3px)] rounded-md bg-white transition-transform duration-300 ease-out ${
                yearly ? "translate-x-full" : "translate-x-0"
              }`}
            />
            <button
              type="button"
              aria-pressed={!yearly}
              onClick={() => setBilling("monthly")}
              className={`relative z-10 cursor-pointer rounded-md py-2 font-medium transition-colors ${
                !yearly ? "text-[#171717]" : "text-white/70 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              aria-pressed={yearly}
              onClick={() => setBilling("yearly")}
              className={`relative z-10 cursor-pointer rounded-md py-2 font-medium transition-colors ${
                yearly ? "text-[#171717]" : "text-white/70 hover:text-white"
              }`}
            >
              Yearly{" "}
              <span
                className={yearly ? "text-green-600" : "text-green-400"}
              >
                (save 20%)
              </span>
            </button>
          </div>
        </div>

        {/* plan cards */}
        <div className="mt-12 grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-[1.4vw]">
          {PLANS.map((plan) => {
            const price = yearly ? plan.yearly : plan.monthly;
            const popular = plan.popularIn?.includes(billing);
            const bonus = yearly && !plan.current;

            return (
              <article
                key={plan.name}
                className="plan-card relative flex flex-col rounded-2xl bg-[#454545] p-5 sm:p-6"
              >
                {popular && (
                  <span className="absolute top-4 right-4 flex items-center gap-1.5 rounded-full bg-[#B8E6FE] border border-[#00A6F4] px-4 py-2 text-[12px] font-medium text-[#00A6F4]">
                    <Star
                      className="h-5 w-5 fill-[#00A6F4] text-[#00A6F4]"
                      strokeWidth={1.5}
                    />
                    Most Popular
                  </span>
                )}

                <h3 className="text-[22px] font-medium tracking-[-0.01em]">
                  {plan.name}
                </h3>
                <p className="mt-2 text-[12px] leading-[1.5] text-white/80 sm:min-h-[3em]">
                  {plan.description}
                </p>

                <div className="mt-4">
                  <p className="price-anim text-[clamp(34px,3vw,46px)] font-medium leading-none tracking-[-0.03em]">
                    <span className="mr-1 align-[0.55em] text-[0.5em]">₹</span>
                    {formatPrice(price)}
                  </p>
                  <p className="price-anim mt-1 min-h-[1.2em] text-[13px] text-white/80">
                    {plan.tier}
                    {bonus && " + 2 months free on early"}
                  </p>
                </div>

                <button
                  type="button"
                  disabled={plan.current}
                  className={`mt-5 w-full rounded-md py-2 text-[13px] font-medium transition ${
                    plan.current
                      ? "cursor-default border border-white/60 text-white/90"
                      : "cursor-pointer bg-[#0EA5E9] text-white hover:bg-[#0284C7]"
                  }`}
                >
                  {plan.cta}
                </button>

                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-[13px] leading-[1.3] text-white/90"
                    >
                      <span className="mt-[1px] flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#0EA5E9]">
                        <Check
                          className="h-[10px] w-[10px] text-[#171717]"
                          strokeWidth={3.5}
                        />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}