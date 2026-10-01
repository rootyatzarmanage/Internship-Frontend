import { useEffect, useRef } from "react";
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

    const ctx = gsap.context(() => {
      const headings = headingRef.current!.querySelectorAll("h2, p");
      const buttons = buttonsRef.current!.children;
      const infoItems = infoRef.current!.querySelectorAll(".info-item");

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // 0. header slides down from the top
      tl.fromTo(
        headerRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        0
      );

      // 1. h2s and p slide in from the left
      tl.fromTo(
        headings,
        { x: -150, opacity: 0 },
        { x: 0, opacity: 1, duration: 1, stagger: 0.25 },
        0.3
      );

      // 2. buttons rise up (runs after the headings finish)
      tl.fromTo(
        buttons,
        { y: 100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.25 },
        1
      );

      // 3. info text + 4 boxes slide in from the right
      tl.fromTo(
        infoItems,
        { x: 200, opacity: 0 },
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
        className="relative z-20 flex h-28 items-center justify-between bg-[#171717] px-20 text-white"
      >
        {/* logo (black png -> white) */}
        <a href="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Yatzar Manage"
            className="h-7 w-auto brightness-0 invert"
          />
          <span className="text-[25px] uppercase text-white">
            Yatzar Manage
          </span>
        </a>
        {/* nav */}
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

        {/* actions */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 cursor-pointer rounded-md border border-white/70 px-4 py-2 text-[12px] font-medium text-white transition hover:bg-white/10">
            Login / Sign-up 
          </button>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="relative h-[calc(100vh-7rem)] min-h-[600px] overflow-hidden bg-[#171717] px-20 text-white">
        <div
          ref={headingRef}
          className="relative z-10 flex flex-col gap-3 py-7 overflow-hidden"
        >
          <h2 className="text-[64px] font-semibold leading-none tracking-[-5px]">
            DESIGN,
          </h2>

          <h2 className="font-[Arial,sans-serif] text-[64px] font-semibold leading-none tracking-[-5px] text-transparent [-webkit-text-stroke:1.5px_white]">
            COORDINATE,
          </h2>

          <h2 className="text-[64px] font-semibold leading-none tracking-[-5px]">
            DELIVER.
          </h2>

          <p className="max-w-[650px] pt-5 text-[17px] leading-5 text-white/80">
            Collaborative BIM workflows for architects, engineers, and
            construction teams from complete lifecycle of asset, on a single
            platform.
          </p>

          <div ref={buttonsRef} className="flex w-fit items-center gap-3 pt-6">
            <button className="rounded-md cursor-pointer bg-[#0b86cf] px-5 py-2 text-[13px] font-medium text-white transition hover:bg-[#0a74b3]">
              Get Started
            </button>
            <button className="flex items-center gap-2 cursor-pointer rounded-md border border-white/70 px-5 py-2 text-[13px] font-medium text-white transition hover:bg-white/10">
              Learn More <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* top-right info text + 4 boxes */}
        <div
          ref={infoRef}
          className="absolute right-20 top-10 z-10 flex w-[400px] flex-col items-end gap-7"
        >
          <p className="info-item whitespace-nowrap text-right text-[18.5px] font-medium text-white">
            Now supporting IFC4.3 — ISO 16739 certified
          </p>

          <div className="grid w-full grid-cols-2 gap-2">
            {stats.map((s) => (
              <div
                key={s.value}
                className="info-item flex flex-col items-center justify-center rounded-lg border border-white/30 px-3 py-2.5 text-center"
              >
                <span className="text-[16px] font-medium leading-tight">
                  {s.value}
                </span>
                <span className="text-[11px] text-white/70">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <img
          ref={imageRef}
          src={image}
          alt="Wireframe of a modern building"
          className="absolute bottom-0 right-0 w-[74vw] max-w-[1950px]"
        />
      </section>
    </>
  );
}