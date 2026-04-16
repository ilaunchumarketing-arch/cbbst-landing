import { Globe, ShieldCheck, Package, Headphones } from "lucide-react";

const badges = [
  {
    icon: Globe,
    title: "Worldwide Shipping",
    desc: "Fast & secure to every collector",
  },
  {
    icon: ShieldCheck,
    title: "Secure Checkout",
    desc: "Shop Pay, PayPal & Google Pay",
  },
  {
    icon: Package,
    title: "Collector-Grade Packing",
    desc: "Every comic ships protected",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "Comic experts ready to help",
    emoji: "🎙️",
  },
];

export default function TrustBadges() {
  return (
    <section className="bg-cbbst-dark border-b border-white/5 py-5 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b) => (
          <div key={b.title} className="flex items-center gap-3">
            {b.emoji ? (
              <span className="text-2xl">{b.emoji}</span>
            ) : (
              <b.icon className="text-cbbst-red flex-shrink-0" size={22} />
            )}
            <div>
              <div className="text-white text-xs font-bold tracking-wide">
                {b.title}
              </div>
              <div className="text-white/40 text-[11px]">{b.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
