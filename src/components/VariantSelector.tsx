"use client";

export type Variant = {
  name: string;
  tier: string;
  note?: string;
  /** Optional per-variant image (from Shopify). Picking the variant swaps the main photo. */
  image?: string;
  /** True when Shopify reports this variant unavailable — selectable to view, never buyable. */
  soldOut?: boolean;
};

type Props = {
  variants: Variant[];
  selectedIndex: number;
  onSelect: (i: number) => void;
  className?: string;
  /** Tailwind class for the selected-state accent. Defaults to brand red. */
  accentClass?: string;
  /** Badge wording on unbuyable variants. "UNAVAILABLE" for books never put on sale. */
  soldOutLabel?: string;
};

export default function VariantSelector({
  variants,
  selectedIndex,
  onSelect,
  className = "",
  accentClass = "border-cbbst-red bg-cbbst-red/15",
  soldOutLabel = "SOLD OUT",
}: Props) {
  if (variants.length <= 1) {
    // Single variant — no selection needed, just show it inline.
    const v = variants[0];
    if (!v) return null;
    return (
      <div className={className}>
        <div className="text-cbbst-gold text-[10px] font-black tracking-[0.3em] mb-2">
          INCLUDED
        </div>
        <div className="bg-black/40 border border-white/15 p-3 inline-block">
          <span className="text-white text-xs font-black tracking-wider">{v.name}</span>
          {v.soldOut && (
            <span className="ml-2 text-red-400 text-[10px] font-black tracking-widest">{soldOutLabel}</span>
          )}
          {v.note && (
            <p className="text-white/50 text-[11px] mt-1 leading-snug">{v.note}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex items-baseline justify-between mb-3">
        <span className="text-cbbst-gold text-[10px] font-black tracking-[0.3em]">
          SELECT YOUR VARIANT
        </span>
        <span className="text-white/40 text-[10px] font-black tracking-widest">
          {variants.length} OPTIONS
        </span>
      </div>
      <div className="grid sm:grid-cols-2 gap-2">
        {variants.map((v, i) => {
          const isSelected = i === selectedIndex;
          return (
            <button
              key={v.name}
              type="button"
              onClick={() => onSelect(i)}
              className={`text-left p-3 border-2 transition-all relative ${
                isSelected
                  ? `${accentClass} shadow-[0_0_20px_rgba(232,25,44,0.2)]`
                  : "border-white/15 hover:border-white/40 bg-black/40"
              } ${v.soldOut ? "opacity-60" : ""}`}
              aria-pressed={isSelected}
            >
              {isSelected && (
                <span className="absolute top-2 right-2 text-cbbst-gold text-xs font-black">
                  ✓
                </span>
              )}
              <div className="flex items-baseline justify-between gap-2 pr-5">
                <span className="text-white text-[11px] font-black tracking-wider leading-tight">
                  {v.name}
                </span>
              </div>
              <div className={`text-sm font-black mt-1.5 ${v.soldOut ? "text-white/30 line-through" : "text-cbbst-gold"}`}>
                {v.tier}
              </div>
              {v.soldOut && (
                <div className="text-red-400 text-[10px] font-black tracking-widest mt-1">{soldOutLabel}</div>
              )}
              {v.note && (
                <p className="text-white/50 text-[10px] mt-1 leading-snug">{v.note}</p>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
