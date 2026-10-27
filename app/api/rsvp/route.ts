import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const b = await req.json().catch(() => null);
  const name = typeof b?.name === "string" ? b.name.trim().slice(0, 80) : "";
  const attending = b?.attending === "yes" || b?.attending === "no" ? b.attending : null;
  const count = Number.isInteger(b?.count) ? Math.min(Math.max(b.count, 0), 6) : 0;
  const note = typeof b?.note === "string" ? b.note.trim().slice(0, 300) : "";
  if (!name || !attending) return NextResponse.json({ error: "Invalid RSVP" }, { status: 400 });

  const payload = { name, attending, count, note, at: new Date().toISOString() };

  // Forward to a Google Apps Script / Make / Zapier webhook, or log if none is set.
  const hook = process.env.RSVP_WEBHOOK_URL;
  if (hook) {
    const r = await fetch(hook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }).catch(() => null);
    if (!r?.ok) return NextResponse.json({ error: "Could not save RSVP" }, { status: 502 });
  } else {
    console.log("RSVP:", payload);
  }
  return NextResponse.json({ ok: true });
}
