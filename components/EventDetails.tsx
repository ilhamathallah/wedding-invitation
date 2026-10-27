"use client";
import { motion } from "framer-motion";
import { wedding } from "@/lib/config";

const SHOW_MAP = true; // set to false to hide the framed map
const GOLD = "#B8964A";
const ease = [0.22, 1, 0.36, 1] as const;
const vp = { once: true, margin: "-80px" } as const;

type Event = (typeof wedding.events)[number];

const fmt = (iso: string) =>
  new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");

const calendarUrl = (e: Event) =>
  "https://calendar.google.com/calendar/render?" +
  new URLSearchParams({
    action: "TEMPLATE",
    text: `${e.title}: ${wedding.couple.a} & ${wedding.couple.b}`,
    dates: `${fmt(e.start)}/${fmt(e.end)}`,
    location: `${e.venue}, ${e.address}`,
  });

// Fixed: the old version had line breaks inside the template string, which put spaces in the URL
const mapsUrl = (q: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}`;

const ROMAN = ["I", "II", "III", "IV"];

const CORNERS = [
  "left-0 top-0 border-l-2 border-t-2",
  "right-0 top-0 border-r-2 border-t-2",
  "bottom-0 left-0 border-b-2 border-l-2",
  "bottom-0 right-0 border-b-2 border-r-2",
];

const btn =
  "inline-flex items-center justify-center rounded-sm border border-[#B8964A]/60 px-5 py-2.5 text-sm tracking-wide text-[#8A6D2B] transition duration-300 hover:bg-[#B8964A] hover:text-white active:scale-95";

/* ---------- Background: sage glow, swaying botanical sprigs, drifting gold dust ---------- */

const LEAVES = Array.from({ length: 7 }, (_, i) => ({
  y: 50 + i * 36,
  side: i % 2 ? 1 : -1,
}));

function Sprig({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute bottom-0 ${className}`}
    >
      <motion.svg
        viewBox="0 0 120 310"
        className="h-full w-full origin-bottom"
        animate={{ rotate: [-2.5, 2.5, -2.5] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.path
          d="M60 305 C 52 230, 72 150, 60 12"
          fill="none"
          stroke={GOLD}
          strokeOpacity="0.6"
          strokeWidth="1"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2.2, ease: "easeInOut" }}
        />
        {LEAVES.map((l, i) => {
          const cx = 60 + l.side * 15;
          return (
            <g key={i} transform={`rotate(${l.side * -32} ${cx} ${l.y})`}>
              <motion.ellipse
                cx={cx}
                cy={l.y}
                rx="15"
                ry="5.5"
                fill="#7D8F7B"
                fillOpacity="0.14"
                stroke="#7D8F7B"
                strokeOpacity="0.55"
                strokeWidth="0.8"
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
                initial={{ opacity: 0, scale: 0.4 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 + i * 0.18, duration: 0.8 }}
              />
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
}

// Integer math only, so server and client render identical markup (no hydration mismatch)
const DUST = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 41 + 9) % 100,
  top: (i * 59 + 13) % 100,
  size: 2 + (i % 3),
  drift: 12 + (i % 5) * 8,
  dur: 6 + (i % 7),
  delay: (i % 6) * 0.7,
}));

function Backdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
    >
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_40%,rgba(125,143,123,0.14),transparent_70%)]"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      <Sprig className="left-0 h-[260px] w-[100px] opacity-60 sm:h-[340px] sm:w-[130px] sm:opacity-100 lg:h-[460px] lg:w-[180px]" />
      <Sprig className="right-0 h-[260px] w-[100px] -scale-x-100 opacity-60 sm:h-[340px] sm:w-[130px] sm:opacity-100 lg:h-[460px] lg:w-[180px]" />

      {DUST.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-[#B8964A]"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: d.size,
            height: d.size,
          }}
          animate={{ y: [0, -d.drift, 0], opacity: [0.1, 0.6, 0.1] }}
          transition={{
            duration: d.dur,
            delay: d.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="absolute inset-x-[4vw] top-6 h-px bg-gradient-to-r from-transparent via-[#B8964A]/50 to-transparent" />
      <div className="absolute inset-x-[4vw] bottom-6 h-px bg-gradient-to-r from-transparent via-[#B8964A]/50 to-transparent" />
    </div>
  );
}

/* ---------- Small pieces ---------- */

function Ornament({ className = "mt-5" }: { className?: string }) {
  return (
    <div
      className={`mx-auto flex items-center justify-center gap-3 ${className}`}
      aria-hidden
    >
      <motion.span
        className="h-px w-14 origin-right bg-gradient-to-r from-transparent to-[#B8964A] sm:w-24"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={vp}
        transition={{ duration: 1.2, delay: 0.3, ease }}
      />
      <motion.span
        className="h-1.5 w-1.5 rotate-45 bg-[#B8964A]"
        animate={{ scale: [1, 1.6, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="h-px w-14 origin-left bg-gradient-to-l from-transparent to-[#B8964A] sm:w-24"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={vp}
        transition={{ duration: 1.2, delay: 0.3, ease }}
      />
    </div>
  );
}

/** Gold frame that draws itself line by line, then the corner ornaments fade in. */
function Frame({ delay = 0 }: { delay?: number }) {
  const line = "absolute bg-[#B8964A]/55";
  const t = (d: number) => ({ duration: 1.1, delay: delay + d, ease });
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <motion.span
        className={`${line} left-0 right-0 top-0 h-px origin-left`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={vp}
        transition={t(0)}
      />
      <motion.span
        className={`${line} bottom-0 right-0 top-0 w-px origin-top`}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={vp}
        transition={t(0.5)}
      />
      <motion.span
        className={`${line} bottom-0 left-0 right-0 h-px origin-right`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={vp}
        transition={t(1)}
      />
      <motion.span
        className={`${line} bottom-0 left-0 top-0 w-px origin-bottom`}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={vp}
        transition={t(1.5)}
      />
      {CORNERS.map((c) => (
        <motion.span
          key={c}
          className={`absolute h-3 w-3 border-[#B8964A] ${c}`}
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={vp}
          transition={{ delay: delay + 1.8, duration: 0.6 }}
        />
      ))}
    </div>
  );
}

function EventCard({ e, i }: { e: Event; i: number }) {
  return (
    <motion.article
      className="h-full"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={vp}
      transition={{ duration: 1, delay: i * 0.18, ease }}
    >
      <div className="group relative h-full transition-transform duration-500 hover:-translate-y-1.5">
        <Frame delay={i * 0.18} />
        <div className="relative m-2 flex h-[calc(100%-1rem)] flex-col border border-[#B8964A]/20 bg-white/70 px-6 py-10 text-center shadow-[0_14px_36px_-20px_rgba(30,35,33,0.45)] transition-shadow duration-500 group-hover:shadow-[0_22px_44px_-18px_rgba(30,35,33,0.5)] sm:px-8 lg:py-12">
          <span className="font-display text-base italic text-[#8A6D2B]">
            {ROMAN[i] ?? i + 1}
          </span>
          <h3 className="mt-1 font-display text-3xl sm:text-4xl">{e.title}</h3>
          <Ornament className="mt-4" />
          <p className="mt-4 font-display text-xl italic text-[#8A6D2B]">
            {e.time}
          </p>
          <p className="mt-6 font-display text-2xl">{e.venue}</p>
          <p className="mt-1 text-sm text-ink/60">{e.address}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3 pt-2 sm:mt-auto">
            <a
              className={btn}
              href={mapsUrl(`${e.venue} ${e.address}`)}
              target="_blank"
              rel="noreferrer"
            >
              Open in Maps
            </a>
            <a
              className={btn}
              href={calendarUrl(e)}
              target="_blank"
              rel="noreferrer"
            >
              Add to calendar
            </a>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* ---------- Section ---------- */

export default function EventDetails() {
  const last = wedding.events[wedding.events.length - 1];

  return (
    <section
      id="details"
      className="relative isolate w-full overflow-hidden bg-paper px-4 py-24 text-ink sm:px-6 sm:py-32 lg:py-40"
    >
      <Backdrop />

      <div className="mx-auto max-w-5xl">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={vp}
          transition={{ duration: 0.9, ease }}
        >
          <p className="font-display text-lg italic text-[#8A6D2B] sm:text-xl lg:text-2xl">
            Join us for
          </p>
          <h2 className="heading mt-2 lg:text-6xl">The Details</h2>
          <Ornament />
          <p className="mt-5 font-display text-xl italic text-ink/70">
            {wedding.displayDate}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:mt-20 lg:gap-12">
          {wedding.events.map((e, i) => (
            <EventCard key={e.id} e={e} i={i} />
          ))}
        </div>

        {/* {SHOW_MAP && (
          <motion.figure
            className="mx-auto mt-14 max-w-3xl border-4 border-double border-ink/25 bg-white/70 p-2 shadow-[0_18px_40px_-24px_rgba(30,35,33,0.5)] sm:p-3 lg:mt-20"
            initial={{ opacity: 0, y: 36, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={vp}
            transition={{ duration: 1, ease }}
          >
            <div className="relative border border-ink/20">
              <iframe
                title="Map of the reception venue"
                loading="lazy"
                className="block h-72 w-full sm:h-80 lg:h-96"
                style={{ filter: "sepia(0.3) saturate(0.8) contrast(0.95)" }}
                src={`https://www.google.com/maps?q=${encodeURIComponent(wedding.mapQuery)}&output=embed`}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(30,35,33,0.22)]"
              />
            </div>
            <figcaption className="py-4 text-center">
              <p className="font-display text-2xl italic">{last.venue}</p>
              <p className="mt-1 text-sm text-ink/60">{last.address}</p>
            </figcaption>
          </motion.figure>
        )} */}

        <motion.div
          className="mt-10 flex items-center justify-center gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={vp}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <span className="h-px w-10 bg-[#B8964A]/60 sm:w-16" />
          <p className="text-center font-display text-lg italic tracking-wide text-ink/75">
            Dress code: {wedding.dressCode}
          </p>
          <span className="h-px w-10 bg-[#B8964A]/60 sm:w-16" />
        </motion.div>
      </div>
    </section>
  );
}
