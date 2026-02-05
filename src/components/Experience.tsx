"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import Image from "next/image";

export default function Experience() {
    const { experience } = portfolioData;

    return (
        <section id="experience" className="py-20 flex justify-center">
            <div className="max-w-3xl w-full px-6">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-16 text-center"
                >
                    <h2 className="text-3xl md:text-4xl font-serif font-medium text-neutral-900 dark:text-neutral-50">
                        Work Experience
                    </h2>
                </motion.div>

                <div className="space-y-12">
                    {experience.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            <div className="flex flex-col md:flex-row gap-6 md:items-start">
                                {/* Logo */}
                                <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white">
                                    <Image src={item.logo} alt={item.company} fill className="object-cover" />
                                </div>

                                {/* Content */}
                                <div className="flex-grow">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-baseline mb-2">
                                        <h3 className="text-xl font-medium text-neutral-900 dark:text-neutral-50">
                                            {item.company}
                                        </h3>
                                        <span className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
                                            {item.period}
                                        </span>
                                    </div>

                                    <div className="text-base text-neutral-600 dark:text-neutral-300 font-medium mb-2">
                                        {item.role}
                                    </div>

                                    <p className="text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            </div>

                            {/* Divider */}
                            {index !== experience.length - 1 && (
                                <div className="mt-12 h-px w-full bg-neutral-100 dark:bg-neutral-800" />
                            )}
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
