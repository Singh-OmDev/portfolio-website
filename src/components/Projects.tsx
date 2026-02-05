"use client";

import React from "react";
import { motion } from "framer-motion";
import { portfolioData } from "@/data/portfolio";
import Image from "next/image";
import { Github, Globe } from "lucide-react";

export default function Projects() {
    const { projects } = portfolioData;

    return (
        <section id="projects" className="py-20 flex justify-center bg-white dark:bg-black">
            <div className="max-w-6xl w-full px-6">

                {/* Header */}
                <div className="mb-20 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block mb-4"
                    >
                        <span className="px-4 py-1.5 bg-white text-black text-sm font-medium rounded-full">
                            My Projects
                        </span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-serif font-bold text-neutral-900 dark:text-white mb-6"
                    >
                        Check out my latest work
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-neutral-400 font-serif max-w-2xl mx-auto"
                    >
                        I&apos;ve worked on a variety of projects, from simple websites to complex applications. Here are a few of my favorites.
                    </motion.p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {projects.map((project, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group flex flex-col bg-neutral-100 dark:bg-neutral-900/50 rounded-2xl p-0 overflow-hidden"
                        >
                            {/* Image Card */}
                            <div className="relative aspect-video w-full bg-neutral-800 overflow-hidden">
                                <Image
                                    src={project.image}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                                />
                            </div>

                            {/* Text Content */}
                            <div className="p-6">
                                <h3 className="text-2xl font-serif font-bold text-neutral-900 dark:text-white mb-2">
                                    {project.title}
                                </h3>
                                <p className="text-neutral-400 font-serif mb-4 min-h-[3rem]">
                                    {project.description}
                                </p>

                                {/* Tech Pills */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.tech.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1 text-xs font-bold bg-white text-black dark:bg-neutral-800 dark:text-white rounded-md font-serif border border-neutral-200 dark:border-neutral-700"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                {/* Buttons */}
                                <div className="flex gap-3 mt-auto">
                                    <a
                                        href={project.github}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold font-serif hover:bg-neutral-200 transition-colors"
                                    >
                                        <Github size={16} />
                                        Source
                                    </a>
                                    <a
                                        href={project.link}
                                        className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold font-serif hover:bg-neutral-200 transition-colors"
                                    >
                                        <Globe size={16} />
                                        Demo
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}
