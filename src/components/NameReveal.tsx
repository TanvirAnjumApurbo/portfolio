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
const HERO_TITLE_GRADIENT =
  "linear-gradient(170deg, #5d0c55 0%, #b11279 22%, #ee2e73 45%, #ff8769 68%, #ffd36a 100%)";
const ABOUT_COPY = [
  "I am most myself in the quiet hours, when a hard problem and a clear mind",
  "are the only two things in the room. Curiosity is the engine; patience is the wheel.",
  "I move slowly enough to understand and quickly enough to keep pace with my own questions,",
  "and I've learned that the things worth building are rarely the things that come easy.",
  "So I reach for what sits just past the edge of the known — not loudly, not in a hurry,",
  "but with the steady certainty of someone who has decided that limits exist only to be moved.",
  "Calm is not the absence of ambition. In me, it's the shape ambition takes.",
];
const ABOUT_TEXT = `about me.\n\n${ABOUT_COPY.join(" ")}`;
const ABOUT_COPY_GRADIENT =
  "radial-gradient(ellipse 42% 72% at 50% 50%, #ffa377 0%, #ff796d 18%, #f45274 36%, #c23576 56%, #7a1f5f 78%, #271027 100%)";
const ABOUT_GRADIENT_SIZE = "155% 280%";
const ABOUT_GRADIENT_START = "50% 0%";
const ABOUT_GRADIENT_END = "50% 78%";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const holesRef = useRef<SVGGElement>(null); // photo-window glyphs (the reveal)
  const wordmarkRef = useRef<SVGGElement>(null); // solid-white glyphs (same box)
  const bgPhotoRef = useRef<SVGImageElement>(null); // full-bleed hero photo (L1)
  const photoRef = useRef<SVGImageElement>(null); // photo inside the windows (L3)
  const overlayRef = useRef<SVGRectElement>(null); // black sheet behind the name
  const cardRef = useRef<HTMLDivElement>(null); // headline + chips (rise in below)
  const headlineRef = useRef<HTMLHeadingElement>(null); // gradient headline
  const headlineLineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const roleRailRef = useRef<HTMLUListElement>(null);
  const aboutBgRef = useRef<HTMLDivElement>(null);
  const aboutPanelRef = useRef<HTMLDivElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLDivElement>(null); // scroll hint over the bare photo

  useGSAP(
    () => {
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const headlineLines = headlineLineRefs.current.filter(Boolean);
      const aboutText = aboutTextRef.current;

      if (reduce) {
        // Static, legible fallback: show the final About state without the
        // scroll-scrubbed handoff.
        gsap.set([holesRef.current, wordmarkRef.current], {
          scale: 1,
          svgOrigin: NAME_ORIGIN,
        });
        gsap.set([bgPhotoRef.current, photoRef.current], {
          scale: 1,
          svgOrigin: PHOTO_ORIGIN,
        });
        gsap.set(overlayRef.current, { opacity: 1 });
        gsap.set(wordmarkRef.current, { opacity: 0 });
        gsap.set(cardRef.current, {
          opacity: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set(headlineLineRefs.current, {
          opacity: 0,
          y: 0,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          backgroundPosition: "50% 100%",
        });
        gsap.set(roleRailRef.current, { opacity: 0, y: 0, filter: "blur(0px)" });
        gsap.set(headlineRef.current, {
          backgroundPosition: "50% 100%",
          filter: "brightness(1) saturate(1)",
        });
        gsap.set(aboutBgRef.current, { opacity: 1, filter: "blur(18px) brightness(0.38)" });
        gsap.set(aboutPanelRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
        });
        gsap.set(aboutText, {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          backgroundPosition: ABOUT_GRADIENT_END,
        });
        gsap.set(hintRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          // Extended pin keeps the title wipe and About reveal in one viewport
          // before the next content section enters.
          end: "+=330%",
          // Low scrub so the timeline rides the smoothed Lenis scroll closely
          // instead of trailing a full second behind it.
          scrub: 0.6,
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
        {
          opacity: 0,
          filter: "blur(16px)",
          clipPath: "inset(0% 0% 0% 0%)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.42,
          ease: "power3.out",
        },
        0.9,
      );
      tl.fromTo(
        headlineLines,
        {
          opacity: 0,
          filter: "blur(14px)",
          clipPath: "inset(0% 0% 0% 0%)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.32,
          stagger: 0.055,
          ease: "power3.out",
        },
        0.94,
      );
      tl.fromTo(
        roleRailRef.current,
        { opacity: 0, filter: "blur(10px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.26,
          ease: "power2.out",
        },
        1.15,
      );
      // 5. closing beat: the headline is already vivid magenta-pink, and a warm
      //    band drifts gently up through the letters (pink → coral → gold) with
      //    a faint brightness lift — colour warming in, not a hard slide
      tl.fromTo(
        headlineRef.current,
        { filter: "brightness(0.92) saturate(0.9)" },
        {
          filter: "brightness(1.08) saturate(1.08)",
          duration: 0.58,
          ease: "power1.inOut",
        },
        0.98,
      );
      tl.fromTo(
        headlineLines,
        { backgroundPosition: "50% 0%" },
        {
          backgroundPosition: "50% 100%",
          duration: 0.58,
          ease: "power1.inOut",
        },
        0.98,
      );
      // 6. Hold the finished title briefly, then wipe it away in place.
      tl.to({}, { duration: 0.18 }, 1.58);
      tl.to(
        cardRef.current,
        {
          opacity: 0,
          filter: "blur(10px)",
          clipPath: "inset(0% 0% 0% 100%)",
          duration: 0.28,
          ease: "power2.inOut",
        },
        1.74,
      );
      tl.to(
        wordmarkRef.current,
        { opacity: 0, duration: 0.22, ease: "power1.inOut" },
        1.78,
      );
      tl.fromTo(
        aboutBgRef.current,
        { opacity: 0, scale: 1.08, filter: "blur(28px) brightness(0.18)" },
        {
          opacity: 1,
          scale: 1,
          filter: "blur(18px) brightness(0.36)",
          duration: 0.48,
          ease: "power2.out",
        },
        1.78,
      );
      tl.fromTo(
        aboutPanelRef.current,
        {
          opacity: 0,
          filter: "blur(16px)",
          clipPath: "inset(0% 100% 0% 0%)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 0.46,
          ease: "power3.out",
        },
        1.9,
      );
      tl.fromTo(
        aboutText,
        { opacity: 0, filter: "blur(12px)" },
        {
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.035,
          duration: 0.36,
          ease: "power2.out",
        },
        1.94,
      );
      tl.fromTo(
        aboutText,
        { backgroundPosition: ABOUT_GRADIENT_START },
        {
          backgroundPosition: ABOUT_GRADIENT_END,
          duration: 0.72,
          ease: "power1.inOut",
        },
        1.98,
      );
      tl.to({}, { duration: 0.68 }, 2.42);
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

      <div
        ref={aboutBgRef}
        className="pointer-events-none absolute inset-[-8%] z-20 opacity-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7, 6, 10, 0.96) 0%, rgba(7, 6, 10, 0.84) 48%, rgba(7, 6, 10, 0.94) 100%), url('/images/hero-photo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "opacity, transform, filter",
        }}
      />

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
        className="absolute inset-x-0 top-[52%] z-30 flex flex-col items-center px-5 text-center opacity-0"
        style={{
          willChange: "opacity, transform, filter, clip-path",
        }}
      >
        <h2
          ref={headlineRef}
          className="font-[family-name:var(--font-display)] font-black uppercase leading-[0.88]"
          style={{
            fontSize: "clamp(2.25rem, 7vw, 6.75rem)",
            letterSpacing: "0",
            textShadow: "0 0 34px rgba(224, 31, 126, 0.18)",
            willChange: "filter",
          }}
        >
          {["Building", "Research-Driven AI"].map((line, index) => (
            <span
              key={line}
              ref={(node) => {
                headlineLineRefs.current[index] = node;
              }}
              className="block will-change-[opacity,transform,filter,clip-path]"
              style={{
                background: HERO_TITLE_GRADIENT,
                backgroundSize: "100% 180%",
                backgroundPosition: "50% 0%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                willChange: "opacity, transform, filter, clip-path, background-position",
              }}
            >
              {line}
            </span>
          ))}
        </h2>

        <ul
          ref={roleRailRef}
          className="mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-white/70 sm:mt-11"
        >
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

      <div
        ref={aboutPanelRef}
        className="absolute inset-x-0 top-[18%] z-30 flex justify-center px-[6vw] opacity-0 sm:top-[23%] md:top-[26%]"
        style={{
          clipPath: "inset(0% 100% 0% 0%)",
          willChange: "opacity, filter, clip-path",
        }}
      >
        <h2 className="sr-only">About me</h2>
        <p
          ref={aboutTextRef}
          aria-label={ABOUT_TEXT.replace(/\s+/g, " ")}
          className="about-copy-surface mx-auto w-full max-w-[72rem] whitespace-pre-line text-left font-[family-name:var(--font-display)] font-extrabold leading-[1.14]"
          style={{
            background: ABOUT_COPY_GRADIENT,
            backgroundSize: ABOUT_GRADIENT_SIZE,
            backgroundPosition: ABOUT_GRADIENT_START,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
            fontSize: "clamp(1.25rem, 2.3vw, 2.25rem)",
            letterSpacing: "0",
            textShadow: "0 0 24px rgba(255, 91, 112, 0.18)",
            willChange: "opacity, filter, background-position",
          }}
        >
          {ABOUT_TEXT}
        </p>
      </div>
    </section>
  );
}
