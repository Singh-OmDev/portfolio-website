"use client";

import React from "react";
import SpotifyWidget from "./SpotifyWidget";
import GitHubWidget from "./GitHubWidget";
import IDEWidget from "./IDEWidget";
import { motion } from "framer-motion";

export default function LiveActivity() {
    return (
        <section className="w-full py-16 px-6 relative z-10 flex flex-col items-center border-t border-neutral-200/50 dark:border-neutral-800/50 bg-neutral-50/50 dark:bg-black/20">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-10 text-center"
            >
                <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-neutral-200/50 dark:bg-neutral-800/50 rounded-full text-neutral-600 dark:text-neutral-400 mb-3">
                    In Real Time
                </span>
                <h2 className="text-3xl font-serif font-medium text-neutral-900 dark:text-neutral-50">
                    Live Status
                </h2>
            </motion.div>

            <div className="flex flex-col md:flex-row flex-wrap justify-center items-center gap-6 w-full max-w-6xl mx-auto">
                {/* 
                    We use a flex layout that centers items.
                    On mobile, they stack vertically.
                    On desktop, they align horizontally.
                */}
                <IDEWidget />
                <GitHubWidget />
                <SpotifyWidget />
            </div>
        </section>
    );
}
