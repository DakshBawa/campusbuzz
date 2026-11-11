import { catOf } from "../data/events.js";
import { endOf, fmtDate, fmtTime } from "../utils/dates.js";
import { downloadIcs } from "../utils/ics.js";

export default function MyTickets({ events, ctx, goDiscover }) {
  const mine = events.filter((e) => ctx.regs[e.id]).sort((a, b) => a.start - b.start);
  const going = mine.filter((e) => ctx.regs[e.id].status === "going"), wait = mine.filter((e) => ctx.regs[e.id].status === "waitlist");

  const Ticket = ({ e }) => {
    const r = ctx.regs[e.id], c = catOf(e.category), w = r.status === "waitlist";
    return (
      <article className="rise flex overflow-hidden rounded-3xl bg-white ring-1 ring-ink/10">
        <div className="w-2 shrink-0" style={{ background: c.color }} />
        <div className="flex-1 p-5">
          <p className="text-xs font-bold uppercase tracking-wide" style={{ color: c.color }}>{e.category}</p>
          <h3 className="font-display text-xl font-extrabold leading-tight"><button onClick={() => ctx.open(e.id)} className="text-left hover:underline">{e.title}</button></h3>
          <p className="mt-2 text-sm text-ink/70">{fmtDate(e.start)} · {fmtTime(e.start)} to {fmtTime(endOf(e))}<br />{e.venue}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {!w && <button className="btn-light !py-1.5" onClick={() => downloadIcs(e)}>＋ Calendar</button>}
            <button className="btn-light !py-1.5" onClick={() => ctx.cancel(e)}>{w ? "Leave waitlist" : "Cancel"}</button>
          </div>
        </div>
        <div className="stub grid w-32 shrink-0 place-items-center p-3 text-center sm:w-36">
          <div><p className="text-[10px] font-bold uppercase tracking-widest text-ink/50">{w ? "Waitlist" : "Entry code"}</p><p className="mt-1 break-all font-mono text-lg font-bold">{w ? "—" : r.code}</p>{!w && <p className="mt-1 text-[10px] text-ink/50">Show at the door</p>}</div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-8">
      <div><h1 className="font-display text-4xl font-extrabold md:text-5xl">My tickets</h1><p className="mt-1 text-ink/60">Everything you've signed up for, in one place.</p></div>
      {mine.length === 0 ? (
        <div className="rounded-3xl bg-white p-10 text-center ring-1 ring-ink/10"><p className="text-4xl" aria-hidden>🎟️</p><p className="mt-2 font-display text-xl font-extrabold">No tickets yet</p><p className="mb-5 text-sm text-ink/60">Register for an event and it will show up here.</p><button className="btn" onClick={goDiscover}>Browse events</button></div>
      ) : (
        <>
          <section className="grid gap-4 lg:grid-cols-2">{going.map((e) => <Ticket key={e.id} e={e} />)}</section>
          {wait.length > 0 && <section><h2 className="mb-3 font-display text-xl font-extrabold">Waitlisted</h2><div className="grid gap-4 lg:grid-cols-2">{wait.map((e) => <Ticket key={e.id} e={e} />)}</div></section>}
        </>
      )}
    </div>
  );
}
