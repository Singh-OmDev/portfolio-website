"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TerminalSquare, Server, Database, ListOrdered, ShieldCheck, Activity, Network } from "lucide-react";
import RateLimiterDemo from "./RateLimiterDemo";
import LoadBalancerDemo from "./LoadBalancerDemo";
import CacheDemo from "./CacheDemo";
import MessageQueueDemo from "./MessageQueueDemo";
import JwtDemo from "./JwtDemo";
import CircuitBreakerDemo from "./CircuitBreakerDemo";
import WebSocketDemo from "./WebSocketDemo";

export default function Playground() {
    const [activeTab, setActiveTab] = useState<"rate" | "load" | "cache" | "queue" | "jwt" | "circuit" | "ws">("rate");

    const tabs = [
        { id: "rate", label: "Rate Limiter", icon: TerminalSquare, color: "text-green-500", bg: "bg-green-500/10" },
        { id: "load", label: "Load Balancer", icon: Server, color: "text-blue-500", bg: "bg-blue-500/10" },
        { id: "cache", label: "Distributed Cache", icon: Database, color: "text-red-500", bg: "bg-red-500/10" },
        { id: "queue", label: "Message Queue", icon: ListOrdered, color: "text-indigo-500", bg: "bg-indigo-500/10" },
        { id: "jwt", label: "JWT Auth", icon: ShieldCheck, color: "text-purple-500", bg: "bg-purple-500/10" },
        { id: "circuit", label: "Circuit Breaker", icon: Activity, color: "text-orange-500", bg: "bg-orange-500/10" },
        { id: "ws", label: "WebSockets", icon: Network, color: "text-cyan-500", bg: "bg-cyan-500/10" },
    ] as const;

    return (
        <section id="playground" className="py-12 flex justify-center w-full px-6 relative z-10 w-full overflow-hidden">
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
                        Explore core backend concepts visually. Switch between the tabs below to test different mechanisms like rate limiting, load balancing, caching, and more.
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
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 cursor-pointer ${isActive
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
                        {activeTab === "queue" && (
                            <motion.div
                                key="queue"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <MessageQueueDemo />
                            </motion.div>
                        )}
                        {activeTab === "jwt" && (
                            <motion.div
                                key="jwt"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <JwtDemo />
                            </motion.div>
                        )}
                        {activeTab === "circuit" && (
                            <motion.div
                                key="circuit"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CircuitBreakerDemo />
                            </motion.div>
                        )}
                        {activeTab === "ws" && (
                            <motion.div
                                key="ws"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <WebSocketDemo />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
