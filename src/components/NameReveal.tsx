"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Code2, LineChart } from "lucide-react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";
const NAME_MARK = "/images/name.svg";

// name.svg is a logotype with white glyphs on transparent. Its viewBox is
// tightly cropped to the content (0 232.2 1554.432 983.04, aspect ~1.581:1),
// content center ~(762.2, 717.2) within that box. This single placement box
// matches that aspect ratio and lands the content center on the viewport
// center (836, 470), sized to fit a 390px viewport. Nudge x/y if the logotype
// looks off-center after a future name.svg edit.
const NAME_IMG = { x: 634, y: 341.5, w: 412, h: 260.5 };
// scaling origin = the logotype's optical center (also the viewport center)
const NAME_ORIGIN = "836 470";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // the white-glyph windows (scale these)
  const overlayRef = useRef<SVGRectElement>(null); // black sheet
  const cardSheetRef = useRef<HTMLDivElement>(null); // solid sheet that lands first
  const cardRef = useRef<HTMLDivElement>(null); // poster content (slides + fades in)
  const headlineRef = useRef<HTMLHeadingElement>(null); // gradient headline that ignites
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
          end: "+=360%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. letter-windows start oversized and shrink to readable, settling
      //    early so the readable name can hold for a beat
      tl.fromTo(
        holesRef.current,
        { scale: 5, svgOrigin: NAME_ORIGIN },
        { scale: 1, svgOrigin: NAME_ORIGIN, ease: "power2.out", duration: 0.5 },
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
      // 3. dissolve to the poster: the sheet eases up over the settled reveal
      tl.fromTo(
        cardSheetRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.24, ease: "power1.inOut" },
        0.5,
      );
      // 4. poster content fades + rises in, overlapping the dissolve
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 42 },
        { opacity: 1, y: 0, duration: 0.26, ease: "power2.out" },
        0.6,
      );
      // 5. the signature beat: the headline ignites — a dim, desaturated shape
      //    brightens + saturates into the full gradient as you keep scrolling,
      //    with a subtle drift so the colour also flows through the letters
      tl.fromTo(
        headlineRef.current,
        { filter: "brightness(0.35) saturate(0.5)", backgroundPosition: "50% 0%" },
        {
          filter: "brightness(1) saturate(1)",
          backgroundPosition: "50% 100%",
          duration: 0.36,
          ease: "power1.inOut",
        },
        0.66,
      );
      // 6. hold the finished poster before the section unpins
      tl.to({}, { duration: 0.12 }, 1.0);
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

      {/* solid sheet — lands first to cover the reveal */}
      <div
        ref={cardSheetRef}
        className="absolute inset-0 z-20 bg-[#070606] opacity-0"
      />

      {/* final poster: white logotype up top, igniting gradient headline, role chips */}
      <div
        ref={cardRef}
        className="absolute inset-0 z-30 flex flex-col items-center justify-center px-6 pb-[10vh] text-center opacity-0"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={NAME_MARK}
          alt="Tanvir Anjum Apurbo"
          draggable={false}
          className="h-auto w-[clamp(210px,40vw,540px)] select-none"
        />

        <h2
          ref={headlineRef}
          className="mt-12 font-[family-name:var(--font-display)] font-black uppercase leading-[0.92] tracking-[-0.01em] sm:mt-16"
          style={{
            fontSize: "clamp(2rem, 6.2vw, 4.75rem)",
            background:
              "linear-gradient(168deg, #ffb0d8 0%, #ff5fa6 32%, #e84393 58%, #ff7a52 100%)",
            backgroundSize: "100% 135%",
            backgroundPosition: "50% 100%",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            willChange: "filter, background-position, opacity, transform",
          }}
        >
          Building
          <br />
          Research-Driven AI
        </h2>

        <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-white/65 sm:mt-12">
          <li className="flex items-center gap-2">
            <Code2 className="h-[1.05em] w-[1.05em]" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[0.78rem] uppercase tracking-[0.2em] sm:text-sm">
              Engineering
            </span>
          </li>
          <li className="flex items-center gap-2">
            <LineChart className="h-[1.05em] w-[1.05em]" strokeWidth={1.75} aria-hidden="true" />
            <span className="text-[0.78rem] uppercase tracking-[0.2em] sm:text-sm">
              Data Science
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
