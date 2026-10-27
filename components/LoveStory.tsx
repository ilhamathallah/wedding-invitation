"use client";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { wedding } from "@/lib/config";

const ease = [0.22, 1, 0.36, 1] as const;

export default function LoveStory() {
  const ref = useRef<HTMLDivElement>(null);

  // The sage line fills as you scroll through the story
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 70%", "end 60%"],
  });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <section
      ref={ref}
      id="story"
      className="relative w-full py-28 sm:py-36 overflow-hidden px-0 bg-paper"
    >
      {/* --- CLASSIC EDITORIAL BACKGROUND --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden -z-10 opacity-50">
        <div className="absolute top-1/4 left-0 -translate-x-1/3 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-sage/10 blur-[140px]" />
        <div className="absolute bottom-1/4 right-0 translate-x-1/3 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] rounded-full bg-sage/15 blur-[160px]" />
      </div>
      {/* ------------------------------------ */}

      {/* Content Container */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <Reveal className="text-center">
          <span className="text-xs uppercase tracking-[0.4em] text-sage font-serif italic">
            Our Memoir
          </span>
          <h2 className="heading mt-3 text-4xl sm:text-6xl font-display font-normal tracking-wide text-ink">
            Our Love Story
          </h2>

          {/* Classic Ornamental Divider */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <div className="h-px w-16 bg-sage/40" />
            <div className="w-2 h-2 rounded-full border border-sage/60 rotate-45" />
            <div className="h-px w-16 bg-sage/40" />
          </div>
        </Reveal>

        <div className="relative mt-24">
          {/* Garis vertikal latar belakang klasik */}
          <div
            className="absolute left-[13px] top-0 h-full w-px bg-sage/30 md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />
          {/* Garis vertikal animasi scroll */}
          <motion.div
            style={{ scaleY, originY: 0 }}
            className="absolute left-[13px] top-0 h-full w-[2px] bg-sage md:left-1/2 md:-translate-x-1/2"
            aria-hidden
          />

          <ol className="space-y-20 md:space-y-32">
            {wedding.story.map((s, i) => {
              const left = i % 2 === 0; // desktop: alternate sides
              return (
                <motion.li
                  key={s.year}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 1, ease, delay: i * 0.1 }}
                  className={`relative pl-12 md:w-1/2 md:pl-0 ${
                    left ? "md:pr-20 md:text-right" : "md:ml-auto md:pl-20"
                  }`}
                >
                  {/* Classic Timeline Dot with Ring */}
                  <motion.div
                    className={`absolute top-0 z-10 h-4 w-4 rounded-full border border-sage bg-paper flex items-center justify-center left-[6px] ${
                      left
                        ? "md:left-auto md:right-[-9px]"
                        : "md:left-[-7px] md:right-auto"
                    }`}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{
                      delay: 0.3,
                      type: "spring",
                      stiffness: 300,
                      damping: 18,
                    }}
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-sage" />
                  </motion.div>

                  {/* Clean Content Layout (Tanpa Card / Kotak) */}
                  <div
                    className={`relative ${left ? "md:text-right" : "md:text-left"}`}
                  >
                    {"photo" in s && s.photo && (
                      <div
                        className={`mb-6 overflow-hidden rounded-lg aspect-[16/9] w-full border border-sage/20 p-1 bg-paper/50 shadow-sm ${left ? "md:ml-auto" : "md:mr-auto"}`}
                      >
                        <Photo src={s.photo as string} alt={s.title} />
                      </div>
                    )}

                    {/* Classic Serif Year Callout */}
                    <span className="font-serif italic text-sage text-lg font-medium tracking-wide block mb-1">
                      ~ {s.year} ~
                    </span>

                    <h3 className="font-display text-2xl sm:text-3xl text-ink tracking-tight font-normal">
                      {s.title}
                    </h3>

                    <p className="mt-3 leading-relaxed text-ink/80 text-sm sm:text-base font-serif max-w-lg">
                      {s.text}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
