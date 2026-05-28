export function HeroPhoto() {
  return (
    <div data-hero-photo className="absolute inset-0 z-30">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-photo.png"
        alt="Tanvir Anjum Apurbo"
        className="h-full w-full object-cover object-center"
      />
      {/* Bottom fade to dark */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background: "linear-gradient(to top, #050505 0%, transparent 100%)",
        }}
      />
    </div>
  );
}
