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

// The hero opens zoomed so far into the middle line ("anjum") that the first
// frame reads as abstract photo, not a glyph. A geometric ease pulls it back at
// a constant *perceived* zoom rate (scale = START_SCALE^(1−p)) — a smooth
// dolly-out across the huge range, never a linear rush through the middle.
const START_SCALE = 50;
const zoomOutEase = (p: number) =>
  (START_SCALE - START_SCALE ** (1 - p)) / (START_SCALE - 1);

// The hero photo OPENS slightly zoomed-in (PHOTO_ZOOM) and de-zooms to a perfect
// fit (1.0) as scrolling begins — it reads as a gentle shrink while the photo
// always stays full-bleed (no black border). The de-zoom overlaps the start of
// the glyph pull-out, so it runs straight into the letters with no pause.
const PHOTO_ZOOM = 1.16;
// how long the de-zoom takes; long enough to overlap the letters emerging so
// the shrink flows seamlessly into the reveal (no gap), short enough to read.
const PHOTO_DEZOOM_DUR = 0.35;
// origin for the photo's de-zoom = centre of the 1672×941 viewBox
const PHOTO_ORIGIN = "836 470.5";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // photo-window glyphs (the reveal)
  const wordmarkRef = useRef<SVGGElement>(null); // solid-white glyphs (same box)
  const bgPhotoRef = useRef<SVGImageElement>(null); // full-bleed hero photo (L1)
  const photoRef = useRef<SVGImageElement>(null); // photo inside the windows (L3)
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
        gsap.set([bgPhotoRef.current, photoRef.current], {
          scale: 1,
          svgOrigin: PHOTO_ORIGIN,
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
          end: "+=480%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // 1. OPENING SHRINK — the photo opens slightly zoomed-in (PHOTO_ZOOM,
      //    still full-bleed) and de-zooms to a perfect fit (1.0) as scrolling
      //    starts. Through the still-giant glyph the whole screen IS this photo,
      //    so the de-zoom reads as a gentle shrink — but the photo always covers
      //    the frame, so there's no black edge. It runs from the very first
      //    pixel and its tail overlaps the letters emerging (see below), so the
      //    shrink flows straight into the reveal with no pause. Both photo layers
      //    move together so they stay identical.
      tl.fromTo(
        [bgPhotoRef.current, photoRef.current],
        { scale: PHOTO_ZOOM, svgOrigin: PHOTO_ORIGIN },
        {
          scale: 1,
          svgOrigin: PHOTO_ORIGIN,
          duration: PHOTO_DEZOOM_DUR,
          ease: "power1.out",
        },
        0,
      );

      // 2. the letters come: the windows AND the white wordmark share one long
      //    scale tween, so they stay perfectly registered. It starts enormous
      //    (START_SCALE — so big it covers the whole screen as the photo, hiding
      //    that it's a glyph) and the geometric ease dollies back at a constant
      //    perceived zoom rate. It also starts at 0 and runs UNDER the photo
      //    de-zoom: while the glyph still covers everything you only see the
      //    photo shrink, then the letters resolve out of it — one continuous move.
      tl.fromTo(
        [holesRef.current, wordmarkRef.current],
        { scale: START_SCALE, svgOrigin: NAME_ORIGIN },
        { scale: 1, svgOrigin: NAME_ORIGIN, ease: zoomOutEase, duration: 1.0 },
        0,
      );
      // black sheet sweeps in behind the name as the letters part from the photo
      tl.fromTo(overlayRef.current, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0);
      // scroll hint belongs to the full-photo opening; gone once the letters come
      tl.to(hintRef.current, { opacity: 0, duration: 0.08 }, 0);
      // 3. the photo → white hand-off begins EARLY, while the letters are still
      //    large (~scale 10.5 — only a few glyphs on screen, like the reference),
      //    and dissolves VERY slowly to solid white by a medium size (~scale 1.8).
      //    The long linear dissolve makes the opacity step down gently (100% →
      //    90% → …) over a big scroll interval as the name keeps shrinking, so
      //    the wash-out reads clearly — then it carries on shrinking as white
      tl.fromTo(
        wordmarkRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.45, ease: "none" },
        0.4,
      );
      // 4. once the white name has shrunk enough to clear the space below it,
      //    the tagline starts IGNITING (faint at first), then keeps rising as
      //    the name settles — like the date glowing in under the logotype
      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
        0.9,
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
        1.1,
      );
      // 6. hold the finished poster after the warm-shift fully resolves, then unpin
      tl.to({}, { duration: 0.12 }, 1.52);
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
          ref={bgPhotoRef}
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

        {/* L3: the same photo, revealed only through the letter-windows. The
            mask sits on the GROUP (no transform) so the windows stay locked to
            the white wordmark; only the photo INSIDE scales, so the opening
            zoom-out never knocks the name out of registration. */}
        <g mask="url(#nameMask)">
          <image
            ref={photoRef}
            href={HERO_PHOTO}
            x="0"
            y="0"
            width="1672"
            height="941"
            preserveAspectRatio="xMidYMid slice"
          />
        </g>

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
