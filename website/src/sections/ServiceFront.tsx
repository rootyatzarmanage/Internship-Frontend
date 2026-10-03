import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  PencilRuler,
  Boxes,
  Users,
  ScanSearch,
  HardHat,
  Building2,
  type LucideIcon,
} from "lucide-react";
import siteImg from "../assets/bento-site.png";
import teamImg from "../assets/bento-team.png";
import buildingImg from "../assets/building-line-hd.png";
import flowChart from "../assets/bim-chart-hd.png";

gsap.registerPlugin(ScrollTrigger);

// (unused in the JSX right now, kept from your original)
export const STEPS: { icon: LucideIcon; label: string }[] = [
  { icon: PencilRuler, label: "Concept & Planning" },
  { icon: Boxes, label: "3D BIM Modeling" },
  { icon: Users, label: "Collaboration & Coordination" },
  { icon: ScanSearch, label: "Clash Detection & Validation" },
  { icon: HardHat, label: "Construction Support" },
  { icon: Building2, label: "Project Delivery & Handover" },
];

// From lg up, sizes inside the bento use cqw (1% of the bento's width),
// so the whole block scales proportionally with its container.
const CARD =
  "bento-card relative overflow-hidden rounded-2xl border border-[#d9d9d9] bg-[#171717] lg:rounded-[2cqw]";

export default function AboutFirst() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const bentoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !bentoRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // matches the xl breakpoint (1280px) where the layout becomes side-by-side
    const isStacked = window.matchMedia("(max-width: 1279px)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current!.children,
        { x: isStacked ? -40 : -100, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: "power3.out",
        }
      );

      gsap.fromTo(
        ".bento-card",
        {
          x: isStacked ? 0 : 80,
          y: isStacked ? 50 : 80,
          scale: 0.94,
          opacity: 0,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 1,
          stagger: 0.12,
          delay: isStacked ? 0 : 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: bentoRef.current,
            start: "top 85%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[calc(100svh-4rem)] flex-col gap-10 overflow-hidden bg-[#171717] px-5 py-10 text-white sm:gap-12 sm:px-8 sm:py-14 xl:h-[calc(100vh-7rem)] xl:min-h-[600px] xl:flex-row xl:items-center xl:justify-between xl:gap-12 xl:px-20 xl:py-0"
    >
      {/* text block */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-start xl:min-w-0"
      >
        <h1 className="text-[clamp(32px,8vw,56px)] font-semibold leading-[1.05] tracking-[-0.045em] xl:text-[clamp(52px,4.6vw,76px)]">
          We Set you up,
          <br />
          So your <span className="text-[#0EA5E9]">Team</span> can
          <br />
          Start Building.
        </h1>

        <p className="mt-5 max-w-[34rem] text-[13px] leading-5 text-white/85 sm:text-[15px] sm:leading-6 xl:mt-7 xl:max-w-[min(600px,40vw)] xl:text-[clamp(13.5px,1.05vw,17px)] xl:leading-relaxed">
          From BIM and digital engineering to project management and asset
          delivery, we connect people, processes, and information to help AECO
          teams deliver projects with greater clarity, coordination, and
          control.
        </p>

        <NavLink
          to="#"
          className="mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-md bg-[#0284C7] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0369A1] sm:text-[14px] xl:mt-8"
        >
          Book a Demo <span aria-hidden="true">→</span>
        </NavLink>
      </div>

      {/* bento wrapper:
          - below xl: full width, capped at 720px and centered
          - xl+: 44vw, but never taller than the available section height */}
      <div
        ref={bentoRef}
        className="mx-auto w-full max-w-[720px] [container-type:inline-size] xl:mx-0 xl:w-[min(44vw,calc((100vh_-_9rem)*1.19))] xl:max-w-[900px] xl:shrink-0"
      >
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:aspect-[432/363] lg:grid-cols-[158fr_114fr_133fr] lg:grid-rows-[152fr_76fr_106fr] lg:gap-[3cqw]">
          {/* A: site photo (left, tall) */}
          <div
            className={`${CARD} col-span-2 h-[220px] sm:h-[300px] lg:col-span-1 lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-auto`}
          >
            <img
              src={siteImg}
              alt="Engineer in a hard hat reviewing a 3D building model on a monitor"
              className="h-full w-full object-cover grayscale"
            />
          </div>

          {/* B: building line drawing */}
          <div
            className={`${CARD} h-[170px] sm:h-[220px] lg:col-start-2 lg:row-start-1 lg:h-auto`}
          >
            <img
              src={buildingImg}
              alt="Line drawing of a multi-storey building"
              className="h-full w-full object-contain"
            />
          </div>

          {/* C: text */}
          <div
            className={`${CARD} flex h-[170px] flex-col justify-center px-4 sm:h-[220px] sm:px-6 lg:col-start-2 lg:row-start-2 lg:h-auto lg:px-[3.2cqw]`}
          >
            <p className="text-[11px] tracking-[0.12em] text-white sm:text-[13px] lg:text-[clamp(8px,1.7cqw,15px)]">
              END - TO - END
            </p>
            <p className="mt-2 text-[15px] leading-[1.35] tracking-[0.03em] text-[#0EA5E9] sm:text-[18px] lg:mt-[1.2cqw] lg:text-[clamp(10px,2.4cqw,22px)]">
              DIGITAL PROJECT SUPPORT
            </p>
          </div>

          <div
            className={`${CARD} col-span-2 flex items-center px-3 py-4 sm:px-5 sm:py-5 lg:col-span-2 lg:col-start-1 lg:row-start-3 lg:px-[2.5cqw] lg:py-[1.6cqw]`}
          >
            <div className="w-full overflow-x-auto lg:h-full lg:overflow-visible">
              <img
                src={flowChart}
                alt="BIM workflow chart showing the project stages from planning to handover"
                className="h-auto w-full min-w-[460px] object-contain sm:min-w-[560px] lg:h-full lg:min-w-0"
              />
            </div>
          </div>

          <div
            className={`${CARD} col-span-2 h-[240px] sm:h-[320px] lg:col-span-1 lg:col-start-3 lg:row-span-3 lg:row-start-1 lg:h-auto`}
          >
            <img
              src={teamImg}
              alt="Project team gathered around a monitor reviewing building plans"
              className="h-full w-full object-cover grayscale"
            />
          </div>
        </div>
      </div>
    </section>
  );
}