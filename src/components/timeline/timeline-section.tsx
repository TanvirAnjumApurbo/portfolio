"use client";

const items = [
  {
    year: "2018",
    title: "SSC",
    description: "Secondary School Certificate — foundation years.",
  },
  {
    year: "2020",
    title: "HSC",
    description: "Higher Secondary Certificate — science track.",
  },
  {
    year: "2021",
    title: "B.Sc. in CSE",
    description: "Started Computer Science & Engineering degree.",
  },
  {
    year: "2024",
    title: "Research & Thesis",
    description:
      "Focused on ML classification, Bangla character recognition, and computer vision research.",
  },
  {
    year: "next",
    title: "Future",
    description:
      "Graduate studies, deeper AI research, and building impactful software.",
  },
];

export function TimelineSection() {
  return (
    <section
      className="relative py-32"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #0c0c12 50%, #0a0a10 100%)",
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
          journey.
        </h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[18px] md:left-[22px] top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-14">
            {items.map((item, i) => (
              <div key={i} className="relative flex gap-8 md:gap-12">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0 mt-1">
                  <div
                    className="w-[10px] h-[10px] md:w-[12px] md:h-[12px] rounded-full border-2"
                    style={{
                      borderColor:
                        item.year === "next"
                          ? "#e84393"
                          : "rgba(255,255,255,0.15)",
                      background:
                        item.year === "next"
                          ? "#e84393"
                          : "rgba(255,255,255,0.05)",
                      marginLeft: "13px",
                    }}
                  />
                </div>

                {/* Content */}
                <div>
                  <span
                    className="font-mono text-white/25 block mb-2"
                    style={{ fontSize: "clamp(0.7rem, 1vw, 0.85rem)" }}
                  >
                    {item.year}
                  </span>
                  <h3
                    className="font-[family-name:var(--font-display)] font-bold lowercase leading-[1.15] tracking-[-0.02em] text-foreground mb-2"
                    style={{ fontSize: "clamp(1.2rem, 2vw, 1.6rem)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-sm leading-[1.6] text-white/40 max-w-md">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
