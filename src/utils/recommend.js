import { dayDiff } from "./dates.js";

/* Simple, explainable scoring: your interests, categories you've joined, popularity and how soon it is. */
export function recommend(events, interests, regs, countOf) {
  const joined = new Set(events.filter((e) => regs[e.id]).map((e) => e.category));
  return events
    .filter((e) => !regs[e.id] && !e.closed && countOf(e) < e.capacity)
    .map((e) => {
      const hits = e.tags.filter((t) => interests.includes(t));
      const fill = countOf(e) / e.capacity;
      const score = hits.length * 3 + (joined.has(e.category) ? 2 : 0) + fill * 1.5 - Math.max(0, dayDiff(e.start)) * 0.06 + (e.featured ? 0.5 : 0);
      const reason = hits.length ? `Matches your interest in ${hits[0]}` : joined.has(e.category) ? `Because you joined a ${e.category.toLowerCase()}` : fill > 0.7 ? "Filling up fast" : null;
      return { e, score, reason, personal: hits.length > 0 || joined.has(e.category) };
    })
    .filter((x) => x.personal || x.score > 2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
}

export function badge(e, count, reg) {
  if (reg?.status === "going") return ["Going ✓", "bg-emerald-100 text-emerald-800"];
  if (reg?.status === "waitlist") return ["Waitlisted", "bg-amber-100 text-amber-800"];
  if (e.closed) return ["Closed", "bg-stone-200 text-stone-600"];
  if (count >= e.capacity) return ["Full", "bg-rose-100 text-rose-700"];
  if (count / e.capacity >= 0.85) return [`${e.capacity - count} seats left`, "bg-orange-100 text-orange-800"];
  return null;
}
