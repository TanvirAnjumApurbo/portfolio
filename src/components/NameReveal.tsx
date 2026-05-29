"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";
const NAME_MARK = "/images/name.svg";

// name.svg is a logotype with white glyphs on transparent. Its viewBox is
// tightly cropped to the content (0 232.2 1554.432 983.04, aspect ~1.581:1),
// content center ~(762.2, 717.2) within that box. This single placement box
// matches that aspect ratio and lands the content center on the viewport
// center (836, 470), sized to fit a 390px viewport. The reveal mask and the
// end card BOTH use it, so they are pixel-aligned. Nudge x/y if the logotype
// looks off-center after a future name.svg edit.
const NAME_IMG = { x: 634, y: 341.5, w: 412, h: 260.5 };
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
                width={NAME_IMG.w}
                height={NAME_IMG.h}
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

      {/* title card; same placement box as the reveal (so the letterforms are
          pixel-aligned), gradient-filled, over a solid sheet */}
      <div
        ref={cardRef}
        className="absolute inset-0 z-20 bg-[#070606] opacity-0"
      >
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 1672 941"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <defs>
            <mask
              id="cardNameMask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1672"
              height="941"
            >
              <image
                href={NAME_MARK}
                x={NAME_IMG.x}
                y={NAME_IMG.y}
                width={NAME_IMG.w}
                height={NAME_IMG.h}
                preserveAspectRatio="xMidYMid meet"
              />
            </mask>
            <linearGradient id="cardNameGrad" x1="0" y1="0" x2="0.45" y2="1">
              <stop offset="0%" stopColor="#f6f2f4" />
              <stop offset="52%" stopColor="#ff5fb7" />
              <stop offset="100%" stopColor="#ffd56c" />
            </linearGradient>
          </defs>
          <rect
            x={NAME_IMG.x}
            y={NAME_IMG.y}
            width={NAME_IMG.w}
            height={NAME_IMG.h}
            fill="url(#cardNameGrad)"
            mask="url(#cardNameMask)"
          />
          <text
            x="836"
            y={NAME_IMG.y + NAME_IMG.h + 46}
            textAnchor="middle"
            fontSize="17"
            letterSpacing="5"
            fill="#ffffff"
            fillOpacity="0.4"
            style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
          >
            ML · COMPUTER VISION · FULL-STACK
          </text>
        </svg>
      </div>
    </section>
  );
}
