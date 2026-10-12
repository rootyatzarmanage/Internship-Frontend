import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Lightbulb,
  Box,
  Users,
  ShieldCheck,
  HardHat,
  CircleCheck,
  type LucideIcon,
} from "lucide-react";

// NOTE: file names are case-sensitive on Linux hosts (Vercel, Netlify, etc).
// These must match the files in src/assets EXACTLY (all lowercase here).
import concept from "../../assets/concept.png";
import modeling from "../../assets/modeling.png";
import collab from "../../assets/collab.png";
import clash from "../../assets/clash.png";
import construction from "../../assets/construction.png";
import handover from "../../assets/handover.png";

gsap.registerPlugin(ScrollTrigger);

const W = 1000;
const H = 400;
const DURATION = 2; // seconds to draw the whole line
const SAMPLES_PER_SEGMENT = 40;

type Pt = { x: number; y: number };

// gentle wave that rises left -> right
const CONTROL: Pt[] = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  return {
    x: 20 + 940 * t,
    y: 305 - 110 * t + 14 * Math.sin(t * Math.PI * 6),
  };
});

const dist = (a: Pt, b: Pt) => Math.hypot(b.x - a.x, b.y - a.y);

// centripetal Catmull-Rom (Barry-Goldman), same curve type as before
function catmullRom(p0: Pt, p1: Pt, p2: Pt, p3: Pt, t: number): Pt {
  const t0 = 0;
  const t1 = t0 + Math.sqrt(dist(p0, p1));
  const t2 = t1 + Math.sqrt(dist(p1, p2));
  const t3 = t2 + Math.sqrt(dist(p2, p3));
  const tt = t1 + (t2 - t1) * t;

  const mix = (a: Pt, b: Pt, ta: number, tb: number): Pt => {
    const k = (tt - ta) / (tb - ta);
    return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k };
  };

  const a1 = mix(p0, p1, t0, t1);
  const a2 = mix(p1, p2, t1, t2);
  const a3 = mix(p2, p3, t2, t3);
  const b1 = mix(a1, a2, t0, t2);
  const b2 = mix(a2, a3, t1, t3);
  return mix(b1, b2, t1, t2);
}

function buildCurve(points: Pt[]) {
  const n = points.length;
  // phantom end points so the curve passes through the first and last control point
  const first = {
    x: 2 * points[0].x - points[1].x,
    y: 2 * points[0].y - points[1].y,
  };
  const last = {
    x: 2 * points[n - 1].x - points[n - 2].x,
    y: 2 * points[n - 1].y - points[n - 2].y,
  };
  const ext = [first, ...points, last];

  const samples: Pt[] = [];
  for (let i = 0; i < n - 1; i++) {
    for (let s = 0; s < SAMPLES_PER_SEGMENT; s++) {
      samples.push(
        catmullRom(ext[i], ext[i + 1], ext[i + 2], ext[i + 3], s / SAMPLES_PER_SEGMENT)
      );
    }
  }
  samples.push(points[n - 1]);

  // cumulative arc length
  const cum: number[] = [0];
  for (let i = 1; i < samples.length; i++) {
    cum.push(cum[i - 1] + dist(samples[i - 1], samples[i]));
  }
  const total = cum[cum.length - 1];

  // index of the sample at arc-length fraction u
  const locate = (u: number) => {
    const target = Math.min(Math.max(u, 0), 1) * total;
    let lo = 0;
    let hi = cum.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] <= target) lo = mid;
      else hi = mid;
    }
    const span = cum[hi] - cum[lo] || 1;
    return { lo, hi, k: (target - cum[lo]) / span };
  };

  const pointAt = (u: number): Pt => {
    const { lo, hi, k } = locate(u);
    return {
      x: samples[lo].x + (samples[hi].x - samples[lo].x) * k,
      y: samples[lo].y + (samples[hi].y - samples[lo].y) * k,
    };
  };

  const angleAtEnd = () => {
    const a = samples[samples.length - 2];
    const b = samples[samples.length - 1];
    return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
  };

  const d = samples
    .map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`)
    .join(" ");

  return { d, pointAt, angleAtEnd };
}

const CURVE = buildCurve(CONTROL);

/* ------------------------------------------------------------------ */
/* Content                                                             */
/* ------------------------------------------------------------------ */
const STOPS: {
  u: number;
  label: string;
  sketch: string;
  Icon: LucideIcon;
}[] = [
  { u: 0.07, label: "Concept & Planning", sketch: concept, Icon: Lightbulb },
  { u: 0.23, label: "3D BIM Modeling", sketch: modeling, Icon: Box },
  { u: 0.4, label: "Collaboration & Coordination", sketch: collab, Icon: Users },
  { u: 0.57, label: "Clash Detection & Validation", sketch: clash, Icon: ShieldCheck },
  { u: 0.74, label: "Construction Support", sketch: construction, Icon: HardHat },
  { u: 0.9, label: "Project Delivery & Handover", sketch: handover, Icon: CircleCheck },
];

const toPct = (p: Pt) => ({
  left: `${(p.x / W) * 100}%`,
  top: `${(p.y / H) * 100}%`,
});

const STOP_POS = STOPS.map((s) => toPct(CURVE.pointAt(s.u)));
const END_POS = toPct(CURVE.pointAt(1));
const END_DEG = CURVE.angleAtEnd();

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */
export default function FlowAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const path = pathRef.current;
    if (!root || !path) return;

    const ctx = gsap.context(() => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const stops = gsap.utils.toArray<HTMLElement>(".flow-stop");
      const end = root.querySelector(".flow-end");
      const len = path.getTotalLength();

      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      gsap.set(".flow-dot, .flow-sketch, .flow-label, .flow-end", {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });

      // linear ease so time maps 1:1 to distance along the line
      tl.to(path, { strokeDashoffset: 0, duration: DURATION, ease: "none" }, 0);

      stops.forEach((el, i) => {
        const t = STOPS[i].u * DURATION; // moment the line reaches this stop
        tl.fromTo(
          el.querySelector(".flow-dot"),
          { scale: 0 },
          { scale: 1, autoAlpha: 1, duration: 0.35, ease: "back.out(3)" },
          t
        )
          .fromTo(
            el.querySelector(".flow-sketch"),
            { y: 24, scale: 0.7 },
            { y: 0, scale: 1, autoAlpha: 1, duration: 0.6, ease: "power3.out" },
            t + 0.05
          )
          .fromTo(
            el.querySelector(".flow-label"),
            { y: -10 },
            { y: 0, autoAlpha: 1, duration: 0.5, ease: "power2.out" },
            t + 0.15
          );
      });

      tl.fromTo(
        end,
        { scale: 0 },
        { scale: 1, autoAlpha: 1, duration: 0.4, ease: "back.out(2)" },
        DURATION - 0.1
      );
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    // small screens: keep a readable width and scroll sideways
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
      <div
        ref={rootRef}
        className="relative mx-auto aspect-[5/2] w-full min-w-[640px] max-w-[1100px] [container-type:inline-size] sm:min-w-0"
      >
        {/* the line; stroke width scales with the container */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
          className="absolute inset-0 h-full w-full"
          fill="none"
          aria-hidden="true"
        >
          <path
            ref={pathRef}
            d={CURVE.d}
            stroke="white"
            strokeWidth={2.6}
            strokeLinejoin="round"
          />
        </svg>

        {STOPS.map(({ label, sketch, Icon }, i) => (
          <div
            key={label}
            className="flow-stop absolute h-0 w-0"
            style={STOP_POS[i]}
          >
            {/* sketch above the dot */}
            <img
              src={sketch}
              alt=""
              loading="lazy"
              decoding="async"
              className="flow-sketch absolute bottom-[2cqw] left-0 -ml-[6cqw] w-[12cqw] max-w-none object-contain brightness-0 invert"
            />
            {/* dot on the line */}
            <span className="flow-dot absolute left-0 top-0 -ml-[0.7cqw] -mt-[0.7cqw] h-[1.4cqw] w-[1.4cqw] rounded-full border-2 border-white bg-[#171717]" />
            {/* icon + label below */}
            <div className="flow-label absolute left-0 top-[2cqw] -ml-[6.5cqw] flex w-[13cqw] flex-col items-center gap-[0.5cqw] text-center">
              <Icon
                className="h-[1.8cqw] w-[1.8cqw] min-h-[10px] min-w-[10px] text-white"
                strokeWidth={1.5}
              />
              <span className="text-[clamp(8px,1.15cqw,13px)] leading-tight text-white/90">
                {label}
              </span>
            </div>
          </div>
        ))}

        {/* arrow head at the end of the line */}
        <div className="flow-end absolute h-0 w-0" style={END_POS}>
          <svg
            viewBox="0 0 24 24"
            className="absolute left-0 top-0 -ml-[1.4cqw] -mt-[1.4cqw] h-[2.8cqw] w-[2.8cqw]"
            style={{ transform: `rotate(${END_DEG}deg)` }}
            fill="none"
            stroke="white"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}