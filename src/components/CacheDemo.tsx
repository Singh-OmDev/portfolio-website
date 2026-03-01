"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Database, Search, Clock, Zap, FileJson } from "lucide-react";

export default function CacheDemo() {
    const [status, setStatus] = useState<"idle" | "fetching_db" | "fetching_cache" | "done">("idle");
    const [lastFetchType, setLastFetchType] = useState<"db" | "cache" | null>(null);
    const [fetchTime, setFetchTime] = useState<number | null>(null);
    const [isCached, setIsCached] = useState(false);
    const [cacheTimer, setCacheTimer] = useState<NodeJS.Timeout | null>(null);

    const handleFetch = () => {
        if (status === "fetching_db" || status === "fetching_cache") return;

        if (isCached) {
            // Cache Hit (Instant)
            setStatus("fetching_cache");
            setTimeout(() => {
                setStatus("done");
                setLastFetchType("cache");
                setFetchTime(5); // 5ms simulated
            }, 50); // very fast visual ping
        } else {
            // Cache Miss (Slow)
            setStatus("fetching_db");
            setTimeout(() => {
                setStatus("done");
                setLastFetchType("db");
                setFetchTime(1250); // 1.25s simulated

                // Set data in cache for 10 seconds
                setIsCached(true);
                if (cacheTimer) clearTimeout(cacheTimer);
                const timer = setTimeout(() => {
                    setIsCached(false);
                }, 10000); // Cache expires after 10s
                setCacheTimer(timer);

            }, 1250);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Database size={20} className="text-neutral-500" />
                            Data Retrieval
                        </h3>
                    </div>

                    <div className="space-y-4 mb-8">
                        {/* Redis Node */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${status === "fetching_cache"
                            ? "bg-red-50 dark:bg-red-900/20 border-red-400 dark:border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : isCached
                                ? "bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800/50"
                                : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                            }`}>
                            <div className="flex items-center gap-3">
                                <Zap size={18} className={isCached ? "text-red-500" : "text-neutral-400"} />
                                <span className={`font-mono font-medium ${isCached ? "text-red-600 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                                    Redis Cache <span className="text-xs font-normal ml-1">({isCached ? "Hot" : "Empty"})</span>
                                </span>
                            </div>
                        </div>

                        {/* Postgres Node */}
                        <div className={`flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${status === "fetching_db"
                            ? "bg-blue-50 dark:bg-blue-900/20 border-blue-400 dark:border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]"
                            : "bg-neutral-50 dark:bg-neutral-800/50 border-neutral-200 dark:border-neutral-700"
                            }`}>
                            <div className="flex items-center gap-3">
                                <Database size={18} className={status === "fetching_db" ? "text-blue-500" : "text-neutral-400"} />
                                <span className={`font-mono font-medium ${status === "fetching_db" ? "text-blue-600 dark:text-blue-400" : "text-neutral-600 dark:text-neutral-400"}`}>
                                    PostgreSQL Primary
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <button
                    onClick={handleFetch}
                    disabled={status === "fetching_db" || status === "fetching_cache"}
                    className="w-full relative group overflow-hidden bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                >
                    {(status === "idle" || status === "done") && (
                        <>
                            <Search size={18} className="text-neutral-400 group-hover:text-current" />
                            <span className="relative z-10">Query User Data</span>
                        </>
                    )}
                    {status === "fetching_db" && (
                        <>
                            <Database size={18} className="animate-bounce" />
                            <span className="relative z-10">Querying Database...</span>
                        </>
                    )}
                    {status === "fetching_cache" && (
                        <>
                            <Zap size={18} className="animate-pulse text-red-500" />
                            <span className="relative z-10">Fetching from Cache...</span>
                        </>
                    )}
                </button>
            </div>

            {/* Results Display */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r opacity-50 ${lastFetchType === 'cache' ? 'from-transparent via-red-500/50 to-transparent' : 'from-transparent via-blue-500/50 to-transparent'
                    }`}></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">Response details</span>
                    {fetchTime !== null && (
                        <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded bg-neutral-800 ${lastFetchType === 'cache' ? 'text-red-400' : 'text-blue-400'}`}>
                            <Clock size={12} />
                            <span>{fetchTime}ms</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 flex flex-col items-center justify-center">
                    {status === "idle" && (
                        <p className="text-neutral-600 text-sm italic">Execute a query to see performance...</p>
                    )}

                    {(status === "fetching_db" || status === "fetching_cache") && (
                        <div className="flex flex-col items-center gap-4 text-neutral-500">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neutral-500"></div>
                            <p className="text-sm">Awaiting payload...</p>
                        </div>
                    )}

                    {status === "done" && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full h-full flex flex-col"
                        >
                            <div className={`mb-4 inline-flex items-center self-start gap-1 text-xs font-bold px-2 py-1 rounded ${lastFetchType === 'cache' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                }`}>
                                {lastFetchType === 'cache' ? '⚡ CACHE HIT' : '🐌 CACHE MISS (DB QUERY)'}
                            </div>
                            <div className="bg-neutral-950 rounded-xl p-4 flex-1 border border-neutral-800 text-green-400 text-xs overflow-hidden">
                                <div className="flex items-center gap-2 mb-2 text-neutral-500 pb-2 border-b border-neutral-800/50">
                                    <FileJson size={14} />
                                    <span>payload.json</span>
                                </div>
                                <pre className="whitespace-pre-wrap">
                                    {`{
  "user_id": "usr_9x8f72a",
  "name": "Bruce Wayne",
  "role": "admin",
  "permissions": [
    "read",
    "write",
    "deploy"
  ],
  "last_login": "${new Date().toISOString()}"
}`}
                                </pre>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
