"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

// ─── Constants ────────────────────────────────────────────────────────────────

const SECTIONS = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "skills",     label: "Skills"     },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects"   },
  { id: "contact",    label: "Contact"    },
];

const NAV_LINKS = [
  { label: "HOME",       id: "hero"       },
  { label: "ABOUT",      id: "about"      },
  { label: "PROJECTS",   id: "projects"   },
  { label: "EXPERIENCE", id: "experience" },
  { label: "CONTACT",    id: "contact"    },
];

const MAX_TRAVEL_X = 3;   // px — horizontal bar travel
const MAX_TRAVEL_Y = 1.5; // px — vertical bar travel (less, since bars are tall)

// ─── Eye that tracks mouse ─────────────────────────────────────────────────────

// ─── Single bar-shaped eye that shifts to follow mouse ────────────────────────

function TrackingEye({ offsetX, offsetY }: { offsetX: number; offsetY: number }) {
  return (
    <div
      className="w-[5px] h-[11px] rounded-[2px] bg-white dark:bg-black"
      style={{
        transform: `translate(${offsetX}px, ${offsetY}px)`,
        transition: "transform 0.08s ease-out",
      }}
    />
  );
}

// ─── Robot face ────────────────────────────────────────────────────────────────

function RobotFace({ mouse }: { mouse: { x: number; y: number } }) {
  // Keep offset in state so server (0,0) matches client initial render → no hydration mismatch
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const nx = (mouse.x / window.innerWidth) * 2 - 1;
    const ny = (mouse.y / window.innerHeight) * 2 - 1;
    setOffset({ x: nx * MAX_TRAVEL_X, y: ny * MAX_TRAVEL_Y });
  }, [mouse]);

  return (
    <div className="w-8 h-8 rounded-full bg-black dark:bg-white flex items-center justify-center gap-[4px] flex-shrink-0">
      <TrackingEye offsetX={offset.x} offsetY={offset.y} />
      <TrackingEye offsetX={offset.x} offsetY={offset.y} />
    </div>
  );
}

// ─── Circular progress ring ────────────────────────────────────────────────────

function CircularProgress({ pct }: { pct: number }) {
  const r = 8;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="flex-shrink-0 -rotate-90">
      <circle cx="11" cy="11" r={r} fill="none" strokeWidth="2.5"
        className="stroke-neutral-200 dark:stroke-neutral-700" />
      <circle cx="11" cy="11" r={r} fill="none" strokeWidth="2.5"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        className="stroke-neutral-900 dark:stroke-white transition-all duration-200"
      />
    </svg>
  );
}

// ─── Main smart pill ───────────────────────────────────────────────────────────

export default function RobotMenu() {
  const [open, setOpen]               = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [activeSection, setActiveSection] = useState("Home");
  const [scrollPct, setScrollPct]     = useState(0);
  const [mouse, setMouse]             = useState({ x: 0, y: 0 });

  // ── Scroll tracking ──
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const top = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setScrollPct(total > 0 ? Math.round((top / total) * 100) : 0);
      setScrolled(top > 80);
      if (top <= 80) setOpen(false); // close menu when back at top
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── Section observer ──
  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTIONS.forEach(({ id, label }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(label); },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  // ── Mouse tracking ──
  useEffect(() => {
    const onMove = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">

        {/* ── THE PILL ── */}
        <AnimatePresence mode="wait">

          {/* ROBOT MODE — at top of page */}
          {!scrolled && (
            <motion.button
              key="robot"
              onClick={() => setOpen((v) => !v)}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-lg cursor-pointer"
            >
              <RobotFace mouse={mouse} />
              <motion.span
                key={open ? "close" : "menu"}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.12 }}
                className="text-xs font-semibold tracking-widest text-neutral-800 dark:text-neutral-200 uppercase pr-1"
              >
                {open ? "CLOSE" : "MENU"}
              </motion.span>
            </motion.button>
          )}

          {/* PROGRESS MODE — when scrolled */}
          {scrolled && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 px-4 py-2 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full shadow-lg pointer-events-none select-none"
            >
              <AnimatePresence mode="wait">
                <motion.span
                  key={activeSection}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="text-xs font-medium text-neutral-700 dark:text-neutral-300 tracking-wide"
                >
                  {activeSection}
                </motion.span>
              </AnimatePresence>
              <span className="text-neutral-300 dark:text-neutral-700 text-xs select-none">·</span>
              <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400 w-7 text-right">
                {scrollPct}%
              </span>
              <CircularProgress pct={scrollPct} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── NAV DROPDOWN (only in robot mode) ── */}
        <AnimatePresence>
          {open && !scrolled && (
            <motion.div
              key="nav"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 28 }}
              className="mt-2 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.045 }}
                  onClick={() => scrollTo(link.id)}
                  className="w-full px-7 py-4 text-left font-serif text-2xl font-medium tracking-tight text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0 cursor-pointer"
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── BACKDROP ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[59]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
