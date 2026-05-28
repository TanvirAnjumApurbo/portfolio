"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";

// The photo and the cut-out letters live in one SVG coordinate space
// (0 0 1672 941 — the photo's native aspect), so the holes line up with the
// photo automatically. Letters are tuned to read at scale 1 on the narrowest
// target (390px) where `slice` scales the viewBox up by height.
const NAME_LINES = [
  { text: "TANVIR", y: 394 },
  { text: "ANJUM", y: 506 },
  { text: "APURBO", y: 618 },
];
const NAME_FONT_SIZE = 100;
// optical center of the 3-line block ≈ viewport center; letters scale from here
const NAME_ORIGIN = "836 470";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // the punched-out letters (scale these)
  const overlayRef = useRef<SVGRectElement>(null); // black sheet
  const cardRef = useRef<HTMLDivElement>(null); // final solid logo
  const hintRef = useRef<HTMLDivElement>(null); // scroll hint over the bare photo

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        // Static, legible fallback: name shown as windows onto the still photo.
        // No pin, no scrub — the masked state is the hero.
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(hintRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. letters start oversized and shrink to readable — the core reveal
      tl.fromTo(
        holesRef.current,
        { scale: 5, svgOrigin: NAME_ORIGIN },
        { scale: 1, svgOrigin: NAME_ORIGIN, ease: "power2.out", duration: 1 },
        0,
      );
      // 2. black sheet sweeps in at the very start (before this, full photo)
      tl.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.12 },
        0,
      );
      // scroll hint only belongs to the bare-photo moment; gone with the sheet
      tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0);
      // 3. land on the solid logo before releasing into About
      tl.fromTo(
        cardRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.18 },
        0.82,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Tanvir Anjum Apurbo intro"
      className="relative h-screen w-full overflow-hidden bg-[#070606]"
    >
      <h1 className="sr-only">Tanvir Anjum Apurbo</h1>

      {/* Photo + cut-out letters share one SVG coordinate space — alignment is automatic */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <mask
            id="nameCut"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1672"
            height="941"
          >
            <rect x="0" y="0" width="1672" height="941" fill="#fff" />
            <g
              ref={holesRef}
              fill="#000"
              textAnchor="middle"
              fontWeight={900}
              style={{
                fontFamily: "var(--font-display), system-ui, sans-serif",
              }}
            >
              {NAME_LINES.map((line) => (
                <text key={line.text} x="836" y={line.y} fontSize={NAME_FONT_SIZE}>
                  {line.text}
                </text>
              ))}
            </g>
          </mask>
        </defs>

        {/* the hero photo — the letters reveal THIS */}
        <image
          href={HERO_PHOTO}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* black sheet with the name cut out; holes reveal the photo above */}
        <rect
          ref={overlayRef}
          x="0"
          y="0"
          width="1672"
          height="941"
          fill="#070606"
          mask="url(#nameCut)"
          opacity="0"
        />
      </svg>

      {/* scroll hint, only over the bare photo */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/45"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-8 w-px origin-top bg-white/30 animate-[scroll-line_2.4s_ease-in-out_infinite]" />
      </div>

      {/* title card; fades in to land the logo before About */}
      <div
        ref={cardRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070606] opacity-0"
      >
        <div
          className="text-center font-[family-name:var(--font-display)] font-black leading-[0.95] tracking-[-0.02em]"
          style={{
            fontSize: "clamp(2.5rem, 8vw, 6rem)",
            background:
              "linear-gradient(160deg, #f6f2f4 0%, #ff5fb7 52%, #ffd56c 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          TANVIR
          <br />
          ANJUM
          <br />
          APURBO
        </div>
        <p className="mt-6 text-[0.7rem] uppercase tracking-[0.35em] text-white/40 md:text-xs">
          ML · Computer Vision · Full-stack
        </p>
      </div>
    </section>
  );
}
