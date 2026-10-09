import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import memberPhoto from "../../assets/person.jpg";

gsap.registerPlugin(ScrollTrigger);

const DESIGN_WIDTH = 1920;
const PAGE_WIDTH = 1760; // 5 cards x 294px + 4 gaps x 72.5px
const PER_PAGE = 5;

type Member = {
  name: string;
  role: string;
  photo: string;
  github: string;
  linkedin: string;
};

const TEAM: Member[] = Array.from({ length: 15 }, () => ({
  name: "Name of the member",
  role: "Designation",
  photo: memberPhoto,
  github: "#",
  linkedin: "#",
}));

const PAGES = Math.ceil(TEAM.length / PER_PAGE);
const GROUPS = Array.from({ length: PAGES }, (_, i) =>
  TEAM.slice(i * PER_PAGE, (i + 1) * PER_PAGE)
);

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" fill="currentColor" className="h-full w-full" aria-hidden="true">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-full w-full" aria-hidden="true">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

export default function Team() {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const frame = frameRef.current;
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!section || !frame || !viewport || !track) return;

    const mq = window.matchMedia("(min-width: 1024px)");

    const fit = () => {
      if (mq.matches) {
        const scale = section.clientWidth / DESIGN_WIDTH;
        frame.style.transform = `scale(${scale})`;
        section.style.height = `${frame.offsetHeight * scale}px`;
      } else {
        frame.style.transform = "";
        section.style.height = "";
      }
    };

    const onModeChange = () => {
      // reset the slider when switching between desktop and mobile layouts
      gsap.set(track, { x: 0 });
      viewport.scrollTo({ left: 0 });
      setPage(0);
      fit();
      ScrollTrigger.refresh();
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(section);
    mq.addEventListener("change", onModeChange);
    return () => {
      ro.disconnect();
      mq.removeEventListener("change", onModeChange);
    };
  }, []);

  // entrance animation (plays once when the section scrolls in)
  useEffect(() => {
    if (!sectionRef.current) return;
    const mm = gsap.matchMedia();

    const ctx = gsap.context(() => {
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          defaults: { ease: "power3.out" },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            once: true,
          },
        });

        tl.fromTo(
          ".team-title-inner",
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9 }
        )
          .fromTo(
            ".team-intro",
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7 },
            "-=0.5"
          )
          .fromTo(
            ".team-page:first-child .team-card",
            { x: 80, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9, stagger: 0.1 },
            "-=0.4"
          )
          .fromTo(
            ".team-dots",
            { opacity: 0 },
            { opacity: 1, duration: 0.6 },
            "-=0.3"
          );
      });
    }, sectionRef);

    return () => {
      mm.revert();
      ctx.revert();
    };
  }, []);

  const goTo = (i: number) => {
    setPage(i);
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) return;

    if (isDesktop()) {
      gsap.to(track, {
        x: -i * PAGE_WIDTH,
        duration: 0.8,
        ease: "power3.inOut",
      });
    } else {
      const max = viewport.scrollWidth - viewport.clientWidth;
      viewport.scrollTo({ left: max * (i / (PAGES - 1)), behavior: "smooth" });
    }
  };

  // mobile: keep the dots in sync with the native swipe position
  const onScroll = () => {
    const viewport = viewportRef.current;
    if (!viewport || isDesktop()) return;
    const max = viewport.scrollWidth - viewport.clientWidth;
    if (max <= 0) return;
    setPage(Math.round((viewport.scrollLeft / max) * (PAGES - 1)));
  };

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-[#171717] font-['DM_Sans',sans-serif] text-white"
    >
      <div
        ref={frameRef}
        className="w-full origin-top-left pt-14 lg:w-[1920px] lg:pt-[126px]"
        style={{ transformOrigin: "top left" }}
      >
        {/* heading */}
        <div className="px-5 lg:px-[80px]">
          <h2 className="overflow-hidden font-['Plus_Jakarta_Sans',sans-serif] text-[40px] font-medium leading-[44px] tracking-[-1.5px] sm:text-[56px] sm:leading-[60px] lg:text-[80px] lg:leading-[80px] lg:tracking-[-3px]">
            <span className="team-title-inner block">Meet Our Team</span>
          </h2>
          <p className="team-intro mt-4 max-w-[560px] text-[13px] leading-[20px] text-white lg:mt-[23px] lg:text-[14px]">
            Behind Yatzar is a passionate team of engineers, designers, and BIM
            specialists. We combine construction expertise with modern
            technology to build tools that simplify collaboration, improve
            project delivery, and help our clients succeed.
          </p>
        </div>

        {/* cards: swipeable row on mobile, 5-per-page slider on desktop */}
        <div
          ref={viewportRef}
          onScroll={onScroll}
          className="mt-8 snap-x snap-mandatory scroll-px-5 overflow-x-auto [scrollbar-width:none] lg:mx-[80px] lg:mt-[79px] lg:w-[1760px] lg:snap-none lg:overflow-hidden [&::-webkit-scrollbar]:hidden"
        >
          <div ref={trackRef} className="flex w-max gap-4 px-5 lg:gap-0 lg:px-0">
            {GROUPS.map((group, g) => (
              <div
                key={g}
                className="team-page contents lg:flex lg:w-[1760px] lg:shrink-0 lg:gap-[72.5px]"
              >
                {group.map((m, i) => (
                  <article
                    key={i}
                    className="team-card relative h-[348px] w-[240px] shrink-0 snap-start overflow-hidden rounded-xl border-2 border-[#d9d9d9] bg-[#3f3f3f] sm:h-[378px] sm:w-[260px] lg:h-[427px] lg:w-[294px] lg:rounded-[16px] lg:border-[3px]"
                  >
                    <img
                      src={m.photo}
                      alt=""
                      className="absolute inset-0 h-full w-full object-cover object-top grayscale"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 px-3 pb-3 lg:px-[12px] lg:pb-[24px]">
                      <h3 className="text-[18px] font-medium leading-[24px] text-white lg:text-[24px] lg:leading-[28px]">
                        {m.name}
                      </h3>
                      <div className="mt-1 flex items-center justify-between pl-2 pr-2 lg:mt-[5px] lg:pl-[10px] lg:pr-[11px]">
                        <span className="text-[14px] leading-[20px] text-white/60 lg:text-[16px]">
                          {m.role}
                        </span>
                        <div className="flex items-center gap-2 text-white/60 lg:gap-[10px]">
                          <a
                            href={m.linkedin}
                            aria-label={`${m.name} on LinkedIn`}
                            className="h-[18px] w-[18px] transition-colors hover:text-white lg:h-[20px] lg:w-[20px]"
                          >
                            <LinkedinIcon />
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* pagination dots */}
        <div className="team-dots mt-8 flex items-center justify-center gap-[10px] pb-12 lg:mt-[78px] lg:gap-[19px] lg:pb-[114px]">
          {Array.from({ length: PAGES }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show team page ${i + 1}`}
              aria-current={i === page}
              className={`h-2.5 rounded-full bg-[#e5e5e5] transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0EA5E9] lg:h-[14px] ${
                i === page ? "w-8 lg:w-[51px]" : "w-2.5 lg:w-[14px]"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}