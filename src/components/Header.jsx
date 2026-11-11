const TABS = [["discover", "Discover"], ["tickets", "My tickets"], ["organize", "Organize"]];

export default function Header({ page, setPage, tickets, onInterests }) {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3 md:px-8">
        <button onClick={() => setPage("discover")} className="font-display text-2xl font-extrabold tracking-tight">Campus<span className="text-[#3b36ff]">Buzz</span></button>
        <nav className="order-3 flex w-full gap-1 md:order-none md:w-auto" aria-label="Main">
          {TABS.map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} aria-current={page === id ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${page === id ? "bg-ink text-white" : "text-ink/70 hover:bg-ink/5"}`}>
              {label}{id === "tickets" && tickets > 0 && <span className="ml-1.5 rounded-full bg-[#ff3d8b] px-1.5 py-0.5 text-[10px] text-white">{tickets}</span>}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <button onClick={onInterests} className="btn-light !py-2">✨ My interests</button>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-xs font-bold text-white" aria-label="Your profile">YOU</span>
        </div>
      </div>
    </header>
  );
}
