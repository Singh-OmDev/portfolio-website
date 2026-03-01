"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Database, ShieldAlert, GitMerge, FileCode2, Play, RotateCcw } from "lucide-react";

type HexCode = string;

export default function MerkleTreeDemo() {
    const defaultData = ["Row 1", "Row 2", "Row 3", "Row 4"];
    const [data, setData] = useState<string[]>([...defaultData]);
    const [isCorrupted, setIsCorrupted] = useState(false);

    // Simple hash function for visual purposes
    const hashData = (str: string): HexCode => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i);
        return Math.abs(hash).toString(16).padEnd(6, '0').slice(0, 6).toUpperCase();
    };

    // Calculate Tree
    const hash0 = hashData(data[0]);
    const hash1 = hashData(data[1]);
    const hash2 = hashData(data[2]);
    const hash3 = hashData(data[3]);

    const hash01 = hashData(hash0 + hash1);
    const hash23 = hashData(hash2 + hash3);

    const rootHash = hashData(hash01 + hash23);

    const corruptData = () => {
        const newData = [...data];
        newData[2] = "Row 3 (HACKED)";
        setData(newData);
        setIsCorrupted(true);
    };

    const resetData = () => {
        setData([...defaultData]);
        setIsCorrupted(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <GitMerge size={20} className="text-neutral-500" />
                        Merkle Trees (Anti-Entropy)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        How do databases quickly check if millions of rows are out of sync without comparing raw gigabytes of data over a network? They build a tree of Hashes. If a single row changes at the bottom, the single "Root Hash" at the top changes instantly.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 space-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Root Hash (Top Level)</span>
                            <span className={`text-xl font-bold font-mono transition-colors ${isCorrupted ? 'text-red-500' : 'text-emerald-500'}`}>
                                #{rootHash}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={corruptData}
                        disabled={isCorrupted}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <ShieldAlert size={16} /> Corrupt Row 3
                    </button>
                    <button
                        onClick={resetData}
                        disabled={!isCorrupted}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex flex-col items-center justify-between relative py-4 z-10 w-full mb-4">

                    {/* Level 0: Root Hash */}
                    <div className="relative z-20">
                        <motion.div layout className={`px-8 py-4 rounded-xl border-2 flex flex-col items-center justify-center transition-colors shadow-lg ${isCorrupted ? 'border-red-500 bg-red-500/10' : 'border-emerald-500 bg-emerald-500/10'}`}>
                            <span className="text-[10px] uppercase font-bold text-neutral-400 mb-1 tracking-widest">Root Hash</span>
                            <span className={`text-xl font-bold ${isCorrupted ? 'text-red-400' : 'text-emerald-400'}`}>#{rootHash}</span>
                        </motion.div>
                        {/* Down arrows */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 w-32 h-16 pointer-events-none opacity-50">
                            <svg className="w-full h-full" overflow="visible">
                                <line x1="50%" y1="0" x2="10%" y2="100%" stroke={isCorrupted ? '#ef4444' : '#a3a3a3'} strokeWidth="2" strokeDasharray="4 4" />
                                <line x1="50%" y1="0" x2="90%" y2="100%" stroke={isCorrupted ? '#ef4444' : '#a3a3a3'} strokeWidth="2" strokeDasharray="4 4" />
                            </svg>
                        </div>
                    </div>

                    {/* Level 1: Intermediate Hashes */}
                    <div className="flex w-full justify-around relative z-20 mt-8">
                        <motion.div layout className="px-6 py-3 rounded-xl border border-neutral-700 bg-neutral-800 flex flex-col items-center">
                            <span className="text-[9px] uppercase font-bold text-neutral-500 mb-1">Hash(0+1)</span>
                            <span className="text-neutral-300 font-bold">#{hash01}</span>
                            {/* Down arrows */}
                            <div className="absolute top-full left-1/4 -translate-x-1/2 w-24 h-16 pointer-events-none opacity-50">
                                <svg className="w-full h-full" overflow="visible">
                                    <line x1="50%" y1="0" x2="10%" y2="100%" stroke="#a3a3a3" strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#a3a3a3" strokeWidth="2" strokeDasharray="4 4" />
                                </svg>
                            </div>
                        </motion.div>

                        <motion.div layout className={`px-6 py-3 rounded-xl border flex flex-col items-center transition-colors ${isCorrupted ? 'border-red-500/50 bg-red-900/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-neutral-700 bg-neutral-800'}`}>
                            <span className="text-[9px] uppercase font-bold text-neutral-500 mb-1">Hash(2+3)</span>
                            <span className={`font-bold ${isCorrupted ? 'text-red-400' : 'text-neutral-300'}`}>#{hash23}</span>
                            {/* Down arrows */}
                            <div className="absolute top-full right-1/4 translate-x-1/2 w-24 h-16 pointer-events-none opacity-50">
                                <svg className="w-full h-full" overflow="visible">
                                    <line x1="50%" y1="0" x2="10%" y2="100%" stroke={isCorrupted ? '#ef4444' : '#a3a3a3'} strokeWidth="2" strokeDasharray="4 4" />
                                    <line x1="50%" y1="0" x2="90%" y2="100%" stroke="#a3a3a3" strokeWidth="2" strokeDasharray="4 4" />
                                </svg>
                            </div>
                        </motion.div>
                    </div>

                    {/* Level 2: Leaf Hashes */}
                    <div className="flex w-full justify-between px-4 relative z-20 mt-12 gap-2">
                        {[hash0, hash1, hash2, hash3].map((h, i) => {
                            const isHackedLeaf = isCorrupted && i === 2;
                            return (
                                <motion.div layout key={`leaf-${i}`} className={`flex-1 py-2 rounded-lg border flex flex-col items-center justify-center transition-colors ${isHackedLeaf ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] bg-red-900/10' : 'border-neutral-700 bg-neutral-800/50'}`}>
                                    <span className="text-[8px] uppercase font-bold text-neutral-500 mb-0.5">Hash({i})</span>
                                    <span className={`text-xs font-bold ${isHackedLeaf ? 'text-red-400' : 'text-neutral-400'}`}>#{h}</span>

                                    {/* Down arrow to underlying data */}
                                    <div className="absolute top-full w-full h-8 pointer-events-none opacity-30 flex justify-center">
                                        <svg className="w-2 h-full" overflow="visible">
                                            <line x1="50%" y1="0" x2="50%" y2="100%" stroke={isHackedLeaf ? '#ef4444' : '#a3a3a3'} strokeWidth="2" strokeDasharray="2 2" />
                                        </svg>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>

                </div>

                {/* Underling Database Rows */}
                <div className="h-20 bg-black border-t border-neutral-800 p-4 flex gap-2 relative z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    {data.map((row, i) => {
                        const isHackedRow = isCorrupted && i === 2;
                        return (
                            <div key={`data-${i}`} className={`flex-1 h-full rounded border border-dashed flex items-center justify-center p-2 text-center transition-colors ${isHackedRow ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-neutral-700 text-neutral-500'}`}>
                                <span className="text-[10px] font-bold">{row}</span>
                            </div>
                        )
                    })}
                    <div className="absolute -top-3 left-4 bg-neutral-800 px-2 py-0.5 rounded text-[8px] uppercase tracking-widest text-neutral-400 font-bold border border-neutral-700 flex items-center gap-1">
                        <Database size={10} /> Raw DB Blocks
                    </div>
                </div>

            </div>
        </div>
    );
}
