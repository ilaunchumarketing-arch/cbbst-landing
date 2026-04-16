const reviews = [
  {
    text: "Caught a grail on the Friday WhatNot stream — CBBST ships fast and packs like a vault. Already ordered two more!",
    author: "Marcus T.",
    location: "Miami FL",
  },
  {
    text: "The WhatNot live streams are insane — I've found grails I never thought I'd own. Robert and the team are top-notch.",
    author: "Jennifer R.",
    location: "Atlanta GA",
  },
  {
    text: "Superior Stands are a game changer for my display wall. Quality is unreal for the price. CBBST has become my go-to shop.",
    author: "Chris D.",
    location: "New York NY",
  },
];

export default function Reviews() {
  return (
    <section className="bg-cbbst-dark2 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-cbbst-red text-xs font-bold tracking-widest">
            COLLECTOR REVIEWS
          </span>
          <h2 className="text-white font-black text-3xl sm:text-4xl tracking-tight mt-2">
            WHAT COLLECTORS SAY
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r) => (
            <div
              key={r.author}
              className="bg-cbbst-dark3 border border-white/5 rounded-lg p-6"
            >
              <div className="text-gold text-lg mb-3 tracking-wider">
                ★★★★★
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-4 italic">
                &ldquo;{r.text}&rdquo;
              </p>
              <p className="text-white/40 text-xs font-bold">
                — {r.author}, {r.location}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
