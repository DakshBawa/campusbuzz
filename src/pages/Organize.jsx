import { useState } from "react";
import Poster from "../components/Poster.jsx";
import CapacityBar from "../components/CapacityBar.jsx";
import { CATEGORIES, TAGS, VENUES, catOf } from "../data/events.js";
import { fmtDate, fmtTime } from "../utils/dates.js";

const iso = (d) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const blank = () => ({ title: "", category: "Workshop", date: iso(new Date(Date.now() + 864e5)), time: "17:00", hours: 2, venue: VENUES[0], capacity: 50, desc: "", tags: [], fee: "Free" });

export default function Organize({ events, ctx, onCreate, onToggle, onDelete }) {
  const [f, setF] = useState(blank());
  const [err, setErr] = useState("");
  const set = (k, v) => setF({ ...f, [k]: v });
  const start = new Date(`${f.date}T${f.time}`);
  const mine = events.filter((e) => e.mine);
  const total = mine.reduce((s, e) => s + ctx.countOf(e), 0), seatsLeft = mine.reduce((s, e) => s + Math.max(0, e.capacity - ctx.countOf(e)), 0);

  const submit = () => {
    if (!f.title.trim()) return setErr("Give your event a title.");
    if (isNaN(start) || start < new Date()) return setErr("Pick a date and time in the future.");
    if (!(+f.capacity >= 1)) return setErr("Capacity must be at least 1.");
    setErr("");
    onCreate({ id: `n${Date.now()}`, title: f.title.trim(), category: f.category, club: "Your club", start, hours: +f.hours, venue: f.venue, tags: f.tags, capacity: +f.capacity, registered: 0, fee: f.fee.trim() || "Free", desc: f.desc.trim() || "More details coming soon.", closed: false, mine: true });
    setF(blank());
  };
  const preview = { id: "preview", title: f.title || "Your event title", category: f.category, start: isNaN(start) ? new Date() : start, tags: f.tags };

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-4xl font-extrabold md:text-5xl">Organize</h1><p className="mt-1 text-ink/60">Create an event and watch the registrations come in.</p></div>
      <div className="grid gap-3 sm:grid-cols-3">
        {[["Your events", mine.length], ["Total registrations", total], ["Seats still open", seatsLeft]].map(([k, v]) => <div key={k} className="rounded-3xl bg-white p-5 ring-1 ring-ink/10"><p className="text-xs font-bold uppercase tracking-wide text-ink/50">{k}</p><p className="font-display text-4xl font-extrabold">{v}</p></div>)}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4 rounded-3xl bg-white p-6 ring-1 ring-ink/10">
          <h2 className="font-display text-2xl font-extrabold">New event</h2>
          <label className="block text-sm font-semibold">Title<input className="field mt-1" value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Intro to Web Dev" /></label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block text-sm font-semibold">Category<select className="field mt-1" value={f.category} onChange={(e) => set("category", e.target.value)}>{CATEGORIES.map((c) => <option key={c.id}>{c.id}</option>)}</select></label>
            <label className="block text-sm font-semibold">Venue<select className="field mt-1" value={f.venue} onChange={(e) => set("venue", e.target.value)}>{VENUES.map((v) => <option key={v}>{v}</option>)}</select></label>
            <label className="block text-sm font-semibold">Date<input type="date" className="field mt-1" min={iso(new Date())} value={f.date} onChange={(e) => set("date", e.target.value)} /></label>
            <label className="block text-sm font-semibold">Start time<input type="time" className="field mt-1" value={f.time} onChange={(e) => set("time", e.target.value)} /></label>
            <label className="block text-sm font-semibold">Duration (hours)<input type="number" min="0.5" step="0.5" className="field mt-1" value={f.hours} onChange={(e) => set("hours", e.target.value)} /></label>
            <label className="block text-sm font-semibold">Seats<input type="number" min="1" className="field mt-1" value={f.capacity} onChange={(e) => set("capacity", e.target.value)} /></label>
          </div>
          <label className="block text-sm font-semibold">Description<textarea rows={3} className="field mt-1" value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="What will people do or learn?" /></label>
          <div><p className="mb-2 text-sm font-semibold">Topics (up to 3)</p><div className="flex flex-wrap gap-1.5">{TAGS.map((t) => { const on = f.tags.includes(t); return <button key={t} type="button" aria-pressed={on} disabled={!on && f.tags.length >= 3} onClick={() => set("tags", on ? f.tags.filter((x) => x !== t) : [...f.tags, t])} className={`rounded-full border px-3 py-1 text-xs font-semibold capitalize disabled:opacity-40 ${on ? "border-ink bg-ink text-white" : "border-ink/15"}`}>{t}</button>; })}</div></div>
          {err && <p role="alert" className="text-sm font-semibold text-rose-600">{err}</p>}
          <button className="btn" onClick={submit}>Publish event</button>
        </section>

        <aside className="space-y-3 lg:sticky lg:top-24 lg:self-start">
          <p className="text-xs font-bold uppercase tracking-wide text-ink/50">Live preview</p>
          <Poster event={preview} className="min-h-[220px] rounded-3xl p-5 shadow-xl">
            <span className="chip bg-white/20 backdrop-blur">{f.category}</span>
            <div className="absolute inset-x-5 bottom-5 max-w-[75%]"><h3 className="font-display text-2xl font-extrabold leading-tight">{preview.title}</h3><p className="mt-1 text-xs text-white/85">{fmtDate(preview.start)} · {fmtTime(preview.start)} · {f.venue}</p></div>
          </Poster>
        </aside>
      </div>

      <section>
        <h2 className="mb-3 font-display text-2xl font-extrabold">Your events</h2>
        {mine.length === 0 && <p className="rounded-3xl bg-white p-6 text-sm text-ink/60 ring-1 ring-ink/10">You haven't created any events yet.</p>}
        <div className="grid gap-4 lg:grid-cols-2">
          {mine.map((e) => (
            <article key={e.id} className="rounded-3xl bg-white p-5 ring-1 ring-ink/10">
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-lg font-extrabold leading-tight"><button onClick={() => ctx.open(e.id)} className="text-left hover:underline">{e.title}</button></h3><p className="text-xs text-ink/60">{fmtDate(e.start)} · {fmtTime(e.start)} · {e.venue}</p></div><span className={`chip ${e.closed ? "bg-stone-200 text-stone-600" : "bg-emerald-100 text-emerald-800"}`}>{e.closed ? "Closed" : "Open"}</span></div>
              <div className="my-4"><CapacityBar count={ctx.countOf(e)} capacity={e.capacity} color={catOf(e.category).color} /></div>
              <div className="flex gap-2"><button className="btn-light !py-1.5" onClick={() => onToggle(e.id)}>{e.closed ? "Reopen registrations" : "Close registrations"}</button><button className="btn-light !py-1.5 !text-rose-600" onClick={() => onDelete(e.id)}>Delete</button></div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
