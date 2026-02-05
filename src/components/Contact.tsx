"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function Contact() {
    const { socials } = portfolioData;

    return (
        <section id="contact" className="py-32 flex justify-center text-center">
            <div className="max-w-2xl w-full px-6">

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-6"
                >
                    <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300">
                        Contact
                    </span>
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-6xl font-serif font-medium mb-8 text-neutral-900 dark:text-neutral-50"
                >
                    Get in Touch
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-12"
                >
                    I&apos;m currently open to new opportunities. If you have a project in mind or just want to say hi, feel free to reach out.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <a
                        href={socials.email}
                        className="inline-block px-8 py-4 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium text-lg hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors shadow-lg hover:shadow-xl hover:-translate-y-1 transform duration-200"
                    >
                        Say Hello
                    </a>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-20 text-neutral-400 text-sm"
                >
                    &copy; {new Date().getFullYear()} Alex Dev. All rights reserved.
                </motion.div>

            </div>
        </section>
    );
}
