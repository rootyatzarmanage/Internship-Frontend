import logo from "../assets/logo.png";

const platformLinks = [
  "CDE",
  "IFC Viewer",
  "Collaboration",
  "Cost Management",
  "Scheduling",
];

const companyLinks = ["Contact", "About", "Career"];

const Footer = () => {
  return (
    <footer className="flex min-h-[336px] flex-col justify-between bg-[#e9e9e9] px-6 pb-8 pt-12 text-[#1a1a1a] md:px-20 md:pb-10 md:pt-16">
      <div className="flex flex-col gap-10 md:flex-row md:justify-between px-6">
        <div className="max-w-[440px]">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Yatzar Manage" className="h-7 w-auto" />
            <span className="text-[20px] uppercase text-[#1a1a1a] font-semibold">
              Yatzar Manage
            </span>
          </a>

          <p className="mt-6 text-md leading-6 text-black">
            Collaborative BIM workflows for architects, engineers, and
            construction teams from complete lifecycle of asset, on a single
            platform.
          </p>

          <div className="mt-6 inline-flex items-center gap-3 rounded-full border-2 border-[#1a1a1a] px-4 py-2 text-[13px] font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
            Now supporting IFC4.3 — ISO 16739 certified
          </div>
        </div>
        <div className="flex gap-12 sm:gap-16 md:gap-20">
          <div>
            <h4 className="text-md font-semibold uppercase tracking-wide">
              Platform
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {platformLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-md text-[#1a1a1a]/80 transition-colors hover:text-black"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-md font-semibold uppercase tracking-wide">
              Company
            </h4>
            <ul className="mt-5 flex flex-col gap-3">
              {companyLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#"
                    className="text-md text-[#1a1a1a]/80 transition-colors hover:text-black"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="mt-10 flex flex-col gap-4 border-t border-black/10 pt-5 px-5 text-[13px] text-[#1a1a1a]/80 sm:flex-row sm:items-center sm:justify-between">
        <p>
          copyrights {new Date().getFullYear()}, Yatzar Creations , All rights
          reserved
        </p>

        <div className="flex items-center gap-3">
          <a href="#" className="transition-colors hover:text-black">
            Privacy policy
          </a>
          <span className="h-3.5 w-px bg-[#1a1a1a]/60" />
          <a href="#" className="transition-colors hover:text-black">
            Term and conditions
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;