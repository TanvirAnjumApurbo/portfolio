"use client";

const research = [
  {
    title: "Weighted Probabilistic Classification",
    area: "Machine Learning",
    summary:
      "Novel approach to classification using weighted probability distributions for improved prediction accuracy on imbalanced datasets.",
    keywords: ["probability", "classification", "weighted models"],
    links: [
      { label: "Paper", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
  {
    title: "Bangla Handwritten Character Recognition",
    area: "Computer Vision",
    summary:
      "Deep learning pipeline using CNN and ResNet architectures for accurate recognition of handwritten Bangla characters.",
    keywords: ["cnn", "resnet", "bangla", "deep learning"],
    links: [
      { label: "Paper", href: "#" },
      { label: "Methodology", href: "#" },
    ],
  },
  {
    title: "Image Processing Research",
    area: "Computer Vision",
    summary:
      "Exploring advanced image processing techniques for feature extraction and visual pattern analysis.",
    keywords: ["opencv", "feature extraction", "image processing"],
    links: [
      { label: "Summary", href: "#" },
      { label: "GitHub", href: "#" },
    ],
  },
];

export function ResearchSection() {
  return (
    <section
      className="relative py-32"
      style={{
        background:
          "linear-gradient(180deg, #0b0b11 0%, #0d0d14 50%, #0a0a0f 100%)",
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
          research work.
        </h2>

        <div className="space-y-6">
          {research.map((item, i) => (
            <div
              key={i}
              className="relative border border-white/[0.06] rounded-2xl p-8 md:p-10 grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 md:gap-12 items-start transition-colors hover:border-white/[0.12]"
              style={{
                background:
                  "linear-gradient(160deg, rgba(255,255,255,0.02) 0%, transparent 100%)",
              }}
            >
              <div>
                <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[#e84393]/70 mb-3 block">
                  {item.area}
                </span>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold lowercase leading-[1.15] tracking-[-0.02em] text-foreground mb-3"
                  style={{ fontSize: "clamp(1.3rem, 2vw, 1.75rem)" }}
                >
                  {item.title}
                </h3>
                <p className="text-sm leading-[1.7] text-white/45 mb-5 max-w-xl">
                  {item.summary}
                </p>
                <div className="flex flex-wrap gap-2">
                  {item.keywords.map((kw) => (
                    <span
                      key={kw}
                      className="text-[0.6rem] uppercase tracking-[0.1em] text-white/25 bg-white/[0.04] rounded-full px-3 py-1"
                    >
                      {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-row md:flex-col gap-3 md:gap-2 md:pt-6">
                {item.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-sm text-white/50 hover:text-white transition-colors underline underline-offset-4 decoration-white/15 hover:decoration-white/40"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
