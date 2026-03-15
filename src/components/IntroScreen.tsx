"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const greetings = [
  { text: "Hello",       lang: "English"  },
  { text: "Hola",        lang: "Spanish"  },
  { text: "Bonjour",     lang: "French"   },
  { text: "こんにちは",   lang: "Japanese" },
  { text: "नमस्ते",       lang: "Hindi"    },
  { text: "你好",         lang: "Chinese"  },
  { text: "مرحبا",       lang: "Arabic"   },
  { text: "Hello",       lang: "English"  },
];

const INTERVAL_MS = 300;   // time each greeting is shown
const EXIT_DURATION = 1.0; // final fade-out duration

export default function IntroScreen() {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (index < greetings.length - 1) {
      const timer = setTimeout(() => setIndex((i) => i + 1), INTERVAL_MS);
      return () => clearTimeout(timer);
    } else {
      // Last greeting shown — mark done, then fade out overlay
      const exitTimer = setTimeout(() => {
        setDone(true);
        setTimeout(() => {
          setVisible(false);
        }, EXIT_DURATION * 1000 + 200);
      }, INTERVAL_MS * 2);
      return () => clearTimeout(exitTimer);
    }
  }, [index]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="intro-bg"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION, ease: "easeInOut" }}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              className="text-white select-none"
              style={{
                fontFamily: "var(--font-serif), Georgia, serif",
                fontSize: "clamp(2rem, 6vw, 5rem)",
                fontStyle: "italic",
                fontWeight: 400,
                letterSpacing: "0.02em",
              }}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {greetings[index].text}
            </motion.p>
          </AnimatePresence>
        </motion.div>
      )}

      {done && (
        <motion.div
          key="intro-exit"
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: EXIT_DURATION, ease: "easeInOut" }}
        />
      )}
    </AnimatePresence>
  );
}
