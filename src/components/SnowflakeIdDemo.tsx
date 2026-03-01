"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hash, Server, Clock, ServerCog, ArrowRight, Play, RotateCcw } from "lucide-react";

export default function SnowflakeIdDemo() {
    const [idData, setIdData] = useState<{
        timestampB: string;
        datacenterB: string;
        workerB: string;
        sequenceB: string;
        finalId: string;
    } | null>(null);

    const [isGenerating, setIsGenerating] = useState(false);

    // Config
    const customEpoch = 1609459200000; // Jan 1, 2021
    const [datacenterId, setDatacenterId] = useState(12); // Max 31
    const [workerId, setWorkerId] = useState(5); // Max 31
    const [sequence, setSequence] = useState(0);

    const generateId = async () => {
        if (isGenerating) return;
        setIsGenerating(true);
        setIdData(null);
        await new Promise(r => setTimeout(r, 100));

        const now = Date.now();
        const timestamp = now - customEpoch;

        // Next sequence
        const nextSeq = (sequence + 1) % 4096;
        setSequence(nextSeq);

        // Convert to binary strings with exact padding
        const tBin = timestamp.toString(2).padStart(41, '0');
        const dBin = datacenterId.toString(2).padStart(5, '0');
        const wBin = workerId.toString(2).padStart(5, '0');
        const sBin = nextSeq.toString(2).padStart(12, '0');

        // Simulate 64-bit construction (BigInt required in JS for real >53bit ints)
        // Sign bit (1) + Timestamp (41) + Datacenter (5) + Worker (5) + Sequence (12)
        const binaryString = `0${tBin}${dBin}${wBin}${sBin}`;
        const finalId = BigInt('0b' + binaryString).toString();

        // Animate chunks in order
        // 1. Time
        await new Promise(r => setTimeout(r, 600));
        setIdData(prev => ({ ...prev, timestampB: tBin } as any));

        // 2. Machine IDs
        await new Promise(r => setTimeout(r, 600));
        setIdData(prev => ({ ...prev, timestampB: tBin, datacenterB: dBin, workerB: wBin } as any));

        // 3. Sequence
        await new Promise(r => setTimeout(r, 600));
        setIdData({ timestampB: tBin, datacenterB: dBin, workerB: wBin, sequenceB: sBin, finalId });

        setIsGenerating(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Hash size={20} className="text-neutral-500" />
                        Snowflake ID Generation
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        In distributed systems (like Twitter/Discord), standard auto-incrementing database IO limits scalability. Snowflake generates unique, roughly-sortable 64-bit IDs independently across thousands of machines without communicating with a centralized database.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 font-mono text-[10px] space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 flex items-center gap-1"><Clock size={12} /> Epoch</span>
                            <span className="text-neutral-900 dark:text-neutral-300">Jan 1, 2021</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 flex items-center gap-1"><Server size={12} /> Datacenter ID</span>
                            <input type="number" value={datacenterId} onChange={e => setDatacenterId(Math.min(31, Math.max(0, parseInt(e.target.value) || 0)))} className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded px-2 w-16 text-right outline-none" />
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-neutral-500 flex items-center gap-1"><ServerCog size={12} /> Machine ID</span>
                            <input type="number" value={workerId} onChange={e => setWorkerId(Math.min(31, Math.max(0, parseInt(e.target.value) || 0)))} className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-700 rounded px-2 w-16 text-right outline-none" />
                        </div>
                    </div>
                </div>

                <button
                    onClick={generateId}
                    disabled={isGenerating}
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                >
                    {isGenerating ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />}
                    {isGenerating ? "Generating Bits..." : "Generate New Snowflake ID"}
                </button>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden font-mono min-h-[450px]">

                {/* 64-bit Breakdown Chart */}
                <div className="w-full max-w-2xl text-[10px] mb-8">
                    <div className="flex w-full mb-2">
                        <div className="w-[1.5%] text-center text-neutral-500">1</div>
                        <div className="w-[64%] text-center text-indigo-400">41 bits = Timestamp</div>
                        <div className="w-[7.8%] text-center text-emerald-400">5</div>
                        <div className="w-[7.8%] text-center text-blue-400">5</div>
                        <div className="w-[18.7%] text-center text-yellow-400">12 seq</div>
                    </div>

                    <div className="flex w-full h-8 rounded-lg overflow-hidden border border-neutral-800 bg-neutral-900 shadow-lg relative">
                        {/* Default empty bits */}
                        {!idData && !isGenerating && (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-600 tracking-[0.2em] font-bold opacity-30">
                                00000000000... (64 bits)
                            </div>
                        )}

                        {/* Sign Bit */}
                        <div className="w-[1.5%] bg-neutral-800 border-r border-neutral-900 flex items-center justify-center text-neutral-500 font-bold overflow-hidden">
                            {idData?.timestampB || isGenerating ? "0" : ""}
                        </div>

                        {/* Timestamp (41 bits) */}
                        <div className="w-[64%] bg-indigo-500/20 border-r border-indigo-900/50 flex items-center justify-center overflow-hidden">
                            <AnimatePresence>
                                {(idData?.timestampB) && (
                                    <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-indigo-300 tracking-wider">
                                        {idData.timestampB}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Datacenter (5 bits) */}
                        <div className="w-[7.8%] bg-emerald-500/20 border-r border-emerald-900/50 flex items-center justify-center overflow-hidden">
                            <AnimatePresence>
                                {(idData?.datacenterB) && (
                                    <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-emerald-300 tracking-widest">
                                        {idData.datacenterB}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Worker (5 bits) */}
                        <div className="w-[7.8%] bg-blue-500/20 border-r border-blue-900/50 flex items-center justify-center overflow-hidden">
                            <AnimatePresence>
                                {(idData?.workerB) && (
                                    <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-blue-300 tracking-widest">
                                        {idData.workerB}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Sequence (12 bits) */}
                        <div className="w-[18.7%] bg-yellow-500/20 flex items-center justify-center overflow-hidden relative">
                            <AnimatePresence>
                                {(idData?.sequenceB) && (
                                    <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-yellow-300 tracking-widest absolute">
                                        {idData.sequenceB}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Arrow */}
                <div className="text-neutral-700 mb-8"><ArrowRight className="rotate-90" /></div>

                {/* Final Result Container */}
                <div className={`p-8 rounded-2xl border-2 transition-all w-full max-w-xl text-center flex flex-col gap-4 ${idData?.finalId ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_40px_rgba(99,102,241,0.2)]' : 'border-neutral-800 bg-neutral-900'}`}>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500">Distributed 64-bit Long Int</span>
                    <AnimatePresence mode="wait">
                        {idData?.finalId ? (
                            <motion.span
                                key={idData.finalId}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl md:text-5xl font-bold text-white tracking-tight"
                            >
                                {idData.finalId}
                            </motion.span>
                        ) : (
                            <span className="text-3xl md:text-5xl font-bold text-neutral-800 tracking-wide select-none">
                                ???????????????????
                            </span>
                        )}
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
