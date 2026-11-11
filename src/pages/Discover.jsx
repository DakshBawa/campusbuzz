import { useState } from "react";
import EventCard from "../components/EventCard.jsx";
import CalendarView from "../components/CalendarView.jsx";
import Poster from "../components/Poster.jsx";
import { CATEGORIES } from "../data/events.js";
import { recommend } from "../utils/recommend.js";
import { dayDiff, endOf, fmtDate, fmtTime, when } from "../utils/dates.js";

export default function Discover({ events, ctx, interests, onInterests }) {
  const [q, setQ] = useState(""), [cat, setCat] = useState(""), [free, setFree] = useState(false), [seats, setSeats] = useState(false), [week, setWeek] = useState(false), [view, setView] = useState("cards");
  const upcoming = events.filter((e) => endOf(e) > new Date()).sort((a, b) => a.start - b.start);
  const recs = recommend(upcoming, interests, ctx.regs, ctx.countOf);
  const featured = recs[0]?.e || upcoming[0];
  const thisWeek = upcoming.filter((e) => dayDiff(e.start) < 7).length;

  const list = upcoming.filter((e) =>
    (!q || `${e.title} ${e.club} ${e.venue} ${e.tags.join(" ")}`.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || e.category === cat) && (!free || e.fee === "Free") && (!seats || ctx.countOf(e) < e.capacity) && (!week || dayDiff(e.start) < 7));
  const toggle = (on, set, label) => (
    <button onClick={() => set(!on)} aria-pressed={on} className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold ${on ? "border-ink bg-ink text-white" : "border-ink/15 bg-white hover:bg-ink/5"}`}>{label}</button>
  );

  return (
    <div className="space-y-12">
      <section className="grid items-center gap-8 pt-4 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#3b36ff]">{new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })} on campus</p>
          <h1 className="mt-3 font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">Find your next <span className="rounded-2xl bg-[#ffd23f] px-2">big thing</span>.</h1>
          <p className="mt-5 max-w-md text-lg text-ink/70">Workshops, competitions, club nights and more. Register in one tap and never miss a thing.</p>
          <div className="mt-6 flex max-w-md gap-2">
            <input className="field !rounded-full !py-3" placeholder="Search events, clubs or topics" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search events" />
          </div>
          <div className="mt-6 flex gap-8 text-sm"><p><b className="block font-display text-3xl">{thisWeek}</b>events this week</p><p><b className="block font-display text-3xl">{new Set(upcoming.map((e) => e.club)).size}</b>clubs hosting</p><p><b className="block font-display text-3xl">{Object.keys(ctx.regs).length}</b>on your list</p></div>
        </div>
        {featured && (
          <Poster event={featured} className="rise min-h-[320px] rounded-[2rem] p-6 shadow-2xl">
            <span className="chip bg-white/20 backdrop-blur">Featured · {when(featured.start)}</span>
            <div className="absolute inset-x-6 bottom-6 max-w-[75%]">
              <h2 className="font-display text-3xl font-extrabold leading-tight md:text-4xl">{featured.title}</h2>
              <p className="mt-2 text-sm text-white/85">{fmtDate(featured.start)} · {fmtTime(featured.start)} · {featured.venue}</p>
              <div className="mt-4 flex gap-2">
                <button className="btn !bg-white !text-ink" onClick={() => ctx.open(featured.id)}>See details</button>
              </div>
            </div>
          </Poster>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-4">
          <div><h2 className="font-display text-3xl font-extrabold">Picked for you</h2><p className="text-sm text-ink/60">{interests.length ? `Based on your interests in ${interests.slice(0, 3).join(", ")}${interests.length > 3 ? " and more" : ""}.` : "Choose interests to get better suggestions."}</p></div>
          <button className="btn-light shrink-0" onClick={onInterests}>Edit interests</button>
        </div>
        {recs.length === 0 ? <p className="rounded-3xl bg-white p-6 text-sm text-ink/60 ring-1 ring-ink/10">No suggestions yet. Add a few interests and they'll show up here.</p> : (
          <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-4 md:-mx-8 md:px-8">
            {recs.map(({ e, reason }) => <div key={e.id} className="w-72 shrink-0"><EventCard e={e} ctx={ctx} reason={reason} /></div>)}
          </div>
        )}
      </section>

      <section>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-3xl font-extrabold">All events <span className="text-ink/40">{list.length}</span></h2>
          <div className="flex rounded-full bg-white p-1 ring-1 ring-ink/10" role="group" aria-label="View">
            {[["cards", "Cards"], ["calendar", "Calendar"]].map(([id, l]) => <button key={id} aria-pressed={view === id} onClick={() => setView(id)} className={`rounded-full px-4 py-1.5 text-sm font-semibold ${view === id ? "bg-ink text-white" : ""}`}>{l}</button>)}
          </div>
        </div>
        <div className="mb-6 flex flex-wrap gap-2">
          {["", ...CATEGORIES.map((c) => c.id)].map((c) => (
            <button key={c || "all"} onClick={() => setCat(c)} aria-pressed={cat === c} className={`rounded-full px-3.5 py-1.5 text-sm font-semibold ${cat === c ? "bg-[#3b36ff] text-white" : "bg-white ring-1 ring-ink/15 hover:bg-ink/5"}`}>{c || "All"}</button>
          ))}
          <span className="mx-1 w-px bg-ink/15" />
          {toggle(week, setWeek, "This week")}{toggle(free, setFree, "Free only")}{toggle(seats, setSeats, "Seats available")}
        </div>
        {view === "calendar" ? <CalendarView events={list} ctx={ctx} /> : list.length === 0 ? (
          <p className="rounded-3xl bg-white p-8 text-center text-ink/60 ring-1 ring-ink/10">No events match. Try clearing a filter.</p>
        ) : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((e) => <EventCard key={e.id} e={e} ctx={ctx} />)}</div>}
      </section>
    </div>
  );
}
