"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { wedding } from "@/lib/config";

export default function Gallery() {
  const items = wedding.gallery;
  const [open, setOpen] = useState<number | null>(null);
  const move = useCallback((d: number) => setOpen((i) => (i === null ? i : (i + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") move(1);
      if (e.key === "ArrowLeft") move(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, move]);

  const cur = open === null ? null : items[open];

  return (
    <section id="gallery" className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
      <Reveal className="text-center">
        <h2 className="heading">Candid Moments</h2>
        <p className="mx-auto mt-4 max-w-md text-ink/60">Unposed, unplanned, and our favorites.</p>
      </Reveal>

      <div className="mt-14 columns-2 gap-3 sm:columns-3 sm:gap-4">
        {items.map((g, i) => (
          <motion.button
            key={i} type="button" onClick={() => setOpen(i)} aria-label={`Open photo: ${g.alt}`}
            style={{ aspectRatio: g.ratio }}
            className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl sm:mb-4"
            initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay: (i % 3) * 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            <Photo src={g.src} alt={g.alt} className="transition duration-700 ease-out group-hover:scale-105" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {cur && open !== null && (
          <motion.div
            role="dialog" aria-modal="true" aria-label="Photo viewer"
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={open} onClick={(e) => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35 }} className="text-center"
              >
                {cur.src ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={cur.src} alt={cur.alt} className="mx-auto max-h-[80vh] max-w-[92vw] rounded-xl object-contain" />
                ) : (
                  <div role="img" aria-label={cur.alt} style={{ aspectRatio: cur.ratio }} className="mx-auto max-h-[80vh] w-[min(86vw,460px)] rounded-xl bg-gradient-to-br from-mist via-paper to-sage/30" />
                )}
                <figcaption className="mt-4 text-sm text-paper/80">{cur.alt} · {open + 1}/{items.length}</figcaption>
              </motion.figure>
            </AnimatePresence>

            <button aria-label="Close" onClick={() => setOpen(null)} className="absolute right-4 top-4 h-11 w-11 rounded-full text-2xl text-paper/90 hover:bg-white/10">×</button>
            <button aria-label="Previous photo" onClick={(e) => { e.stopPropagation(); move(-1); }} className="absolute left-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full text-3xl text-paper/90 hover:bg-white/10 sm:left-6">‹</button>
            <button aria-label="Next photo" onClick={(e) => { e.stopPropagation(); move(1); }} className="absolute right-2 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full text-3xl text-paper/90 hover:bg-white/10 sm:right-6">›</button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
