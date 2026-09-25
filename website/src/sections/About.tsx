import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import image1 from '../assets/image-45.png'
import image2 from '../assets/image-46.png'
import image3 from '../assets/image-47.png'
import image4 from '../assets/image-48.png'
import image5 from '../assets/image-49.png'
import image6 from '../assets/image-50.png'

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<SVGPathElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // -----------------------------
      // Connecting line animation
      // -----------------------------
      const line = lineRef.current;

      if (line) {
        const length = line.getTotalLength();

        gsap.set(line, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });

        gsap.to(line, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            end: "bottom 75%",
            scrub: 1,
          },
        });
      }

      // -----------------------------
      // Feature animations
      // -----------------------------
      itemsRef.current.forEach((item, index) => {
        if (!item) return;

        const image = item.querySelector(".feature-image");
        const content = item.querySelector(".feature-content");
        const number = item.querySelector(".feature-number");

        gsap.fromTo(
          content,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.fromTo(
          number,
          {
            opacity: 0,
            scale: 0.7,
          },
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "back.out(1.7)",
            delay: index * 0.05,
            scrollTrigger: {
              trigger: item,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );

        if (image) {
          gsap.fromTo(
            image,
            {
              opacity: 0,
              scale: 0.92,
              y: 30,
            },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      // -----------------------------
      // Header animation
      // -----------------------------
      gsap.fromTo(
        ".platform-header > *",
        {
          opacity: 0,
          y: 30,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".platform-header",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const addItemRef = (el: HTMLDivElement | null) => {
    if (el && !itemsRef.current.includes(el)) {
      itemsRef.current.push(el);
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#151515] px-6 py-28 text-white md:px-12 lg:px-20"
    >
      {/* =====================================
          HEADER
      ====================================== */}
      <div className="platform-header mx-auto max-w-3xl text-center">
        <p className="mb-6 text-sm font-medium uppercase tracking-wide text-white">
          Platform
        </p>

        <h2 className="text-4xl font-semibold tracking-tight md:text-5xl">
          Everything your team needs
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-sm leading-6 text-white/80 md:text-base">
          From model review to cost control, manage every phase of
          <br className="hidden md:block" />
          your BIM workflow.
        </p>
      </div>

      {/* =====================================
          FEATURES WRAPPER
      ====================================== */}
      <div className="relative mx-auto mt-24 max-w-[1100px]">

        {/* =====================================
            CONNECTING SVG LINE
        ====================================== */}
        <svg className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full md:block"
            viewBox="0 0 1200 1800"
            fill="none"
            preserveAspectRatio="none"
            >
            <path
        ref={lineRef}
        d="
            M 15 40

            L 15 270
            Q 15 300 30 300
            L 580 300
            Q 610 300 610 330

            L 610 570
            Q 610 600 580 600
            L 30 600
            Q 0 600 0 630

            L 0 870
            Q 0 900 30 900
            L 580 900
            Q 610 900 610 930

            L 610 1170
            Q 610 1200 580 1200
            L 30 1200
            Q 0 1200 0 1230

            L 0 1470
            Q 0 1500 30 1500
            L 580 1500
            Q 610 1500 610 1530

            L 610 1770
        "
        stroke="white"
        strokeWidth="3"
        />

{/* Top ball */}
<circle
  cx="15"
  cy="40"
  r="15"
  fill="white"
/>

{/* Bottom ball */}
<circle
  cx="610"
  cy="1770"
  r="15"
  fill="white"
/>
</svg>

        {/* =====================================
            FEATURE 01
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2 md:pl-12"
        >
          {/* Content */}
          <div className="feature-content order-2 md:order-1">
            <div className="feature-number mb-7 text-4xl font-semibold">
              01
            </div>

            <h3 className="text-lg font-semibold">
              CDE
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
              ISO 19650-compliant Common Data Environment for
              structured document and model management across
              project lifecycles.
            </p>
          </div>

          {/* Image */}
          <div className="feature-image order-1 overflow-hidden md:order-2">
            <img
              src={image1}
              alt="Construction project"
              className="h-[200px] w-[400px] rounded-xl object-cover grayscale"
            />
          </div>
        </div>

        {/* =====================================
            FEATURE 02
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2"
        >
          {/* Image */}
          <div className="feature-image overflow-hidden rounded-2xl">
            <img
              src={image2}
              alt="3D building model"
              className="h-[200px] w-[400px] object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="feature-content md:pl-12">
            <div className="feature-number mb-7 text-4xl font-semibold">
              02
            </div>

            <h3 className="text-lg font-semibold">
              IFC Viewer
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
              High-performance 3D viewer for IFC models with
              section planes, measurements, clash detection,
              and annotation tools.
            </p>
          </div>
        </div>

        {/* =====================================
            FEATURE 03
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2 md:pl-12"
        >
          {/* Content */}
          <div className="feature-content order-2 md:order-1">
            <div className="feature-number mb-7 text-4xl font-semibold">
              03
            </div>

            <h3 className="text-lg font-semibold">
              BIM Collaboration
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
              Real-time collaboration on BIM models with version
              control, issue tracking, and multi-disciplinary
              coordination.
            </p>
          </div>

          {/* Image */}
          <div className="feature-image order-1 overflow-hidden md:order-2">
            <img
              src={image3}
              alt="BIM collaboration"
              className="h-[200px] w-[400px] object-cover rounded-xl grayscale"
            />
          </div>
        </div>

        {/* =====================================
            FEATURE 04
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2"
        >
          {/* Image */}
          <div className="feature-image overflow-hidden rounded-2xl">
            <img
              src={image4}
              alt="Quantity Takeoff"
              className="h-[200px] w-[400px] object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="feature-content md:pl-12">
            <div className="feature-number mb-7 text-4xl font-semibold">
              04
            </div>

            <h3 className="text-lg font-semibold">
              Quantity Takeoff
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
              Automated quantity extraction from IFC models with custom rules, formulas, and export to cost estimation tools.
            </p>
          </div>
        </div>

        {/* =====================================
            FEATURE 05
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2 md:pl-12"
        >
          {/* Content */}
          <div className="feature-content order-2 md:order-1">
            <div className="feature-number mb-7 text-4xl font-semibold">
              05
            </div>

            <h3 className="text-lg font-semibold">
              Scheduling
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
              BIM scheduling linking model elements to construction timelines with visual progress tracking and milestone management.
            </p>
          </div>

          {/* Image */}
          <div className="feature-image order-1 overflow-hidden md:order-2">
            <img
              src={image5}
              alt="BIM collaboration"
              className="h-[200px] w-[400px] object-cover rounded-xl grayscale"
            />
          </div>
        </div>

        {/* =====================================
            FEATURE 06
        ====================================== */}
        <div
          ref={addItemRef}
          className="relative z-10 grid min-h-[300px] items-center gap-10 md:grid-cols-2"
        >
          {/* Image */}
          <div className="feature-image overflow-hidden rounded-2xl">
            <img
              src={image6}
              alt="Quantity Takeoff"
              className="h-[200px] w-[400px] object-cover grayscale"
            />
          </div>

          {/* Content */}
          <div className="feature-content md:pl-12">
            <div className="feature-number mb-7 text-4xl font-semibold">
              06
            </div>

            <h3 className="text-lg font-semibold">
              Cost Management
            </h3>

            <p className="mt-3 max-w-[430px] text-sm leading-6 text-white/80">
                BIM cost integration with live quantity links, budget tracking, and automated cost reporting across project phases.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;