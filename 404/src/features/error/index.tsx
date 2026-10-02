import type { CSSProperties } from "react";

const BRAND = "#465fff";
const CELL = 51; // grid cell size in px

const gridStyle = (mask: string): CSSProperties => ({
  backgroundImage: `linear-gradient(to right, rgba(228,231,236,0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(228,231,236,0.5) 1px, transparent 1px)`,
  backgroundSize: `${CELL}px ${CELL}px`,
  maskImage: mask,
  WebkitMaskImage: mask,
});

const Four = () => (
  <svg
    viewBox="0 0 110 160"
    className="h-[110px] w-[77px] sm:h-[130px] sm:w-[90px] xl:h-[158px] xl:w-[109px]"
    fill={BRAND}
    aria-hidden="true"
  >

    <rect x="0" y="0" width="33" height="90" rx="3" />
    {/* cross bar */}
    <rect x="0" y="55" width="109" height="35" rx="3" />
    {/* right stem */}
    <rect x="76" y="2" width="33" height="158" rx="6" />
    {/* notch under left stem */}
    <rect x="0" y="82" width="10" height="8" />
  </svg>
);

const SadFace = () => (
  <svg
    viewBox="0 0 190 156"
    className="h-[110px] w-[135px] sm:h-[130px] sm:w-[160px] xl:h-[156px] xl:w-[190px]"
    aria-hidden="true"
  >
    {/* outer frame */}
    <rect x="0" y="0" width="190" height="154" rx="42" fill={BRAND} />
    <rect x="24" y="24" width="142" height="106" rx="20" fill="#fafbfc" />
    {/* eyes */}
    <rect x="62" y="39" width="22" height="20" rx="2" fill={BRAND} />
    <rect x="106" y="39" width="22" height="20" rx="2" fill={BRAND} />
    {/* mouth */}
    <rect x="66" y="79" width="58" height="21" rx="2" fill={BRAND} />
    <rect x="50" y="99" width="23" height="17" rx="2" fill={BRAND} />
    <rect x="117" y="99" width="23" height="17" rx="2" fill={BRAND} />
  </svg>
);

export default function NotFound() {
  return (
    <div className="relative z-1 flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gray-50 p-6 font-[Outfit,sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 h-[260px] w-[450px] sm:h-[330px] sm:w-[450px]"
        style={gridStyle(
          "radial-gradient(circle at top right, #000 0%, transparent 70%)"
        )}
      >
        <span className="absolute right-[51px] top-[51px] h-[51px] w-[51px] bg-gray-100" />
        <span className="absolute right-[153px] top-[102px] h-[51px] w-[51px] bg-gray-100" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-[260px] w-[450px] sm:h-[260px] sm:w-[450px]"
        style={gridStyle(
          "radial-gradient(circle at bottom left, #000 0%, transparent 70%)"
        )}
      >
        <span className="absolute bottom-[51px] left-[51px] h-[51px] w-[51px] bg-gray-100" />
        <span className="absolute bottom-[102px] left-[153px] h-[51px] w-[51px] bg-gray-100" />
      </div>

      <div className="mx-auto w-full max-w-[472px] text-center">
        <h1 className="mb-8 text-[44px] font-bold leading-none text-gray-800 sm:text-[60px] xl:text-[72px]">
          ERROR
        </h1>

        <div
          className="mb-10 flex items-end justify-center gap-4 sm:gap-8 xl:gap-[34px]"
          role="img"
          aria-label="404"
        >
          <Four />
          <SadFace />
          <Four />
        </div>

        <p className="mb-6 text-base text-gray-700 sm:text-lg">
          We can’t seem to find the page you are looking for!
        </p>

        <a
          href="/"
          className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 hover:text-gray-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#465fff]"
        >
          Back to Home Page
        </a>
      </div>
    </div>
  );
}