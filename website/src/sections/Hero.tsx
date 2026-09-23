import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import image from '../assets/Image.png';

// Register plugins
gsap.registerPlugin(ScrollTrigger, useGSAP);

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const badge = badgeRef.current;
      const title = titleRef.current;
      const subtitle = subtitleRef.current;
      const cta = ctaRef.current;
      const container = containerRef.current;
      const overlay = overlayRef.current;
      const stats = statsRef.current;

      if (!title || !subtitle || !container) return;

      // Each headline word lives inside its own overflow-hidden div — we
      // animate the inner span so the div can act as a mask if you want
      // a clipped reveal later. Right now it's just a slide + fade.
      const titleLines = gsap.utils.toArray<HTMLElement>(
        title.querySelectorAll('div > span')
      );
      const statItems = stats ? gsap.utils.toArray<HTMLElement>(stats.children) : [];
      const ctaButtons = cta ? gsap.utils.toArray<HTMLElement>(cta.children) : [];
      const [getStartedBtn, learnMoreBtn] = ctaButtons;

      // --- Initial state: nothing visible but the plain background image ---
      gsap.set(titleLines, { x: 150, opacity: 0 });
      if (overlay) gsap.set(overlay, { opacity: 0 });
      if (badge) gsap.set(badge, { y: -60, opacity: 0 });
      gsap.set(subtitle, { y: 30, opacity: 0 });
      if (statItems.length) gsap.set(statItems, { y: 60, opacity: 0 });
      if (getStartedBtn) gsap.set(getStartedBtn, { x: -100, opacity: 0 });
      if (learnMoreBtn) gsap.set(learnMoreBtn, { x: 100, opacity: 0 });

      // --- After a 2s hold on the bare image, headline slides in ---
      // "Design," animates first, then "Coordinate," and "Deliver."
      // follow in sequence, each moving right -> centre, with a longer
      // gap between each word.
      const tl = gsap.timeline({ delay: 0.5 });

      // Soft centre glow fades in alongside the headline. Added first (and
      // the headline second, at the same start time via '<') so the
      // timeline's "end of this phase" marker lands on whichever of the
      // two actually finishes last — the headline, since it's longer.
      if (overlay) {
        tl.to(overlay, { opacity: 1, duration: 1.5, ease: 'power2.out' }, 0);
      }

      tl.to(
        titleLines,
        {
          x: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.8,
          ease: 'power3.out',
        },
        overlay ? '<' : 0
      );

      // Once all three words are fully in, the subtitle settles in underneath.
      tl.to(subtitle, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
      });

      // Then, once the subtitle is done, the badge and the four stats move
      // in to meet it — badge dropping from the top, stats rising from the
      // bottom — starting together. Stats is added last since its stagger
      // makes it the longer of the two, so the next phase waits for it.
      if (badge) {
        tl.to(badge, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' });
      }
      if (statItems.length) {
        tl.to(
          statItems,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
          },
          badge ? '<' : undefined
        );
      }

      // Finally, once everything above has settled, the CTA buttons slide
      // in from opposite sides — Get Started from the left, Learn More
      // from the right — together.
      if (getStartedBtn) {
        tl.to(getStartedBtn, {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power2.out',
        });
      }
      if (learnMoreBtn) {
        tl.to(
          learnMoreBtn,
          { x: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
          getStartedBtn ? '<' : undefined
        );
      }

      //Parallax Effect
      gsap.to(container, {
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
        y: 100,
        ease: 'none',
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-center items-center px-6 text-white cursor-auto"
    >
      {/* Background Image — loads first, no overlay, no opacity animation */}
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

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-20">

        {/* Certification Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#F5F5F5] mb-8 sm:text-sm font-sm tracking-wide"
        >
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
          <span className="text-[18px] text-[#FAFAFA]">Now supporting IFC4.3 — ISO 16739 certified</span>
        </div>

        {/* Headline */}
        <h1
          ref={titleRef}
          className="text-[48px] font-bold tracking-tight text-[#FAFAFA] leading-[1.3]"
        >
          <div className="overflow-hidden">
            <span className="inline-block">Design,</span>
          </div>
          <div className="overflow-hidden">
            <span className="inline-block">Coordinate,</span>
          </div>
          <div className="overflow-hidden">
            <span className="inline-block">Deliver.</span>
          </div>
        </h1>

        {/* Subtitle */}
        <p
          ref={subtitleRef}
          className="mt-8 text-[18px] sm:text-lg md:text-xl text-[#E5E5E5] font-normal max-w-2xl leading-relaxed"
        >
          Collaborative BIM workflows for architects, engineers, and construction teams from complete lifecycle of asset, on a single platform.
        </p>

        {/* CTA Buttons */}
        <div ref={ctaRef} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button className="px-6 py-3 text-[18px] rounded-full bg-white text-black font-regular hover:bg-gray-200 transition-colors">
            Get Started
          </button>
          <button className="px-6 py-3 text-[18px] rounded-full bg-white/30 border border-white text-white font-regular transition-colors">
            Learn More
          </button>
        </div>
        <div ref={statsRef} className="flex flex-wrap items-start justify-between sm:justify-around py-8 px-2">
        {[
            { title: 'ISO 19650', label: 'Compliant' },
            { title: 'Open BIM', label: 'Open Standards' },
            { title: '99.9%', label: 'Up time' },
            { title: '24/7', label: 'Support' },
        ].map((stat) => (
            <div key={stat.title} className="flex flex-col items-center text-center min-w-[100px]">
            <span className="font-semibold text-[24px] px-3 text-white text-lg sm:text-xl">
                {stat.title}
            </span>
            <span className="text-[16px] text-[#E5E5E5] mt-1">{stat.label}</span>
            </div>
        ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;