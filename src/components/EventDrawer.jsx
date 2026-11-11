import { useEffect } from "react";
import Poster from "./Poster.jsx";
import CapacityBar from "./CapacityBar.jsx";
import { catOf } from "../data/events.js";
import { endOf, fmtDate, fmtTime, overlaps } from "../utils/dates.js";
import { downloadIcs } from "../utils/ics.js";
import { badge } from "../utils/recommend.js";

export default function EventDrawer({ e, events, ctx, onClose }) {
  useEffect(() => { const k = (ev) => ev.key === "Escape" && onClose(); window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  if (!e) return null;
  const c = catOf(e.category), count = ctx.countOf(e), reg = ctx.regs[e.id], full = count >= e.capacity, b = badge(e, count, reg);
  const clash = !reg && events.find((o) => o.id !== e.id && ctx.regs[o.id]?.status === "going" && overlaps(e, o));
  const similar = events.filter((o) => o.id !== e.id && o.start > new Date() && (o.category === e.category || o.tags.some((t) => e.tags.includes(t)))).slice(0, 2);

  return (
    <div className="fixed inset-0 z-40" role="dialog" aria-modal="true" aria-label={e.title}>
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <aside className="slide-in absolute inset-y-0 right-0 flex w-full max-w-md flex-col overflow-y-auto bg-white shadow-2xl">
        <Poster event={e} className="h-52 shrink-0 p-5">
          <button autoFocus onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/25 text-lg backdrop-blur hover:bg-white/40">×</button>
          <span className="chip bg-white/20 backdrop-blur">{e.category}</span>
          <h2 className="absolute bottom-4 left-5 right-24 font-display text-3xl font-extrabold leading-tight">{e.title}</h2>
        </Poster>

        <div className="flex-1 space-y-5 p-5">
          <div className="flex flex-wrap gap-2">{b && <span className={`chip ${b[1]}`}>{b[0]}</span>}<span className="chip bg-ink/5">{e.fee}</span>{e.mine && <span className="chip bg-indigo-100 text-indigo-700">You organize this</span>}</div>
          <dl className="grid gap-3 text-sm">
            {[["📅", `${fmtDate(e.start)}, ${fmtTime(e.start)} to ${fmtTime(endOf(e))}`], ["📍", e.venue], ["👥", `Hosted by ${e.club}`]].map(([i, t]) => (
              <div key={t} className="flex gap-3"><dt aria-hidden>{i}</dt><dd className="font-medium">{t}</dd></div>
            ))}
          </dl>
          <p className="text-sm leading-relaxed text-ink/80">{e.desc}</p>
          <div className="flex flex-wrap gap-1.5">{e.tags.map((t) => <span key={t} className="chip bg-ink/5 text-ink/70">#{t}</span>)}</div>
          <CapacityBar count={count} capacity={e.capacity} color={c.color} />

          {clash && <p role="alert" className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">⚠️ This overlaps with <b>{clash.title}</b>, which you're already going to.</p>}
          {reg?.status === "going" && <p className="rounded-2xl bg-emerald-50 p-3 text-sm text-emerald-900">🎟 You're in! Your ticket code is <b className="font-mono">{reg.code}</b>.</p>}
          {reg?.status === "waitlist" && <p className="rounded-2xl bg-amber-50 p-3 text-sm text-amber-900">You're on the waitlist. We'll move you in if a seat opens up.</p>}

          <div className="flex flex-wrap gap-2">
            {reg ? <button className="btn-light" onClick={() => ctx.cancel(e)}>{reg.status === "going" ? "Cancel registration" : "Leave waitlist"}</button>
              : <button className="btn" disabled={e.closed} onClick={() => ctx.register(e)}>{e.closed ? "Registration closed" : full ? "Join waitlist" : "Register now"}</button>}
            <button className="btn-light" onClick={() => downloadIcs(e)}>＋ Add to calendar</button>
          </div>

          {similar.length > 0 && (
            <div className="border-t border-ink/10 pt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink/50">You might also like</p>
              {similar.map((o) => <button key={o.id} onClick={() => ctx.open(o.id)} className="block w-full rounded-xl px-2 py-2 text-left text-sm font-semibold hover:bg-ink/5">{o.title} <span className="font-normal text-ink/50">· {fmtDate(o.start)}</span></button>)}
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
