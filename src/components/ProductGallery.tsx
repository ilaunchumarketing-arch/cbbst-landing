"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useVariantImage } from "./VariantImage";

type Props = {
  images: string[];
  alt: string;
  /** Optional drop-shadow / glow style around main image (matches per-product theme) */
  shadowClass?: string;
  /** Optional className for the main image wrapper (e.g. aspect ratio override) */
  className?: string;
};

export default function ProductGallery({
  images,
  alt,
  shadowClass = "drop-shadow-[0_25px_60px_rgba(0,0,0,0.7)] drop-shadow-[0_0_40px_rgba(232,25,44,0.25)]",
  className = "",
}: Props) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const { activeImage } = useVariantImage();

  // Merge in the selected variant's image (prepend it if it's not already a gallery shot).
  const displayImages = useMemo(() => {
    if (activeImage && !images.includes(activeImage)) return [activeImage, ...images];
    return images;
  }, [activeImage, images]);

  // Reset to first image if the gallery changes
  useEffect(() => {
    setIndex(0);
  }, [images]);

  // When a variant with its own photo is picked, jump the gallery straight to it.
  useEffect(() => {
    if (!activeImage) return;
    const i = displayImages.indexOf(activeImage);
    if (i >= 0) setIndex(i);
  }, [activeImage, displayImages]);

  const has = displayImages.length > 1;
  const safeIndex = Math.min(index, displayImages.length - 1);

  function go(delta: number) {
    setIndex((i) => {
      const next = (i + delta + displayImages.length) % displayImages.length;
      return next;
    });
  }

  function handleTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX;
  }
  function handleTouchEnd(e: React.TouchEvent) {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchStartX.current = null;
  }

  return (
    <div className={`relative w-full min-w-0 ${className}`}>
      {/* Main image */}
      <div
        className="relative aspect-[2/3] w-full max-w-md mx-auto"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {displayImages.map((src, i) => (
          <Image
            key={src}
            src={src}
            alt={`${alt} — image ${i + 1}`}
            fill
            sizes="(max-width: 768px) 90vw, 480px"
            className={`object-contain transition-opacity duration-500 ${shadowClass} ${
              i === safeIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            priority={i === 0}
          />
        ))}

        {/* Arrows — only when multiple images */}
        {has && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous image"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cbbst-red text-white p-2 sm:p-3 transition-colors backdrop-blur-sm border border-white/10 z-10"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next image"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-cbbst-red text-white p-2 sm:p-3 transition-colors backdrop-blur-sm border border-white/10 z-10"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot indicator */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {displayImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Image ${i + 1}`}
                  className={`h-1.5 transition-all ${
                    i === safeIndex ? "w-6 bg-cbbst-gold" : "w-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Thumbnail strip — only when multiple */}
      {has && (
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {displayImages.map((src, i) => (
            <button
              key={src}
              onClick={() => setIndex(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-[2/3] w-16 sm:w-20 bg-cbbst-dark2 border transition-all overflow-hidden ${
                i === safeIndex
                  ? "border-cbbst-gold ring-2 ring-cbbst-gold/40 scale-105"
                  : "border-white/10 hover:border-white/40 opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
              <span className="absolute bottom-1 left-1 text-[9px] font-black text-white/70 tracking-widest">
                {String(i + 1).padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Count label */}
      {has && (
        <div className="text-center mt-3 text-white/40 text-[10px] font-black tracking-[0.3em]">
          {safeIndex + 1} / {displayImages.length} · SWIPE OR TAP TO BROWSE
        </div>
      )}
    </div>
  );
}
