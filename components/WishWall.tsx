"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

type Wish = { id: string; name: string; text: string; original?: string };

const KEY = "wedding-wishes";
// Wishes live in this browser only. For a shared wall, swap load/save for a database
// (Supabase, Vercel KV, etc.) behind an /api/wishes route.
const seed: Wish[] = [{ id: "seed", name: "The Family", text: "May your home always be filled with love, laughter and quiet mornings together." }];

const field = "w-full rounded-xl border border-ink/15 bg-white/60 px-4 py-3 text-base outline-none transition focus:border-sage focus:ring-4 focus:ring-sage/15";

function WishCard({ w }: { w: Wish }) {
  const [orig, setOrig] = useState(false);
  return (
    <motion.li layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-2xl border border-ink/10 bg-white/50 p-6">
      <p className="font-display text-xl italic leading-relaxed">“{orig && w.original ? w.original : w.text}”</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="font-normal">{w.name}</span>
        {w.original && (
          <button onClick={() => setOrig((o) => !o)} className="text-xs text-sage-dark underline-offset-4 hover:underline">
            {orig ? "Show refined version" : "Refined with AI · see original"}
          </button>
        )}
      </div>
    </motion.li>
  );
}

export default function WishWall({ guest }: { guest?: string }) {
  const [wishes, setWishes] = useState<Wish[]>(seed);
  const [busy, setBusy] = useState(false);
  const [polish, setPolish] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) setWishes(JSON.parse(saved));
    } catch {}
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name")).trim();
    const message = String(fd.get("message")).trim();
    if (!name || !message) return;

    setBusy(true);
    setNotice("");
    let text = message;
    let original: string | undefined;

    if (polish) {
      try {
        const res = await fetch("/api/wishes/refine", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
        if (!res.ok) throw new Error();
        const data = await res.json();
        text = data.refined;
        original = message;
      } catch {
        setNotice("The AI polish is unavailable right now, so your message was posted as written.");
      }
    }

    const next = [{ id: crypto.randomUUID(), name, text, original }, ...wishes];
    setWishes(next);
    try { localStorage.setItem(KEY, JSON.stringify(next)); } catch {}
    form.reset();
    setBusy(false);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="space-y-5 rounded-2xl border border-ink/10 bg-white/50 p-6 sm:p-10">
        <div>
          <label htmlFor="wname" className="mb-2 block text-sm">Your name</label>
          <input id="wname" name="name" required defaultValue={guest} className={field} />
        </div>
        <div>
          <label htmlFor="wmsg" className="mb-2 block text-sm">Your wishes</label>
          <textarea id="wmsg" name="message" required minLength={3} maxLength={500} rows={4} className={field} placeholder="Write a few words, however simple." />
        </div>
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" checked={polish} onChange={(e) => setPolish(e.target.checked)} className="mt-1 h-4 w-4 accent-sage-dark" />
          <span>Make my message warmer and more poetic <span className="text-ink/50">(AI-refined, you can still view the original)</span></span>
        </label>
        <div className="flex flex-col items-center gap-3">
          <button className="btn w-full sm:w-auto" disabled={busy}>{busy ? "Writing your wish…" : "Send wishes"}</button>
          {notice && <p role="status" className="text-center text-sm text-ink/60">{notice}</p>}
        </div>
      </form>

      <ul className="mt-10 space-y-4">
        <AnimatePresence initial={false}>{wishes.map((w) => <WishCard key={w.id} w={w} />)}</AnimatePresence>
      </ul>
    </div>
  );
}
