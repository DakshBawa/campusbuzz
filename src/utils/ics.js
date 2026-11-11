import { endOf } from "./dates.js";

const p = (n) => String(n).padStart(2, "0");
const f = (d) => `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;

/* Downloads an .ics file that opens in Google, Apple or Outlook calendar */
export function downloadIcs(e) {
  const body = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CampusBuzz//EN", "BEGIN:VEVENT", `UID:${e.id}@campusbuzz`, `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(e.start)}`, `DTEND:${f(endOf(e))}`, `SUMMARY:${e.title}`, `LOCATION:${e.venue}`, `DESCRIPTION:${e.desc.replace(/\s+/g, " ")}`, "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type: "text/calendar" }));
  a.download = `${e.title.replace(/\W+/g, "-").toLowerCase()}.ics`;
  a.click();
  URL.revokeObjectURL(a.href);
}
