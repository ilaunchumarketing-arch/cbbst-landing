type Props = {
  tag: string;
  title: string;
  desc?: string;
};

export default function PageHero({ tag, title, desc }: Props) {
  return (
    <section className="relative py-20 sm:py-28 px-6 overflow-hidden border-b border-white/5">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-cbbst-dark to-cbbst-dark2" />
      <div className="absolute -top-32 -left-32 h-[36rem] w-[36rem] rounded-full bg-cbbst-red/12 blur-[140px] animate-float-slow pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 h-[36rem] w-[36rem] rounded-full bg-cbbst-gold/8 blur-[140px] animate-float-slow pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-[2px] bg-cbbst-red/40 animate-scanline" />
      <div className="absolute inset-0 halftone-overlay opacity-10" />

      <div className="relative max-w-4xl mx-auto text-center">
        <div className="text-cbbst-red text-[10px] font-black tracking-[0.4em] mb-4 animate-flicker">
          {tag}
        </div>
        <h1 className="text-white font-black italic text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9]">
          {title.toUpperCase()}
        </h1>
        {desc && (
          <p className="text-white/65 text-base sm:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
            {desc}
          </p>
        )}
      </div>
    </section>
  );
}
