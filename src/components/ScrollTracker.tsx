"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SECTIONS = [
  { id: "hero",       label: "Home"       },
  { id: "about",      label: "About"      },
  { id: "skills",     label: "Skills"     },
  { id: "experience", label: "Experience" },
  { id: "projects",   label: "Projects"   },
  { id: "contact",    label: "Contact"    },
];

export default function ScrollTracker() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [scrollPct, setScrollPct] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Track overall scroll percentage
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      setScrollPct(pct);
      setVisible(scrolled > 80); // hide when right at top
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // IntersectionObserver to track which section is in view
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { threshold: 0.3 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const label =
    SECTIONS.find((s) => s.id === activeSection)?.label ?? "Home";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="scroll-tracker"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed top-4 right-6 z-50 pointer-events-none"
        >
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-lg">
            {/* Section name */}
            <AnimatePresence mode="wait">
              <motion.span
                key={label}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18 }}
                className="text-xs font-medium text-neutral-700 dark:text-neutral-300 tracking-wide"
              >
                {label}
              </motion.span>
            </AnimatePresence>

            {/* Divider */}
            <span className="text-neutral-300 dark:text-neutral-700 text-xs">·</span>

            {/* Percentage */}
            <span className="text-xs font-mono text-neutral-500 dark:text-neutral-400">
              {scrollPct}%
            </span>

            {/* Mini progress bar */}
            <div className="w-16 h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-neutral-900 dark:bg-white"
                style={{ width: `${scrollPct}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
