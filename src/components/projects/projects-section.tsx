"use client";

const projects = [
  {
    title: "porta",
    subtitle: "Global Crowd-Shipping Marketplace",
    description:
      "A platform connecting travelers with senders for cost-effective international shipping through crowd-sourced delivery.",
    tags: ["next.js", "typescript", "django", "mysql"],
    status: "In Progress",
    links: [
      { label: "GitHub", href: "#" },
      { label: "Details", href: "#" },
    ],
  },
];

export function ProjectsSection() {
  return (
    <section
      className="relative py-32"
      style={{
        background:
          "linear-gradient(180deg, #0c0c12 0%, #0a0a10 50%, #0b0b11 100%)",
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
          selected projects.
        </h2>

        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project.title}
              className="relative grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 border border-white/[0.06] rounded-2xl overflow-hidden"
            >
              {/* Visual placeholder */}
              <div
                className="aspect-[16/10] md:aspect-auto"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(232,67,147,0.08) 0%, rgba(100,80,160,0.06) 50%, rgba(30,30,50,0.1) 100%)",
                }}
              >
                <div className="h-full flex items-center justify-center">
                  <span className="text-white/10 text-sm uppercase tracking-[0.2em]">
                    Project Visual
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 md:p-10 md:py-12 flex flex-col justify-center">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[0.65rem] uppercase tracking-[0.15em] text-[#e84393] border border-[#e84393]/20 rounded-full px-3 py-1">
                    {project.status}
                  </span>
                </div>
                <h3
                  className="font-[family-name:var(--font-display)] font-bold lowercase leading-[1.1] tracking-[-0.02em] text-foreground mb-2"
                  style={{ fontSize: "clamp(2rem, 3.5vw, 3.5rem)" }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-white/40 lowercase mb-4"
                  style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.15rem)" }}
                >
                  {project.subtitle}
                </p>
                <p className="text-sm leading-[1.7] text-white/50 mb-6 max-w-md">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.65rem] uppercase tracking-[0.1em] text-white/30 border border-white/[0.08] rounded-full px-3 py-1"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4">
                  {project.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors underline underline-offset-4 decoration-white/20 hover:decoration-white/40"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
