"use client";

const announcements = [
  { emoji: "🎙️", text: "LIVE ON WHATNOT EVERY FRIDAY — FOLLOW @CBBST FOR DROPS" },
  { emoji: "⚡", text: "FREE SHIPPING ON ORDERS OVER $75" },
  { emoji: "🏆", text: "CGC 9.8 GRADED SLABS IN STOCK NOW" },
  { emoji: "🔥", text: "NEW EXCLUSIVES DROP EVERY WEEK — DON'T MISS OUT" },
  { emoji: "💥", text: "EXCLUSIVE VARIANTS YOU WON'T FIND ANYWHERE ELSE" },
];

export default function AnnouncementBar() {
  const doubled = [...announcements, ...announcements];

  return (
    <div className="bg-cbbst-red text-white text-xs font-bold tracking-wider overflow-hidden whitespace-nowrap py-1.5">
      <div className="animate-ticker inline-flex gap-16">
        {doubled.map((a, i) => (
          <span key={i} className="inline-flex items-center gap-2 px-4">
            <span>{a.emoji}</span>
            <span>{a.text}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
