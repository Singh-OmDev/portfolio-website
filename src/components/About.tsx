"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function About() {
    const { profile } = portfolioData;

    return (
        <section id="about" className="py-24 md:py-32 flex justify-center bg-white dark:bg-black overflow-hidden">
            <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">

                {/* Content Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="md:col-span-12 max-w-3xl mx-auto text-center"
                >
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                        <span className="text-sm font-medium tracking-widest uppercase text-neutral-900 dark:text-white">
                            About Me
                        </span>
                        <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                    </div>

                    <h2 className="text-3xl md:text-5xl font-serif font-bold text-neutral-900 dark:text-white mb-8 leading-tight">
                        Architecting Scalable & Reliable Systems
                    </h2>

                    <div className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-6 text-left md:text-center">
                        {profile.bio.split('\n').filter(Boolean).map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </div>
                </motion.div>

            </div>
        </section>
    );
}
