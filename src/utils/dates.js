const day0 = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const endOf = (e) => new Date(e.start.getTime() + e.hours * 36e5);
export const sameDay = (a, b) => a.toDateString() === b.toDateString();
export const fmtDate = (d) => d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
export const fmtTime = (d) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
export const overlaps = (a, b) => a.start < endOf(b) && b.start < endOf(a);

export function when(d) {
  const n = Math.round((day0(d) - day0(new Date())) / 864e5);
  return n === 0 ? "Today" : n === 1 ? "Tomorrow" : n > 1 && n < 7 ? `In ${n} days` : fmtDate(d);
}
export const dayDiff = (d) => Math.round((day0(d) - day0(new Date())) / 864e5);
