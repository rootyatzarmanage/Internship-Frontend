import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import image from "../assets/building-1.png";
import logo from "../assets/logo.png";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const navLinks = ["About", "Service", "Pricing", "Support", "Contact"];

const stats = [
  { value: "ISO 19650", label: "Compliant" },
  { value: "Open BIM", label: "Open Standard" },
  { value: "99.9%", label: "Uptime" },
  { value: "24/7", label: "Support" },
];

export default function Hero() {
  const [menuOpen, setMenuOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (
      !headerRef.current ||
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
        headerRef.current,
        { y: isMobile ? -60 : -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0
      );

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
      {/* ---------- HEADER ---------- */}
      <header
        ref={headerRef}
        className="relative z-20 flex h-16 items-center justify-between bg-[#171717] px-5 text-white sm:px-8 xl:h-28 xl:px-20"
      >
        <a href="/" className="flex items-center gap-2 xl:gap-3">
          <img
            src={logo}
            alt="Yatzar Manage"
            className="h-5 w-auto brightness-0 invert xl:h-7"
          />
          <span className="text-[16px] uppercase text-white sm:text-[20px] xl:text-[25px]">
            Yatzar Manage
          </span>
        </a>

        {/* desktop nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 xl:flex">
          {navLinks.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-[15px] font-medium text-white/90 transition hover:text-white"
            >
              {link}
            </a>
          ))}
        </nav>

        {/* desktop action */}
        <div className="hidden items-center gap-3 xl:flex">
          <button className="flex items-center gap-2 cursor-pointer rounded-md px-4 py-2 text-[12px] bg-white border border-white font-medium text-black transition hover:bg-[#171717] hover:border-white hover:text-white">
            Book a Demo <span aria-hidden="true">→</span>
          </button>
          <button className="flex items-center gap-2 cursor-pointer rounded-md bg-[#0284C7] px-4 py-2 text-[12px] border border-[#0284C7] font-medium text-white transition hover:bg-[#171717] hover:border-[#38BDF8]">
            Login / Sign-up
          </button>
        </div>

        {/* mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] xl:hidden"
        >
          <span
            className={`h-[2px] w-6 bg-white transition-transform duration-300 ${
              menuOpen ? "translate-y-[7px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-opacity duration-300 ${
              menuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-[2px] w-6 bg-white transition-transform duration-300 ${
              menuOpen ? "-translate-y-[7px] -rotate-45" : ""
            }`}
          />
        </button>

        {/* mobile dropdown */}
        {menuOpen && (
          <div className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 bg-[#171717] px-5 pb-5 pt-3 sm:px-8 xl:hidden">
            {navLinks.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setMenuOpen(false)}
                className="py-2.5 text-[16px] font-medium text-white/90 transition hover:text-white"
              >
                {link}
              </a>
            ))}
            <button className="mt-3 w-full cursor-pointer rounded-md border border-white/70 px-4 py-2.5 text-[13px] bg-white text-black font-medium transition hover:bg-white/10">
              Login / Sign-up
            </button>
            <button className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0284C7] bg-[#0284C7] px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10">
              Book a Demo <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </header>

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
                className="info-item flex flex-col items-center justify-center rounded-lg border border-white/30 px-3 py-2.5 text-center"
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