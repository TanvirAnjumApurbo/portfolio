"use client";

const chapters = [
  {
    number: "01",
    title: "machine learning research",
    description:
      "Exploring probabilistic models and classification systems that push the boundaries of data-driven decision making.",
    tags: ["python", "scikit-learn", "pandas", "numpy"],
  },
  {
    number: "02",
    title: "computer vision",
    description:
      "Building intelligent visual systems — from handwritten character recognition to image processing pipelines.",
    tags: ["opencv", "cnn", "resnet", "google colab"],
  },
  {
    number: "03",
    title: "full-stack development",
    description:
      "Crafting scalable web platforms with modern frameworks, clean architecture, and research-driven features.",
    tags: ["next.js", "react", "django", "typescript"],
  },
];

export function ChaptersSection() {
  return (
    <section
      className="relative py-32"
      style={{
        background:
          "linear-gradient(180deg, #0e0e14 0%, #0a0a0f 50%, #0c0c12 100%)",
      }}
    >
      <div className="px-[6vw] md:px-[10vw]">
        <h2
          className="font-[family-name:var(--font-display)] font-black lowercase leading-[1] tracking-[-0.03em] mb-20"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            background: "linear-gradient(135deg, #e84393, #d63384)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          what i do.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {chapters.map((chapter) => (
            <div
              key={chapter.number}
              className="group relative border border-white/[0.06] rounded-2xl p-8 md:p-10 transition-colors hover:border-white/[0.12]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              }}
            >
              <span className="text-sm font-mono text-white/20 mb-4 block">
                {chapter.number}
              </span>
              <h3
                className="font-[family-name:var(--font-display)] font-bold lowercase leading-[1.1] tracking-[-0.02em] text-foreground mb-4"
                style={{ fontSize: "clamp(1.4rem, 2.2vw, 2rem)" }}
              >
                {chapter.title}
              </h3>
              <p className="text-sm leading-[1.7] text-white/50 mb-6">
                {chapter.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {chapter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[0.65rem] uppercase tracking-[0.1em] text-white/30 border border-white/[0.08] rounded-full px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
