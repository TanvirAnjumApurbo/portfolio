"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";
const NAME_MARK = "/images/name.svg";

// name.svg is a 1536² logotype with white glyphs on transparent and a
// deliberately staggered 3-line layout. Measured content box (source units):
//   x:[4.9, 1519.4]  y:[246.9, 1187.5]   center (762.2, 717.2)
// Placing the 1536² square at (x,y,size) below maps that content center to the
// viewport center (836, 470) and sizes the logotype to fit a 390px viewport.
const NAME_IMG = { x: 630, y: 276, size: 416 };
// scaling origin = the logotype's optical center (also the viewport center)
const NAME_ORIGIN = "836 470";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // the white-glyph windows (scale these)
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

      // 1. letter-windows start oversized and shrink to readable — the core reveal
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
      // 3. land on the solid gradient logo before releasing into About
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

      {/* Photo + the name.svg windows share one SVG coordinate space — alignment is automatic */}
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 1672 941"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          {/* white glyphs = "reveal the photo here"; everywhere else stays hidden */}
          <mask
            id="nameMask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="1672"
            height="941"
          >
            <g ref={holesRef}>
              <image
                href={NAME_MARK}
                x={NAME_IMG.x}
                y={NAME_IMG.y}
                width={NAME_IMG.size}
                height={NAME_IMG.size}
                preserveAspectRatio="xMidYMid meet"
              />
            </g>
          </mask>
        </defs>

        {/* L1: the hero photo fills the screen */}
        <image
          href={HERO_PHOTO}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid slice"
        />

        {/* L2: black sheet sweeps in to cover the photo */}
        <rect
          ref={overlayRef}
          x="0"
          y="0"
          width="1672"
          height="941"
          fill="#070606"
          opacity="0"
        />

        {/* L3: the same fixed photo, revealed only through the letter-windows */}
        <image
          href={HERO_PHOTO}
          x="0"
          y="0"
          width="1672"
          height="941"
          preserveAspectRatio="xMidYMid slice"
          mask="url(#nameMask)"
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

      {/* title card; the same name.svg letterforms, gradient-filled, so the
          shapes are continuous with the reveal */}
      <div
        ref={cardRef}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#070606] opacity-0"
      >
        <svg
          className="w-[clamp(280px,58vw,460px)]"
          viewBox="4.9 246.9 1514.6 940.6"
          aria-hidden="true"
        >
          <defs>
            <mask
              id="cardNameMask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1536"
              height="1536"
            >
              <image href={NAME_MARK} x="0" y="0" width="1536" height="1536" />
            </mask>
            <linearGradient id="cardNameGrad" x1="0" y1="0" x2="0.45" y2="1">
              <stop offset="0%" stopColor="#f6f2f4" />
              <stop offset="52%" stopColor="#ff5fb7" />
              <stop offset="100%" stopColor="#ffd56c" />
            </linearGradient>
          </defs>
          <rect
            x="4.9"
            y="246.9"
            width="1514.6"
            height="940.6"
            fill="url(#cardNameGrad)"
            mask="url(#cardNameMask)"
          />
        </svg>
        <p className="mt-6 text-[0.7rem] uppercase tracking-[0.35em] text-white/40 md:text-xs">
          ML · Computer Vision · Full-stack
        </p>
      </div>
    </section>
  );
}
