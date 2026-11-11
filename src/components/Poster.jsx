import { catOf } from "../data/events.js";

/* Generated event poster: category colours, big emoji, children on top */
export default function Poster({ event: e, className = "", children }) {
  const c = catOf(e.category);
  return (
    <div className={`poster ${className}`} style={{ background: `linear-gradient(135deg, ${c.color}, ${c.dark})` }}>
      <span className="poster-emoji" aria-hidden>{c.emoji}</span>
      {children}
    </div>
  );
}
