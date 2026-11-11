import { TAGS } from "../data/events.js";

export default function InterestsDialog({ interests, setInterests, onClose }) {
  const toggle = (t) => setInterests(interests.includes(t) ? interests.filter((x) => x !== t) : [...interests, t]);
  return (
    <div className="fixed inset-0 z-40 grid place-items-center p-4" role="dialog" aria-modal="true" aria-label="Choose interests">
      <div className="absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="rise relative w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="font-display text-2xl font-extrabold">What are you into?</h2>
        <p className="mt-1 text-sm text-ink/60">Pick a few. We'll use them to suggest events that fit you.</p>
        <div className="my-5 flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button key={t} onClick={() => toggle(t)} aria-pressed={interests.includes(t)}
              className={`rounded-full border px-3.5 py-1.5 text-sm font-semibold capitalize ${interests.includes(t) ? "border-ink bg-ink text-white" : "border-ink/15 hover:bg-ink/5"}`}>{t}</button>
          ))}
        </div>
        <button className="btn w-full" onClick={onClose}>Done ({interests.length} selected)</button>
      </div>
    </div>
  );
}
