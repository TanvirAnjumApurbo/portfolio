"use client";

const groups = [
  {
    label: "languages",
    skills: ["Python", "JavaScript", "TypeScript"],
  },
  {
    label: "frontend",
    skills: ["React", "Next.js"],
  },
  {
    label: "backend",
    skills: ["Django", "MySQL"],
  },
  {
    label: "ml / data",
    skills: ["Pandas", "NumPy", "Scikit-learn", "OpenCV", "Google Colab"],
  },
  {
    label: "tools",
    skills: ["Git / GitHub", "VS Code", "Overleaf", "PowerShell"],
  },
];

export function StackSection() {
  return (
    <section
      className="relative py-32"
      style={{
        background:
          "linear-gradient(180deg, #0a0a0f 0%, #0c0c14 50%, #0a0a0f 100%)",
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
          tech stack.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 md:gap-16">
          {groups.map((group) => (
            <div key={group.label}>
              <h3 className="text-[0.7rem] uppercase tracking-[0.2em] text-[#e84393]/60 mb-6">
                {group.label}
              </h3>
              <div className="space-y-3">
                {group.skills.map((skill) => (
                  <div
                    key={skill}
                    className="flex items-center gap-4 group"
                  >
                    <div className="h-px flex-1 max-w-[40px] bg-white/10 group-hover:bg-[#e84393]/30 transition-colors" />
                    <span
                      className="font-[family-name:var(--font-display)] font-bold lowercase tracking-[-0.01em] text-white/70 group-hover:text-foreground transition-colors"
                      style={{ fontSize: "clamp(1rem, 1.6vw, 1.35rem)" }}
                    >
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
