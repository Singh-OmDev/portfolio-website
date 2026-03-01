"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Network, PowerOff, ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react";

type NodeStatus = "up" | "down";

export default function CapTheoremDemo() {
    const [nodeA, setNodeA] = useState<NodeStatus>("up");
    const [nodeB, setNodeB] = useState<NodeStatus>("up");
    const [networkPartition, setNetworkPartition] = useState(false);

    // Choose between CP (Consistency over Availability) or AP (Availability over Consistency)
    const [systemType, setSystemType] = useState<"CP" | "AP">("AP");

    const [dbDataA, setDbDataA] = useState("V1");
    const [dbDataB, setDbDataB] = useState("V1");

    const handleWriteToA = () => {
        if (nodeA === "down") return;

        const newData = `V${parseInt(dbDataA.replace('V', '')) + 1}`;
        setDbDataA(newData);

        // Attempt replication to B
        if (!networkPartition && nodeB === "up") {
            setTimeout(() => setDbDataB(newData), 600);
        }
    };

    const handleReadFromB = () => {
        if (nodeB === "down") {
            alert("Error: Node B is down.");
            return;
        }

        if (networkPartition) {
            if (systemType === "CP") {
                alert("Error (CP System): Network partitioned! Refusing to serve potentially stale data. (Sacrificing Availability for Consistency)");
            } else {
                alert(`Success (AP System): Reading from Node B. Data returned: ${dbDataB}. \n(Warning: May be stale/inconsistent with Node A!)`);
            }
        } else {
            alert(`Success: Reading from Node B. Data returned: ${dbDataB}.`);
        }
    };

    const reset = () => {
        setNodeA("up");
        setNodeB("up");
        setNetworkPartition(false);
        setDbDataA("V1");
        setDbDataB("V1");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <ShieldAlert size={20} className="text-neutral-500" />
                        CAP Theorem Sandbox
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        In a distributed data store, you can only guarantee two out of three: <strong className="text-indigo-400">C</strong>onsistency, <strong className="text-emerald-400">A</strong>vailability, or <strong className="text-red-400">P</strong>artition Tolerance.
                        <br /><br />
                        Since networks always fail (<strong>P</strong> is mandatory), you must choose between <strong>CP</strong> (errors on disconnect) or <strong>AP</strong> (serves stale data on disconnect).
                    </p>

                    <div className="flex flex-col gap-2 mb-6">
                        <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-widest">System Configuration</span>
                        <button
                            onClick={() => setSystemType("AP")}
                            className={`px-4 py-2 rounded-xl text-left text-xs font-bold transition-colors border ${systemType === "AP"
                                    ? 'bg-emerald-500 text-white border-emerald-600'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                        >
                            AP Database (Cassandra/DynamoDB)
                        </button>
                        <button
                            onClick={() => setSystemType("CP")}
                            className={`px-4 py-2 rounded-xl text-left text-xs font-bold transition-colors border ${systemType === "CP"
                                    ? 'bg-indigo-500 text-white border-indigo-600'
                                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                        >
                            CP Database (MongoDB/Redis)
                        </button>
                    </div>


                    <div className="flex gap-2">
                        <button
                            onClick={() => setNetworkPartition(!networkPartition)}
                            className={`flex flex-col flex-1 py-2 px-1 rounded-xl items-center justify-center transition-all border outline-none text-[10px] uppercase font-bold text-center leading-tight ${networkPartition ? 'bg-red-500 text-white border-red-600' : 'bg-neutral-800/10 dark:bg-neutral-800 text-neutral-600 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                }`}
                        >
                            <Network size={16} className="mb-1" />
                            {networkPartition ? "Fix Network" : "Cut Network"}
                        </button>
                    </div>

                </div>

                <div className="flex gap-2 mt-4">
                    <button
                        onClick={reset}
                        className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center text-sm gap-2"
                        title="Reset"
                    >
                        <RotateCcw size={16} /> Reset State
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px] justify-center text-center">

                <div className="flex justify-between items-center w-full px-12 relative z-10">

                    {/* Node A */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => setNodeA(prev => prev === 'up' ? 'down' : 'up')}
                            className={`p-2 rounded-full border-2 transition-colors ${nodeA === 'up' ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10' : 'border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20'}`}
                            title="Toggle Power"
                        >
                            <PowerOff size={16} />
                        </button>

                        <div className={`w-24 h-24 rounded-2xl border-4 flex flex-col items-center justify-center transition-all bg-neutral-900 shadow-2xl ${nodeA === 'up' ? 'border-neutral-700' : 'border-red-900 opacity-50'}`}>
                            <Database size={32} className={nodeA === 'up' ? 'text-blue-400' : 'text-neutral-600'} />
                            <span className="text-[10px] uppercase font-bold text-neutral-400 mt-2">Node A</span>
                            <span className={`text-lg font-bold ${nodeA === 'up' ? 'text-white' : 'text-neutral-500'}`}>{dbDataA}</span>
                        </div>

                        <button
                            onClick={handleWriteToA}
                            disabled={nodeA === 'down'}
                            className="px-4 py-2 mt-4 bg-blue-600 text-white rounded-lg text-xs font-bold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-colors"
                        >
                            Write V+1
                        </button>
                    </div>

                    {/* Network Link (The "P" in CAP) */}
                    <div className="flex-1 h-32 relative mx-4 flex items-center justify-center">
                        <div className={`absolute w-full h-1 transition-colors ${networkPartition ? 'bg-red-500/50' : 'bg-emerald-500/50'} z-0 rounded`} />

                        {/* Sync Animation */}
                        {!networkPartition && dbDataA !== dbDataB && nodeA === 'up' && nodeB === 'up' && (
                            <motion.div
                                initial={{ left: "0%" }}
                                animate={{ left: "100%" }}
                                transition={{ duration: 0.6 }}
                                onAnimationComplete={() => setDbDataB(dbDataA)}
                                className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_15px_#3b82f6] z-10 -translate-x-1/2"
                            />
                        )}

                        {networkPartition && (
                            <div className="absolute bg-black p-2 rounded-full border-2 border-red-500 z-20 shadow-[0_0_20px_rgba(239,68,68,0.5)]">
                                <ShieldAlert size={24} className="text-red-500" />
                            </div>
                        )}
                    </div>

                    {/* Node B */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={() => setNodeB(prev => prev === 'up' ? 'down' : 'up')}
                            className={`p-2 rounded-full border-2 transition-colors ${nodeB === 'up' ? 'border-emerald-500 text-emerald-500 hover:bg-emerald-500/10' : 'border-red-500 text-red-500 bg-red-500/10 hover:bg-red-500/20'}`}
                            title="Toggle Power"
                        >
                            <PowerOff size={16} />
                        </button>

                        <div className={`w-24 h-24 rounded-2xl border-4 flex flex-col items-center justify-center transition-all bg-neutral-900 shadow-2xl ${nodeB === 'up' ? 'border-neutral-700' : 'border-red-900 opacity-50'}`}>
                            <Database size={32} className={nodeB === 'up' ? 'text-purple-400' : 'text-neutral-600'} />
                            <span className="text-[10px] uppercase font-bold text-neutral-400 mt-2">Node B</span>
                            <span className={`text-lg font-bold ${nodeB === 'up' ? 'text-white' : 'text-neutral-500'} ${networkPartition && dbDataA !== dbDataB ? 'text-red-400' : ''}`}>{dbDataB}</span>
                        </div>

                        <button
                            onClick={handleReadFromB}
                            disabled={nodeB === 'down'}
                            className={`px-4 py-2 mt-4 text-white rounded-lg text-xs font-bold active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${systemType === 'CP' && networkPartition ? 'bg-red-600 hover:bg-red-500 line-through' : 'bg-purple-600 hover:bg-purple-500'}`}
                        >
                            Read Data
                        </button>
                    </div>

                </div>

                {/* Status Legend */}
                <div className="absolute bottom-6 left-0 w-full text-center flex flex-col items-center">
                    <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-full border border-neutral-800 bg-neutral-900 shadow-xl">
                        <span className={`flex items-center gap-1 ${!networkPartition && systemType === 'CP' ? 'text-indigo-400' : 'text-neutral-600'}`}><CheckCircle2 size={12} /> Consistent</span>
                        <span className={`flex items-center gap-1 ${nodeB === 'up' && (systemType === 'AP' || !networkPartition) ? 'text-emerald-400' : 'text-neutral-600'}`}><CheckCircle2 size={12} /> Available</span>
                        <span className={`flex items-center gap-1 ${networkPartition ? 'text-red-400' : 'text-neutral-600'}`}><CheckCircle2 size={12} /> Partitioned</span>
                    </div>
                </div>

            </div>

        </div>
    );
}
