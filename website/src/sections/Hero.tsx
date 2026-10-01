import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import image from "../assets/building-1.png";
import logo from "../assets/logo.png";

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

  useEffect(() => {
    if (
      !headerRef.current ||
      !headingRef.current ||
      !buttonsRef.current ||
      !infoRef.current
    )
      return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const headings = headingRef.current!.querySelectorAll("h2, p");
      const buttons = buttonsRef.current!.children;
      const infoItems = infoRef.current!.querySelectorAll(".info-item");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0. header slides down from the top
      tl.fromTo(
        headerRef.current,
        { y: isMobile ? -60 : -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0
      );

      // 1. h2s and p slide in from the left
      tl.fromTo(
        headings,
        { x: isMobile ? -60 : -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.25 },
        0.3
      );

      // 2. buttons rise up (runs after the headings finish)
      tl.fromTo(
        buttons,
        { y: isMobile ? 50 : 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.25 },
        1
      );

      // 3. info text + 4 boxes slide in from the right
      tl.fromTo(
        infoItems,
        { x: isMobile ? 80 : 200, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.15 },
        0.6
      );

      // 4. image zooms in from its bottom-right corner
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
      {/* ---------- HEADER ---------- */}
      <header
        ref={headerRef}
        className="relative z-20 flex h-16 items-center justify-between bg-[#171717] px-5 text-white sm:px-8 md:h-28 md:px-20"
      >
        {/* logo (black png -> white) */}
        <a href="/" className="flex items-center gap-2 md:gap-3">
          <img
            src={logo}
            alt="Yatzar Manage"
            className="h-5 w-auto brightness-0 invert md:h-7"
          />
          <span className="text-[16px] uppercase text-white sm:text-[20px] md:text-[25px]">
            Yatzar Manage
          </span>
        </a>

        {/* desktop nav */}
        <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 md:flex">
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
        <div className="hidden items-center gap-3 md:flex">
          <button className="flex items-center gap-2 cursor-pointer rounded-md border border-white/70 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-white/10">
            Login / Sign-up
          </button>
        </div>

        {/* mobile hamburger */}
        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] md:hidden"
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
          <div className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 bg-[#171717] px-5 pb-5 pt-3 sm:px-8 md:hidden">
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
            <button className="mt-3 w-full cursor-pointer rounded-md border border-white/70 px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10">
              Login / Sign-up
            </button>
          </div>
        )}
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative flex min-h-[calc(100svh-4rem)] flex-col overflow-hidden bg-[#171717] px-5 text-white sm:px-8 md:block md:h-[calc(100vh-7rem)] md:min-h-[600px] md:px-20">
        <div
          ref={headingRef}
          className="relative z-10 flex flex-col gap-2 overflow-hidden py-6 md:gap-3 md:py-7"
        >
          <h2 className="text-[40px] font-semibold leading-none tracking-[-2px] sm:text-[52px] sm:tracking-[-3px] md:text-[64px] md:tracking-[-5px]">
            DESIGN,
          </h2>

          <h2 className="font-[Arial,sans-serif] text-[40px] font-semibold leading-none tracking-[-2px] text-transparent [-webkit-text-stroke:1.5px_white] sm:text-[52px] sm:tracking-[-3px] md:text-[64px] md:tracking-[-5px]">
            COORDINATE,
          </h2>

          <h2 className="text-[40px] font-semibold leading-none tracking-[-2px] sm:text-[52px] sm:tracking-[-3px] md:text-[64px] md:tracking-[-5px]">
            DELIVER.
          </h2>

          <p className="max-w-[650px] pt-4 text-[15px] leading-5 text-white/80 md:pt-5 md:text-[17px]">
            Collaborative BIM workflows for architects, engineers, and
            construction teams from complete lifecycle of asset, on a single
            platform.
          </p>

          <div
            ref={buttonsRef}
            className="flex w-fit items-center gap-3 pt-5 md:pt-6"
          >
            <button className="cursor-pointer rounded-md bg-[#0b86cf] px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-[#0a74b3] md:py-2">
              Get Started
            </button>
            <button className="flex cursor-pointer items-center gap-2 rounded-md border border-white/70 px-5 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10 md:py-2">
              Learn More <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* info text + 4 boxes (in flow on mobile, top-right on desktop) */}
        <div
          ref={infoRef}
          className="relative z-10 mt-2 flex w-full flex-col items-start gap-4 md:absolute md:right-20 md:top-10 md:mt-0 md:w-[400px] md:items-end md:gap-7"
        >
          <p className="info-item text-left text-[15px] font-medium text-white sm:text-[17px] md:whitespace-nowrap md:text-right md:text-[18.5px]">
            Now supporting IFC4.3 — ISO 16739 certified
          </p>

          <div className="grid w-full grid-cols-2 gap-2">
            {stats.map((s) => (
              <div
                key={s.value}
                className="info-item flex flex-col items-center justify-center rounded-lg border border-white/30 px-3 py-2.5 text-center"
              >
                <span className="text-[15px] font-medium leading-tight md:text-[16px]">
                  {s.value}
                </span>
                <span className="text-[11px] text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* building image: bottom of the stack on mobile, pinned bottom-right on desktop */}
        <img
          ref={imageRef}
          src={image}
          alt="Wireframe of a modern building"
          className="-mr-5 mt-auto w-[115%] max-w-none self-end pt-8 sm:-mr-8 sm:w-[100%] md:absolute md:bottom-0 md:right-0 md:mr-0 md:w-[74vw] md:max-w-[1950px] md:self-auto md:pt-0"
        />
      </section>
    </>
  );
}