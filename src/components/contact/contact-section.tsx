"use client";

export function ContactSection() {
  return (
    <section
      className="relative min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(ellipse at 50% 60%, #151520 0%, #0a0a0f 70%)",
      }}
    >
      <div className="text-center px-[6vw] py-32">
        <h2
          className="font-[family-name:var(--font-display)] font-black lowercase leading-[1] tracking-[-0.03em] mb-8"
          style={{
            fontSize: "clamp(2.5rem, 6vw, 6rem)",
            background: "linear-gradient(135deg, #e84393, #d63384, #a855f7)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          let&apos;s build something
          <br />
          research-driven.
        </h2>

        <p className="text-white/40 text-sm md:text-base mb-12 max-w-md mx-auto">
          Open to research collaborations, interesting projects, and
          opportunities.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium transition-all"
            style={{
              background: "linear-gradient(135deg, #e84393, #d63384)",
              color: "#fff",
            }}
          >
            Download CV
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/[0.1] text-sm text-white/60 hover:text-white hover:border-white/[0.25] transition-all"
          >
            GitHub
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/[0.1] text-sm text-white/60 hover:text-white hover:border-white/[0.25] transition-all"
          >
            LinkedIn
          </a>
          <a
            href="#"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/[0.1] text-sm text-white/60 hover:text-white hover:border-white/[0.25] transition-all"
          >
            Email
          </a>
        </div>
      </div>
    </section>
  );
}
