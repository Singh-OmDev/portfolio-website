"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Search, PlusCircle, CheckCircle2, XCircle, HelpCircle } from "lucide-react";

const BIT_ARRAY_SIZE = 16; // Visual size

export default function BloomFilterDemo() {
    // 0 = empty, 1 = filled
    const [bitArray, setBitArray] = useState<number[]>(Array(BIT_ARRAY_SIZE).fill(0));
    const [username, setUsername] = useState("");

    const [activeHashes, setActiveHashes] = useState<number[]>([]);
    const [result, setResult] = useState<"none" | "probably" | "definitely_not">("none");
    const [isAnimating, setIsAnimating] = useState(false);

    // Two simple mock hash functions that return an index between 0 and BIT_ARRAY_SIZE - 1
    const hash1 = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
        return Math.abs(hash) % BIT_ARRAY_SIZE;
    };

    const hash2 = (str: string) => {
        let hash = 5381;
        for (let i = 0; i < str.length; i++) hash = (hash * 33) ^ str.charCodeAt(i);
        return Math.abs(hash) % BIT_ARRAY_SIZE;
    };

    const handleCheck = async () => {
        if (!username.trim() || isAnimating) return;
        setIsAnimating(true);
        setResult("none");
        setActiveHashes([]);

        const h1 = hash1(username.toLowerCase());
        const h2 = hash2(username.toLowerCase());

        // Animate H1
        setActiveHashes([h1]);
        await new Promise(r => setTimeout(r, 600));

        // Animate H2
        setActiveHashes([h1, h2]);
        await new Promise(r => setTimeout(r, 600));

        // Evaluate
        if (bitArray[h1] === 1 && bitArray[h2] === 1) {
            setResult("probably");
        } else {
            setResult("definitely_not");
        }

        setIsAnimating(false);
    };

    const handleAdd = async () => {
        if (!username.trim() || isAnimating) return;
        setIsAnimating(true);
        setResult("none");
        setActiveHashes([]);

        const h1 = hash1(username.toLowerCase());
        const h2 = hash2(username.toLowerCase());

        // Animate H1
        setActiveHashes([h1]);
        await new Promise(r => setTimeout(r, 600));

        // Animate H2
        setActiveHashes([h1, h2]);
        await new Promise(r => setTimeout(r, 600));

        // Set Bits
        setBitArray(prev => {
            const next = [...prev];
            next[h1] = 1;
            next[h2] = 1;
            return next;
        });

        // Reset
        setActiveHashes([]);
        setUsername("");
        setIsAnimating(false);
    };

    const handleReset = () => {
        setBitArray(Array(BIT_ARRAY_SIZE).fill(0));
        setResult("none");
        setActiveHashes([]);
        setUsername("");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-5 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Filter size={20} className="text-neutral-500" />
                        Bloom Filter
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A memory-efficient probabilistic data structure used to test if an element is a member of a set. It can definitively tell you "No", but can only say "Probably Yes" (false positives are possible, false negatives are not).
                    </p>

                    <div className="mb-6 relative">
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value.replace(/\s/g, ''));
                                setResult("none");
                                setActiveHashes([]);
                            }}
                            placeholder="Enter username (e.g., 'alex_123')"
                            className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-4 pl-4 pr-4 outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow dark:text-white font-mono text-sm"
                            disabled={isAnimating}
                        />
                    </div>

                    <div className="flex gap-3 mb-6">
                        <button
                            onClick={handleCheck}
                            disabled={isAnimating || !username}
                            className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                        >
                            <Search size={16} /> Check if Exists
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isAnimating || !username}
                            className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                        >
                            <PlusCircle size={16} /> Add to Set
                        </button>
                    </div>

                    {/* Result Display */}
                    <AnimatePresence mode="wait">
                        {result !== "none" && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className={`p-4 rounded-xl border flex gap-3 ${result === 'probably' ? 'bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-900/50 text-amber-800 dark:text-amber-400' :
                                        'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-900/50 text-green-800 dark:text-green-400'
                                    }`}
                            >
                                {result === 'probably' ? <HelpCircle size={20} className="shrink-0 mt-0.5" /> : <CheckCircle2 size={20} className="shrink-0 mt-0.5" />}
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm uppercase">
                                        {result === 'probably' ? 'Probably Exists' : 'Definitely Available'}
                                    </span>
                                    <span className="text-xs opacity-80 mt-1">
                                        {result === 'probably'
                                            ? 'All hash bits are 1. It might exist, or it might be a collision. (Query DB to confirm)'
                                            : 'At least one hash bit is 0. It is mathematically impossible for this to exist in the DB!'}
                                    </span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button onClick={handleReset} disabled={isAnimating} className="text-xs text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors mt-4 self-start cursor-pointer">
                    Clear Bit Array
                </button>
            </div>

            {/* Visualizer Panel */}
            <div className="md:col-span-7 bg-neutral-900 dark:bg-black p-6 md:p-8 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col justify-center relative overflow-hidden font-mono min-h-[400px]">

                {/* Hash Functions visualized */}
                <div className="flex justify-center gap-8 mb-12">
                    <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeHashes.length >= 1 ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}>
                        <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500 flex flex-col items-center justify-center text-indigo-400 relative z-10 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
                            <span className="text-[10px] uppercase font-bold tracking-widest mb-1">Hash 1</span>
                            <span className="text-lg font-bold">{activeHashes.length >= 1 ? activeHashes[0] : '?'}</span>
                        </div>
                    </div>

                    <div className={`flex flex-col items-center gap-2 transition-all duration-300 ${activeHashes.length >= 2 ? 'opacity-100 scale-110' : 'opacity-40 grayscale'}`}>
                        <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/20 border-2 border-fuchsia-500 flex flex-col items-center justify-center text-fuchsia-400 relative z-10 shadow-[0_0_20px_rgba(217,70,239,0.2)]">
                            <span className="text-[10px] uppercase font-bold tracking-widest mb-1">Hash 2</span>
                            <span className="text-lg font-bold">{activeHashes.length >= 2 ? activeHashes[1] : '?'}</span>
                        </div>
                    </div>
                </div>

                {/* The Bit Array */}
                <div className="flex flex-col gap-2">
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest">Memory Bit Array</span>

                    <div className="flex flex-wrap gap-2 md:gap-3 p-4 bg-neutral-950 border border-neutral-800 rounded-2xl relative z-10 w-full justify-center">
                        {bitArray.map((bit, idx) => {
                            const isActive1 = activeHashes[0] === idx;
                            const isActive2 = activeHashes[1] === idx;
                            const isTargeted = isActive1 || isActive2;

                            return (
                                <div key={idx} className="flex flex-col items-center gap-1">
                                    <div
                                        className={`w-8 h-10 md:w-10 md:h-12 rounded flex items-center justify-center font-bold text-lg transition-all duration-300 ${isTargeted ? (isActive1 ? 'bg-indigo-500 text-white shadow-[0_0_15px_#6366f1] scale-110' : 'bg-fuchsia-500 text-white shadow-[0_0_15px_#d946ef] scale-110') :
                                                bit === 1 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]' :
                                                    'bg-neutral-900 border border-neutral-800 text-neutral-700'
                                            }`}
                                    >
                                        {bit}
                                    </div>
                                    <span className="text-[8px] text-neutral-500">{idx}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
}
