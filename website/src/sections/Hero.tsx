import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import image from '../assets/Image.png';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  const navRef = useRef<HTMLElement>(null);
  const badgeWrapRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  const ctaMaskRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const nav = navRef.current;
      const badgeWrap = badgeWrapRef.current;
      const badge = badgeRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const ctaMask = ctaMaskRef.current;
      const cta = ctaRef.current;
      const stats = statsRef.current;

      if (!container || !title || !subtitle) return;

      // ---------------------------------------
      // Headline elements
      // ---------------------------------------

      const titleMasks = gsap.utils.toArray<HTMLElement>(
        title.querySelectorAll(':scope > div')
      );

      const titleWords = gsap.utils.toArray<HTMLElement>(
        title.querySelectorAll(':scope > div > span')
      );

      // ---------------------------------------
      // Stats
      // ---------------------------------------

      const statInners = stats
        ? gsap.utils.toArray<HTMLElement>(
            stats.querySelectorAll('[data-stat-inner]')
          )
        : [];

      // ---------------------------------------
      // CTA buttons
      // ---------------------------------------

      const ctaButtons = cta
        ? gsap.utils.toArray<HTMLElement>(cta.children)
        : [];

      const getStartedBtn = ctaButtons[0];
      const learnMoreBtn = ctaButtons[1];

      // ---------------------------------------
      // Navbar
      // ---------------------------------------

      const navMasks = nav
        ? gsap.utils.toArray<HTMLElement>(
            nav.querySelectorAll('[data-nav-mask]')
          )
        : [];

      const navInners = nav
        ? gsap.utils.toArray<HTMLElement>(
            nav.querySelectorAll('[data-nav-inner]')
          )
        : [];

      // ---------------------------------------
      // Initial states
      // ---------------------------------------

      // Headline starts outside the right edge
      gsap.set(titleWords, {
        x: (i: number) => {
          const mask = titleMasks[i];
          const word = titleWords[i];

          return mask && word
            ? (mask.offsetWidth + word.offsetWidth) / 2 + 20
            : 100;
        },
      });

      // Background overlay
      if (overlay) {
        gsap.set(overlay, {
          opacity: 0,
        });
      }

      // Subtitle
      gsap.set(subtitle, {
        opacity: 0,
      });

      // Badge
      if (badgeWrap) {
        gsap.set(badgeWrap, {
          height: 0,
          overflow: 'hidden',
        });
      }

      if (badge) {
        gsap.set(badge, {
          yPercent: -110,
        });
      }

      // Stats
      if (statInners.length) {
        gsap.set(statInners, {
          yPercent: 110,
        });
      }

      // CTA
      if (ctaMask) {
        gsap.set(ctaMask, {
          overflow: 'hidden',
        });
      }

      if (getStartedBtn) {
        gsap.set(getStartedBtn, {
          xPercent: -110,
        });
      }

      if (learnMoreBtn) {
        gsap.set(learnMoreBtn, {
          xPercent: 110,
        });
      }

      // Navbar
      if (navMasks.length) {
        gsap.set(navMasks, {
          overflow: 'hidden',
        });
      }

      if (navInners.length) {
        gsap.set(navInners, {
          yPercent: -110,
        });
      }

      // ---------------------------------------
      // Entrance timeline
      // ---------------------------------------

      const tl = gsap.timeline({
        delay: 0.5,
      });

      // 1. Background glow
      if (overlay) {
        tl.to(
          overlay,
          {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out',
          },
          0
        );
      }

      // 2. Headline
      tl.to(
        titleWords,
        {
          x: 0,
          duration: 1,
          stagger: 0.8,
          ease: 'power3.out',
        },
        overlay ? '<' : 0
      );

      // 3. Subtitle
      tl.to(subtitle, {
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });

      // 4. Badge wrapper
      if (badgeWrap) {
        tl.to(badgeWrap, {
          height: 'auto',
          duration: 0.8,
          ease: 'power2.out',
          onComplete: () => {
            gsap.set(badgeWrap, {
              clearProps: 'overflow',
            });
          },
        });
      }

      // 5. Badge itself
      if (badge) {
        tl.to(
          badge,
          {
            yPercent: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          badgeWrap ? '<' : undefined
        );
      }

      // 6. Stats
      if (statInners.length) {
        tl.to(
          statInners,
          {
            yPercent: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          badge ? '<' : undefined
        );
      }

      // 7. Get Started button
      if (getStartedBtn) {
        tl.to(getStartedBtn, {
          xPercent: 0,
          duration: 0.8,
          ease: 'power2.out',
        });
      }

      // 8. Learn More button
      if (learnMoreBtn) {
        tl.to(
          learnMoreBtn,
          {
            xPercent: 0,
            duration: 0.8,
            ease: 'power2.out',
          },
          getStartedBtn ? '<' : undefined
        );
      }

      // Remove CTA clipping
      if (ctaMask) {
        tl.set(ctaMask, {
          clearProps: 'overflow',
        });
      }

      // 9. Navbar animation
      if (navInners.length) {
        tl.to(navInners, {
          yPercent: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
        });

        tl.set(navMasks, {
          clearProps: 'overflow',
        });
      }

      // ---------------------------------------
      // Parallax
      // ---------------------------------------

      gsap.to(container, {
        y: 100,
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    },
    {
      scope: containerRef,
    }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 text-white"
    >
      {/* =====================================
          BACKGROUND
      ====================================== */}

      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={image}
          alt="Hero Background"
          className="w-full h-full object-cover"
        />

        <div
          ref={overlayRef}
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255, 255, 255, 0.12) 0%, rgba(255,255,255,0) 60%)',
          }}
        />
      </div>

      {/* =====================================
          NAVBAR
      ====================================== */}

      <nav
        ref={navRef}
        className="absolute top-0 inset-x-0 z-20 px-6"
      >
        <div className="max-w-[1420px] mx-auto h-[72px] flex items-center justify-between">

          {/* Logo */}
          <div
            data-nav-mask
            className="py-1 overflow-hidden"
          >
            <a
              data-nav-inner
              href="/"
              className="block text-[14px] sm:text-[22px] font-semibold tracking-tight text-white leading-none"
            >
              YATZAR MANAGE
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6 md:gap-[70px]">

            {/* Contact */}
            <div
              data-nav-mask
              className="py-1 overflow-hidden hidden sm:block"
            >
              <a
                data-nav-inner
                href="#contact"
                className="block text-[14px] text-white hover:text-[#E5E5E5] transition-colors"
              >
                Contact
              </a>
            </div>

            {/* Login / Sign Up */}
            <div
              data-nav-mask
              className="py-1 overflow-hidden"
            >
              <button
                data-nav-inner
                className="block px-3 py-2 sm:px-5 py-2 text-[10px] sm:text-[16px] rounded-full bg-white text-black hover:bg-gray-200 transition-colors"
              >
                Login / Sign Up
              </button>
            </div>

          </div>
        </div>
      </nav>

      {/* =====================================
          HERO CONTENT
      ====================================== */}

      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-20">

        {/* Certification Badge */}
        <div ref={badgeWrapRef} className="pb-4 sm:pb-8">
  <div
    ref={badgeRef}
    className="
      inline-flex items-center
      gap-1
      sm:gap-2
      px-2.5
      py-1
      sm:px-5
      sm:py-2.5
      rounded-full
      border border-[#F5F5F5]
      text-sm
      font-normal
      tracking-wide
    "
  >
    <span className="w-1.8 h-1.8 sm:w-2 sm:h-2 rounded-full bg-red-500 animate-pulse" />

    <span className="text-[9px] min-[375px]:text-[10px] sm:text-[18px] text-[#FAFAFA]">
      Now supporting IFC4.3 — ISO 16739 certified
    </span>
  </div>
</div>

        {/* =====================================
            HEADLINE
        ====================================== */}

        <h1
          ref={titleRef}
          className="text-[48px] font-bold tracking-tight text-[#FAFAFA] leading-[1.3]"
        >
          <div className="overflow-hidden">
            <span className="inline-block">
              Design,
            </span>
          </div>

          <div className="overflow-hidden">
            <span className="inline-block">
              Coordinate,
            </span>
          </div>

          <div className="overflow-hidden">
            <span className="inline-block">
              Deliver.
            </span>
          </div>
        </h1>

        {/* =====================================
            SUBTITLE
        ====================================== */}

        <p
          ref={subtitleRef}
          className="mt-8 text-[18px] sm:text-lg md:text-xl text-[#E5E5E5] font-normal max-w-2xl leading-relaxed"
        >
          Collaborative BIM workflows for architects, engineers, and
          construction teams from complete lifecycle of asset, on a single
          platform.
        </p>

        {/* =====================================
            CTA BUTTONS
        ====================================== */}

        <div
          ref={ctaMaskRef}
          className="mt-8"
        >
          <div
            ref={ctaRef}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <button className="px-6 py-3 text-[18px] rounded-full bg-white text-black font-normal hover:bg-gray-200 transition-colors">
              Get Started
            </button>

            <button className="px-6 py-3 text-[18px] rounded-full bg-white/30 border border-white text-white font-normal hover:bg-white/40 transition-colors">
              Learn More
            </button>
          </div>
        </div>

        {/* =====================================
            STATS
        ====================================== */}

        <div ref={statsRef} className="grid grid-cols-2 min-[528px]:flex min-[528px]:flex-wrap min-[528px]:justify-between sm:justify-around py-8 px-2 w-full gap-y-6">
          {[
            {
              title: 'ISO 19650',
              label: 'Compliant',
            },
            {
              title: 'Open BIM',
              label: 'Open Standards',
            },
            {
              title: '99.9%',
              label: 'Up time',
            },
            {
              title: '24/7',
              label: 'Support',
            },
          ].map((stat) => (
            <div
              key={stat.title}
              className="overflow-hidden min-w-[100px]"
            >
              <div
                data-stat-inner
                className="flex flex-col items-center text-center"
              >
                <span className="font-semibold text-[24px] px-3 text-white">
                  {stat.title}
                </span>

                <span className="text-[16px] text-[#E5E5E5] mt-1">
                  {stat.label}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Hero;
