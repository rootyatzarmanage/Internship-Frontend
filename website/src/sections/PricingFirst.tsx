import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import FlowAnimation from "./FlowAnimation";

export default function PricingFirst() {
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
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
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] w-full flex-col justify-center gap-10 overflow-hidden bg-[#171717] px-5 py-10 text-white sm:gap-12 sm:px-8 sm:py-14 xl:h-[calc(100vh-7rem)] xl:min-h-[560px] xl:flex-row xl:items-center xl:justify-between xl:gap-10 xl:px-[4vw] xl:py-0">
      {/* text block */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-start xl:max-w-[40%] xl:shrink-0"
      >
        <h1 className="text-[clamp(36px,9vw,56px)] font-semibold leading-[1.05] tracking-[-0.045em] xl:text-[clamp(48px,4.6vw,80px)]">
          Simple Plans
          <br />
          That <span className="text-[#0EA5E9]">Growth</span> with
          <br />
          your Project.
        </h1>

        <p className="mt-5 max-w-[34rem] text-[13px] leading-5 text-white/85 sm:text-[15px] sm:leading-6 xl:mt-6 xl:max-w-[min(440px,36vw)] xl:text-[clamp(13px,0.95vw,16px)] xl:leading-relaxed">
          From BIM and digital engineering to project management and asset
          delivery, we connect people, processes, and information to help AECO
          teams deliver projects with greater clarity, coordination, and
          control.
        </p>

        <NavLink
          to="/"
          className="mt-6 flex w-fit cursor-pointer items-center gap-2 rounded-md bg-[#0284C7] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0369A1] sm:text-[14px] xl:mt-7"
        >
          Book a Demo <span aria-hidden="true">→</span>
        </NavLink>
      </div>

      {/* flow animation: explicit width at every breakpoint, no overflow rules
          (FlowAnimation handles its own horizontal scroll on phones) */}
      <div className="w-full sm:mx-auto sm:max-w-[820px] xl:mx-0 xl:w-[56vw] xl:max-w-[1100px] xl:shrink-0">
        <FlowAnimation />
      </div>
    </section>
  );
}