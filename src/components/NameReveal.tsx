"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "@/lib/gsap";

const HERO_PHOTO = "/images/hero-photo.png";
const NAME_MARK = "/images/name.svg";

export function NameReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const section = sectionRef.current;
      const mark = markRef.current;
      if (!section || !mark) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      gsap.set(mark, {
        scale: 12,
        x: "10vw",
        y: "6vh",
        opacity: 1,
        transformOrigin: "50% 50%",
      });

      gsap.set("[data-name-outline]", { opacity: 0 });

      tl.fromTo(
        "[data-name-photo]",
        { opacity: 1, scale: 1 },
        {
          opacity: 0.08,
          scale: 1.12,
          duration: 0.42,
          ease: "power2.out",
        },
        0,
      );

      tl.fromTo(
        "[data-name-matte]",
        { opacity: 0 },
        { opacity: 0.96, duration: 0.42, ease: "power2.out" },
        0,
      );

      tl.to(
        mark,
        {
          scale: 0.72,
          x: 0,
          y: "-24vh",
          duration: 0.64,
          ease: "power4.out",
        },
        0.03,
      );

      tl.to(
        "[data-name-outline]",
        { opacity: 1, duration: 0.24, ease: "power2.out" },
        0.22,
      );

      tl.to(
        mark,
        {
          scale: 0.66,
          y: "-26vh",
          duration: 0.16,
          ease: "none",
        },
        0.66,
      );

      tl.to(
        mark,
        {
          opacity: 0,
          scale: 0.5,
          y: "-34vh",
          duration: 0.2,
          ease: "power2.inOut",
        },
        0.82,
      );
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      aria-label="Tanvir Anjum Apurbo name reveal"
      className="relative h-screen w-full overflow-hidden bg-[#070606]"
    >
      <h1 className="sr-only">Tanvir Anjum Apurbo</h1>

      <div
        data-name-photo
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${HERO_PHOTO})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
          transformOrigin: "center center",
          willChange: "opacity, transform",
        }}
      />

      <div
        data-name-matte
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 34%, rgba(45, 18, 31, 0.8) 0%, rgba(7, 6, 6, 0.96) 58%, #070606 100%)",
          willChange: "opacity",
        }}
      />

      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div
          ref={markRef}
          className="w-[min(88vw,960px)]"
          style={{
            aspectRatio: "1536 / 930",
            willChange: "transform, opacity",
          }}
        >
          <svg
            className="block h-full w-full overflow-visible"
            viewBox="0 220 1536 930"
            aria-hidden="true"
          >
            <defs>
              <mask
                id="tanvir-svg-name-mask"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="1536"
                height="1536"
                style={{ maskType: "alpha" }}
              >
                <image
                  href={NAME_MARK}
                  x="0"
                  y="0"
                  width="1536"
                  height="1536"
                  preserveAspectRatio="xMidYMid meet"
                />
              </mask>

              <linearGradient id="tanvir-svg-name-tint" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.62" />
                <stop offset="48%" stopColor="#ff5fb7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ffd56c" stopOpacity="0.34" />
              </linearGradient>
            </defs>

            <g data-name-outline opacity="0">
              <image
                href={NAME_MARK}
                x="-11"
                y="-11"
                width="1558"
                height="1558"
                preserveAspectRatio="xMidYMid meet"
                opacity="0.95"
              />
            </g>

            <g mask="url(#tanvir-svg-name-mask)">
              <image
                href={HERO_PHOTO}
                x="-155"
                y="92"
                width="1846"
                height="1248"
                preserveAspectRatio="xMidYMid slice"
              />
              <rect
                x="0"
                y="0"
                width="1536"
                height="1536"
                fill="url(#tanvir-svg-name-tint)"
              />
            </g>
          </svg>
        </div>
      </div>
    </section>
  );
}
