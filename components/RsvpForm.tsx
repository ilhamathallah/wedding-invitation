"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { wedding } from "@/lib/config";

const field = "w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-base outline-none transition focus:border-sage focus:ring-4 focus:ring-sage/15";

export default function RsvpForm({ guest }: { guest?: string }) {
  const [attending, setAttending] = useState<"yes" | "no">("yes");
  const [count, setCount] = useState(1);
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setStatus("loading");
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: fd.get("name"), attending, count: attending === "yes" ? count : 0, note: fd.get("note") }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {status === "done" ? (
        <motion.div key="done" initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-ink/10 bg-white/50 p-10 text-center">
          <h3 className="font-display text-3xl">{attending === "yes" ? "We can’t wait to see you" : "You will be missed"}</h3>
          <p className="mt-3 text-ink/60">Thank you for letting us know.</p>
        </motion.div>
      ) : (
        <motion.form key="form" onSubmit={onSubmit} exit={{ opacity: 0 }} className="space-y-6 rounded-2xl border border-ink/10 bg-white/50 p-6 sm:p-10">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">Full name</label>
            <input id="name" name="name" required defaultValue={guest} autoComplete="name" className={field} />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm">Will you attend?</legend>
            <div className="relative grid grid-cols-2 rounded-full bg-mist p-1">
              {(["yes", "no"] as const).map((v) => (
                <button key={v} type="button" onClick={() => setAttending(v)} aria-pressed={attending === v}
                  className="relative z-10 rounded-full py-2.5 text-sm">
                  {attending === v && <motion.span layoutId="seg" className="absolute inset-0 -z-10 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
                  {v === "yes" ? "Joyfully accept" : "Regretfully decline"}
                </button>
              ))}
            </div>
          </fieldset>

          <AnimatePresence initial={false}>
            {attending === "yes" && (
              <motion.div key="count" initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                <p className="mb-2 text-sm">Number of guests</p>
                <div className="flex items-center gap-5">
                  <button type="button" aria-label="Fewer guests" onClick={() => setCount((c) => Math.max(1, c - 1))} className="h-11 w-11 rounded-full border border-ink/20 text-xl">−</button>
                  <span className="w-6 text-center font-display text-3xl tabular-nums" aria-live="polite">{count}</span>
                  <button type="button" aria-label="More guests" onClick={() => setCount((c) => Math.min(6, c + 1))} className="h-11 w-11 rounded-full border border-ink/20 text-xl">+</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label htmlFor="note" className="mb-2 block text-sm">Dietary needs or a note (optional)</label>
            <textarea id="note" name="note" rows={3} maxLength={300} className={field} />
          </div>

          <div className="flex flex-col items-center gap-3">
            <button className="btn w-full sm:w-auto" disabled={status === "loading"}>{status === "loading" ? "Sending…" : "Send RSVP"}</button>
            {status === "error" && <p role="alert" className="text-sm text-red-700">Something went wrong. Please try again.</p>}
            <p className="text-xs text-ink/50">Kindly reply by {wedding.rsvpDeadline}</p>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
