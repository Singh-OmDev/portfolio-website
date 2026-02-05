"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function About() {
    const { profile } = portfolioData;

    return (
        <section id="about" className="py-32 flex justify-center">
            <div className="max-w-5xl w-full px-6 grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-neutral-50 mb-6">
                        About
                    </h2>
                </motion.div>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
                        {profile.bio}
                    </p>
                    <p className="text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        I believe in a web that is fast, accessible, and beautiful.
                        When I&apos;m not coding, I&apos;m likely exploring new design trends or contributing to open source.
                    </p>
                </motion.div>

            </div>
        </section>
    );
}
