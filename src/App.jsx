import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header.jsx";
import EventDrawer from "./components/EventDrawer.jsx";
import InterestsDialog from "./components/InterestsDialog.jsx";
import Discover from "./pages/Discover.jsx";
import MyTickets from "./pages/MyTickets.jsx";
import Organize from "./pages/Organize.jsx";
import { EVENTS } from "./data/events.js";

const code = () => `BZ-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

export default function App() {
  const [page, setPage] = useState("discover");
  const [events, setEvents] = useState(EVENTS);
  const [regs, setRegs] = useState({});
  const [interests, setInterests] = useState(["ai", "coding", "music"]);
  const [openId, setOpenId] = useState(null);
  const [showInterests, setShowInterests] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 3200); return () => clearTimeout(t); }, [toast]);

  const countOf = (e) => e.registered + (regs[e.id]?.status === "going" ? 1 : 0);
  const register = (e) => {
    if (regs[e.id]) return;
    const full = e.registered >= e.capacity;
    setRegs((r) => ({ ...r, [e.id]: { code: code(), status: full ? "waitlist" : "going" } }));
    setToast(full ? `You're on the waitlist for ${e.title}` : `You're in! ${e.title} is on your tickets.`);
  };
  const cancel = (e) => { setRegs(({ [e.id]: _, ...rest }) => rest); setToast("Registration cancelled"); };
  const open = useCallback((id) => setOpenId(id), []);
  const ctx = { regs, countOf, register, cancel, open };

  return (
    <div className="min-h-screen">
      <Header page={page} setPage={setPage} tickets={Object.keys(regs).length} onInterests={() => setShowInterests(true)} />
      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8 md:px-8">
        {page === "discover" && <Discover events={events} ctx={ctx} interests={interests} onInterests={() => setShowInterests(true)} />}
        {page === "tickets" && <MyTickets events={events} ctx={ctx} goDiscover={() => setPage("discover")} />}
        {page === "organize" && (
          <Organize events={events} ctx={ctx}
            onCreate={(e) => { setEvents((x) => [e, ...x]); setToast("Event published. It's live on Discover."); }}
            onToggle={(id) => setEvents((x) => x.map((e) => (e.id === id ? { ...e, closed: !e.closed } : e)))}
            onDelete={(id) => { setEvents((x) => x.filter((e) => e.id !== id)); setOpenId(null); }} />
        )}
      </main>
      <EventDrawer e={events.find((e) => e.id === openId)} events={events} ctx={ctx} onClose={() => setOpenId(null)} />
      {showInterests && <InterestsDialog interests={interests} setInterests={setInterests} onClose={() => setShowInterests(false)} />}
      {toast && <div role="status" className="rise fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 text-sm font-semibold text-white shadow-2xl">{toast}</div>}
    </div>
  );
}
