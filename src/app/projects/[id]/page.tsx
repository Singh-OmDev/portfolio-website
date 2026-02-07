"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { portfolioData } from "@/data/portfolio";
import { motion } from "framer-motion";
import { ArrowLeft, Github, Globe, Calendar, Users, Briefcase, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function ProjectDetail() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const project = portfolioData.projects.find((p) => p.id === id);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black text-neutral-900 dark:text-white">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
                    <Link href="/#projects" className="text-blue-600 hover:underline">
                        Back to Projects
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-white selection:bg-neutral-200 dark:selection:bg-neutral-800">
            <Navbar />

            {/* Added generous bottom padding to clear the floating navbar */}
            <article className="max-w-5xl mx-auto px-6 pt-32 pb-40">
                {/* Back Button */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </motion.button>

                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-12"
                >
                    <div className="flex flex-wrap gap-3 mb-6">
                        {project.status && (
                            <span className="px-3 py-1 text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-full border border-green-200 dark:border-green-800 uppercase tracking-wide">
                                {project.status}
                            </span>
                        )}
                        {project.tech.slice(0, 3).map((tech) => (
                            <span key={tech} className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200 dark:border-neutral-800">
                                {tech}
                            </span>
                        ))}
                        {project.tech.length > 3 && (
                            <span className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200 dark:border-neutral-800">
                                +{project.tech.length - 3} more
                            </span>
                        )}
                    </div>

                    <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight">
                        {project.title}
                    </h1>

                    <p className="text-xl md:text-2xl text-neutral-500 font-serif max-w-3xl leading-relaxed">
                        {project.description}
                    </p>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="relative aspect-video w-full rounded-3xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 mb-16 shadow-2xl"
                >
                    <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </motion.div>

                {/* Metadata Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800"
                >
                    <div>
                        <div className="flex items-center gap-2 text-neutral-500 mb-2 text-sm font-medium uppercase tracking-wider">
                            <Calendar size={16} /> Timeline
                        </div>
                        <div className="font-serif font-bold text-lg">{project.timeline || "N/A"}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-neutral-500 mb-2 text-sm font-medium uppercase tracking-wider">
                            <Briefcase size={16} /> Role
                        </div>
                        <div className="font-serif font-bold text-lg">{project.role || "Developer"}</div>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-neutral-500 mb-2 text-sm font-medium uppercase tracking-wider">
                            <Users size={16} /> Team
                        </div>
                        <div className="font-serif font-bold text-lg">{project.team || "Solo"}</div>
                    </div>
                    <div className="flex gap-4 items-center justify-start md:justify-end">
                        {project.link !== "#" && (
                            <a
                                href={project.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-bold font-serif hover:-translate-y-1 transition-transform shadow-lg hover:shadow-xl"
                            >
                                <Globe size={18} />
                                Demo
                            </a>
                        )}
                        {project.github !== "#" && (
                            <a
                                href={project.github}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-5 py-2.5 bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white rounded-xl font-bold font-serif hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <Github size={18} />
                                Code
                            </a>
                        )}
                    </div>
                </motion.div>

                {/* Content Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">

                    {/* Left Column: Main Content */}
                    <div className="lg:col-span-2 space-y-16">
                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-serif font-bold mb-6">Overview</h2>
                            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-line">
                                {project.overview || project.description}
                            </p>
                        </section>

                        {/* Key Features */}
                        {project.features && (
                            <section>
                                <h2 className="text-3xl font-serif font-bold mb-8">Key Features</h2>
                                <div className="grid grid-cols-1 gap-4">
                                    {project.features.map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            viewport={{ once: true }}
                                            className="flex gap-4 p-4 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors border border-transparent hover:border-neutral-200 dark:hover:border-neutral-800"
                                        >
                                            <div className="mt-1 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-full p-1 h-6 w-6 flex items-center justify-center shrink-0">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            <div className="text-lg text-neutral-700 dark:text-neutral-300">
                                                {/* Rudimentary markdown bold parsing */}
                                                <span dangerouslySetInnerHTML={{ __html: feature.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Challenges & Learnings */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {project.challenges && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-4">Challenges</h2>
                                    <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                        {/* Rudimentary markdown bold parsing */}
                                        <span dangerouslySetInnerHTML={{ __html: project.challenges.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white">$1</strong>') }} />
                                    </p>
                                </section>
                            )}

                            {project.learnings && (
                                <section>
                                    <h2 className="text-2xl font-serif font-bold mb-4">Learnings</h2>
                                    <ul className="space-y-3">
                                        {project.learnings.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-neutral-600 dark:text-neutral-400">
                                                <span className="text-neutral-400 mt-1.5">•</span>
                                                <span dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong class="text-neutral-900 dark:text-white">$1</strong>') }} />
                                            </li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                        </div>

                    </div>


                    {/* Right Column: Sidebar */}
                    <aside className="space-y-12">
                        {/* Tech Stack */}
                        <section>
                            <h3 className="text-xl font-serif font-bold mb-6">Tech Stack</h3>
                            <div className="flex flex-wrap gap-2">
                                {project.tech.map((tech) => (
                                    <span
                                        key={tech}
                                        className="px-3 py-1.5 text-sm font-medium bg-neutral-100 dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-800"
                                    >
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* Future Enhancements */}
                        {project.future && (
                            <section>
                                <h3 className="text-xl font-serif font-bold mb-6">Future Roadmap</h3>
                                <ul className="space-y-4">
                                    {project.future.map((item, i) => (
                                        <li key={i} className="flex gap-3 items-start p-3 bg-neutral-50 dark:bg-neutral-900/30 rounded-xl border border-neutral-100 dark:border-neutral-800/50">
                                            <div className="h-2 w-2 rounded-full bg-neutral-400 mt-2 shrink-0" />
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        )}
                    </aside>

                </div>

            </article>
        </main>
    );
}
