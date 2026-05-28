export function HeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      {/* Gradient matching hero photo: warm greens, pinks, sunset tones */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 15% 30%, rgba(180, 100, 60, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 75% 20%, rgba(120, 170, 80, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 30% 70%, rgba(200, 80, 140, 0.18) 0%, transparent 50%),
            radial-gradient(ellipse at 85% 65%, rgba(180, 130, 60, 0.12) 0%, transparent 45%),
            radial-gradient(ellipse at 50% 50%, rgba(60, 50, 80, 0.3) 0%, transparent 60%),
            linear-gradient(160deg, #12100e 0%, #0e0c14 40%, #0a0a0f 100%)
          `,
        }}
      />
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: `
            conic-gradient(from 200deg at 40% 45%,
              rgba(200, 100, 60, 0.12) 0deg,
              rgba(180, 80, 140, 0.1) 90deg,
              rgba(100, 160, 80, 0.08) 180deg,
              rgba(180, 140, 60, 0.1) 270deg,
              rgba(200, 100, 60, 0.12) 360deg
            )
          `,
        }}
      />
    </div>
  );
}
