import { useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import gsap from "gsap";
import building from "../assets/about-building.png";

export default function About() {
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!textRef.current || !imageRef.current) return;
    const isMobile = window.matchMedia("(max-width: 1240px)").matches;

    const ctx = gsap.context(() => {
      const items = textRef.current!.children;
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        items,
        { x: isMobile ? -40 : -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9, stagger: 0.15 }
      );
      tl.fromTo(
        imageRef.current,
        { x: isMobile ? 40 : 300, y: isMobile ? 80 : 180, scale: isMobile ? 0.75 : 0.35, opacity: 0 },
        { x: 0, y : 0, scale : 1, opacity: 1, duration: 1.4, ease:"power3.out" },
        0.3
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-[#171717] px-5 text-white sm:px-8 xl:block xl:h-[calc(100vh-7rem)] xl:min-h-[600px] xl:px-20">
      {/* text block */}
      <div
        ref={textRef}
        className="relative z-10 flex flex-col items-start py-6 xl:py-7"
      >
        <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-2px] sm:text-[52px] sm:tracking-[-3px] xl:text-[64px] xl:tracking-[-4px]">
          We Support
          <br />
          What You <span className="text-[#0EA5E9]">Planned</span>
          <br />
          To Build
        </h1>

        <p className="mt-5 max-w-[300px] text-[13px] leading-5 text-white/85 sm:max-w-[420px] sm:text-[14px] xl:mt-7 xl:max-w-[470px] xl:text-[13.5px]">
          Yatzar Manage is a unified project management platform that
          centralizes tasks, teams, documents, and approvals, giving BIM teams
          clear visibility, streamlined workflows, and faster decisions.
        </p>

        <NavLink className="mt-5 flex w-fit cursor-pointer items-center gap-2 rounded-md bg-[#0284C7] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0369A1] xl:mt-6 xl:py-2"
        >
          Book a Demo <span aria-hidden="true">→</span>
        </NavLink>
      </div>

      {/* building wireframe (source PNG is dark-gray lines -> forced to white) */}
      <img
        ref={imageRef}
        src={building}
        alt="Wireframe of a house, half finished building and half framing"
        className="mx-auto w-[90%] max-w-none pt-8 brightness-0 invert sm:w-[70%] xl:absolute xl:bottom-6 xl:right-20 xl:mx-0 xl:w-[58vw] xl:max-w-[1150px] xl:pt-0 2xl:bottom-10"
      />
    </section>
  );
}
