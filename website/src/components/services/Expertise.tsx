import { useEffect, useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Compass,
  GitBranch,
  ChartGantt,
  Database,
  Radio,
  Settings,
  Ruler,
  GraduationCap,
  Check,
  type LucideIcon,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1920;

type Service = {
  icon: LucideIcon;
  number: string;
  title: string;
  description: string;
  benefits: string[];
  tag: string;
};

const SERVICES: Service[] = [
  {
    icon: Compass,
    number: "01",
    title: "BIM Consulting",
    description:
      "Build a BIM strategy that fits your organization, projects, and delivery goals.",
    benefits: [
      "BIM implementation guidance",
      "Workflow optimization",
      "BIM standards & strategy",
      "OpenBIM adoption",
      "Better project coordination",
    ],
    tag: "Strategy",
  },
  {
    icon: GitBranch,
    number: "02",
    title: "Digital Engineering",
    description:
      "Turn complex engineering requirements into coordinated, information-rich digital solutions.",
    benefits: [
      "Multidisciplinary coordination",
      "Digital modelling",
      "Engineering documentation",
      "Clash reduction",
      "Data-rich project information",
    ],
    tag: "Engineering",
  },
  {
    icon: ChartGantt,
    number: "03",
    title: "Digital Project Management",
    description:
      "Connect teams, information, resources, and project controls for more predictable delivery.",
    benefits: [
      "Project planning",
      "Scheduling",
      "Resource management",
      "Cost tracking",
      "Progress monitoring",
    ],
    tag: "Delivery",
  },
  {
    icon: Database,
    number: "04",
    title: "Digital Assets Management",
    description:
      "Organize, manage, and protect digital assets so project information remains useful beyond delivery.",
    benefits: [
      "Asset organization",
      "Version control",
      "Structured information",
      "Secure access",
      "Better information retrieval",
    ],
    tag: "Lifecycle",
  },
  {
    icon: Radio,
    number: "05",
    title: "Integrated Project Delivery",
    description:
      "Bring stakeholders, workflows, and information together around a shared project delivery process.",
    benefits: [
      "Early collaboration",
      "Shared project goals",
      "Reduced coordination gaps",
      "Better decision-making",
      "Integrated workflows",
    ],
    tag: "Collaboration",
  },
  {
    icon: Settings,
    number: "06",
    title: "Manufacturing & Engineering",
    description:
      "Connect engineering intelligence with manufacturing requirements to improve accuracy, coordination, and production readiness.",
    benefits: [
      "Engineering-to-production workflows",
      "Digital modelling",
      "Engineering documentation",
      "Clash reduction",
      "Data-rich project information",
    ],
    tag: "Production",
  },
  {
    icon: Ruler,
    number: "07",
    title: "Design & Engineering",
    description:
      "Develop coordinated design and engineering solutions that balance performance, constructability, and project requirements.",
    benefits: [
      "Architectural design",
      "Engineering coordination",
      "Technical documentation",
      "Cost Constructability",
      "Design optimization",
    ],
    tag: "Design",
  },
  {
    icon: GraduationCap,
    number: "08",
    title: "Professional Training & Certification",
    description:
      "Build industry-ready capability through practical BIM, digital construction, and professional certification programs.",
    benefits: [
      "BIM software skills",
      "OpenBIM workflows",
      "Digital project management",
      "Professional certification",
      "Industry standards",
    ],
    tag: "Capability",
  },
];

export default function WhyYatzar() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

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
          ".why-intro",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7 }
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
            "-=0.3"
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
          );
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
      <div
        ref={frameRef}
        className="w-full origin-top-left pb-12 pt-10 lg:w-[1920px] lg:pb-[100px] lg:pt-[36px]"
        style={{ transformOrigin: "top left" }}
      >
        {/* heading */}
        <div className="flex flex-col items-center text-center">
          <p className="py-4 text-[20px] uppercase">what we do</p>
          <h1 className="text-[clamp(32px,8vw,46px)] font-semibold uppercase leading-[1.05] tracking-[-0.045em] xl:text-[clamp(52px,4.6vw,76px)]">
            one connected workflow.
            <br />
            <span className="text-[#0EA5E9]">Eight</span> areas of expertise
          </h1>
          <p className="why-intro mt-4 w-full max-w-[560px] px-5 text-[13px] leading-[20px] text-white/85 lg:mt-[16px] lg:w-[920px] lg:max-w-none lg:px-0 lg:text-[14px] lg:leading-[22px]">
            Yatzar Manage is a unified project management platform that
            centralizes tasks, teams, documents, and approvals, giving BIM teams
            clear visibility, streamlined workflows, and faster decisions.
          </p>
        </div>

        {/* service cards */}
        <div className="mt-10 grid grid-cols-1 gap-4 px-5 sm:grid-cols-2 sm:gap-4 sm:px-8 lg:mt-[56px] lg:grid-cols-4 lg:gap-[32px] lg:px-[160px]">
        {SERVICES.map(
            ({ icon: Icon, number, title, description, benefits, tag }) => (
            <article
                key={number}
                className="why-card flex flex-col rounded-xl border border-white/5 bg-[#3a3a3a] p-4 sm:p-5 lg:rounded-[16px] lg:p-[22px]"
            >
                <div className="why-icon flex h-9 w-9 items-center justify-center rounded-lg border border-white/70 lg:h-[36px] lg:w-[36px] lg:rounded-[8px]">
                <Icon
                    className="h-4 w-4 text-white/90 lg:h-[17px] lg:w-[17px]"
                    strokeWidth={1.5}
                />
                </div>

                <h2 className="mt-4 text-[18px] font-medium leading-[1.2] tracking-[-0.01em] sm:text-[20px] lg:mt-[18px] lg:min-h-[2.4em] lg:text-[22px]">
                {number}. {title}
                </h2>

                <p className="mt-2 text-[12px] leading-[1.5] text-white/80 lg:mt-[8px] lg:min-h-[4.5em] lg:text-[12.5px]">
                {description}
                </p>

                <p className="mt-4 text-[14px] text-white lg:mt-[14px] lg:text-[16px]">
                Benefits:
                </p>
                <ul className="mt-2 flex flex-col gap-1.5 lg:mt-[10px] lg:gap-[8px]">
                {benefits.map((b) => (
                    <li
                    key={b}
                    className="flex items-start gap-2.5 text-[13px] leading-[1.3] text-white/90 lg:gap-[12px] lg:text-[14px]"
                    >
                    <Check
                        className="mt-[2px] h-[14px] w-[14px] shrink-0 text-[#0EA5E9] lg:h-[15px] lg:w-[15px]"
                        strokeWidth={2}
                    />
                    {b}
                    </li>
                ))}
                </ul>

                {/* mt-auto pins the tag to the bottom; pt guarantees a gap above it */}
                <div className="mt-auto pt-5 lg:pt-[22px]">
                <span className="inline-block rounded border border-white/60 px-2 py-[3px] text-[10px] font-medium uppercase tracking-wide text-white/90 lg:px-[8px] lg:py-[3px] lg:text-[11px]">
                    {tag}
                </span>
                </div>
            </article>
            )
        )}
        </div>
      </div>
    </section>
  );
}