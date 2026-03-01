"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Filter, ArrowRight, Layers, FileDown, Play, RotateCcw } from "lucide-react";

type Stage = "idle" | "split" | "map" | "shuffle" | "reduce" | "done";

export default function MapReduceDemo() {
    const [stage, setStage] = useState<Stage>("idle");

    // The raw input dataset (Word Count example)
    const rawData = ["apple banana", "apple orange", "banana apple"];

    const runPipeline = async () => {
        if (stage !== "idle" && stage !== "done") return;

        setStage("idle");
        await new Promise(r => setTimeout(r, 400));

        // 1. Split
        setStage("split");
        await new Promise(r => setTimeout(r, 1500));

        // 2. Map (parallel processing)
        setStage("map");
        await new Promise(r => setTimeout(r, 2000));

        // 3. Shuffle (group by key over network)
        setStage("shuffle");
        await new Promise(r => setTimeout(r, 2000));

        // 4. Reduce (aggregate)
        setStage("reduce");
        await new Promise(r => setTimeout(r, 2000));

        // 5. Done (output)
        setStage("done");
    };

    const isRunning = stage !== "idle" && stage !== "done";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Layers size={20} className="text-neutral-500" />
                        MapReduce Pipeline
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        How do you process 50 Terabytes of text to find word frequencies? You can't fit it on one machine. MapReduce <i>splits</i> the data, <i>maps</i> (transforms) chunks in parallel across hundreds of cheap workers, <i>shuffles</i> identical keys together, and <i>reduces</i> them into a final answer.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
                        <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest block mb-2">Target Problem: Word Count</span>
                        <div className="text-xs font-mono space-y-1 text-neutral-700 dark:text-neutral-300 bg-white dark:bg-black p-2 rounded border border-neutral-200 dark:border-neutral-700">
                            {rawData.map((line, i) => <div key={i}>{i + 1}. {line}</div>)}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={runPipeline}
                        disabled={isRunning}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <Play size={16} /> Execute Job
                    </button>
                    <button
                        onClick={() => setStage("idle")}
                        disabled={isRunning}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50 text-sm"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 w-full h-full relative grid grid-cols-5 gap-2 text-[10px] items-center text-center">

                    {/* Column 1: Input / Split */}
                    <div className="flex flex-col gap-8 items-center justify-center relative z-20 h-full">
                        <span className="absolute top-0 text-neutral-500 font-bold uppercase tracking-widest">1. Split</span>

                        <AnimatePresence>
                            {(stage === 'idle' || ['split', 'map', 'shuffle', 'reduce', 'done'].includes(stage)) && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-4 w-full">
                                    {rawData.map((line, i) => (
                                        <div key={`split-${i}`} className={`p-2 rounded border transition-colors ${stage !== 'idle' ? 'bg-indigo-500/10 border-indigo-500/50 text-indigo-300 scale-105' : 'bg-neutral-800 border-neutral-700 text-neutral-400'}`}>
                                            "{line}"
                                        </div>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Column 2: Map */}
                    <div className="flex flex-col gap-8 items-center justify-center relative z-20 h-full">
                        <span className="absolute top-0 text-neutral-500 font-bold uppercase tracking-widest">2. Map</span>

                        <AnimatePresence>
                            {['map', 'shuffle', 'reduce', 'done'].includes(stage) && (
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 w-full">

                                    {/* Worker 1 */}
                                    <div className="p-2 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 flex flex-col gap-1">
                                        <div>[apple, 1]</div>
                                        <div>[banana, 1]</div>
                                    </div>
                                    {/* Worker 2 */}
                                    <div className="p-2 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 flex flex-col gap-1">
                                        <div>[apple, 1]</div>
                                        <div>[orange, 1]</div>
                                    </div>
                                    {/* Worker 3 */}
                                    <div className="p-2 rounded border border-emerald-500/50 bg-emerald-500/10 text-emerald-300 flex flex-col gap-1">
                                        <div>[banana, 1]</div>
                                        <div>[apple, 1]</div>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Column 3: Shuffle (Network Cross) */}
                    <div className="flex flex-col gap-8 items-center justify-center relative z-20 h-full">
                        <span className="absolute top-0 text-neutral-500 font-bold uppercase tracking-widest">3. Shuffle</span>

                        <AnimatePresence>
                            {['shuffle', 'reduce', 'done'].includes(stage) && (
                                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col gap-4 w-full relative">

                                    {/* Key: Apple */}
                                    <div className="p-2 rounded border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 flex flex-col">
                                        <span className="font-bold underline mb-1">apple</span>
                                        <span>[1, 1, 1]</span>
                                    </div>
                                    {/* Key: Banana */}
                                    <div className="p-2 rounded border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 flex flex-col">
                                        <span className="font-bold underline mb-1">banana</span>
                                        <span>[1, 1]</span>
                                    </div>
                                    {/* Key: Orange */}
                                    <div className="p-2 rounded border border-yellow-500/50 bg-yellow-500/10 text-yellow-300 flex flex-col">
                                        <span className="font-bold underline mb-1">orange</span>
                                        <span>[1]</span>
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Column 4: Reduce */}
                    <div className="flex flex-col gap-8 items-center justify-center relative z-20 h-full">
                        <span className="absolute top-0 text-neutral-500 font-bold uppercase tracking-widest">4. Reduce</span>

                        <AnimatePresence>
                            {['reduce', 'done'].includes(stage) && (
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex flex-col gap-4 w-full">

                                    {/* Reducer 1 */}
                                    <div className="p-2 rounded-full border-2 border-blue-500/50 bg-blue-500/10 text-blue-300 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        apple: 3
                                    </div>
                                    {/* Reducer 2 */}
                                    <div className="p-2 rounded-full border-2 border-blue-500/50 bg-blue-500/10 text-blue-300 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        banana: 2
                                    </div>
                                    {/* Reducer 3 */}
                                    <div className="p-2 rounded-full border-2 border-blue-500/50 bg-blue-500/10 text-blue-300 flex items-center justify-center font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                                        orange: 1
                                    </div>

                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Column 5: Output */}
                    <div className="flex flex-col gap-8 items-center justify-center relative z-20 h-full">
                        <span className="absolute top-0 text-neutral-500 font-bold uppercase tracking-widest text-[8px] md:text-[10px]">5. Output DB</span>

                        <AnimatePresence>
                            {stage === 'done' && (
                                <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col p-4 rounded-xl border-2 border-green-500 bg-green-500/10 text-green-300 w-full relative overflow-hidden shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                                    <Database size={24} className="mb-2 mx-auto" />
                                    <div className="text-left space-y-1">
                                        <div>apple: 3</div>
                                        <div>banana: 2</div>
                                        <div>orange: 1</div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Background Flow Arrows */}
                    <div className="absolute inset-0 z-0 pointer-events-none opacity-20 flex justify-evenly items-center">
                        <ArrowRight size={32} className={`transition-colors duration-1000 ${stage === 'split' ? 'text-indigo-500 opacity-100' : 'text-neutral-700'}`} />
                        <ArrowRight size={32} className={`transition-colors duration-1000 ${stage === 'map' ? 'text-emerald-500 opacity-100' : 'text-neutral-700'}`} />
                        <Filter size={32} className={`transition-colors duration-1000 ${stage === 'shuffle' ? 'text-yellow-500 opacity-100' : 'text-neutral-700'}`} />
                        <ArrowRight size={32} className={`transition-colors duration-1000 ${stage === 'reduce' ? 'text-blue-500 opacity-100' : 'text-neutral-700'}`} />
                    </div>

                </div>

                {/* Terminal Tracker */}
                <div className="h-12 bg-black border-t border-neutral-800 flex items-center justify-center shrink-0 z-20 text-xs font-bold font-mono tracking-widest text-neutral-400">
                    {stage === 'idle' && "STANDING BY"}
                    {stage === 'split' && <span className="text-indigo-400">READING BLOCKS & SPLITTING...</span>}
                    {stage === 'map' && <span className="text-emerald-400">MAPPING (APPLYING FUNCTION)...</span>}
                    {stage === 'shuffle' && <span className="text-yellow-400">SHUFFLING ACROSS NETWORK...</span>}
                    {stage === 'reduce' && <span className="text-blue-400">REDUCING (AGGREGATING)...</span>}
                    {stage === 'done' && <span className="text-green-400">JOB SUCCESSFUL. SAVING.</span>}
                </div>
            </div>
        </div>
    );
}
