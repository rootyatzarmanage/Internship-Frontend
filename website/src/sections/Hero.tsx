import { useEffect, useRef } from "react";
import gsap from "gsap";
import image from '../assets/building-1.png'

export default function Hero() {
  const headingRef = useRef(null);
  const buttonsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headings = headingRef.current.querySelectorAll("h2, p");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 1. h2s and p slide in from the left
      tl.fromTo(
        headings,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.25 }
      );

      // 2. buttons slide in as ONE block, right as the p arrives
      tl.fromTo(
        buttonsRef.current,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      );

      // 3. image zooms in from its bottom-right corner
      tl.fromTo(
        imageRef.current,
        { scale: 0.35, opacity: 0, transformOrigin: "100% 100%" },
        { scale: 1, opacity: 1, duration: 1.5, transformOrigin: "100% 100%" },
        0.8
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <header className="bg-[#171717] py-14"></header>

      <section className="relative h-[calc(100vh-7rem)] min-h-[600px] overflow-hidden bg-[#171717] px-20 text-white">
        <div ref={headingRef} className="relative z-10 flex flex-col gap-1 overflow-hidden">
          <h2 className="text-[64px] font-semibold leading-none tracking-[-5px]">
            DESIGN,
          </h2>

          <h2 className="font-[Arial,sans-serif] text-[64px] font-semibold leading-none tracking-[-5px] text-transparent [-webkit-text-stroke:1.5px_white]">
            COORDINATE,
          </h2>

          <h2 className="text-[64px] font-semibold leading-none tracking-[-5px]">
            DELIVER.
          </h2>

          <p className="max-w-[650px] text-[14px] pt-5 leading-5 text-white/80">
            Collaborative BIM workflows for architects, engineers, and construction
            teams from complete lifecycle of asset, on a single platform.
          </p>

          <div ref={buttonsRef} className="flex w-fit items-center gap-3 pt-6">
            <button className="rounded-md bg-[#0b86cf] px-5 py-2 text-[13px] font-medium text-white transition hover:bg-[#0a74b3]">
              Get Started
            </button>
            <button className="flex items-center gap-2 rounded-md border border-white/70 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-white/10">
              Learn More <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        <img
          ref={imageRef}
          src={image}
          alt="Wireframe of a modern building"
          className="absolute bottom-0 right-0 w-[74vw] max-w-[1750px]"
        />
      </section>
    </>
  );
}