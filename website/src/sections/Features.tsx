import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import smallBuilding from "../assets/building-2.png";

gsap.registerPlugin(ScrollTrigger);

const features = [
  { title: "01 .CDE", desc: "ISO 19650-compliant Common Data Environment for structured document and model management across project lifecycles." },
  { title: "02 .IFC VIEWER", desc: "High-performance 3D viewer for IFC models with section planes, measurements, clash detection, and annotation tools." },
  { title: "03 .BIM COLLABORATION", desc: "Real-time collaboration on BIM models with version control, issue tracking, and multi-disciplinary coordination." },
  { title: "04 .QUANTITY TAKEOFF", desc: "Automated quantity extraction from IFC models with custom rules, formulas, and export to cost estimation tools." },
  { title: "05 .SCHEDULING", desc: "BIM scheduling linking model elements to construction timelines with visual progress tracking and milestone management." },
  { title: "06 .COST MANAGEMENT", desc: "BIM cost integration with live quantity links, budget tracking, and automated cost reporting across project phases." },
];

/** Desktop only: row 2 travels 1.3×, row 3 1.77× as far as row 1; all land together. */
const ROW_TRAVEL = [1, 1.3, 1.77];

/** Desktop timeline = one viewport-height of scroll (Figma: 1080px). */
const FIGMA_H = 1080;
const at = (px: number) => 1 - px / FIGMA_H;

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLImageElement>(null);

  useLayoutEffect(() => {
    if (
      !sectionRef.current ||
      !textRef.current ||
      !gridRef.current ||
      !buildingRef.current
    )
      return;

    const section = sectionRef.current;
    const text = textRef.current;
    const items = Array.from(gridRef.current.children) as HTMLElement[];
    const building = buildingRef.current;

    const mm = gsap.matchMedia();

    // ---------- LARGE SCREENS (>= 1280px): scrubbed Figma animation ----------
    mm.add("(min-width: 1280px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        },
      });

      // features: horizontal slide only
      items.forEach((el, i) => {
        const travel = ROW_TRAVEL[Math.floor(i / 2)];
        tl.fromTo(el, { x: () => travel * window.innerHeight }, { x: 0, duration: 1 }, 0);
      });

      // building: grows from bottom-left, then fades in
      gsap.set(building, { transformOrigin: "0% 100%" });
      tl.fromTo(
        building,
        { scale: 0.26 },
        { scale: 1, duration: 220 / FIGMA_H, ease: (p: number) => 1 - Math.pow(1 - p, 0.6) },
        at(220)
      );
      tl.fromTo(
        building,
        { opacity: 0 },
        { opacity: 1, duration: 110 / FIGMA_H, ease: "power4.in" },
        at(130)
      );
    });

    // ---------- TABLET / MOBILE (< 1280px): simple reveal ----------
    mm.add("(max-width: 1279px)", () => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        text.children,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.12 },
        0
      );
      tl.fromTo(
        items,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, stagger: 0.1 },
        0.2
      );
      tl.fromTo(
        building,
        { scale: 0.6, opacity: 0, transformOrigin: "50% 100%" },
        { scale: 1, opacity: 1, duration: 1 },
        0.5
      );
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col overflow-hidden bg-[#171717] px-5 pb-4 pt-12 text-white sm:px-8 xl:block xl:min-h-[max(100vh,56.25vw)] xl:p-0"
    >
      {/* LEFT CONTENT */}
      <div
        ref={textRef}
        className="max-w-[600px] xl:absolute xl:left-[4.1667vw] xl:top-[5.3646vw] xl:z-10 xl:w-[41.6667vw] xl:max-w-none"
      >
        <span className="block text-[13px] font-normal leading-none text-white sm:text-[14px] xl:text-[max(14px,1.3021vw)]">
          PLATFORM
        </span>
        <h2 className="mt-2 text-[38px] font-medium uppercase leading-[1.05] tracking-[-0.05em] sm:text-[52px] md:text-[60px] xl:mt-[0.7031vw] xl:text-[3.3333vw] xl:leading-[1.0938]">
          Everything your team needs
        </h2>
        <p className="mt-3 max-w-[420px] text-[14px] leading-6 text-white/80 md:text-[16px] xl:mt-[0.1302vw] xl:max-w-[21.875vw] xl:text-[max(13px,0.8698vw)] xl:leading-[1.45]">
          From model review to cost control, manage every phase of your BIM workflow.
        </p>
      </div>

      {/* FEATURES */}
      <div
        ref={gridRef}
        className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-8 xl:absolute xl:right-[4.1667vw] xl:top-[15.8646vw] xl:z-10 xl:mt-0 xl:w-[45.3125vw] xl:gap-x-[3.6458vw] xl:gap-y-[3.5469vw]"
      >
        {features.map((f, i) => (
          <div
            key={f.title}
            className={`relative ${i === 3 ? "xl:top-[0.2604vw]" : ""} ${
              i >= 4 ? "xl:mt-[0.5vw]" : ""
            }`}
          >
            <h3 className="text-[20px] font-medium leading-[1.1] sm:text-[22px] xl:text-[max(16px,1.75vw)]">
              {f.title}
            </h3>
            <p className="mt-1.5 text-[13.5px] leading-5 text-white/80 sm:text-[14px] xl:mt-[0.9427vw] xl:text-[max(12px,0.8333vw)] xl:leading-[1.5]">
              {f.desc}
            </p>
          </div>
        ))}
      </div>

      {/* BUILDING IMAGE */}
      <img
        ref={buildingRef}
        src={smallBuilding}
        alt="Wireframe of a building"
        className="-mb-4 mt-2 mx-auto block w-[70%] max-w-[320px] object-contain xl:mb-0 xl:mt-0 xl:absolute xl:bottom-[0.4375vw] xl:left-[0.9896vw] xl:my-0 xl:w-[39.0104vw] xl:max-w-none"
      />
    </section>
  );
}