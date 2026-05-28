export function HeroSubtitle() {
  return (
    <div
      data-hero-subtitle
      className="absolute z-20"
      style={{
        bottom: "12%",
        left: "clamp(2rem, 8vw, 10rem)",
        opacity: 0,
      }}
    >
      <p
        className="font-sans lowercase text-muted"
        style={{
          fontSize: "clamp(0.7rem, 1.2vw, 0.95rem)",
          letterSpacing: "0.1em",
        }}
      >
        full-stack developer / computer vision / ai research
      </p>
    </div>
  );
}
