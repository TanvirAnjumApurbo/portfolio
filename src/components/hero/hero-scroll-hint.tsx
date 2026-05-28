export function HeroScrollHint() {
  return (
    <div
      data-hero-scroll-hint
      className="absolute bottom-8 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-3"
    >
      <span className="text-[0.625rem] uppercase tracking-[0.3em] text-white/40 font-sans">
        Scroll
      </span>
      <div className="h-10 w-px bg-white/20 overflow-hidden">
        <div
          className="h-full w-full bg-white/60"
          style={{ animation: "scroll-line 2s ease-in-out infinite" }}
        />
      </div>
    </div>
  );
}
