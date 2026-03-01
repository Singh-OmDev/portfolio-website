"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, ArrowRight, Zap } from "lucide-react";

interface RequestLog {
    id: string;
    node: "A" | "B" | "C";
    timestamp: Date;
}

export default function LoadBalancerDemo() {
    const [requestLog, setRequestLog] = useState<RequestLog[]>([]);
    const [activeNode, setActiveNode] = useState<"A" | "B" | "C" | null>(null);
    const [isHovering, setIsHovering] = useState(false);

    // Round Robin Logic
    const nodes: ("A" | "B" | "C")[] = ["A", "B", "C"];
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleRequest = () => {
        const timestamp = new Date();
        const id = crypto.randomUUID();
        const assignedNode = nodes[currentIndex];

        // Animate the active node
        setActiveNode(assignedNode);
        setTimeout(() => setActiveNode(null), 300);

        // Update Log
        setRequestLog((prev) => [{ id, node: assignedNode, timestamp }, ...prev].slice(0, 10));

        // Advance Round Robin Index
        setCurrentIndex((prev) => (prev + 1) % nodes.length);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel & Visualization */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Server size={20} className="text-neutral-500" />
                            Load Balancer
                        </h3>
                        <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">Round Robin</span>
                    </div>

                    {/* Nodes Visualization */}
                    <div className="flex flex-col gap-4 mb-8">
                        {nodes.map((node) => (
                            <div
                                key={node}
                                className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${activeNode === node
                                    ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                                    : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <Server size={18} className={activeNode === node ? "text-blue-500" : "text-neutral-400"} />
                                    <span className={`font-mono font-medium ${activeNode === node ? "text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                                        Node {node}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`h-2 w-2 rounded-full ${activeNode === node ? "bg-blue-500 animate-pulse" : "bg-neutral-300 dark:bg-neutral-600"}`}></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleRequest}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={isHovering ? { transform: "translateY(-2px)" } : {}}
                    className="w-full relative group overflow-hidden bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                >
                    <Zap size={18} className={`${isHovering ? "text-blue-400 dark:text-blue-500" : ""}`} />
                    <span className="relative z-10">Send Traffic</span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Terminal / Log */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50"></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">lb-proxy.log</span>
                    <span className="text-neutral-500 text-xs">upstream routing</span>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto pr-2 space-y-3 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        <AnimatePresence initial={false}>
                            {requestLog.length === 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-neutral-600 text-sm italic"
                                >
                                    Waiting for incoming traffic...
                                </motion.p>
                            )}

                            {requestLog.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm flex items-start gap-3"
                                >
                                    <span className="text-neutral-500 shrink-0">
                                        {log.timestamp.toLocaleTimeString([], { hour12: false, second: '2-digit', fractionalSecondDigits: 3 })}
                                    </span>

                                    <div className="flex items-center gap-2 text-neutral-300">
                                        <span>Req routed</span>
                                        <ArrowRight size={12} className="text-neutral-600" />
                                        <span className="text-blue-400 font-bold">Node {log.node}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
