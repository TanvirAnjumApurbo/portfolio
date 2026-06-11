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
// The release-date headline is painted with a per-line radial heat-field whose
// stop colors live in CSS vars — GSAP tweens the COLORS themselves through the
// reference site's full serial grade: glyphs surface whole from near-black ->
// buried violet-plum ember -> crimson-magenta heat -> a long vivid pink dwell
// with gold blooming from the bottom line's core -> a brief all-gold flood ->
// a dying amber-brown as the light drains back out, bottom line first.
const HERO_LINE_GRADIENT =
  "radial-gradient(ellipse 92% 280% at 50% 56%, var(--c0) 0%, var(--c1) 14%, var(--c2) 30%, var(--c3) 48%, var(--c4) 70%, var(--c5) 100%)";
const IGNITE_VAR_KEYS = ["--c0", "--c1", "--c2", "--c3", "--c4", "--c5"] as const;
// the surfacing state: fully-formed glyphs sitting barely above the black bg
const IGNITE_DARK: Record<string, string> = {
  "--c0": "#3c1742",
  "--c1": "#321238",
  "--c2": "#260d2b",
  "--c3": "#1a091f",
  "--c4": "#100614",
  "--c5": "#09040c",
};
// ramp ends: [0] = top line, [last] = bottom line (bottom always runs
// hotter); lines in between sample their position along that ramp.
const IGNITE_EMBER: Record<string, string>[] = [
  {
    "--c0": "#6e155c",
    "--c1": "#5f1255",
    "--c2": "#480e48",
    "--c3": "#320a38",
    "--c4": "#1d0722",
    "--c5": "#0e0511",
  },
  {
    "--c0": "#8c1c60",
    "--c1": "#781857",
    "--c2": "#5a124b",
    "--c3": "#3e0c3c",
    "--c4": "#240824",
    "--c5": "#100512",
  },
];
const IGNITE_HEAT: Record<string, string>[] = [
  {
    "--c0": "#c92e6e",
    "--c1": "#b62866",
    "--c2": "#97205a",
    "--c3": "#6f184c",
    "--c4": "#3e0e35",
    "--c5": "#150712",
  },
  {
    "--c0": "#df4070",
    "--c1": "#c93468",
    "--c2": "#a8285d",
    "--c3": "#7c1c4e",
    "--c4": "#460f37",
    "--c5": "#170713",
  },
];
// the long held peak, matched to the site's dwell: vivid magenta-pink body
// with the warm gold blooming only from the core, bottom line hotter.
const IGNITE_PEAK: Record<string, string>[] = [
  {
    "--c0": "#ff8e5e",
    "--c1": "#ff5f68",
    "--c2": "#f93b74",
    "--c3": "#d92070",
    "--c4": "#a01361",
    "--c5": "#471040",
  },
  {
    "--c0": "#ffc25c",
    "--c1": "#ff9550",
    "--c2": "#ff5f5e",
    "--c3": "#f23a73",
    "--c4": "#c2186a",
    "--c5": "#5e124a",
  },
];
// the ~half-second pre-drain flood: the whole block goes amber-gold and the
// TOP line is the most golden (the light is already rising out upward)
const IGNITE_FLARE: Record<string, string>[] = [
  {
    "--c0": "#ffd28e",
    "--c1": "#fab97c",
    "--c2": "#e3905f",
    "--c3": "#b35f49",
    "--c4": "#6b3331",
    "--c5": "#221114",
  },
  {
    "--c0": "#ffda9c",
    "--c1": "#fcc084",
    "--c2": "#e69a66",
    "--c3": "#b8654c",
    "--c4": "#703634",
    "--c5": "#241215",
  },
];
// dying state right before the lines alpha out: gold collapsed to umber
const IGNITE_DRAIN: Record<string, string> = {
  "--c0": "#80523c",
  "--c1": "#6e4434",
  "--c2": "#54322a",
  "--c3": "#3a2220",
  "--c4": "#231514",
  "--c5": "#110b0b",
};
// per-line tween values: each line ignites into its own slice of the field,
// interpolated between the ramp's hand-tuned top/bottom ends so the headline
// can carry any number of lines.
const igniteVars = (palettes: Record<string, string>[]) =>
  Object.fromEntries(
    IGNITE_VAR_KEYS.map((key) => [
      key,
      (index: number, _target: unknown, targets: unknown[]) => {
        const span = Math.max(targets.length - 1, 1);
        return gsap.utils.interpolate(
          palettes[0][key],
          palettes[palettes.length - 1][key],
          index / span,
        );
      },
    ]),
  );
// the release-date stack — 3 lines like the reference site's date block
const HEADLINE_LINES = ["Building", "Research-Driven", "AI Systems"];
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
  const heroStageRef = useRef<HTMLDivElement>(null); // name + title stage
  const transitionShadeRef = useRef<HTMLDivElement>(null); // full-page circular darkening
  const cardLayerRef = useRef<HTMLDivElement>(null); // card layer ABOVE the shade, mirrors the stage shrink
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
        gsap.set(heroStageRef.current, {
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "brightness(1) blur(0px)",
        });
        gsap.set(transitionShadeRef.current, { opacity: 0, scale: 1 });
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
          "--line-bloom": "150%",
          ...igniteVars(IGNITE_PEAK),
        });
        gsap.set(roleRailRef.current, { opacity: 0, y: 0, filter: "blur(0px)" });
        gsap.set(aboutBgRef.current, {
          opacity: 1,
          filter: "blur(18px) brightness(0.38)",
          "--about-aperture": "170%",
        });
        gsap.set(aboutPanelRef.current, {
          opacity: 1,
          filter: "blur(0px)",
          "--about-aperture": "170%",
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
          // Extended pin: the headline ignition alone spans ~3 viewport
          // scrolls (the reference arc), then the About reveal rides the tail.
          end: "+=430%",
          // Low scrub so the timeline rides the smoothed Lenis scroll closely
          // instead of trailing a full second behind it.
          scrub: 0.6,
          pin: true,
          anticipatePin: 1,
        },
      });

      gsap.set(heroStageRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "brightness(1) blur(0px)",
        transformOrigin: "50% 50%",
      });
      gsap.set(transitionShadeRef.current, {
        opacity: 0,
        scale: 0.45,
        backgroundColor: "rgba(7, 6, 6, 0)",
        transformOrigin: "50% 54%",
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
      // 4. The lower copy begins while the name is still shrinking into place,
      //    and it inherits the same recession: the block spawns a touch large
      //    and keeps easing smaller the whole time it surfaces — on the site
      //    the logo is mid-shrink and the appearing date text shrinks with it.
      tl.set(cardRef.current, { opacity: 1 }, 0.82);
      tl.fromTo(
        cardRef.current,
        { scale: 1.09 },
        { scale: 1, duration: 1.0, ease: "sine.out" },
        0.85,
      );

      // The headline surfaces as WHOLE glyphs sitting barely above black — no
      // mask wipe. The bloom mask stays fully open; only opacity + the stop
      // colors carry the reveal, exactly like the serial reference frames.
      gsap.set(headlineLines, {
        opacity: 0,
        yPercent: 0,
        filter:
          "brightness(1) saturate(1) blur(1.4px) drop-shadow(0 0 0px rgba(255, 110, 94, 0))",
        "--line-bloom": "150%",
        ...IGNITE_DARK,
        "--release-ignite-y": "135%",
        "--release-ignite-opacity": 0,
      });
      gsap.set(headlineRef.current, {
        filter: "drop-shadow(0 0 0px rgba(255, 96, 84, 0))",
      });
      gsap.set(roleRailRef.current, {
        opacity: 0,
        y: 10,
        color: "rgba(239, 235, 238, 0.18)",
        textShadow: "0 0 0px rgba(255, 255, 255, 0)",
        filter: "brightness(0.42) drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
        "--platform-ignite-y": "132%",
        "--platform-ignite-opacity": 0,
      });

      // 4a. SURFACING — bottom line first, each line fading up whole from
      //     near-black while the name above is still mid-shrink. The ease-in
      //     keeps them buried long, then they resolve — like frame 1 of the
      //     reference where "2026" is barely separable from the background.
      tl.to(
        headlineLines,
        {
          opacity: 1,
          duration: 0.3,
          stagger: { each: 0.16, from: "end" },
          ease: "sine.in",
        },
        0.85,
      );
      tl.to(
        headlineLines,
        {
          filter:
            "brightness(1) saturate(1) blur(0px) drop-shadow(0 0 0px rgba(255, 110, 94, 0))",
          duration: 0.5,
          stagger: { each: 0.12, from: "end" },
          ease: "sine.out",
        },
        1.1,
      );

      // 5. IGNITION — one long continuous climb of the stop colors, each
      //    stage overlapping the next, bottom line always a step ahead:
      //    near-black -> violet-plum ember ...
      tl.to(
        headlineLines,
        {
          ...igniteVars(IGNITE_EMBER),
          duration: 0.4,
          stagger: { each: 0.12, from: "end" },
          ease: "sine.inOut",
        },
        1.1,
      );
      //    ... -> crimson-magenta heat ...
      tl.to(
        headlineLines,
        {
          ...igniteVars(IGNITE_HEAT),
          duration: 0.4,
          stagger: { each: 0.1, from: "end" },
          ease: "sine.inOut",
        },
        1.6,
      );
      //    ... -> the vivid pink peak with gold blooming from the bottom
      //    line's core. This state then DWELLS (the site holds it longest).
      tl.to(
        headlineLines,
        {
          ...igniteVars(IGNITE_PEAK),
          duration: 0.35,
          stagger: { each: 0.08, from: "end" },
          ease: "sine.inOut",
        },
        2.1,
      );
      tl.to(
        headlineLines,
        {
          filter:
            "brightness(1.05) saturate(1.18) blur(0px) drop-shadow(0 0 0px rgba(255, 96, 84, 0))",
          duration: 0.3,
          stagger: { each: 0.06, from: "end" },
          ease: "power1.out",
        },
        2.15,
      );
      //    A rising warm light pass sweeps the lines through the dwell — the
      //    over-brighten that precedes the flood on the site.
      tl.fromTo(
        headlineLines,
        {
          "--release-ignite-y": "135%",
          "--release-ignite-opacity": 0,
        },
        {
          "--release-ignite-y": "26%",
          "--release-ignite-opacity": 0.5,
          duration: 0.3,
          stagger: { each: 0.06, from: "end" },
          ease: "power2.out",
        },
        2.6,
      );
      //    ... -> the brief ALL-GOLD flood, rising bottom -> top (the top
      //    line ends the most golden, the light already leaving upward).
      tl.to(
        headlineLines,
        {
          ...igniteVars(IGNITE_FLARE),
          duration: 0.2,
          stagger: { each: 0.06, from: "end" },
          ease: "power1.inOut",
        },
        2.85,
      );
      // The warm halo lives on the UNMASKED h2 — a drop-shadow inside the lines'
      // bloom mask gets clipped to their border-box and reads as a grey plate.
      tl.to(
        headlineRef.current,
        {
          filter: "drop-shadow(0 0 28px rgba(255, 96, 84, 0.3))",
          duration: 0.22,
          ease: "power1.out",
        },
        2.85,
      );
      tl.to(
        headlineLines,
        {
          "--release-ignite-opacity": 0,
          duration: 0.14,
          stagger: { each: 0.04, from: "end" },
          ease: "power1.out",
        },
        3.08,
      );
      tl.to(
        headlineRef.current,
        {
          filter: "drop-shadow(0 0 0px rgba(255, 96, 84, 0))",
          duration: 0.3,
          ease: "power1.inOut",
        },
        3.2,
      );

      // Once the name has settled, the GTA-site shrink begins: the whole stage
      // (name + title together) recedes while the title is still igniting, and
      // the name — the logo — pulls back further than the title lines. The card
      // lives in its own layer above the shade, so it mirrors the stage here.
      tl.to(
        [heroStageRef.current, cardLayerRef.current],
        {
          scale: 0.83,
          y: -18,
          duration: 0.9,
          ease: "power1.inOut",
        },
        1.02,
      );
      tl.to(
        [holesRef.current, wordmarkRef.current],
        {
          scale: 0.75,
          svgOrigin: NAME_ORIGIN,
          duration: 0.7,
          ease: "power1.inOut",
        },
        1.06,
      );
      // ... and never fully stops: a slow drift keeps the whole ensemble
      // receding through the dwell, so the scene always feels like the
      // site's continuous pull-back.
      tl.to(
        [heroStageRef.current, cardLayerRef.current],
        { scale: 0.79, duration: 1.3, ease: "none" },
        2.0,
      );
      tl.to(
        transitionShadeRef.current,
        {
          opacity: 0.2,
          scale: 0.82,
          duration: 0.42,
          ease: "power1.out",
        },
        1.02,
      );

      // 5b. The role rail mirrors the platform line: on the site the platform
      //    icons only surface once the text is already vivid pink, dim grey,
      //    with a tight sheen riding through as the block floods.
      tl.fromTo(
        roleRailRef.current,
        {
          opacity: 0,
          y: 10,
          color: "rgba(239, 235, 238, 0.18)",
          textShadow: "0 0 0px rgba(255, 255, 255, 0)",
          filter: "brightness(0.42) drop-shadow(0 0 0px rgba(255, 255, 255, 0))",
        },
        {
          opacity: 1,
          y: 0,
          color: "rgba(240, 236, 238, 0.85)",
          textShadow: "0 0 14px rgba(255, 255, 255, 0.14)",
          filter: "brightness(1) drop-shadow(0 0 9px rgba(255, 255, 255, 0.16))",
          duration: 0.44,
          ease: "power2.out",
        },
        2.0,
      );
      tl.fromTo(
        roleRailRef.current,
        {
          "--platform-ignite-y": "132%",
          "--platform-ignite-opacity": 0,
        },
        {
          "--platform-ignite-y": "34%",
          "--platform-ignite-opacity": 0.85,
          duration: 0.3,
          ease: "power2.out",
        },
        2.45,
      );
      tl.to(
        roleRailRef.current,
        {
          "--platform-ignite-opacity": 0,
          duration: 0.14,
          ease: "power1.out",
        },
        3.0,
      );
      tl.to(
        transitionShadeRef.current,
        {
          opacity: 0.4,
          scale: 1.45,
          duration: 0.42,
          ease: "power1.inOut",
        },
        2.7,
      );
      // 6. THE LIGHT DRAINS — the gold collapses to a dying umber and then the
      //    lines alpha out, bottom line first (the light exits upward, the top
      //    line keeping a last gold kiss), while the About scene surfaces.
      tl.to(
        headlineLines,
        {
          ...igniteVars([IGNITE_DRAIN, IGNITE_DRAIN]),
          filter:
            "brightness(0.82) saturate(0.9) blur(0.4px) drop-shadow(0 0 0px rgba(255, 96, 84, 0))",
          duration: 0.24,
          // bottom line cools first — on the site the light exits upward
          stagger: { each: 0.05, from: "end" },
          ease: "power1.inOut",
        },
        3.16,
      );
      tl.to(
        headlineLines,
        {
          opacity: 0,
          filter:
            "brightness(0.45) saturate(0.8) blur(2.5px) drop-shadow(0 0 0px rgba(255, 45, 118, 0))",
          duration: 0.3,
          stagger: { each: 0.06, from: "end" },
          ease: "power1.inOut",
        },
        3.34,
      );
      tl.to(
        transitionShadeRef.current,
        {
          opacity: 1,
          scale: 2.55,
          backgroundColor: "rgba(7, 6, 6, 0.96)",
          duration: 0.32,
          ease: "power2.inOut",
        },
        3.36,
      );
      tl.to(
        roleRailRef.current,
        { opacity: 0, y: -8, filter: "brightness(0.2) blur(2px)", duration: 0.26 },
        3.3,
      );
      tl.to(
        cardRef.current,
        {
          opacity: 0,
          y: -30,
          scale: 0.9,
          filter: "brightness(0.16) blur(14px)",
          duration: 0.42,
          ease: "power2.inOut",
        },
        3.4,
      );
      tl.to(
        heroStageRef.current,
        {
          opacity: 0,
          scale: 0.73,
          filter: "brightness(0) blur(3px)",
          duration: 0.42,
          ease: "power2.inOut",
        },
        3.48,
      );
      // keep the dying card moving with the stage (its fade is its own tween)
      tl.to(
        cardLayerRef.current,
        { scale: 0.73, duration: 0.42, ease: "power2.inOut" },
        3.48,
      );
      tl.to(
        wordmarkRef.current,
        { opacity: 0, duration: 0.22, ease: "power1.inOut" },
        3.52,
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
        3.42,
      );
      tl.to(
        transitionShadeRef.current,
        {
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
        },
        3.7,
      );
      // The About scene opens through a circular aperture that grows out of
      // the dying light's center, instead of a side wipe.
      tl.fromTo(
        [aboutBgRef.current, aboutPanelRef.current],
        { "--about-aperture": "0%" },
        {
          "--about-aperture": "155%",
          duration: 0.58,
          ease: "power1.inOut",
        },
        3.42,
      );
      tl.fromTo(
        aboutPanelRef.current,
        {
          opacity: 0,
          filter: "blur(16px)",
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.46,
          ease: "power3.out",
        },
        3.54,
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
        3.58,
      );
      tl.fromTo(
        aboutText,
        { backgroundPosition: ABOUT_GRADIENT_START },
        {
          backgroundPosition: ABOUT_GRADIENT_END,
          duration: 0.55,
          ease: "power1.inOut",
        },
        3.64,
      );
      tl.to({}, { duration: 0.11 }, 4.19);
    },
    {
      scope: sectionRef,
      // If the line structure changes (a dev Fast Refresh can swap spans under
      // a live timeline), fully revert and rebind so no line is left orphaned
      // on the stylesheet's static ember colors.
      dependencies: [HEADLINE_LINES.length],
      revertOnUpdate: true,
    },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Tanvir Anjum Apurbo intro"
      className="relative h-screen w-full overflow-hidden bg-[#070606]"
    >
      <h1 className="sr-only">Tanvir Anjum Apurbo</h1>

      <div
        ref={heroStageRef}
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          transformOrigin: "50% 50%",
          willChange: "opacity, transform, filter",
        }}
      >
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

      </div>

      <div
        ref={transitionShadeRef}
        className="hero-circle-dim pointer-events-none absolute inset-[-14%] z-20 opacity-0"
        aria-hidden="true"
      />

      {/* poster tagline: igniting gradient headline + role chips, below the name.
          It rides its own layer ABOVE the circular shade (z-40 > z-20) so the
          vignette dims the scene behind it but never veils the writing; the
          layer mirrors heroStage's shrink tweens to stay in step with the name. */}
      <div
        ref={cardLayerRef}
        className="pointer-events-none absolute inset-0 z-40"
        style={{ transformOrigin: "50% 50%", willChange: "transform" }}
      >
        <div
          ref={cardRef}
          className="absolute inset-x-0 top-[52%] flex flex-col items-center px-5 text-center opacity-0"
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
              // Glow is animated per-line via drop-shadow during the ignition, so
              // the headline stays glowless while it is still a cold ember.
              textShadow: "none",
              willChange: "filter",
            }}
          >
            {HEADLINE_LINES.map((line, index) => (
              <span
                key={line}
                ref={(node) => {
                  headlineLineRefs.current[index] = node;
                }}
                className="hero-release-line block will-change-[opacity,transform,filter]"
                style={{
                  backgroundImage: HERO_LINE_GRADIENT,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  willChange: "opacity, transform, filter",
                }}
              >
                {line}
                <span className="hero-release-sheen" aria-hidden="true">
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <ul
            ref={roleRailRef}
            className="hero-platform-rail mt-9 flex flex-wrap items-center justify-center gap-x-9 gap-y-3 text-white/70 sm:mt-11"
          >
            <li className="flex items-center gap-2">
              <Code2 className="h-[1.05em] w-[1.05em]" strokeWidth={1.75} aria-hidden="true" />
              <span
                className="hero-platform-label text-[0.78rem] uppercase tracking-[0.2em] sm:text-sm"
              >
                Engineering
                <span className="hero-platform-label-sheen" aria-hidden="true">
                  Engineering
                </span>
              </span>
            </li>
            <li className="flex items-center gap-2">
              <LineChart className="h-[1.05em] w-[1.05em]" strokeWidth={1.75} aria-hidden="true" />
              <span
                className="hero-platform-label text-[0.78rem] uppercase tracking-[0.2em] sm:text-sm"
              >
                Data Science
                <span className="hero-platform-label-sheen" aria-hidden="true">
                  Data Science
                </span>
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div
        ref={aboutBgRef}
        className="about-aperture pointer-events-none absolute inset-[-8%] z-20 opacity-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7, 6, 10, 0.96) 0%, rgba(7, 6, 10, 0.84) 48%, rgba(7, 6, 10, 0.94) 100%), url('/images/hero-photo.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "opacity, transform, filter",
        }}
      />

      <div
        ref={aboutPanelRef}
        className="about-aperture absolute inset-x-0 top-[18%] z-30 flex justify-center px-[6vw] opacity-0 sm:top-[23%] md:top-[26%]"
        style={{
          willChange: "opacity, filter",
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
