"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { wedding } from "@/lib/config";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.4,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
};

export default function Hero({ guest }: { guest?: string }) {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, 120]);
  const opacity = useTransform(scrollY, [0, 450], [1, 0]);
  const { a, b } = wedding.couple;

  return (
    <header className="relative flex min-h-[100svh] items-center justify-center overflow-hidden px-6 text-center">
      {/* Background photo with subtle parallax */}
      <motion.div
        className="absolute inset-0 -z-0"
        style={{ y }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 scale-110 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/wedding/welcome.png')",
          }}
        />
      </motion.div>

      {/* Soft overlay for readable text */}
      <div className="absolute inset-0 z-0 bg-black/35" />

      {/* Optional warm tint */}
      <div className="absolute inset-0 z-0 bg-[#e9dfce]/15" />

      {/* Decorative ring */}
      <svg
        viewBox="0 0 400 400"
        className="pointer-events-none absolute z-10 w-[min(92vw,640px)] -rotate-90"
        aria-hidden="true"
      >
        <motion.circle
          cx="200"
          cy="200"
          r="190"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth="0.6"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{
            duration: 2.8,
            delay: 0.2,
            ease: "easeInOut",
          }}
        />
      </svg>

      {/* Couple's names */}
      <motion.div
        style={{ opacity }}
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-20 text-white"
      >
        {guest && (
          <motion.p variants={item} className="mb-6 text-sm text-white/80">
            Dear {guest},
          </motion.p>
        )}

        <motion.p
          variants={item}
          className="text-xs sm:text-sm md:text-lg tracking-[0.25em] text-white/90"
        >
          {wedding.tagline}
        </motion.p>

        <motion.h1
          variants={item}
          className="mt-5 font-display text-6xl font-light leading-[0.95] drop-shadow-lg sm:text-8xl"
        >
          {a}
          <span className="block py-3 font-display text-3xl italic text-white/85 sm:text-4xl">
            and
          </span>
          {b}
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-8 text-base tracking-wide text-white/90"
        >
          {wedding.displayDate}
        </motion.p>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#couple"
        aria-label="Scroll to details"
        className="absolute bottom-8 z-20 flex flex-col items-center gap-2 text-xs tracking-widest text-white/80"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
      >
        SCROLL
        <motion.span
          className="block h-10 w-px bg-white/70"
          animate={{
            scaleY: [0, 1, 0],
            originY: [0, 0, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </motion.a>
    </header>
  );
}
