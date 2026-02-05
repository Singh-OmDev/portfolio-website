"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function Skills() {
    const { skills } = portfolioData;

    return (
        <section className="py-20 flex justify-center bg-white dark:bg-black">
            <div className="max-w-5xl w-full px-6 text-left">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-8"
                >
                    <h2 className="text-3xl font-serif font-bold text-neutral-900 dark:text-white">
                        Skills
                    </h2>
                </motion.div>

                <div className="flex flex-wrap gap-3">
                    {skills.map((skill, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <div className="px-5 py-2 bg-neutral-100 dark:bg-white border border-neutral-200 dark:border-white rounded-lg text-base font-serif font-bold text-neutral-900 shadow-sm hover:scale-105 transition-all duration-300 cursor-default">
                                {skill}
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
