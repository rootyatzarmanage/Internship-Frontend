import { useEffect, useRef } from "react";
import * as THREE from "three";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
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

import concept from "../../assets/concept.png";
import modeling from "../../assets/modeling.png";
import collab from "../../assets/collab.png";
import clash from "../../assets/clash.png";
import construction from "../../assets/construction.png";
import handover from "../../assets/handover.png";

gsap.registerPlugin(ScrollTrigger);

// ---------- path (design space: 1000 x 400, y up inside three.js) ----------
const W = 1000;
const H = 400;
const SEGMENTS = 600; // line resolution
const DURATION = 2; // seconds to draw the whole line

// gentle wave that rises left -> right
const CONTROL = Array.from({ length: 15 }, (_, i) => {
  const t = i / 14;
  const x = 20 + 940 * t;
  const yDown = 305 - 110 * t + 14 * Math.sin(t * Math.PI * 6);
  return new THREE.Vector3(x, H - yDown, 0);
});
const CURVE = new THREE.CatmullRomCurve3(CONTROL, false, "centripetal");

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

const toPct = (p: THREE.Vector3) => ({
  left: `${(p.x / W) * 100}%`,
  top: `${((H - p.y) / H) * 100}%`,
});

const STOP_POS = STOPS.map((s) => toPct(CURVE.getPointAt(s.u)));
const END_POS = toPct(CURVE.getPointAt(1));
const END_TANGENT = CURVE.getTangentAt(1);
const END_DEG = -(Math.atan2(END_TANGENT.y, END_TANGENT.x) * 180) / Math.PI;

export default function FlowAnimation() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    // ---------- three.js scene ----------
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, W, H, 0, -1, 1);

    const geo = new LineGeometry();
    geo.setPositions(
      CURVE.getSpacedPoints(SEGMENTS).flatMap((p) => [p.x, p.y, p.z])
    );
    const mat = new LineMaterial({ color: 0xffffff, linewidth: 2 });
    const line = new Line2(geo, mat);
    scene.add(line);

    const state = { p: 0 };
    const render = () => {
      geo.instanceCount = Math.round(state.p * SEGMENTS); // draws the first N segments
      renderer.render(scene, camera);
    };

    const resize = () => {
      const w = root.clientWidth;
      const h = root.clientHeight;
      renderer.setSize(w, h, false);
      mat.resolution.set(w, h);
      mat.linewidth = Math.max(1.5, (w / W) * 2.6); // keep line weight proportional
      render();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    // ---------- GSAP: draw the line, reveal each stop when it arrives ----------
    const ctx = gsap.context(() => {
      const stops = gsap.utils.toArray<HTMLElement>(".flow-stop");
      const end = root.querySelector(".flow-end");

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        state.p = 1;
        render();
        return;
      }

      gsap.set(".flow-dot, .flow-sketch, .flow-label, .flow-end", {
        autoAlpha: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: root, start: "top 85%", once: true },
      });

      // linear ease so "time" maps 1:1 to "distance along the line"
      tl.to(state, { p: 1, duration: DURATION, ease: "none", onUpdate: render }, 0);

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

    return () => {
      ctx.revert();
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    // small screens: keep a readable width and scroll sideways
    <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
      <div
        ref={rootRef}
        className="relative mx-auto aspect-[5/2] w-full min-w-[640px] max-w-[1100px] [container-type:inline-size] sm:min-w-0"
      >
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

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
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </div>
      </div>
    </div>
  );
}