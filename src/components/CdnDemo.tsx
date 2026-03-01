"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, User, Image as ImageIcon, Zap, Clock, Database, ArrowRight } from "lucide-react";

type Region = "eu" | "us";
type CacheState = "empty" | "cached";

export default function CdnDemo() {
    const [euCache, setEuCache] = useState<CacheState>("empty");
    const [usCache, setUsCache] = useState<CacheState>("empty");
    const [activeUser, setActiveUser] = useState<Region | null>(null);
    const [activePath, setActivePath] = useState<"client-to-edge" | "edge-to-origin" | "origin-to-edge" | "edge-to-client" | null>(null);
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" }[]>([]);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 5));
    };

    const requestImage = async (region: Region) => {
        if (activeUser !== null) return;

        setActiveUser(region);
        setLogs([]);
        addLog(`User (${region.toUpperCase()}): Requested hero-image.png`, "info");

        // 1. Client to Edge
        setActivePath("client-to-edge");
        await new Promise(r => setTimeout(r, 600));

        const isCached = region === "eu" ? euCache === "cached" : usCache === "cached";

        if (isCached) {
            // CACHE HIT
            addLog(`${region.toUpperCase()} Edge: Cache HIT! Serving instantly from memory.`, "success");
            setActivePath("edge-to-client");
            await new Promise(r => setTimeout(r, 400));
            addLog(`User (${region.toUpperCase()}): Downloaded in 12ms.`, "success");
        } else {
            // CACHE MISS
            addLog(`${region.toUpperCase()} Edge: Cache MISS. Fetching from Origin (US-East).`, "warn");
            setActivePath("edge-to-origin");
            await new Promise(r => setTimeout(r, 2000)); // Simulate slow cross-globe trip

            addLog("Origin Server: Serving hero-image.png...", "info");
            setActivePath("origin-to-edge");
            await new Promise(r => setTimeout(r, 2000));

            // Save to Cache
            if (region === "eu") setEuCache("cached");
            if (region === "us") setUsCache("cached");
            addLog(`${region.toUpperCase()} Edge: Cached locally for future requests.`, "info");

            setActivePath("edge-to-client");
            await new Promise(r => setTimeout(r, 600));
            addLog(`User (${region.toUpperCase()}): Downloaded in 850ms.`, "warn");
        }

        setActivePath(null);
        setActiveUser(null);
    };

    const clearCaches = () => {
        setEuCache("empty");
        setUsCache("empty");
        addLog("Admin: Cleared all edge caches (Purge).", "error");
    };

    const isRunning = activeUser !== null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Globe size={20} className="text-neutral-500" />
                        CDN (Edge Caching)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A Content Delivery Network (CDN) copies static assets (images, videos, JS files) directly to servers geographically closest to the user (Edge Nodes). This prevents overseas users from suffering massive cross-ocean latency on every request.
                    </p>

                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Simulate Heavy Asset Request</h4>
                    <div className="flex flex-col gap-3 mb-8">
                        <button
                            onClick={() => requestImage("eu")}
                            disabled={isRunning}
                            className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-400 py-3 px-4 rounded-xl flex items-center justify-between hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <span className="flex items-center gap-2 font-bold text-sm"><User size={16} /> User in Europe (EU)</span>
                            <ImageIcon size={16} />
                        </button>

                        <button
                            onClick={() => requestImage("us")}
                            disabled={isRunning}
                            className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400 py-3 px-4 rounded-xl flex items-center justify-between hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-all disabled:opacity-40 cursor-pointer"
                        >
                            <span className="flex items-center gap-2 font-bold text-sm"><User size={16} /> User in America (US)</span>
                            <ImageIcon size={16} />
                        </button>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button onClick={clearCaches} disabled={isRunning} className="w-full text-xs text-red-500 border border-red-500/20 py-2 rounded-lg hover:bg-red-500/10 transition-colors cursor-pointer">
                        Purge All Edges
                    </button>
                </div>
            </div>

            {/* Visualization */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex items-center justify-between relative py-6 px-4 md:px-12 z-10 w-full">

                    {/* Users Column */}
                    <div className="flex flex-col justify-between h-full gap-16 relative z-20">
                        {/* EU User */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${activeUser === 'eu' ? 'bg-blue-900 border-blue-500 text-blue-300 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'bg-neutral-800 border-neutral-700 text-neutral-500'}`}>
                                <User size={20} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-blue-400 tracking-widest hidden md:block">EU Client</span>
                        </div>

                        {/* US User */}
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-colors ${activeUser === 'us' ? 'bg-emerald-900 border-emerald-500 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : 'bg-neutral-800 border-neutral-700 text-neutral-500'}`}>
                                <User size={20} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-widest hidden md:block">US Client</span>
                        </div>
                    </div>

                    {/* Edge Nodes Column */}
                    <div className="flex flex-col justify-between h-full gap-16 relative z-20 mx-4 md:mx-0">
                        {/* EU Edge */}
                        <div className={`w-28 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeUser === 'eu' && ["client-to-edge", "edge-to-client"].includes(activePath || "") ? 'border-blue-400 shadow-[0_0_20px_rgba(59,130,246,0.2)]' : 'border-neutral-700'} bg-neutral-900 relative`}>
                            <Server size={18} className={euCache === 'cached' ? "text-blue-400" : "text-neutral-500"} />
                            <span className="text-[9px] uppercase font-bold text-neutral-300">EU Edge</span>
                            {euCache === 'cached' ? (
                                <span className="text-[8px] bg-blue-500/20 text-blue-400 px-1.5 rounded animate-pulse absolute -bottom-2 border border-blue-500/30">Cached</span>
                            ) : (
                                <span className="text-[8px] bg-neutral-800 text-neutral-500 px-1.5 rounded absolute -bottom-2">Empty</span>
                            )}
                        </div>

                        {/* US Edge */}
                        <div className={`w-28 h-20 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${activeUser === 'us' && ["client-to-edge", "edge-to-client"].includes(activePath || "") ? 'border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'border-neutral-700'} bg-neutral-900 relative`}>
                            <Server size={18} className={usCache === 'cached' ? "text-emerald-400" : "text-neutral-500"} />
                            <span className="text-[9px] uppercase font-bold text-neutral-300">US Edge</span>
                            {usCache === 'cached' ? (
                                <span className="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 rounded animate-pulse absolute -bottom-2 border border-emerald-500/30">Cached</span>
                            ) : (
                                <span className="text-[8px] bg-neutral-800 text-neutral-500 px-1.5 rounded absolute -bottom-2">Empty</span>
                            )}
                        </div>
                    </div>

                    {/* Origin Data Center */}
                    <div className="relative z-20 flex items-center justify-center">
                        <div className={`w-32 h-32 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all bg-neutral-950 ${activePath === 'edge-to-origin' || activePath === 'origin-to-edge' ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.2)]' : 'border-neutral-800'}`}>
                            <Database size={24} className={activePath === 'origin-to-edge' ? 'text-indigo-400 animate-pulse' : 'text-neutral-600'} />
                            <span className="text-xs font-bold text-neutral-300 uppercase tracking-widest text-center">Origin Server</span>
                            <span className="text-[9px] text-neutral-500">(US-East-1)</span>
                            <div className="absolute top-2 right-2 flex items-center gap-1 text-[8px] text-yellow-500 opacity-60">
                                <Clock size={10} /> <i>Slow</i>
                            </div>
                        </div>
                    </div>

                    {/* Animations Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <AnimatePresence>
                            {/* EU Animations */}
                            {activeUser === 'eu' && activePath === 'client-to-edge' && (
                                <motion.div initial={{ left: "15%", top: "25%", opacity: 0 }} animate={{ left: "35%", opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute w-3 h-3 bg-blue-400 shadow-[0_0_10px_#60a5fa] rounded-full" />
                            )}
                            {activeUser === 'eu' && activePath === 'edge-to-client' && (
                                <motion.div initial={{ left: "35%", top: "25%", opacity: 0 }} animate={{ left: "15%", opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute w-3 h-3 bg-green-400 shadow-[0_0_10px_#4ade80] rounded-full flex items-center justify-center"><ImageIcon size={6} className="text-black" /></motion.div>
                            )}
                            {activeUser === 'eu' && activePath === 'edge-to-origin' && (
                                <motion.div initial={{ left: "45%", top: "25%", opacity: 0, y: 0 }} animate={{ left: "75%", opacity: 1, y: 70 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} className="absolute w-2 h-2 border border-blue-500 bg-black rounded-full shadow-[0_0_10px_#3b82f6]" />
                            )}
                            {activeUser === 'eu' && activePath === 'origin-to-edge' && (
                                <motion.div initial={{ left: "75%", top: "45%", opacity: 0, y: 0 }} animate={{ left: "45%", opacity: 1, y: -70 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} className="absolute w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] flex items-center justify-center"><ImageIcon size={6} className="text-white" /></motion.div>
                            )}

                            {/* US Animations */}
                            {activeUser === 'us' && activePath === 'client-to-edge' && (
                                <motion.div initial={{ left: "15%", bottom: "25%", opacity: 0 }} animate={{ left: "35%", opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute w-3 h-3 bg-emerald-400 shadow-[0_0_10px_#34d399] rounded-full" />
                            )}
                            {activeUser === 'us' && activePath === 'edge-to-client' && (
                                <motion.div initial={{ left: "35%", bottom: "25%", opacity: 0 }} animate={{ left: "15%", opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute w-3 h-3 bg-green-400 shadow-[0_0_10px_#4ade80] rounded-full flex items-center justify-center"><ImageIcon size={6} className="text-black" /></motion.div>
                            )}
                            {activeUser === 'us' && activePath === 'edge-to-origin' && (
                                <motion.div initial={{ left: "45%", bottom: "25%", opacity: 0, y: 0 }} animate={{ left: "75%", opacity: 1, y: -70 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} className="absolute w-2 h-2 border border-emerald-500 bg-black rounded-full shadow-[0_0_10px_#10b981]" />
                            )}
                            {activeUser === 'us' && activePath === 'origin-to-edge' && (
                                <motion.div initial={{ left: "75%", bottom: "45%", opacity: 0, y: 0 }} animate={{ left: "45%", opacity: 1, y: 70 }} exit={{ opacity: 0 }} transition={{ duration: 1.8 }} className="absolute w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981] flex items-center justify-center"><ImageIcon size={6} className="text-white" /></motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Logs */}
                <div className="h-28 bg-black border-t border-neutral-800 p-4 font-mono text-[11px] overflow-y-auto z-30 shrink-0">
                    <AnimatePresence>
                        {logs.length === 0 && <span className="text-neutral-600">Waiting for global traffic...</span>}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`mb-1 flex gap-2 ${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'warn' ? 'text-yellow-400' :
                                                'text-neutral-300'
                                    }`}
                            >
                                <ArrowRight size={10} className="mt-1 opacity-50 shrink-0" />
                                <span>{log.msg}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
