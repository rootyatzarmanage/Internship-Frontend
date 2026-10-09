import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const platformLinks = [
  "CDE",
  "IFC Viewer",
  "Collaboration",
  "Cost Management",
  "Scheduling",
];

const companyLinks = [
  { label: "Contact", to: "/contact" },
  { label: "About", to: "/about" },
  { label: "Career", to: "/#career" },
];

const Footer = () => {
  return (
    <footer className="flex min-h-[300px] flex-col justify-between bg-[#e9e9e9] px-5 pb-6 pt-10 text-[#1a1a1a] sm:px-8 md:px-16 md:pb-8 md:pt-14 xl:px-20">
      {/* Top Section */}
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        {/* Brand & Info */}
        <div className="max-w-[440px]">
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3">
            <img src={logo} alt="Yatzar Manage" className="h-6 w-auto sm:h-7" />
            <span className="text-[18px] font-semibold uppercase text-[#1a1a1a] sm:text-[20px]">
              Yatzar Manage
            </span>
          </Link>

          <p className="mt-4 text-[13.5px] leading-5 text-[#1a1a1a]/90 sm:mt-5 sm:text-[15px] sm:leading-6">
            Collaborative BIM workflows for architects, engineers, and
            construction teams from complete lifecycle of asset, on a single
            platform.
          </p>

          <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border-2 border-[#1a1a1a] px-3.5 py-1.5 text-[12px] font-medium sm:mt-6 sm:px-4 sm:py-2 sm:text-[13px]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Now supporting IFC4.3 — ISO 16739 certified
          </div>
        </div>

        {/* Links Navigation */}
        <div className="flex flex-wrap gap-10 sm:gap-16 md:gap-20">
          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#1a1a1a] sm:text-[14px]">
              Platform
            </h4>
            <ul className="mt-3.5 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {platformLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-[13.5px] text-[#1a1a1a]/80 transition-colors hover:text-black sm:text-[15px]"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[13px] font-semibold uppercase tracking-wider text-[#1a1a1a] sm:text-[14px]">
              Company
            </h4>
            <ul className="mt-3.5 flex flex-col gap-2.5 sm:mt-5 sm:gap-3">
              {companyLinks.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-[13.5px] text-[#1a1a1a]/80 transition-colors hover:text-black sm:text-[15px]"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 flex flex-col gap-3 border-t border-black/10 pt-5 text-[12px] text-[#1a1a1a]/80 sm:flex-row sm:items-center sm:justify-between sm:text-[13px]">
        <p>
          © {new Date().getFullYear()} Yatzar Creations. All rights reserved.
        </p>

        <div className="flex items-center gap-3">
          <a href="/privacy" className="transition-colors hover:text-black">
            Privacy Policy
          </a>
          <span className="h-3 w-px bg-[#1a1a1a]/40" />
          <a href="/terms" className="transition-colors hover:text-black">
            Terms &amp; Conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;