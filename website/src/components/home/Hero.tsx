import { useEffect, useRef } from "react";
import gsap from "gsap";
import image from "../../assets/building-1.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: "ISO 19650", label: "Compliant" },
  { value: "Open BIM", label: "Open Standard" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Hero() {
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (
      !headingRef.current ||
      !buttonsRef.current ||
      !infoRef.current
    )
      return;

    // Updated breakpoint threshold from 767px to 1279px
    const isMobile = window.matchMedia("(max-width: 1240px)").matches;

    const ctx = gsap.context(() => {
      const headings = headingRef.current!.querySelectorAll("h2, p");
      const buttons = buttonsRef.current!.children;
      const infoItems = infoRef.current!.querySelectorAll(".info-item");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        headings,
        { x: isMobile ? -60 : -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.25 },
        0.3
      );

      tl.fromTo(
        buttons,
        { y: isMobile ? 50 : 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.25 },
        1
      );

      tl.fromTo(
        infoItems,
        { x: isMobile ? 80 : 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.15 },
        0.6
      );

      tl.fromTo(
        imageRef.current,
        { scale: 0.35, opacity: 0, transformOrigin: "100% 100%" },
        { scale: 1, opacity: 1, duration: 1.5, transformOrigin: "100% 100%" },
        0.8
      );

      const scrollConfig = {
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
      };

      gsap.to(imageRef.current, {
        y: 80,
        ease: "none",
        scrollTrigger: scrollConfig,
      });

      gsap.to([headingRef.current, infoRef.current], {
        y: -120,
        ease: "none",
        scrollTrigger: scrollConfig,
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section
        ref={sectionRef}
        className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-[#171717] px-5 text-white sm:px-8 xl:block xl:h-[calc(100vh-7rem)] xl:min-h-[600px] xl:px-20"
      >
        <div
          ref={headingRef}
          className="relative z-10 flex flex-col gap-2 overflow-hidden py-6 xl:gap-3 xl:py-7"
        >
          <h2 className="text-[40px] font-semibold leading-none tracking-[-2px] sm:text-[52px] sm:tracking-[-3px] xl:text-[64px] xl:tracking-[-5px]">
            DESIGN,
          </h2>

          <h2 className="font-[Arial,sans-serif] text-[40px] font-semibold leading-none tracking-[-2px] text-transparent [-webkit-text-stroke:1.5px_white] sm:text-[52px] sm:tracking-[-3px] xl:text-[64px] xl:tracking-[-5px]">
            COORDINATE,
          </h2>

          <h2 className="text-[40px] font-semibold leading-none tracking-[-2px] sm:text-[52px] sm:tracking-[-3px] xl:text-[64px] xl:tracking-[-5px]">
            DELIVER.
          </h2>

          <p className="max-w-[650px] pt-4 text-[15px] leading-5 text-white/80 xl:pt-5 xl:text-[17px]">
            Collaborative BIM workflows for architects, engineers, and
            construction teams from complete lifecycle of asset, on a single
            platform.
          </p>

          <div
            ref={buttonsRef}
            className="flex w-fit items-center gap-3 pt-5 xl:pt-6"
          >
            <button className="cursor-pointer rounded-md bg-[#0b86cf] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0a74b3] xl:py-2">
              Get Started
            </button>
            <button className="flex cursor-pointer items-center gap-2 rounded-md border border-white/70 px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10 xl:py-2">
              Learn More <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* info text + 4 boxes */}
        <div
          ref={infoRef}
          className="relative z-10 mt-2 flex w-full flex-col items-start gap-4 xl:absolute xl:right-20 xl:top-10 xl:mt-0 xl:w-[400px] xl:items-end xl:gap-7"
        >
          <p className="info-item text-left text-[15px] font-medium text-white sm:text-[17px] xl:whitespace-nowrap xl:text-right xl:text-[18.5px]">
            Now supporting IFC4.3 — ISO 16739 certified
          </p>

          <div className="grid w-full grid-cols-2 gap-2">
            {stats.map((s) => (
              <div
                key={s.value}
                className="info-item flex flex-col items-center justify-center rounded-xl border border-white/30 px-3 py-2.5 text-center"
              >
                <span className="text-[15px] font-medium leading-tight xl:text-[16px]">
                  {s.value}
                </span>
                <span className="text-[11px] text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* building image */}
        <img
          ref={imageRef}
          src={image}
          alt="Wireframe of a modern building"
          className="-mr-5 mt-auto w-[115%] max-w-none self-end pt-8 sm:-mr-8 sm:w-[100%] xl:absolute xl:bottom-0 xl:right-0 xl:mr-0 xl:w-[74vw] xl:max-w-[1950px] xl:self-auto xl:pt-0"
        />
      </section>
    </>
  );
}