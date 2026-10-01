import { lazy, Suspense, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Maximize, Maximize2, Minimize } from "lucide-react";
import building from "../assets/building-3.png";

gsap.registerPlugin(ScrollTrigger);

// must live OUTSIDE the component, or it reloads on every re-render
const Viewer3D = lazy(() => import("./Viewer3D"));

export default function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // track browser fullscreen on/off
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // scroll animations
  useEffect(() => {
    if (
      !sectionRef.current ||
      !rowRef.current ||
      !textRef.current ||
      !badgesRef.current ||
      !viewerRef.current
    )
      return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: rowRef.current,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // heading + paragraph slide in from the left
      tl.fromTo(
        textRef.current!.children,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.2 },
        0
      );

      // the 2 badges slide in from the right
      tl.fromTo(
        badgesRef.current!.children,
        { x: 300, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.1, stagger: 0.15 },
        0
      );

      // viewer rises from the bottom while scrolling to this page
      gsap.fromTo(
        viewerRef.current,
        { y: () => window.innerHeight * 0.6 },
        {
          y: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "top 20%",
            scrub: 0.5,
            invalidateOnRefresh: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // "Isometric" = expand to the full webpage (browser tabs stay visible)
  useEffect(() => {
    if (!expanded) return;

    gsap.set(viewerRef.current, { y: 0 });

    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";

    const block = (e: Event) => {
      if (viewerRef.current?.contains(e.target as Node)) return; // let the 3D viewer handle it
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };

    window.addEventListener("wheel", block, { passive: false, capture: true });
    window.addEventListener("touchmove", block, { passive: false, capture: true });
    window.addEventListener("keydown", onKey);

    return () => {
      html.style.overflow = prevOverflow;
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
      window.removeEventListener("keydown", onKey);
    };
  }, [expanded]);

  // "Fullscreen" = real browser fullscreen
  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      viewerRef.current?.requestFullscreen();
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative flex flex-col justify-center overflow-hidden bg-[#171717] px-5 py-8 text-white sm:px-8 md:px-12 xl:min-h-screen xl:px-[4.1667vw] xl:py-[2vw]"
    >
      <div
        ref={rowRef}
        className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between"
      >
        <div ref={textRef} className="max-w-[1100px]">
          <h2 className="text-[34px] font-medium uppercase tracking-[-0.05em] sm:text-[48px] md:text-[56px] xl:text-[3vw]">
            Explore our IFC viewer
          </h2>
          <p className="mt-2 max-w-[420px] text-[14px] leading-6 text-white/80 md:text-[15px] xl:mt-[0.3vw] xl:max-w-[30vw] xl:text-[max(13px,0.8698vw)] xl:leading-[1.5]">
            Navigate, measure, and annotate your BIM models directly in the
            browser. Built for real-time collaboration with full IFC support.
          </p>
        </div>

        <div
          ref={badgesRef}
          className="flex items-center gap-3 md:mt-[2.5vw] xl:gap-[0.6vw]"
        >
          <button className="cursor-pointer rounded-md border border-white/70 px-3 py-1.5 text-[12px] text-white transition-colors hover:bg-white hover:text-black xl:rounded-[0.45vw] xl:px-[0.9vw] xl:py-[0.4vw] xl:text-[max(12px,0.73vw)]">
            Open BIM
          </button>
          <button className="cursor-pointer rounded-md border border-[#0ea5e9]/80 px-3 py-1.5 text-[12px] text-[#0ea5e9] transition-colors hover:bg-[#0ea5e9] hover:text-white xl:rounded-[0.45vw] xl:px-[0.9vw] xl:py-[0.4vw] xl:text-[max(12px,0.73vw)]">
            ISO 19650
          </button>
        </div>
      </div>

      {/* VIEWER: the outer div keeps the space in the layout */}
      <div className="relative mt-8 aspect-[4/3] w-full sm:aspect-[16/9] xl:mt-[2.6vw] xl:aspect-[2.72/1]">
        <div
          ref={viewerRef}
          {...(expanded || isFullscreen ? { "data-lenis-prevent": true } : {})}
          className={`overflow-hidden bg-[#1c2028] ${
            expanded
              ? "fixed inset-0 z-[100] h-screen w-screen rounded-none border-0"
              : "absolute inset-0 rounded-[14px] border-2 border-white/70 xl:rounded-[1.15vw]"
          }`}
        >
          <Suspense
            fallback={
              <img
                src={building}
                alt="Loading 3D model"
                className="h-full w-full object-cover"
              />
            }
          >
            <Viewer3D
              url="/models/house.glb"
              zoomEnabled={expanded || isFullscreen}
            />
          </Suspense>

          {/* bottom-right buttons */}
          <div className="absolute bottom-3 right-3 z-10 flex items-center gap-2 xl:bottom-[0.85vw] xl:right-[1vw] xl:gap-[0.5vw]">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-white/70 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-white/15 sm:text-[12px] xl:gap-[0.5vw] xl:rounded-[0.45vw] xl:px-[0.9vw] xl:py-[0.45vw] xl:text-[max(12px,0.73vw)]"
            >
              Isometric
              {expanded ? (
                <Minimize className="h-3.5 w-3.5 xl:h-[max(14px,0.85vw)] xl:w-[max(14px,0.85vw)]" />
              ) : (
                <Maximize className="h-3.5 w-3.5 xl:h-[max(14px,0.85vw)] xl:w-[max(14px,0.85vw)]" />
              )}
            </button>

            <button
              type="button"
              onClick={toggleFullscreen}
              className="flex cursor-pointer items-center gap-2 rounded-md border border-white/70 bg-black/30 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm transition hover:bg-white/15 sm:text-[12px] xl:gap-[0.5vw] xl:rounded-[0.45vw] xl:px-[0.9vw] xl:py-[0.45vw] xl:text-[max(12px,0.73vw)]"
            >
              Fullscreen{" "}
              <Maximize2 className="h-3.5 w-3.5 xl:h-[max(14px,0.85vw)] xl:w-[max(14px,0.85vw)]" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}