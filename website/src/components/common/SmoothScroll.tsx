import { useEffect, type PropsWithChildren } from "react";
import Lenis from "lenis";

export default function SmoothScroll({ children }: PropsWithChildren) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      smoothWheel: true,
    });

    let frameId = 0;

    const animate = (time: number) => {
      lenis.raf(time);
      frameId = window.requestAnimationFrame(animate);
    };

    frameId = window.requestAnimationFrame(animate);

    return () => {
      window.cancelAnimationFrame(frameId);
      lenis.destroy();
    };
  }, []);

  return children;
}
