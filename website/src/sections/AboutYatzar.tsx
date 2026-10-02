import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Layers,
  Users,
  GitBranch,
  ShieldCheck,
  LayoutDashboard,
  ListChecks,
  TriangleAlert,
  Scaling,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

// The whole section is designed at this width. At any other screen width the
// design is scaled uniformly, so every padding and gap keeps its proportion.
const DESIGN_WIDTH = 1920;

type Feature = { icon: LucideIcon; title: string; text: string };

const FEATURES: Feature[] = [
  {
    icon: Layers,
    title: "Single source of truth",
    text: "Keep every model, drawing, and document in one central environment, so your whole team works from the same up-to-date information.",
  },
  {
    icon: Users,
    title: "Real-Time Collaboration",
    text: "Architects, engineers, and contractors can review, comment, and coordinate together, without long email chains or scattered files.",
  },
  {
    icon: GitBranch,
    title: "Version Control & Audit Trail",
    text: "Track every revision, see who changed what and when, and roll back with confidence. Nothing gets lost or overwritten.",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access & Security",
    text: "Give each stakeholder the right level of access, with secure data handling that protects sensitive project information.",
  },
  {
    icon: LayoutDashboard,
    title: "Clear Project Visibility",
    text: "Get live dashboards for progress, approvals, and pending tasks, so managers can spot delays early and decide faster.",
  },
  {
    icon: ListChecks,
    title: "Standards-Ready Workflows",
    text: "Structured approval and review workflows help your team stay aligned with industry BIM standards like ISO 19650.",
  },
  {
    icon: TriangleAlert,
    title: "Faster Issue Resolution",
    text: "Raise, assign, and track issues and clashes directly on the project, so problems get fixed before they reach the site.",
  },
  {
    icon: Scaling,
    title: "Built to Scale",
    text: "Whether it's a single building or a large multi-site portfolio, Yatzar grows with your projects and your team.",
  },
];

const STANDARDS = ["ISO19650", "OPENBIM", "IFC4.3", "ISO16739"];

export default function WhyYatzar() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // desktop (>= 1024px): scale the 1920px design frame to the section width
  // below that: normal responsive flow, cards stacked in one column
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    if (!section || !frame) return;

    const desktop = window.matchMedia("(min-width: 1024px)");

    const fit = () => {
      if (desktop.matches) {
        const scale = section.clientWidth / DESIGN_WIDTH;
        frame.style.transform = `scale(${scale})`;
        section.style.height = `${frame.offsetHeight * scale}px`;
      } else {
        frame.style.transform = "";
        section.style.height = "";
      }
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(section);
    const onChange = () => {
      fit();
      ScrollTrigger.refresh();
    };
    desktop.addEventListener("change", onChange);
    return () => {
      ro.disconnect();
      desktop.removeEventListener("change", onChange);
    };
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;

    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        });

        tl.fromTo(
          ".why-title-inner",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9 }
        )
          .fromTo(
            ".why-intro",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".why-card",
            { y: 48, opacity: 0, scale: 0.96 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              stagger: { each: 0.08, grid: "auto", from: "start" },
            },
            "-=0.4"
          )
          .fromTo(
            ".why-icon",
            { rotate: -90, scale: 0.4, opacity: 0 },
            {
              rotate: 0,
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: "back.out(2)",
              stagger: 0.08,
            },
            "<0.15"
          )
          .fromTo(
            ".why-marquee",
            { opacity: 0 },
            { opacity: 1, duration: 0.8 },
            "-=0.4"
          );

        gsap.to(".why-track", {
          xPercent: -50,
          duration: 28,
          ease: "none",
          repeat: -1,
        });
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#171717] text-white"
    >
      {/* fixed 1920px design frame, scaled by the effect above */}
      <div
        ref={frameRef}
        className="w-full origin-top-left pt-10 lg:w-[1920px] lg:pt-[36px]"
        style={{ transformOrigin: "top left" }}
      >
        {/* heading */}
        <div className="flex flex-col items-center text-center">
          <h2 className="overflow-hidden px-5 pb-[4px] text-[36px] font-semibold uppercase leading-[40px] tracking-[-1.5px] sm:text-[48px] sm:leading-[52px] lg:px-0 lg:text-[72px] lg:leading-[72px] lg:tracking-[-3px]">
            <span className="why-title-inner block">Why Yatzar ?</span>
          </h2>
          <p className="why-intro mt-4 w-full max-w-[560px] px-5 text-[13px] leading-[20px] text-white/85 lg:mt-[16px] lg:w-[920px] lg:max-w-none lg:px-0 lg:text-[14px] lg:leading-[22px]">
            Yatzar Manage is a unified project management platform that
            centralizes tasks, teams, documents, and approvals, giving BIM teams
            clear visibility, streamlined workflows, and faster decisions.
          </p>
        </div>

        {/* cards: 4 x 410px, 40px gaps, 80px side margin */}
        <div className="mx-auto mt-10 grid w-full max-w-[560px] grid-cols-1 gap-4 px-5 lg:mt-[116px] lg:max-w-none lg:grid-cols-[repeat(4,410px)] lg:gap-[40px] lg:px-[80px]">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="why-card w-full rounded-md bg-[#3f3f3f] px-6 py-6 transition-colors duration-300 hover:bg-[#4a4a4a] lg:h-[181.49px] lg:w-[410px] lg:px-[32px] lg:pb-[30px] lg:pt-[39px]"
            >
              <div className="mb-4 flex items-center gap-4 lg:mb-[25px] lg:h-[28px] lg:gap-[22px]">
                <Icon
                  className="why-icon h-6 w-6 shrink-0 text-white/80 lg:h-7 lg:w-7"
                  strokeWidth={1.5}
                  aria-hidden="true"
                />
                <h3 className="text-[18px] font-medium leading-[26px] text-white lg:text-[20px] lg:leading-[28px]">
                  {title}
                </h3>
              </div>
              <p className="text-[14px] leading-[21px] text-white/70 lg:text-[16px] lg:leading-[20px]">
                {text}
              </p>
            </article>
          ))}
        </div>

        {/* standards ticker */}
        <div
          className="why-marquee mt-12 overflow-hidden pb-8 lg:mt-[108px] lg:pb-[38px]"
          aria-label="Supported standards: ISO 19650, OpenBIM, IFC 4.3, ISO 16739"
        >
          <div className="why-track flex w-max will-change-transform">
            {[0, 1].map((half) => (
              <div key={half} className="flex shrink-0" aria-hidden={half === 1}>
                {Array.from({ length: 3 }).flatMap((_, rep) =>
                  STANDARDS.map((label) => (
                    <span
                      key={`${rep}-${label}`}
                      className="px-5 text-[18px] font-semibold leading-[26px] tracking-[0.5px] text-white/40 lg:px-[28px] lg:text-[24px] lg:leading-[32px]"
                    >
                      {label}
                    </span>
                  ))
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}