import Poster from "./Poster.jsx";
import CapacityBar from "./CapacityBar.jsx";
import { catOf } from "../data/events.js";
import { badge } from "../utils/recommend.js";
import { fmtTime, when } from "../utils/dates.js";

export default function EventCard({ e, ctx, reason }) {
  const count = ctx.countOf(e), reg = ctx.regs[e.id], b = badge(e, count, reg);
  const full = count >= e.capacity;
  const c = catOf(e.category);
  return (
    <article className="rise group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10 transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      <Poster event={e} className="h-36 p-4">
        <div className="flex items-start justify-between">
          <span className="chip bg-white/20 backdrop-blur">{e.category}</span>
          {b && <span className={`chip ${b[1]}`}>{b[0]}</span>}
        </div>
        <div className="absolute bottom-3 left-4">
          <p className="font-display text-xl font-extrabold leading-none">{when(e.start)}</p>
          <p className="text-xs font-semibold text-white/85">{fmtTime(e.start)}</p>
        </div>
      </Poster>
      <div className="flex flex-1 flex-col gap-2 p-4">
        {reason && <p className="text-[11px] font-bold" style={{ color: c.color }}>✨ {reason}</p>}
        <h3 className="font-display text-lg font-extrabold leading-tight">
          <button onClick={() => ctx.open(e.id)} className="text-left after:absolute after:inset-0">{e.title}</button>
        </h3>
        <p className="text-xs text-ink/60">{e.club} · {e.venue}</p>
        <div className="mt-auto space-y-3 pt-2">
          <CapacityBar count={count} capacity={e.capacity} color={c.color} />
          <div className="relative z-10 flex items-center justify-between gap-2">
            <span className="text-sm font-bold">{e.fee}</span>
            {reg ? <button className="btn-light !px-4 !py-1.5" onClick={() => ctx.open(e.id)}>View</button>
              : <button className="btn !px-4 !py-1.5" disabled={e.closed} onClick={() => ctx.register(e)}>{e.closed ? "Closed" : full ? "Join waitlist" : "Register"}</button>}
          </div>
        </div>
      </div>
    </article>
  );
}
