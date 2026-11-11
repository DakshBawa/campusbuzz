export default function CapacityBar({ count, capacity, color = "#14110f" }) {
  const pct = Math.min(100, Math.round((count / capacity) * 100));
  return (
    <div>
      <div className="h-1.5 overflow-hidden rounded-full bg-ink/10" role="img" aria-label={`${pct}% full`}><div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} /></div>
      <p className="mt-1 text-[11px] text-ink/60">{count} going · {Math.max(0, capacity - count)} seats left</p>
    </div>
  );
}
