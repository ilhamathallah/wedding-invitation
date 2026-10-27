"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Photo from "./Photo";
import Reveal from "./Reveal";
import { wedding } from "@/lib/config";

type Person = (typeof wedding.people)["bride"];
const ease = [0.22, 1, 0.36, 1] as const;

function Card({ p, from }: { p: Person; from: 1 | -1 }) {
  const vp = { once: true, margin: "-80px" } as const;
  
  return (
    <motion.article 
      className="relative text-center p-8 sm:p-12 rounded-[2.5rem] bg-paper/80 backdrop-blur-2xl border border-sage/25 shadow-xl shadow-sage/5 overflow-hidden z-10 group w-full"
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={vp}
      transition={{ duration: 1.1, delay: from === -1 ? 0.2 : 0.4, ease }}
      whileHover={{ 
        y: -12, 
        scale: 1.01, 
        boxShadow: "0 25px 50px -12px rgba(125, 143, 123, 0.25)",
        borderColor: "rgba(125, 143, 123, 0.5)",
        transition: { duration: 0.4, ease: "easeOut" } 
      }}
    >
      {/* Internal Glowing Gradient Accent */}
      <div className="absolute inset-0 bg-gradient-to-b from-sage/15 via-sage/5 to-transparent pointer-events-none -z-10 opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Arch portrait container */}
      <div className="relative mx-auto max-w-[260px] sm:max-w-[300px]">
        {/* Multi-layered Animated Outer Arch Frame */}
        <motion.div 
          className="absolute -inset-4 rounded-t-[12rem] rounded-b-[2rem] border border-sage/30 pointer-events-none"
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={vp}
          transition={{ duration: 1.4, ease }}
        />
        <motion.div 
          className="absolute -inset-2 rounded-t-[11rem] rounded-b-[1.5rem] border border-sage/15 pointer-events-none"
          animate={{ rotate: [0, 1, -1, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="mx-auto aspect-[3/4] w-full overflow-hidden rounded-t-full rounded-b-2xl shadow-lg ring-1 ring-sage/20"
          initial={{ clipPath: "inset(100% 0 0 0)" }} 
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={vp} 
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1] }}
        >
          <motion.div 
            className="h-full w-full" 
            initial={{ scale: 1.3 }} 
            whileInView={{ scale: 1 }} 
            viewport={vp} 
            transition={{ duration: 2, ease }}
          >
            <Photo src={p.photo} alt={p.name} />
          </motion.div>
        </motion.div>
      </div>

      {/* Text Details with Staggered Motion */}
      <motion.div 
        className="mt-8 sm:mt-10"
        initial={{ opacity: 0, y: 25 }} 
        whileInView={{ opacity: 1, y: 0 }} 
        viewport={vp} 
        transition={{ duration: 1, delay: 0.4, ease }}
      >
        <motion.span 
          className="inline-block px-5 py-1.5 rounded-full bg-sage/15 text-xs tracking-[0.25em] uppercase text-sage-dark font-semibold shadow-sm"
          whileHover={{ scale: 1.08 }}
        >
          {p.role}
        </motion.span>

        <h3 className="mt-4 font-display text-4xl sm:text-5xl text-ink tracking-tight">{p.name}</h3>
        <p className="mt-2 text-xs uppercase tracking-widest text-ink/50 font-medium">{p.parents}</p>
        <p className="mx-auto mt-4 max-w-sm text-sm sm:text-base leading-relaxed text-ink/75">{p.bio}</p>

        {p.instagram && (
          <motion.a 
            href={`https://instagram.com/${p.instagram}`} 
            target="_blank" 
            rel="noreferrer" 
            className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-sage-dark transition-all py-2 px-6 rounded-full border border-sage/30 bg-paper/80 shadow-sm"
            whileHover={{ scale: 1.08, backgroundColor: "rgba(125, 143, 123, 0.2)", borderColor: "rgba(125, 143, 123, 0.6)" }}
            whileTap={{ scale: 0.95 }}
          >
            <span>@{p.instagram}</span>
          </motion.a>
        )}
      </motion.div>
    </motion.article>
  );
}

export default function Couple() {
  const { bride, groom } = wedding.people;
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll-Linked Animation Setup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const bgYLeft = useTransform(scrollYProgress, [0, 1], [-100, 120]);
  const bgYRight = useTransform(scrollYProgress, [0, 1], [120, -120]);
  const bgYCenter = useTransform(scrollYProgress, [0, 1], [-50, 70]);
  const ringRotate1 = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const ringRotate2 = useTransform(scrollYProgress, [0, 1], [360, 0]);
  const ringScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 1.25, 0.85]);
  const opacityFade = useTransform(scrollYProgress, [0, 0.15, 0.85, 1], [0, 1, 1, 0]);

  return (
    <section 
      ref={sectionRef} 
      id="couple" 
      className="relative w-full py-28 sm:py-36 overflow-hidden px-0"
    >
      {/* --- FULL-WIDTH BACKGROUND CONTAINER (MENTOK 100VW AT LAPTOP) --- */}
      <motion.div 
        style={{ opacity: opacityFade }}
        className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden -z-10"
      >
        {/* Glow Left Mentok Pinggir Kiri Laptop */}
        <motion.div 
          style={{ y: bgYLeft }}
          className="absolute top-0 left-0 -translate-x-1/3 w-[500px] lg:w-[700px] h-[500px] lg:h-[700px] rounded-full bg-sage/20 blur-[130px]"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Glow Right Mentok Pinggir Kanan Laptop */}
        <motion.div 
          style={{ y: bgYRight }}
          className="absolute bottom-0 right-0 translate-x-1/3 w-[600px] lg:w-[800px] h-[600px] lg:h-[800px] rounded-full bg-sage/25 blur-[150px]"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Center Glow */}
        <motion.div 
          style={{ y: bgYCenter }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[900px] h-[600px] lg:h-[900px] rounded-full bg-sage/10 blur-[120px]"
        />

        {/* Extra Large Rotating Geometric Rings (Mentok Layar) */}
        <motion.div 
          style={{ rotate: ringRotate1, scale: ringScale }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] lg:w-[1200px] h-[600px] lg:h-[1200px] rounded-full border border-dashed border-sage/25"
        />
        <motion.div 
          style={{ rotate: ringRotate2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] lg:w-[1500px] h-[800px] lg:h-[1500px] rounded-full border border-sage/15"
        />
      </motion.div>
      {/* --------------------------------------------------------------- */}

      {/* Content Container (Tetap Terpusat dan Rapi) */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <Reveal className="text-center relative z-10">
          <motion.span 
            className="text-xs uppercase tracking-[0.35em] text-sage font-semibold inline-block"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            The Special Day
          </motion.span>
          <h2 className="heading mt-3 text-5xl sm:text-6xl font-display">The Bride &amp; Groom</h2>
          <motion.div 
            className="mx-auto mt-6 h-16 w-px bg-gradient-to-b from-sage via-sage/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease }}
          />
        </Reveal>

        <div className="mt-16 sm:mt-20 grid gap-10 sm:gap-16 lg:grid-cols-2">
          <Card p={bride} from={-1} />
          <Card p={groom} from={1} />
        </div>
      </div>
    </section>
  );
}