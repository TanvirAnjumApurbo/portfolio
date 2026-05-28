export function HeroGrainOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* Vignette only */}
      <div
        className="absolute inset-0"
        style={{
          boxShadow: "inset 0 0 150px rgba(0, 0, 0, 0.5)",
        }}
      />
    </div>
  );
}
