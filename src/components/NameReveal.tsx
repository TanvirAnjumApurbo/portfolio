"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Code2, LineChart } from "lucide-react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";
const NAME_MARK = "/images/name.svg";

// name.svg is a logotype with white glyphs on transparent. Its viewBox is
// tightly cropped to the content (0 232.2 1554.432 983.04, aspect ~1.581:1).
// This single placement box is reused by BOTH the photo-mask reveal and the
// solid-white logotype, so they share one coordinate space — the name never
// shifts during the photo→white hand-off, it just changes fill in place.
// The box sits in the upper-middle (content center ~836,310 in the 1672×941
// viewBox) to leave the lower half for the headline + chips, GTA-poster style.
const NAME_IMG = { x: 634, y: 181.5, w: 412, h: 260.5 };
// scaling origin = the logotype's optical centre (shared by both layers)
const NAME_ORIGIN = "836 310";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // photo-window glyphs (the reveal)
  const wordmarkRef = useRef<SVGGElement>(null); // solid-white glyphs (same box)
  const overlayRef = useRef<SVGRectElement>(null); // black sheet behind the name
  const cardRef = useRef<HTMLDivElement>(null); // headline + chips (rise in below)
  const headlineRef = useRef<HTMLHeadingElement>(null); // gradient headline
  const hintRef = useRef<HTMLDivElement>(null); // scroll hint over the bare photo

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reduce) {
        // Static, legible fallback: the finished poster — solid white name on
        // black, headline in its final warm (gold-bottom) gradient, chips shown.
        gsap.set([holesRef.current, wordmarkRef.current], {
          scale: 1,
          svgOrigin: NAME_ORIGIN,
        });
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(wordmarkRef.current, { opacity: 1 });
        gsap.set(cardRef.current, { opacity: 1, y: 0 });
        gsap.set(headlineRef.current, { backgroundPosition: "50% 100%" });
        gsap.set(hintRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=420%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. the letter-windows AND the white wordmark share one scale tween, so
      //    they stay perfectly registered: glyphs start oversized and shrink to
      //    a readable logotype, settling early to hold for a beat
      tl.fromTo(
        [holesRef.current, wordmarkRef.current],
        { scale: 5, svgOrigin: NAME_ORIGIN },
        { scale: 1, svgOrigin: NAME_ORIGIN, ease: "power2.out", duration: 0.5 },
        0,
      );
      // 2. black sheet sweeps in behind the name (before this, full photo)
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.14 }, 0);
      // scroll hint only belongs to the bare-photo moment; gone with the sheet
      tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0);
      // 3. the hand-off: the solid-white wordmark fades in over the settling
      //    photo-glyphs at the SAME box/scale, so the name simply changes fill
      //    (photo → white) in place — no disappearance, no jump, no black gap
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.28, ease: "power1.inOut" },
        0.42,
      );
      // 4. headline + chips rise in below the solidified name, like the poster's
      //    tagline arriving under the logotype
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.28, ease: "power2.out" },
        0.68,
      );
      // 5. closing beat: the headline is already vivid magenta-pink, and a warm
      //    band drifts gently up through the letters (pink → coral → gold) with
      //    a faint brightness lift — colour warming in, not a hard slide
      tl.fromTo(
        headlineRef.current,
        { filter: "brightness(0.92) saturate(0.9)", backgroundPosition: "50% 0%" },
        {
          filter: "brightness(1) saturate(1)",
          backgroundPosition: "50% 100%",
          duration: 0.42,
          ease: "power1.inOut",
        },
        0.92,
      );
      // 6. hold the finished poster after the warm-shift fully resolves, then unpin
      tl.to({}, { duration: 0.12 }, 1.34);
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

      {/* Photo, the photo-window glyphs and the white wordmark all share one SVG
          coordinate space — alignment between them is automatic */}
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

        {/* L4: solid-white wordmark, identical box + scale to the windows above,
            fades in on top so the name turns from photo to white in place */}
        <g ref={wordmarkRef} opacity="0">
          <image
            href={NAME_MARK}
            x={NAME_IMG.x}
            y={NAME_IMG.y}
            width={NAME_IMG.w}
            height={NAME_IMG.h}
            preserveAspectRatio="xMidYMid meet"
          />
        </g>
      </svg>

      {/* scroll hint, only over the bare photo */}
      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2 text-white/45"
      >
        <span className="text-[0.65rem] uppercase tracking-[0.4em]">Scroll</span>
        <span className="h-8 w-px origin-top bg-white/30 animate-[scroll-line_2.4s_ease-in-out_infinite]" />
      </div>

      {/* poster tagline: igniting gradient headline + role chips, below the name */}
      <div
        ref={cardRef}
        className="absolute inset-x-0 top-[54%] z-30 flex flex-col items-center px-6 text-center opacity-0"
      >
        <h2
          ref={headlineRef}
          className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.92] tracking-[-0.01em]"
          style={{
            fontSize: "clamp(2rem, 6.2vw, 4.75rem)",
            background:
              "linear-gradient(165deg, #ff86c2 0%, #f0508c 18%, #e8437d 36%, #f17a54 68%, #fbc35d 100%)",
            backgroundSize: "100% 150%",
            backgroundPosition: "50% 0%",
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
