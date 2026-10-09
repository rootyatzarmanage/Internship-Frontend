import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import gsap from "gsap";
import logo from "../../assets/logo.png";

const navLinks = [
  { label: "About", to: "/about" },
  { label: "Service", to: "/service" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
  { label: "Contact", to: "/contact" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const isMobile = window.matchMedia("(max-width: 1240px)").matches;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: isMobile ? -60 : -100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const desktopLink = ({ isActive }: { isActive: boolean }) =>
    `text-[15px] font-medium transition hover:text-white ${
      isActive
        ? "text-white underline underline-offset-4"
        : "text-white/90"
    }`;

  return (
    <header
      ref={headerRef}
      className="relative z-20 flex h-16 items-center justify-between bg-[#171717] px-5 text-white sm:px-8 xl:h-28 xl:px-20"
    >
      <Link to="/" className="flex items-center gap-2 xl:gap-3">
        <img
          src={logo}
          alt="Yatzar Manage"
          className="h-5 w-auto brightness-0 invert xl:h-7"
        />

        <span className="text-[16px] uppercase text-white sm:text-[20px] xl:text-[25px]">
          Yatzar Manage
        </span>
      </Link>

      {/* Desktop nav */}
      <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-10 xl:flex">
        {navLinks.map(({ label, to }) => (
          <NavLink key={label} to={to} end className={desktopLink}>
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Desktop action */}
      <div className="hidden items-center gap-3 xl:flex">
        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-white bg-white px-4 py-2 text-[12px] font-medium text-black transition hover:border-white hover:bg-[#171717] hover:text-white">
          Book a Demo <span aria-hidden="true">→</span>
        </button>

        <button className="flex cursor-pointer items-center gap-2 rounded-md border border-[#0284C7] bg-[#0284C7] px-4 py-2 text-[12px] font-medium text-white transition hover:border-[#38BDF8] hover:bg-[#171717]">
          Login / Sign-up
        </button>
      </div>

      {/* Mobile hamburger */}
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

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="absolute left-0 right-0 top-full flex flex-col gap-1 border-t border-white/10 bg-[#171717] px-5 pb-5 pt-3 sm:px-8 xl:hidden">
          {navLinks.map(({ label, to }) => (
            <NavLink
              key={label}
              to={to}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `py-2.5 text-[16px] font-medium transition hover:text-white ${
                  isActive
                    ? "text-white underline underline-offset-4"
                    : "text-white/90"
                }`
              }
            >
              {label}
            </NavLink>
          ))}

          <button className="mt-3 w-full cursor-pointer rounded-md border border-white/70 bg-white px-4 py-2.5 text-[13px] font-medium text-black transition hover:bg-white/10">
            Login / Sign-up
          </button>

          <button className="mt-3 flex w-full cursor-pointer items-center justify-center gap-2 rounded-md border border-[#0284C7] bg-[#0284C7] px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/10">
            Book a Demo <span aria-hidden="true">→</span>
          </button>
        </div>
      )}
    </header>
  );
}