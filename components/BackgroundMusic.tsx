"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/config";

const KEY = "wedding-music"; // remembers if the guest turned the music off
const VOLUME = 0.5;

export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const userPaused = useRef(false);
  const wasPlaying = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [hint, setHint] = useState(false);

  // Smooth volume fade (iOS Safari ignores volume changes, so it just starts at full volume there)
  const fadeTo = useCallback((to: number, done?: () => void) => {
    const a = audioRef.current;
    if (!a) return;
    if (fadeRef.current) clearInterval(fadeRef.current);
    fadeRef.current = setInterval(() => {
      const step = to > a.volume ? 0.05 : -0.05;
      const next = a.volume + step;
      if (Math.abs(next - to) < 0.05) {
        a.volume = to;
        if (fadeRef.current) clearInterval(fadeRef.current);
        done?.();
      } else {
        a.volume = Math.min(1, Math.max(0, next));
      }
    }, 80);
  }, []);

  const play = useCallback(async () => {
    const a = audioRef.current;
    if (!a) return false;
    try {
      a.volume = 0;
      await a.play(); // rejects if the browser blocks autoplay
      setPlaying(true);
      setHint(false);
      fadeTo(VOLUME);
      return true;
    } catch {
      return false;
    }
  }, [fadeTo]);

  const pause = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    setPlaying(false);
    fadeTo(0, () => a.pause());
  }, [fadeTo]);

  // Try to start on load; if blocked, start on the first tap, click or key press
  useEffect(() => {
    try {
      userPaused.current = localStorage.getItem(KEY) === "off";
    } catch {}

    if (userPaused.current) return;

    let hintTimer: ReturnType<typeof setTimeout> | undefined;
    let started = false;

    const events = ["pointerdown", "keydown", "touchend"] as const;

    const cleanup = () => {
      events.forEach((event) => {
        window.removeEventListener(event, onGesture);
      });

      if (hintTimer) clearTimeout(hintTimer);
    };

    const onGesture = async (event: Event) => {
      const target = event.target as HTMLElement | null;

      // The music button already handles its own clicks.
      if (target?.closest?.("[data-music-toggle]")) return;

      if (started || userPaused.current) return;

      if (await play()) {
        started = true;
        cleanup();
      }
    };

    const attemptAutoplay = async () => {
      const success = await play();

      if (success) {
        started = true;
        cleanup();
        return;
      }

      // Autoplay was blocked. Wait for the visitor's first interaction.
      events.forEach((event) => {
        window.addEventListener(event, onGesture, { passive: true });
      });

      setHint(true);

      hintTimer = setTimeout(() => {
        setHint(false);
      }, 9000);
    };

    void attemptAutoplay();

    return cleanup;
  }, [play]);

  // Pause when the tab is hidden, resume when it comes back
  useEffect(() => {
    const onVisibility = () => {
      const a = audioRef.current;
      if (!a) return;
      if (document.hidden) {
        wasPlaying.current = !a.paused;
        a.pause();
      } else if (wasPlaying.current && !userPaused.current) {
        a.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      if (fadeRef.current) clearInterval(fadeRef.current);
    };
  }, []);

  const toggle = async () => {
    if (playing) {
      userPaused.current = true;
      try {
        localStorage.setItem(KEY, "off");
      } catch {}
      pause();
    } else {
      userPaused.current = false;
      try {
        localStorage.removeItem(KEY);
      } catch {}
      await play();
    }
  };

  return (
    <>
      <audio ref={audioRef} src={wedding.music.src} loop preload="auto" />

      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex items-center gap-3 sm:bottom-6 sm:right-6">
        <AnimatePresence>
          {hint && !playing && (
            <motion.span
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 12 }}
              className="rounded-sm border border-[#B8964A]/50 bg-white/95 px-3 py-1.5 font-display text-sm italic text-[#8A6D2B] shadow-md"
            >
              Tap to play our song
            </motion.span>
          )}
        </AnimatePresence>

        <button
          type="button"
          data-music-toggle
          onClick={toggle}
          aria-label={
            playing ? "Pause background music" : "Play background music"
          }
          aria-pressed={playing}
          className="relative grid h-12 w-12 place-items-center rounded-full border border-[#B8964A]/70 bg-white shadow-[0_10px_28px_-10px_rgba(30,35,33,0.5)] transition-transform duration-300 hover:scale-105 active:scale-95 sm:h-14 sm:w-14"
        >
          {/* expanding rings while the music plays */}
          {playing &&
            [0, 1].map((i) => (
              <motion.span
                key={i}
                aria-hidden
                className="absolute inset-0 rounded-full border border-[#B8964A]"
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 1.7, opacity: 0 }}
                transition={{
                  duration: 2.4,
                  delay: i * 1.2,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}

          {/* spinning vinyl record */}
          <motion.svg
            viewBox="0 0 40 40"
            className="h-8 w-8 sm:h-9 sm:w-9"
            animate={{ rotate: playing ? 360 : 0 }}
            transition={
              playing
                ? { duration: 6, repeat: Infinity, ease: "linear" }
                : { duration: 0.6 }
            }
          >
            <circle cx="20" cy="20" r="18" fill="#1E2321" />
            <circle
              cx="20"
              cy="20"
              r="14"
              fill="none"
              stroke="#B8964A"
              strokeOpacity="0.5"
              strokeWidth="0.5"
            />
            <circle
              cx="20"
              cy="20"
              r="10.5"
              fill="none"
              stroke="#B8964A"
              strokeOpacity="0.35"
              strokeWidth="0.5"
            />
            <circle cx="20" cy="20" r="6" fill="#B8964A" />
            <circle cx="20" cy="20" r="1.4" fill="#1E2321" />
          </motion.svg>

          {/* slash across the record when paused */}
          {!playing && (
            <span
              aria-hidden
              className="absolute h-px w-9 -rotate-45 bg-[#B8964A] shadow-[0_0_0_2px_white]"
            />
          )}
        </button>
      </div>
    </>
  );
}
