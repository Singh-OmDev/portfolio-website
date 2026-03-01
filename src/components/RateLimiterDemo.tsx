"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Zap, ShieldAlert, CheckCircle2 } from "lucide-react";

interface RequestLog {
    id: string;
    timestamp: Date;
    status: 200 | 429;
}

export default function RateLimiterDemo() {
    const BUCKET_CAPACITY = 5;
    const REFILL_RATE_MS = 1500; // 1 token every 1.5 seconds

    const [tokens, setTokens] = useState(BUCKET_CAPACITY);
    const [requestLog, setRequestLog] = useState<RequestLog[]>([]);
    const [isHovering, setIsHovering] = useState(false);

    // Refill logic
    useEffect(() => {
        const interval = setInterval(() => {
            setTokens((prev) => Math.min(prev + 1, BUCKET_CAPACITY));
        }, REFILL_RATE_MS);

        return () => clearInterval(interval);
    }, []);

    const handleRequest = () => {
        const timestamp = new Date();
        const id = crypto.randomUUID();

        if (tokens > 0) {
            setTokens((prev) => prev - 1);
            setRequestLog((prev) => [{ id, timestamp, status: 200 as const }, ...prev].slice(0, 15));
        } else {
            setRequestLog((prev) => [{ id, timestamp, status: 429 as const }, ...prev].slice(0, 15));
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Server size={20} className="text-neutral-500" />
                            Server Status
                        </h3>
                        <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm font-medium text-neutral-500">Online</span>
                        </div>
                    </div>

                    {/* Token Visualization */}
                    <div className="mb-8">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 flex justify-between">
                            <span>Available Tokens</span>
                            <span>{tokens} / {BUCKET_CAPACITY}</span>
                        </p>
                        <div className="flex gap-2">
                            {Array.from({ length: BUCKET_CAPACITY }).map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-4 flex-1 rounded-sm transition-all duration-300 ${i < tokens
                                        ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]"
                                        : "bg-neutral-200 dark:bg-neutral-800"
                                        }`}
                                />
                            ))}
                        </div>
                        <p className="text-xs text-neutral-400 mt-3 text-center">Refills 1 token every 1.5s</p>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleRequest}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    style={isHovering && tokens > 0 ? { transform: "translateY(-2px)" } : {}}
                    className="w-full relative group overflow-hidden bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer"
                >
                    <Zap size={18} className={`${isHovering && tokens > 0 ? "animate-pulse text-yellow-500 dark:text-yellow-600" : ""}`} />
                    <span className="relative z-10">Send API Request</span>
                    {/* Hover effect */}
                    <div className="absolute inset-0 bg-black/10 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
            </div>

            {/* Terminal / Log */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50"></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">server.log</span>
                    <span className="text-neutral-500 text-xs">/api/v1/hire-me</span>
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
                                    Waiting for incoming requests...
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

                                    {log.status === 200 ? (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <CheckCircle2 size={14} />
                                            <span>200 OK - Processed</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-red-400">
                                            <ShieldAlert size={14} />
                                            <span>429 ERR - Rate Limited</span>
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
