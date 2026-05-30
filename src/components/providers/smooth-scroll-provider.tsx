"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Respect reduced motion: skip inertial smoothing entirely.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ScrollTrigger.refresh();
      return;
    }

    // Lenis gives the scroll inertia/glide (the "buttery" feel); a short
    // duration keeps a single flick gliding far enough to carry the pinned
    // hero through in roughly one scroll, without feeling floaty.
    const lenis = new Lenis({
      duration: 0.9,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
    });

    // Drive Lenis from GSAP's ticker and keep ScrollTrigger in lock-step, so
    // the scrubbed timeline tracks the smoothed scroll position exactly.
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
