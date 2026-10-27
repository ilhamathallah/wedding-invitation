"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Left = { days: number; hours: number; minutes: number; seconds: number };

// Gold tuned for a white background: softer tone for lines, deeper tone for text (keeps contrast readable)
const GOLD = "#B8964A";
const ease = [0.22, 1, 0.36, 1] as const;

const calc = (target: number): Left => {
  const s = Math.max(0, Math.floor((target - Date.now()) / 1000));
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
  };
};

const UNITS = [
  { key: "days", label: "Days", max: 365 },
  { key: "hours", label: "Hours", max: 24 },
  { key: "minutes", label: "Minutes", max: 60 },
  { key: "seconds", label: "Seconds", max: 60 },
] as const;

// Floating gold dust, positioned in % so it always spans the full width.
// Integer math only, so server and client render identical markup (no hydration mismatch).
// The extra specks (index 22+) only appear on large screens to fill the wider space.
const DUST = Array.from({ length: 36 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  drift: 14 + (i % 5) * 8,
  dur: 6 + (i % 7),
  delay: (i % 6) * 0.7,
  extra: i >= 22,
}));

const CORNERS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

/** A slowly turning clock-face ring. `dir` sets the spin direction. */
function Rings({
  dir = 1,
  duration = 240,
}: {
  dir?: 1 | -1;
  duration?: number;
}) {
  return (
    <motion.svg
      viewBox="0 0 400 400"
      className="absolute inset-0 h-full w-full"
      animate={{ rotate: 360 * dir }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
    >
      {/* dash pattern = 60 clock ticks */}
      <circle
        cx="200"
        cy="200"
        r="196"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.55"
        strokeWidth="0.8"
        strokeDasharray="1.2 19.3"
      />
      <circle
        cx="200"
        cy="200"
        r="186"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.3"
        strokeWidth="0.5"
      />
      <circle
        cx="200"
        cy="200"
        r="150"
        fill="none"
        stroke={GOLD}
        strokeOpacity="0.35"
        strokeWidth="0.6"
        strokeDasharray="4 9"
      />
      <circle
        cx="200"
        cy="200"
        r="120"
        fill="none"
        stroke="#7D8F7B"
        strokeOpacity="0.4"
        strokeWidth="0.5"
      />
    </motion.svg>
  );
}

/** Animated background: wide glow, turning rings that scale with the viewport width, drifting gold dust. */
function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      {/* Wide ellipse glow: percentages, so it stretches with the section width */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_45%,rgba(125,143,123,0.16),transparent_70%)]"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Center rings: size follows viewport width (520px minimum, 1500px maximum) */}
      <div className="absolute left-1/2 top-1/2 h-[clamp(520px,72vw,1500px)] w-[clamp(520px,72vw,1500px)] -translate-x-1/2 -translate-y-1/2">
        <Rings dir={1} duration={240} />
      </div>

      {/* Laptop and wider: two more rings tucked into the left and right edges to fill the width */}
      <div className="absolute -left-[14vw] top-1/2 hidden h-[42vw] w-[42vw] -translate-y-1/2 lg:block">
        <Rings dir={-1} duration={200} />
      </div>
      <div className="absolute -right-[14vw] top-1/2 hidden h-[42vw] w-[42vw] -translate-y-1/2 lg:block">
        <Rings dir={-1} duration={200} />
      </div>

      {DUST.map((d, i) => (
        <motion.span
          key={i}
          className={`absolute rounded-full bg-[#B8964A] ${d.extra ? "hidden lg:block" : ""}`}
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{ y: [0, -d.drift, 0], opacity: [0.12, 0.65, 0.12] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Full-width gold hairlines top and bottom */}
      <div className="absolute inset-x-[4vw] top-6 h-px bg-gradient-to-r from-transparent via-[#B8964A]/60 to-transparent" />
      <div className="absolute inset-x-[4vw] bottom-6 h-px bg-gradient-to-r from-transparent via-[#B8964A]/60 to-transparent" />
    </div>
  );
}

function Ornament() {
  return (
    <div
      className="mx-auto mt-5 flex items-center justify-center gap-3"
      aria-hidden
    >
      <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#B8964A] sm:w-20" />
      <motion.span
        className="h-1.5 w-1.5 rotate-45 bg-[#B8964A]"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#B8964A] sm:w-20" />
    </div>
  );
}

export default function Countdown({ date }: { date: string }) {
  const target = new Date(date).getTime();
  const [left, setLeft] = useState<Left | null>(null); // null on first render avoids hydration mismatch

  useEffect(() => {
    const tick = () => setLeft(calc(target));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const done = left !== null && Object.values(left).every((v) => v === 0);

  return (
    <section
      id="countdown"
      className="relative isolate w-full overflow-hidden bg-paper px-4 py-24 text-ink sm:px-6 sm:py-32 lg:py-40"
    >
      <Backdrop />

      <div className="mx-auto max-w-6xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease }}
        >
          <p className="font-display text-lg italic text-[#8A6D2B] sm:text-xl lg:text-2xl">
            Until we say “I do”
          </p>
          <h2 className="heading mt-2 lg:text-6xl">Counting the days</h2>
          <Ornament />
        </motion.div>

        {done ? (
          <motion.p
            className="mt-14 text-center font-display text-3xl italic sm:text-4xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            Today is the day. We’re getting married!
          </motion.p>
        ) : (
          <div
            role="timer"
            aria-label="Time remaining until the wedding"
            className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-4 sm:mt-14 sm:grid-cols-4 sm:gap-5 lg:mt-16 lg:max-w-5xl lg:gap-8 xl:gap-10"
          >
            {UNITS.map(({ key, label, max }, i) => {
              const value = left?.[key];
              const progress =
                value === undefined ? 0 : Math.min(value / max, 1);
              return (
                <motion.div
                  key={key}
                  className="group relative"
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.9, delay: i * 0.12, ease }}
                >
                  {/* Double-line frame with corner ornaments */}
                  <div className="relative rounded-sm border border-[#B8964A]/50 p-1.5 transition-transform duration-500 group-hover:-translate-y-1 sm:p-2">
                    {CORNERS.map((c) => (
                      <span
                        key={c}
                        aria-hidden
                        className={`absolute h-2.5 w-2.5 border-[#B8964A] ${c}`}
                      />
                    ))}
                    <div className="relative overflow-hidden rounded-[2px] border border-[#B8964A]/25 bg-white px-2 pb-4 pt-4 text-center shadow-[0_12px_32px_-18px_rgba(30,35,33,0.4)] sm:px-4 sm:pb-5 sm:pt-6 lg:pb-7 lg:pt-8">
                      <div className="relative h-16 overflow-hidden sm:h-24 md:h-28 lg:h-32">
                        <AnimatePresence mode="popLayout" initial={false}>
                          <motion.span
                            key={value ?? "empty"}
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: "0%", opacity: 1 }}
                            exit={{ y: "-100%", opacity: 0 }}
                            transition={{ duration: 0.5, ease }}
                            className="absolute inset-0 flex items-center justify-center font-display text-5xl tabular-nums text-ink sm:text-6xl md:text-7xl lg:text-8xl"
                          >
                            {value === undefined
                              ? "--"
                              : String(value).padStart(2, "0")}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <p className="mt-2 font-display text-base italic text-[#8A6D2B] sm:text-lg lg:text-xl">
                        {label}
                      </p>
                      {/* thin gold bar shows how full the current unit is */}
                      <div className="mx-auto mt-3 h-px w-3/4 bg-ink/10">
                        <motion.div
                          className="h-full origin-left bg-[#B8964A]"
                          initial={false}
                          animate={{ scaleX: progress }}
                          transition={{ duration: 0.8, ease }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* diamond divider between cards (wide screens only) */}
                  {i < UNITS.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rotate-45 bg-[#B8964A]/80 sm:-right-[13px] sm:block lg:-right-[21px] xl:-right-[25px]"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
