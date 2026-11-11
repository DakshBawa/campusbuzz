import { useState } from "react";
import { catOf } from "../data/events.js";
import { fmtTime, sameDay } from "../utils/dates.js";

export default function CalendarView({ events, ctx }) {
  const now = new Date();
  const [m, setM] = useState(new Date(now.getFullYear(), now.getMonth(), 1));
  const [sel, setSel] = useState(now);
  const days = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
  const cells = [...Array(m.getDay()).fill(null), ...Array.from({ length: days }, (_, i) => new Date(m.getFullYear(), m.getMonth(), i + 1))];
  const on = (d) => events.filter((e) => sameDay(e.start, d));
  const shift = (n) => setM(new Date(m.getFullYear(), m.getMonth() + n, 1));

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <div className="rounded-3xl bg-white p-4 ring-1 ring-ink/10">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-xl font-extrabold">{m.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</h3>
          <div className="flex gap-1"><button className="btn-light !px-3 !py-1.5" onClick={() => shift(-1)} aria-label="Previous month">‹</button><button className="btn-light !px-3 !py-1.5" onClick={() => shift(1)} aria-label="Next month">›</button></div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-ink/40">{["S", "M", "T", "W", "T", "F", "S"].map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="mt-1 grid grid-cols-7 gap-1">
          {cells.map((d, i) => d ? (
            <button key={i} onClick={() => setSel(d)} aria-pressed={sameDay(d, sel)}
              className={`flex aspect-square flex-col items-center justify-center rounded-xl text-sm font-semibold ${sameDay(d, sel) ? "bg-ink text-white" : sameDay(d, now) ? "bg-indigo-50 text-indigo-700" : "hover:bg-ink/5"}`}>
              {d.getDate()}
              <span className="mt-0.5 flex h-1.5 gap-0.5">{on(d).slice(0, 3).map((e) => <i key={e.id} className="h-1.5 w-1.5 rounded-full" style={{ background: catOf(e.category).color }} />)}</span>
            </button>
          ) : <span key={i} />)}
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-lg font-extrabold">{sel.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short" })}</h3>
        {on(sel).length === 0 && <p className="rounded-2xl bg-white p-4 text-sm text-ink/60 ring-1 ring-ink/10">Nothing scheduled. Pick a day with a dot.</p>}
        {on(sel).map((e) => (
          <button key={e.id} onClick={() => ctx.open(e.id)} className="flex w-full items-center gap-3 rounded-2xl bg-white p-3 text-left ring-1 ring-ink/10 hover:shadow-md">
            <span className="h-10 w-1.5 rounded-full" style={{ background: catOf(e.category).color }} />
            <span><span className="block text-sm font-bold">{e.title}</span><span className="text-xs text-ink/60">{fmtTime(e.start)} · {e.venue}</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
