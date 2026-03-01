"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Users, Timer, Activity, CircleCheckBig, ServerCrash } from "lucide-react";

interface RequestObj {
    id: string;
    status: "waiting" | "processing" | "done" | "dropped";
    assignedConnection: number | null;
}

export default function ConnectionPoolDemo() {
    const POOL_SIZE = 5;
    const MAX_QUEUE = 15;

    const [requests, setRequests] = useState<RequestObj[]>([]);
    const [connections, setConnections] = useState<{ id: number; busy: boolean; reqId: string | null }[]>(
        Array.from({ length: POOL_SIZE }).map((_, i) => ({ id: i, busy: false, reqId: null }))
    );
    const [stats, setStats] = useState({ success: 0, dropped: 0 });

    const reqTicker = useRef<NodeJS.Timeout | null>(null);

    // Main pooling loop
    useEffect(() => {
        reqTicker.current = setInterval(() => {
            setRequests(prevReqs => {
                const waitingReqs = prevReqs.filter(r => r.status === "waiting");
                if (waitingReqs.length === 0) return prevReqs;

                let newReqs = [...prevReqs];
                let connectionsUpdated = false;

                setConnections(prevConns => {
                    let newConns = [...prevConns];
                    const freeConns = newConns.filter(c => !c.busy);

                    // If we have waiting requests and free connections, assign them!
                    if (freeConns.length > 0 && waitingReqs.length > 0) {
                        const pairsToMake = Math.min(freeConns.length, waitingReqs.length);

                        for (let i = 0; i < pairsToMake; i++) {
                            const connIndex = newConns.findIndex(c => c.id === freeConns[i].id);
                            const reqIndex = newReqs.findIndex(r => r.id === waitingReqs[i].id);

                            // Mark connection Busy
                            newConns[connIndex] = { ...newConns[connIndex], busy: true, reqId: newReqs[reqIndex].id };

                            // Mark Request Processing
                            newReqs[reqIndex] = { ...newReqs[reqIndex], status: "processing", assignedConnection: newConns[connIndex].id };
                            connectionsUpdated = true;

                            // Simulate DB Query taking 800ms
                            setTimeout(() => {
                                // 1. Free the connection
                                setConnections(curr => curr.map(c => c.id === freeConns[i].id ? { ...c, busy: false, reqId: null } : c));

                                // 2. Mark request as done
                                setRequests(curr => curr.map(r => r.id === waitingReqs[i].id ? { ...r, status: "done" } : r));
                                setStats(s => ({ ...s, success: s.success + 1 }));

                                // 3. Clean up done requests immediately to save UI state
                                setTimeout(() => {
                                    setRequests(curr => curr.filter(r => r.id !== waitingReqs[i].id));
                                }, 300);

                            }, 800);
                        }
                    }
                    return connectionsUpdated ? newConns : prevConns;
                });
                return newReqs;
            });
        }, 100); // Check queue every 100ms

        return () => clearInterval(reqTicker.current as NodeJS.Timeout);
    }, []);

    const spikeTraffic = () => {
        const newReqs: RequestObj[] = Array.from({ length: 15 }).map(() => ({
            id: crypto.randomUUID(),
            status: "waiting",
            assignedConnection: null
        }));

        setRequests(prev => {
            const currentQueue = prev.filter(r => r.status === "waiting").length;
            if (currentQueue + newReqs.length > MAX_QUEUE) {
                // Drop excess if queue is full
                const allowed = Math.max(0, MAX_QUEUE - currentQueue);
                const accepted = newReqs.slice(0, allowed);
                const droppedCount = newReqs.length - allowed;
                if (droppedCount > 0) {
                    setStats(s => ({ ...s, dropped: s.dropped + droppedCount }));
                }
                return [...prev, ...accepted];
            }
            return [...prev, ...newReqs];
        });
    };

    const clearStats = () => setStats({ success: 0, dropped: 0 });

    const waitingQueue = requests.filter(r => r.status === "waiting");
    const activeReqs = requests.filter(r => r.status === "processing");

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Users size={20} className="text-neutral-500" />
                            Client App
                        </h3>
                        <div className="px-3 py-1 bg-blue-500/20 text-blue-600 border border-blue-500/30 rounded-full text-xs font-bold tracking-wide">
                            Max Queue: {MAX_QUEUE}
                        </div>
                    </div>

                    <div className="flex gap-4 mb-8">
                        <button
                            onClick={spikeTraffic}
                            className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-xl font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                        >
                            <Activity size={18} />
                            Spike Traffic (15 reqs)
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col gap-1">
                            <span className="text-xs text-neutral-500 uppercase font-bold tracking-wider flex items-center gap-1"><CircleCheckBig size={12} className="text-green-500" /> Queries Run</span>
                            <span className="text-2xl font-mono text-neutral-900 dark:text-white">{stats.success}</span>
                        </div>
                        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-950/20 flex flex-col gap-1 relative overflow-hidden group">
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={clearStats} className="text-[10px] text-red-400 hover:text-red-500 underline cursor-pointer">reset</button>
                            </div>
                            <span className="text-xs text-red-600 dark:text-red-400 uppercase font-bold tracking-wider flex items-center gap-1"><ServerCrash size={12} /> Dropped</span>
                            <span className="text-2xl font-mono text-red-600 dark:text-red-400">{stats.dropped}</span>
                        </div>
                    </div>
                </div>

                {/* Queue Visualization */}
                <div className="mt-8 p-6 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900/50">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Pending Queue</span>
                        <span className={`text-xs font-mono px-2 py-0.5 rounded ${waitingQueue.length > MAX_QUEUE * 0.8 ? 'bg-red-500/20 text-red-500' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-500'}`}>
                            {waitingQueue.length} / {MAX_QUEUE}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5 min-h-[40px]">
                        <AnimatePresence>
                            {waitingQueue.length === 0 && (
                                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-neutral-400 italic my-auto">Queue empty...</motion.span>
                            )}
                            {waitingQueue.map((req) => (
                                <motion.div
                                    key={req.id}
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    className="w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"
                                    title="Waiting request"
                                />
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Database / Pool View */}
            <div className="bg-neutral-900 dark:bg-black p-8 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col h-[500px]">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-neutral-800">
                    <h3 className="text-lg font-medium text-neutral-100 flex items-center gap-2">
                        <Database size={20} className="text-neutral-500" />
                        Database Postgres
                    </h3>
                    <div className="text-xs text-neutral-500 font-mono">Max Connections: {POOL_SIZE}</div>
                </div>

                <div className="flex-1 flex flex-col justify-center gap-6">
                    {connections.map((conn) => (
                        <div key={conn.id} className="relative flex items-center gap-4">
                            {/* The Connection Pipe */}
                            <div className="flex-1 h-3 bg-neutral-800 rounded-full overflow-hidden relative">
                                {conn.busy && (
                                    <motion.div
                                        initial={{ x: "-100%" }}
                                        animate={{ x: "0%" }}
                                        transition={{ duration: 0.8, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400"
                                    />
                                )}
                            </div>

                            {/* The Connection Socket/Process */}
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-colors duration-300 shadow-lg relative
                                ${conn.busy
                                    ? 'bg-blue-500/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                                    : 'bg-neutral-800 border-neutral-700 text-neutral-600'
                                }`}
                            >
                                <Timer size={24} className={conn.busy ? "animate-pulse" : ""} />

                                {/* Status Indicator */}
                                <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-black
                                    ${conn.busy ? 'bg-amber-500' : 'bg-green-500'}
                                `} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
