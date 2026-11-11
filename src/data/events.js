/* Sample events. Dates are relative to today so the list always looks current.
   Replace with data from your backend. */
export const CATEGORIES = [
  { id: "Workshop", color: "#ff5a36", dark: "#b8300f", emoji: "🛠️" },
  { id: "Competition", color: "#3b36ff", dark: "#1f1a9e", emoji: "🏆" },
  { id: "Club Activity", color: "#00a86b", dark: "#006b44", emoji: "🌱" },
  { id: "Cultural", color: "#ff3d8b", dark: "#a5155a", emoji: "🎭" },
  { id: "Talk", color: "#e08a00", dark: "#8f5200", emoji: "🎤" },
  { id: "Sports", color: "#0aa5c9", dark: "#046a85", emoji: "⚽" },
];
export const catOf = (id) => CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];

export const TAGS = ["ai", "coding", "robotics", "design", "music", "dance", "sports", "photography", "entrepreneurship", "debate", "careers", "volunteering", "film", "chess", "security"];
export const VENUES = ["Main Auditorium", "Lecture Theatre (LT)", "Vasudha Hall", "Ira Hall", "Ananta Hall", "Academic Blocks", "Central Park", "Food Court Lawn", "Sports Ground", "Library"];

const at = (offset, hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  const d = new Date(); d.setDate(d.getDate() + offset); d.setHours(h, m, 0, 0);
  return d;
};
// [id, title, category, club, dayOffset, time, hours, venue, tags, capacity, registered, fee, description]
const RAW = [
  ["e1", "Intro to Generative AI", "Workshop", "AI Society", 1, "15:00", 2, "Academic Blocks", ["ai", "coding"], 60, 51, "Free", "Hands-on session: build a small chatbot with open tools. Bring a laptop. No prior AI experience needed."],
  ["e2", "Inter-Hostel Football: Quarter Finals", "Sports", "Sports Council", 0, "17:30", 2, "Sports Ground", ["sports"], 300, 120, "Free", "Four hostels, one trophy. Come cheer for your hostel and win free snacks in the half-time quiz."],
  ["e3", "Hack Night: Build in 6 Hours", "Competition", "Coding Club (you)", 3, "18:00", 6, "Lecture Theatre (LT)", ["coding", "entrepreneurship"], 60, 38, "Free", "Teams of up to 4 build a working prototype overnight. Mentors from alumni startups will judge at midnight.", { mine: true, featured: true }],
  ["e4", "Open Mic Evening", "Cultural", "Music Society", 2, "19:00", 3, "Central Park", ["music"], 150, 96, "Free", "Sing, rap, recite or play. Sign up for a 5-minute slot or just come to listen under the lights."],
  ["e5", "Photography Walk: Golden Hour", "Club Activity", "Shutterbugs", 4, "16:30", 2, "Central Park", ["photography", "design"], 25, 25, "Free", "A guided walk through campus's best light spots with tips on composition. Any camera or phone is fine."],
  ["e6", "Startup Pitch Night", "Competition", "E-Cell", 6, "17:00", 3, "Lecture Theatre (LT)", ["entrepreneurship"], 120, 70, "Free", "Ten student teams pitch to a panel of founders and investors. Audience votes for the crowd favourite.", { featured: true }],
  ["e7", "Robotics Basics with Arduino", "Workshop", "Robotics Club", 5, "14:00", 3, "Academic Blocks", ["robotics", "coding"], 40, 22, "₹100", "Wire up sensors, blink LEDs and make a line-follower. Kits are provided and yours to keep."],
  ["e8", "Classical Dance Showcase", "Cultural", "Nritya", 8, "18:30", 2, "Main Auditorium", ["dance", "music"], 400, 180, "Free", "An evening of Kathak, Bharatanatyam and fusion pieces by student performers."],
  ["e9", "Talk: Careers in Data Science", "Talk", "Placement Cell", 3, "12:30", 1.5, "Vasudha Hall", ["ai", "careers"], 200, 140, "Free", "Two alumni explain how they landed data roles, what skills matter, and answer your questions."],
  ["e10", "Parliamentary Debate Trials", "Competition", "Debating Society", 7, "15:00", 3, "Ira Hall", ["debate"], 50, 20, "Free", "Trials for the inter-college team. Motions are revealed 15 minutes before each round."],
  ["e11", "UI/UX Design Sprint", "Workshop", "Design Club", 9, "10:00", 5, "Ananta Hall", ["design"], 35, 31, "₹50", "Go from problem to clickable prototype in one day using Figma. Lunch included."],
  ["e12", "Chess Blitz Tournament", "Competition", "Chess Club", 10, "16:00", 3, "Food Court Lawn", ["chess"], 64, 40, "Free", "Swiss-system blitz, 5-minute games. All levels welcome. Boards and clocks provided."],
  ["e13", "Tree Plantation Drive", "Club Activity", "NSS", 12, "08:00", 3, "Central Park", ["volunteering"], 100, 33, "Free", "Plant 200 saplings across campus. Gloves and breakfast provided. Counts towards NSS hours."],
  ["e14", "Classic Cinema Night", "Cultural", "Film Club", 1, "20:00", 2.5, "Lecture Theatre (LT)", ["film"], 150, 60, "Free", "An open-air style screening followed by a short discussion. Bring a friend and a blanket."],
  ["e15", "Cybersecurity CTF Warm-up", "Competition", "InfoSec Club", 11, "14:00", 4, "Academic Blocks", ["coding", "security"], 80, 49, "Free", "Beginner-friendly capture-the-flag with puzzles in web, crypto and forensics."],
];

export const EVENTS = RAW.map(([id, title, category, club, off, time, hours, venue, tags, capacity, registered, fee, desc, x = {}]) => ({
  id, title, category, club, start: at(off, time), hours, venue, tags, capacity, registered, fee, desc, closed: false, ...x,
}));
