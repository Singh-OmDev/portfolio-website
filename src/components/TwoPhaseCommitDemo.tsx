"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Network, ShieldCheck, MailWarning, ThumbsUp, ThumbsDown, ArrowRight, Play, RefreshCcw, Skull } from "lucide-react";

type TxStage = "idle" | "prepare" | "waiting" | "commit" | "abort" | "done";

export default function TwoPhaseCommitDemo() {
    const [stage, setStage] = useState<TxStage>("idle");
    const [votes, setVotes] = useState<Record<number, "yes" | "no" | "waiting">>({
        1: "waiting", 2: "waiting", 3: "waiting"
    });
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" | "action" }[]>([]);

    // Config toggles
    const [shouldFail, setShouldFail] = useState(false);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error" | "action") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 6));
    };

    const runTransaction = async () => {
        if (stage !== "idle" && stage !== "done") return;

        setStage("idle");
        setVotes({ 1: "waiting", 2: "waiting", 3: "waiting" });
        setLogs([]);
        await new Promise(r => setTimeout(r, 200));

        // 1. Phase 1: PREPARE
        setStage("prepare");
        addLog("Coordinator: Starting global transaction. Sending PREPARE to all nodes.", "action");
        await new Promise(r => setTimeout(r, 1500));

        // 2. Nodes Vote
        setStage("waiting");

        if (shouldFail) {
            // One node rejects
            setVotes({ 1: "yes", 2: "no", 3: "yes" });
            addLog("Node 1: Voted YES (Locked resources).", "info");
            addLog("Node 3: Voted YES (Locked resources).", "info");
            addLog("Node 2: Voted NO (Constraint violation)! Cannot lock.", "error");
            await new Promise(r => setTimeout(r, 1500));

            // Phase 2: ABORT
            setStage("abort");
            addLog("Coordinator: Received a NO vote. Rolling back entire transaction!", "warn");
            addLog("Coordinator: Sending ABORT to all nodes.", "action");
            await new Promise(r => setTimeout(r, 1500));
            addLog("Nodes: Released all locks and rolled back data.", "info");

        } else {
            // All nodes agree
            setVotes({ 1: "yes", 2: "yes", 3: "yes" });
            addLog("Node 1: Voted YES (Ready to commit).", "info");
            addLog("Node 2: Voted YES (Ready to commit).", "info");
            addLog("Node 3: Voted YES (Ready to commit).", "info");
            await new Promise(r => setTimeout(r, 1500));

            // Phase 2: COMMIT
            setStage("commit");
            addLog("Coordinator: All voted YES! Transaction is safe to finalize.", "success");
            addLog("Coordinator: Sending COMMIT to all nodes.", "action");
            await new Promise(r => setTimeout(r, 1500));
            addLog("Nodes: Finalized writes and released locks. Done.", "success");
        }

        setStage("done");
    };

    const isRunning = stage !== "idle" && stage !== "done";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <ShieldCheck size={20} className="text-neutral-500" />
                        Two-Phase Commit (2PC)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A distributed algorithm that ensures all nodes in a cluster commit a transaction... or none do. It prevents partial writes, ensuring ACID properties across networks.
                        Unlike the Saga Pattern which <i>compensates</i> after failures, 2PC <i>locks</i> everything first.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 space-y-4">

                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative">
                                <input type="checkbox" className="sr-only" checked={shouldFail} onChange={(e) => setShouldFail(e.target.checked)} disabled={isRunning} />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${shouldFail ? 'bg-red-500' : 'bg-neutral-300 dark:bg-neutral-700'}`}></div>
                                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${shouldFail ? 'translate-x-4' : 'translate-x-0'}`}></div>
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-xs font-bold uppercase tracking-wider ${shouldFail ? 'text-red-500' : 'text-neutral-500'}`}>Simulate Constraint Error</span>
                                <span className="text-[9px] text-neutral-500">Node 2 will vote "NO" upon prepare phase.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={runTransaction}
                        disabled={isRunning}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <Play size={16} /> Run Global Transaction
                    </button>
                    <button
                        onClick={() => { setStage("idle"); setVotes({ 1: "waiting", 2: "waiting", 3: "waiting" }); setLogs([]); }}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center"
                        title="Reset"
                    >
                        <RefreshCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex flex-col items-center justify-between relative py-6 px-12 z-10 w-full mb-8">

                    {/* Coordinator Node */}
                    <div className="flex flex-col items-center gap-2 relative z-20">
                        <div className={`w-32 py-4 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-300 bg-neutral-900 ${stage === 'prepare' ? 'border-yellow-500 shadow-[0_0_20px_rgba(250,204,21,0.3)]' :
                                stage === 'commit' || (stage === 'done' && !shouldFail) ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]' :
                                    stage === 'abort' || (stage === 'done' && shouldFail) ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' :
                                        'border-indigo-500/50 text-indigo-400'
                            }`}>
                            <div className={`mb-1 ${stage === 'prepare' ? 'text-yellow-400 animate-pulse' : stage === 'commit' ? 'text-green-400' : stage === 'abort' ? 'text-red-400' : 'text-indigo-400'}`}>
                                <Network size={28} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-white tracking-widest leading-none">Coordinator</span>
                            <span className="text-[8px] text-neutral-500 mt-1">Transaction Manager</span>
                        </div>
                    </div>

                    {/* The 3 Participant Nodes */}
                    <div className="flex w-full justify-between relative mt-20 z-20">
                        {[1, 2, 3].map((id) => {
                            const vote = votes[id as keyof typeof votes];
                            return (
                                <div key={id} className="flex flex-col items-center gap-2 relative">
                                    {/* Vote Status Indicator Float */}
                                    <AnimatePresence>
                                        {stage !== 'idle' && stage !== 'prepare' && (
                                            <motion.div initial={{ y: 0, opacity: 0 }} animate={{ y: -15, opacity: 1 }} className="absolute -top-6 bg-black/50 px-2 py-0.5 rounded border border-neutral-700 backdrop-blur-sm z-30">
                                                {vote === 'yes' ? <ThumbsUp size={12} className="text-green-400" /> :
                                                    vote === 'no' ? <ThumbsDown size={12} className="text-red-400" /> :
                                                        <span className="text-[10px] text-yellow-500 animate-pulse">Waiting...</span>}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className={`w-20 h-20 rounded-xl border flex flex-col items-center justify-center transition-all bg-neutral-900 ${vote === 'yes' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' :
                                            vote === 'no' ? 'border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-900/10' :
                                                'border-neutral-700'
                                        }`}>
                                        <Database size={24} className={vote === 'yes' ? 'text-green-400' : vote === 'no' ? 'text-red-400' : 'text-neutral-500'} />
                                        <span className="text-[9px] uppercase font-bold text-neutral-400 mt-2">Node {id}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Network Layer Animations */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <AnimatePresence>
                            {/* Phase 1: Prepare (Coordinator -> Nodes) */}
                            {stage === 'prepare' && [1, 2, 3].map(i => (
                                <motion.div key={`prep-${i}`} initial={{ top: "25%", left: "50%", opacity: 0 }} animate={{ top: "65%", left: i === 1 ? "15%" : i === 2 ? "50%" : "85%", opacity: 1 }} transition={{ duration: 1.2 }} className="absolute -mt-2 -ml-6 flex items-center gap-1 bg-yellow-500 text-black px-2 py-0.5 rounded shadow-[0_0_10px_#facc15] text-[8px] font-bold">
                                    <MailWarning size={10} /> PREPARE
                                </motion.div>
                            ))}

                            {/* Phase 2a: Commit (Coordinator -> Nodes) */}
                            {stage === 'commit' && [1, 2, 3].map(i => (
                                <motion.div key={`com-${i}`} initial={{ top: "25%", left: "50%", opacity: 0 }} animate={{ top: "65%", left: i === 1 ? "15%" : i === 2 ? "50%" : "85%", opacity: 1 }} transition={{ duration: 1 }} className="absolute -mt-2 -ml-6 flex items-center gap-1 bg-green-500 text-black px-2 py-0.5 rounded shadow-[0_0_10px_#22c55e] text-[8px] font-bold">
                                    <ShieldCheck size={10} /> COMMIT
                                </motion.div>
                            ))}

                            {/* Phase 2b: Abort (Coordinator -> Nodes) */}
                            {stage === 'abort' && [1, 2, 3].map(i => (
                                <motion.div key={`abrt-${i}`} initial={{ top: "25%", left: "50%", opacity: 0 }} animate={{ top: "65%", left: i === 1 ? "15%" : i === 2 ? "50%" : "85%", opacity: 1 }} transition={{ duration: 1 }} className="absolute -mt-2 -ml-6 flex items-center gap-1 bg-red-500 text-white px-2 py-0.5 rounded shadow-[0_0_10px_#ef4444] text-[8px] font-bold">
                                    <Skull size={10} /> ABORT
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Background Static Connection Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-30">
                        <line x1="50%" y1="20%" x2="15%" y2="80%" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" className={votes[1] === 'yes' ? 'stroke-green-500' : 'stroke-neutral-700'} />
                        <line x1="50%" y1="20%" x2="50%" y2="80%" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" className={votes[2] === 'yes' ? 'stroke-green-500' : votes[2] === 'no' ? 'stroke-red-500' : 'stroke-neutral-700'} />
                        <line x1="50%" y1="20%" x2="85%" y2="80%" stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" className={votes[3] === 'yes' ? 'stroke-green-500' : 'stroke-neutral-700'} />
                    </svg>
                </div>

                {/* Terminal Logs */}
                <div className="h-32 bg-black border-t border-neutral-800 p-4 overflow-y-auto shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <AnimatePresence>
                        {logs.length === 0 && <span className="text-neutral-600 italic">Waiting...</span>}
                        {logs.map(log => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`text-[11px] mb-1 flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'warn' ? 'text-yellow-400' : log.type === 'action' ? 'text-indigo-400 font-bold' : 'text-neutral-300'}`}
                            >
                                <span className="opacity-50 shrink-0"><ArrowRight size={10} className="mt-1" /></span> {log.msg}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
