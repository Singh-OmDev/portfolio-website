"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, Server, Database } from "lucide-react";
import RateLimiterDemo from "./RateLimiterDemo";
import LoadBalancerDemo from "./LoadBalancerDemo";
import CacheDemo from "./CacheDemo";

export default function Playground() {
    const [activeTab, setActiveTab] = useState<"rate" | "load" | "cache">("rate");

    const tabs = [
        { id: "rate", label: "Rate Limiter", icon: TerminalSquare, color: "text-green-500", bg: "bg-green-500/10" },
        { id: "load", label: "Load Balancer", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "cache", label: "Distributed Cache", icon: Database, color: "text-red-500", bg: "bg-red-500/10" },
    ] as const;

    return (
        <section id="playground" className="py-24 flex justify-center w-full px-6 relative z-10 w-full overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-200/10 dark:bg-blue-900/10 rounded-full blur-[120px] -z-10 pointer-events-none" />

            <div className="max-w-5xl w-full">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center"
                >
                    <span className="inline-block px-3 py-1 text-xs font-medium tracking-wider uppercase bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-600 dark:text-neutral-300 mb-4">
                        Backend Playground
                    </span>
                    <h2 className="text-4xl md:text-5xl font-serif font-medium mb-6 text-neutral-900 dark:text-neutral-50 tracking-tight">
                        Interactive Architecture
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto text-lg leading-relaxed">
                        Explore core backend concepts visually. Switch between the tabs below to test different mechanisms like rate limiting, load balancing, and caching.
                    </p>
                </motion.div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 ${isActive
                                        ? `bg-white dark:bg-neutral-800 shadow-md ${tab.color} border border-neutral-200 dark:border-neutral-700`
                                        : "bg-neutral-100 dark:bg-neutral-900/50 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 border border-transparent"
                                    }`}
                            >
                                <div className={`p-1.5 rounded-md ${isActive ? tab.bg : "bg-transparent"}`}>
                                    <Icon size={16} />
                                </div>
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* Demo Container */}
                <div className="relative min-h-[500px]">
                    <AnimatePresence mode="wait">
                        {activeTab === "rate" && (
                            <motion.div
                                key="rate"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <RateLimiterDemo />
                            </motion.div>
                        )}
                        {activeTab === "load" && (
                            <motion.div
                                key="load"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <LoadBalancerDemo />
                            </motion.div>
                        )}
                        {activeTab === "cache" && (
                            <motion.div
                                key="cache"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CacheDemo />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
