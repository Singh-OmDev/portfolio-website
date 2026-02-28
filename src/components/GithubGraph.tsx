"use client";

import React, { useState, useEffect } from "react";
import { GitHubCalendar } from "react-github-calendar";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";

export default function GithubGraph() {
    const [isDark, setIsDark] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Check initial theme
        if (typeof document !== "undefined") {
            setIsDark(document.documentElement.classList.contains("dark"));

            // Observe dark mode changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.attributeName === "class") {
                        setIsDark(document.documentElement.classList.contains("dark"));
                    }
                });
            });

            observer.observe(document.documentElement, {
                attributes: true,
            });

            return () => observer.disconnect();
        }
    }, []);

    if (!mounted) {
        return (
            <section className="py-10 max-w-4xl mx-auto px-5 w-full">
                <div className="h-[150px] w-full animate-pulse bg-neutral-100 dark:bg-neutral-900 rounded-2xl" />
            </section>
        );
    }

    const githubUrl = portfolioData.socials.github;
    const username = githubUrl.split("/").pop() || "Singh-OmDev";

    return (
        <section className="py-24 md:py-32 flex justify-center bg-white dark:bg-black overflow-hidden w-full">
            <div className="max-w-6xl w-full px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20 items-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="md:col-span-12 max-w-4xl mx-auto text-center w-full"
                >
                    <div className="flex items-center justify-center gap-4 mb-12">
                        <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                        <span className="text-sm font-medium tracking-widest uppercase text-neutral-900 dark:text-white">
                            GitHub Activity
                        </span>
                        <div className="h-px w-12 bg-neutral-900 dark:bg-white" />
                    </div>

                    <div className="flex justify-center w-full overflow-x-auto pb-4 scrollbar-hide">
                        <div className="min-w-max">
                            <GitHubCalendar
                                username={username}
                                colorScheme={isDark ? "dark" : "light"}
                                blockSize={12}
                                blockMargin={4}
                                fontSize={14}
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
