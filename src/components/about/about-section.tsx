"use client";

export function AboutSection() {
  return (
    <section
      className="relative min-h-screen flex items-center"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #111118 40%, #0e0e14 100%)",
      }}
    >
      <div className="w-full max-w-[1400px] px-[6vw] py-32 md:ml-[10vw]">
        <h2
          className="font-[family-name:var(--font-display)] font-black lowercase leading-[1] tracking-[-0.03em] mb-10"
          style={{
            fontSize: "clamp(2.5rem, 5.5vw, 5rem)",
            background: "linear-gradient(135deg, #e84393, #d63384)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          about me.
        </h2>
        <p
          className="font-sans leading-[1.65]"
          style={{
            fontSize: "clamp(1.15rem, 2.4vw, 1.85rem)",
            background:
              "linear-gradient(160deg, #e84393 0%, #cc5eaa 25%, #b07cc0 50%, #9a8ab5 75%, #8a8a9a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          A CSE student driven by curiosity at the intersection of machine
          learning, computer vision, and full-stack development. Building
          research-driven software that bridges the gap between academic
          exploration and real-world impact — from weighted probabilistic
          classification to handwritten character recognition, from scalable web
          platforms to intelligent visual systems.
        </p>
      </div>
    </section>
  );
}
