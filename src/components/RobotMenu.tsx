"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "HOME",       id: "hero"       },
  { label: "ABOUT",      id: "about"      },
  { label: "PROJECTS",   id: "projects"   },
  { label: "EXPERIENCE", id: "experience" },
  { label: "CONTACT",    id: "contact"    },
];

// The robot face — black circle with two white square "eyes"
function RobotFace({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{ width: size, height: size }}
      className="rounded-full bg-black dark:bg-white flex items-center justify-center gap-[4px] flex-shrink-0"
    >
      <span
        style={{ width: size * 0.14, height: size * 0.28 }}
        className="rounded-[2px] bg-white dark:bg-black"
      />
      <span
        style={{ width: size * 0.14, height: size * 0.28 }}
        className="rounded-[2px] bg-white dark:bg-black"
      />
    </div>
  );
}

export default function RobotMenu() {
  const [open, setOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  };

  return (
    <>
      {/* Pill trigger button — fixed top-center */}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[60] flex flex-col items-center">
        <motion.button
          onClick={() => setOpen((v) => !v)}
          layout
          className="flex items-center gap-3 px-4 py-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full shadow-lg cursor-pointer"
          style={{ minWidth: 120 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <RobotFace size={32} />
          <motion.span
            key={open ? "close" : "menu"}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="text-xs font-semibold tracking-widest text-neutral-800 dark:text-neutral-200 uppercase pr-1"
          >
            {open ? "CLOSE" : "MENU"}
          </motion.span>
        </motion.button>

        {/* Dropdown navigation */}
        <AnimatePresence>
          {open && (
            <motion.div
              key="robot-nav"
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="mt-2 w-72 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
            >
              {NAV_LINKS.map((link, i) => (
                <motion.button
                  key={link.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(link.id)}
                  className="w-full px-8 py-4 text-left font-serif text-2xl font-medium tracking-tight text-neutral-900 dark:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors border-b border-neutral-100 dark:border-neutral-800 last:border-0 cursor-pointer"
                >
                  {link.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Backdrop to close */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="robot-backdrop"
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
