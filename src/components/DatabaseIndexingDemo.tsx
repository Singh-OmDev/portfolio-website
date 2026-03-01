"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, ArrowRight, TableProperties, Binary, Play, RotateCcw } from "lucide-react";

type Stage = "idle" | "full_scan" | "btree_search";

export default function DatabaseIndexingDemo() {
    const [stage, setStage] = useState<Stage>("idle");
    const [scanIndex, setScanIndex] = useState(-1);
    const [treePath, setTreePath] = useState<string[]>([]);

    // Config
    const targetValue = 42;
    const tableData = Array.from({ length: 15 }, (_, i) => (i + 1) * 3); // 3, 6, 9... 45
    // Ensure 42 is in there at index 13

    const runFullScan = async () => {
        if (stage !== "idle") return;
        setStage("full_scan");
        setTreePath([]);

        for (let i = 0; i < tableData.length; i++) {
            setScanIndex(i);
            await new Promise(r => setTimeout(r, 150)); // Slow scan
            if (tableData[i] === targetValue) {
                break;
            }
        }
        await new Promise(r => setTimeout(r, 1000));
        setStage("idle");
        setScanIndex(-1);
    };

    const runBtreeSearch = async () => {
        if (stage !== "idle") return;
        setStage("btree_search");
        setScanIndex(-1);

        const path = [];
        // Root Node (midpoint roughly 24)
        path.push("root");
        setTreePath([...path]);
        await new Promise(r => setTimeout(r, 600));

        // Right Child (greater than 24, looks at 36)
        path.push("right");
        setTreePath([...path]);
        await new Promise(r => setTimeout(r, 600));

        // Right-Right Child (greater than 36, finds 42)
        path.push("right-right");
        setTreePath([...path]);

        await new Promise(r => setTimeout(r, 1500));
        setStage("idle");
        setTreePath([]);
    };

    const isRunning = stage !== "idle";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Binary size={20} className="text-neutral-500" />
                        Database Indexing (B-Tree)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        Why are databases fast? If you don't use an Index, searching for a row requires a <strong className="text-red-500 font-normal">Full Table Scan</strong> (checking every single row).
                        An Index builds a balanced <strong>B-Tree</strong> structure in memory, allowing logarithmic <strong className="text-emerald-500 font-normal">O(log n)</strong> lookups.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 flex justify-between items-center text-[10px] uppercase font-bold tracking-widest text-neutral-500">
                        <span>Target Query</span>
                        <span className="text-indigo-500 font-mono text-sm">WHERE id = {targetValue}</span>
                    </div>
                </div>

                <div className="flex flex-col gap-3">
                    <button
                        onClick={runFullScan}
                        disabled={isRunning}
                        className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-40 outline-none cursor-pointer text-xs"
                    >
                        <TableProperties size={16} /> Run Full Table Scan (O(n))
                    </button>
                    <button
                        onClick={runBtreeSearch}
                        disabled={isRunning}
                        className="w-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-900/40 text-emerald-700 dark:text-emerald-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-all disabled:opacity-40 outline-none cursor-pointer text-xs"
                    >
                        <Binary size={16} /> Run B-Tree Index Search (O(log n))
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                {/* Table Data (Bottom) */}
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-xl border border-neutral-800 bg-neutral-800/50 flex flex-col gap-2">
                    <span className="text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-2"><Database size={12} /> Physical Raw Data Pages</span>
                    <div className="flex w-full gap-1">
                        {tableData.map((val, i) => {
                            const isScanningThis = stage === 'full_scan' && scanIndex === i;
                            const isFound = val === targetValue && ((stage === 'full_scan' && scanIndex === i) || (stage === 'btree_search' && treePath.includes('right-right')));
                            const isPassedScan = stage === 'full_scan' && scanIndex > i;

                            return (
                                <div
                                    key={i}
                                    className={`flex-1 h-8 flex items-center justify-center text-[10px] md:text-xs font-bold rounded border transition-colors ${isFound ? 'bg-indigo-500 text-white border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.5)]' :
                                            isScanningThis ? 'bg-red-500/20 border-red-500 text-red-400' :
                                                isPassedScan ? 'bg-neutral-900 border-neutral-700 text-neutral-600' :
                                                    'bg-neutral-800 border-neutral-700 text-neutral-400'
                                        }`}
                                >
                                    {val}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* B-Tree Visualization (Top) */}
                <div className="flex-1 w-full flex flex-col items-center pt-8 relative z-10 transition-opacity duration-300" style={{ opacity: stage === 'full_scan' ? 0.3 : 1 }}>

                    <span className="absolute top-0 left-0 text-[10px] uppercase font-bold text-neutral-500 flex items-center gap-2 bg-neutral-800/50 px-2 py-1 rounded"><Search size={12} /> In-Memory Index (B-Tree)</span>

                    {/* Root Node */}
                    <div className="relative flex flex-col items-center mt-2">
                        <div className={`px-6 py-2 rounded border-2 z-20 transition-all shadow-lg ${treePath.includes('root') ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-neutral-600 bg-neutral-800 text-neutral-400'}`}>
                            [ 24 ]
                        </div>

                        {/* Level 1 Nodes */}
                        <div className="flex w-64 justify-between mt-12 relative z-20">

                            {/* Left Child (<24) */}
                            <div className="px-4 py-1.5 rounded border-2 border-neutral-600 bg-neutral-800 text-neutral-400">
                                [ 12 ]
                            </div>

                            {/* Right Child (>24) */}
                            <div className={`px-4 py-1.5 rounded border-2 transition-all ${treePath.includes('right') ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300' : 'border-neutral-600 bg-neutral-800 text-neutral-400'}`}>
                                [ 36 ]
                            </div>

                        </div>

                        {/* Level 2 Nodes (Leaf Pointers) */}
                        <div className="flex w-80 justify-between mt-12 relative z-20 text-[10px]">
                            <div className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-500">[ 3, 6, 9 ]</div>
                            <div className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-500">[ 15, 18, 21 ]</div>
                            <div className="px-2 py-1 rounded border border-neutral-700 bg-neutral-900 text-neutral-500">[ 27, 30, 33 ]</div>

                            <div className={`px-2 py-1 rounded border-2 transition-all ${treePath.includes('right-right') ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300 shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'border-neutral-700 bg-neutral-900 text-neutral-500'}`}>
                                [ 39, 42, 45 ]
                            </div>
                        </div>

                        {/* Lines */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 overflow-visible opacity-50">
                            {/* Root to L1 */}
                            <line x1="50%" y1="1.5rem" x2="25%" y2="4rem" stroke="#525252" strokeWidth="2" />
                            <line x1="50%" y1="1.5rem" x2="75%" y2="4rem" stroke={treePath.includes('right') ? '#10b981' : '#525252'} strokeWidth="2" />

                            {/* L1 Left to L2 */}
                            <line x1="25%" y1="5.5rem" x2="5%" y2="8.5rem" stroke="#525252" strokeWidth="2" />
                            <line x1="25%" y1="5.5rem" x2="35%" y2="8.5rem" stroke="#525252" strokeWidth="2" />

                            {/* L1 Right to L2 */}
                            <line x1="75%" y1="5.5rem" x2="65%" y2="8.5rem" stroke="#525252" strokeWidth="2" />
                            <line x1="75%" y1="5.5rem" x2="95%" y2="8.5rem" stroke={treePath.includes('right-right') ? '#10b981' : '#525252'} strokeWidth="2" />

                            {/* Pointer to DB */}
                            {treePath.includes('right-right') && (
                                <line x1="95%" y1="10rem" x2="95%" y2="15rem" stroke="#6366f1" strokeWidth="2" strokeDasharray="4 4" />
                            )}
                        </svg>
                    </div>
                </div>

            </div>
        </div>
    );
}
