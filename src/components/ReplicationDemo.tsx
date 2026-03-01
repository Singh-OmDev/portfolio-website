"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, HardDrive, ArrowRight, ArrowDown, Activity, Check, Download, Upload } from "lucide-react";

export default function ReplicationDemo() {
    const [leaderData, setLeaderData] = useState<string[]>([]);
    const [followerData, setFollowerData] = useState<string[]>([]);
    const [isWriting, setIsWriting] = useState(false);
    const [isReading, setIsReading] = useState<number | null>(null); // Node ID being read
    const [syncing, setSyncing] = useState(false);

    const PING_DURATION = 600;

    const handleWrite = () => {
        if (isWriting || syncing) return;
        setIsWriting(true);

        // 1. Write hits Leader
        setTimeout(() => {
            const newRecord = `Rec_${Math.floor(Math.random() * 9000) + 1000}`;
            setLeaderData(prev => [newRecord, ...prev].slice(0, 5));
            setIsWriting(false);
            setSyncing(true);

            // 2. Leader asynchronously syncs to Followers
            setTimeout(() => {
                setFollowerData(prev => [newRecord, ...prev].slice(0, 5));
                setSyncing(false);
            }, PING_DURATION);

        }, PING_DURATION);
    };

    const handleRead = () => {
        if (isReading !== null) return;

        // Round robin randomly pick Follower 1 or 2
        const targetNode = Math.random() > 0.5 ? 1 : 2;
        setIsReading(targetNode);

        setTimeout(() => {
            setIsReading(null);
        }, PING_DURATION);
    };

    return (
        <div className="w-full bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm min-h-[500px] flex flex-col md:flex-row gap-8">

            {/* Control Panel */}
            <div className="w-full md:w-1/3 flex flex-col gap-6 justify-center">
                <div className="bg-neutral-50 dark:bg-neutral-950 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                        <Activity size={20} className="text-blue-500" />
                        Client App
                    </h3>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleWrite}
                            disabled={isWriting || syncing}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-xl font-medium flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <span className="flex items-center gap-2"><Upload size={18} /> INSERT Database</span>
                            {(isWriting || syncing) && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                        </button>

                        <button
                            onClick={handleRead}
                            disabled={isReading !== null}
                            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white p-3 rounded-xl font-medium flex items-center justify-between transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            <span className="flex items-center gap-2"><Download size={18} /> SELECT Records</span>
                            {isReading !== null && <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                        <p className="text-xs text-yellow-700 dark:text-yellow-400 font-medium">
                            {isWriting ? "Routing heavy WRITE query strictly to Leader..." :
                                syncing ? "Leader actively replicating log to Followers..." :
                                    isReading !== null ? `Load balancing fast READ to Follower Node ${isReading}...` :
                                        "Idle. Waiting for client requests."}
                        </p>
                    </div>
                </div>
            </div>

            {/* Architecture Visualizer */}
            <div className="w-full md:w-2/3 relative flex flex-col items-center justify-center py-10">

                {/* Leader Node */}
                <div className="relative mb-24">
                    <div className={`w-32 h-32 rounded-3xl flex flex-col items-center justify-center p-4 border-2 transition-colors z-10 relative bg-neutral-900
                        ${isWriting ? 'border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)]' : 'border-neutral-700 shadow-xl'}`}>
                        <Database size={32} className={isWriting ? 'text-blue-400' : 'text-neutral-500'} />
                        <span className="text-white font-bold mt-2">Leader DB</span>
                        <span className="text-[10px] text-neutral-400 font-mono">Accepts Writes</span>

                        <div className="absolute -top-3 -right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-[10px] text-white font-bold shadow-md">W</div>
                    </div>

                    {/* Leader Data Display */}
                    <div className="absolute top-1/2 left-full -translate-y-1/2 ml-6 text-xs font-mono w-24">
                        <AnimatePresence>
                            {leaderData.length > 0 && <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="text-green-400 font-bold mb-1">+ {leaderData[0]}</motion.div>}
                        </AnimatePresence>
                    </div>

                    {/* Sync Animation Beams */}
                    <AnimatePresence>
                        {syncing && (
                            <>
                                {/* Beam to Follower 1 (Left) */}
                                <motion.div
                                    initial={{ height: 0, opacity: 1 }}
                                    animate={{ height: 100, opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute top-full left-1/4 w-1 bg-gradient-to-b from-blue-500 to-cyan-400"
                                    style={{ transformOrigin: "top" }}
                                />
                                {/* Beam to Follower 2 (Right) */}
                                <motion.div
                                    initial={{ height: 0, opacity: 1 }}
                                    animate={{ height: 100, opacity: 0 }}
                                    transition={{ duration: 0.8 }}
                                    className="absolute top-full right-1/4 w-1 bg-gradient-to-b from-blue-500 to-cyan-400"
                                    style={{ transformOrigin: "top" }}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </div>

                {/* Follower Nodes Row */}
                <div className="flex gap-16 relative">
                    {/* Follower 1 */}
                    <div className="relative flex flex-col items-center">
                        <div className={`w-28 h-28 rounded-2xl flex flex-col items-center justify-center p-4 border-2 transition-colors z-10 bg-neutral-900 relative
                            ${isReading === 1 ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                                syncing ? 'border-blue-400' : 'border-neutral-800 shadow-md'}`}>
                            <HardDrive size={24} className={isReading === 1 ? 'text-cyan-400' : syncing ? 'text-blue-400' : 'text-neutral-500'} />
                            <span className="text-neutral-300 font-medium text-sm mt-2">Follower 1</span>
                            <div className="absolute -bottom-3 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">R</div>
                        </div>
                    </div>

                    {/* Follower 2 */}
                    <div className="relative flex flex-col items-center">
                        <div className={`w-28 h-28 rounded-2xl flex flex-col items-center justify-center p-4 border-2 transition-colors z-10 bg-neutral-900 relative
                            ${isReading === 2 ? 'border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.3)]' :
                                syncing ? 'border-blue-400' : 'border-neutral-800 shadow-md'}`}>
                            <HardDrive size={24} className={isReading === 2 ? 'text-cyan-400' : syncing ? 'text-blue-400' : 'text-neutral-500'} />
                            <span className="text-neutral-300 font-medium text-sm mt-2">Follower 2</span>
                            <div className="absolute -bottom-3 w-6 h-6 bg-cyan-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">R</div>
                        </div>
                    </div>
                </div>

                {/* Global Data Synced State */}
                <div className="absolute bottom-0 right-0 p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl">
                    <span className="text-xs text-neutral-500 font-mono uppercase tracking-wider block mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-1">Cluster Data State</span>
                    <div className="space-y-1 min-w-[120px]">
                        {followerData.length === 0 ? <span className="text-xs text-neutral-400 italic">No records</span> :
                            followerData.map((d, i) => (
                                <div key={i} className={`text-xs font-mono flex items-center justify-between ${i === 0 ? 'text-white font-bold' : 'text-neutral-500'}`}>
                                    <span>{d}</span>
                                    {i === 0 && <Check size={12} className="text-green-500" />}
                                </div>
                            ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
