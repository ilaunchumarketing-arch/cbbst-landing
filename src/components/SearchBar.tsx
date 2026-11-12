"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

/**
 * Navbar search. The icon expands into an input; submitting routes to
 * /search?q=… which renders live results from the catalog.
 */
export default function SearchBar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/search?q=${encodeURIComponent(term)}`);
    setOpen(false);
  };

  return (
    <div className="relative flex items-center">
      {open ? (
        <form onSubmit={submit} className="flex items-center">
          <div className="flex items-center bg-cbbst-dark2 border border-white/20 focus-within:border-cbbst-red rounded transition-colors">
            <Search size={16} className="text-white/50 ml-2.5" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setOpen(false);
              }}
              placeholder="Search comics, slabs, variants…"
              aria-label="Search products"
              className="bg-transparent text-white text-sm placeholder:text-white/35 px-2.5 py-2 w-40 sm:w-60 outline-none"
            />
            <button
              type="button"
              onClick={() => {
                setQ("");
                setOpen(false);
              }}
              aria-label="Close search"
              className="text-white/50 hover:text-white px-2"
            >
              <X size={16} />
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setOpen(true)}
          aria-label="Search"
          className="text-white/70 hover:text-white"
        >
          <Search size={18} />
        </button>
      )}
    </div>
  );
}
