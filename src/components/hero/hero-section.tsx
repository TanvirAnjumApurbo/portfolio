"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { HeroBackground } from "./hero-background";
import { HeroPhoto } from "./hero-photo";
import { HeroScrollHint } from "./hero-scroll-hint";
import { HeroGrainOverlay } from "./hero-grain-overlay";

export function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=200%",
          pin: true,
          scrub: 2,
          anticipatePin: 1,
        },
      });

      // Photo fades out with scale + blur as user scrolls
      tl.to("[data-hero-photo]", {
        opacity: 0,
        scale: 1.15,
        filter: "blur(10px)",
        duration: 0.8,
        ease: "power1.inOut",
      }, 0);

      tl.to("[data-hero-scroll-hint]", {
        opacity: 0,
        duration: 0.15,
      }, 0);
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
    >
      <HeroBackground />
      <HeroPhoto />
      <HeroGrainOverlay />
      <HeroScrollHint />
    </section>
  );
}
