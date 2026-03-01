"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Zap, HeartPulse, UserSquare2, RefreshCcw, Skull } from "lucide-react";

type Role = "follower" | "candidate" | "leader" | "dead";
type Stage = "idle" | "election" | "voting" | "heartbeating" | "killed";

export default function LeaderElectionDemo() {
    const [roles, setRoles] = useState<Record<number, Role>>({
        1: "follower", 2: "follower", 3: "follower", 4: "follower", 5: "follower"
    });
    const [stage, setStage] = useState<Stage>("idle");
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" | "pulse" }[]>([]);

    // To position nodes in a rough circle around center (Node 1 is top, etc)
    const positions = {
        1: { top: "10%", left: "50%", transform: "translate(-50%, 0)" },
        2: { top: "40%", left: "15%", transform: "translate(0, -50%)" },
        3: { top: "40%", right: "15%", transform: "translate(0, -50%)" },
        4: { bottom: "10%", left: "30%", transform: "translate(-50%, 0)" },
        5: { bottom: "10%", right: "30%", transform: "translate(50%, 0)" },
    };

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error" | "pulse") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 5));
    };

    const triggerElection = async (candidateId: number) => {
        if (stage !== "idle" && stage !== "killed") return;

        setStage("election");
        setLogs([]);
        setRoles({ 1: "follower", 2: "follower", 3: "follower", 4: "follower", 5: "follower", [candidateId]: "candidate" });

        await new Promise(r => setTimeout(r, 400));
        addLog(`Node ${candidateId}: Election timeout! Becoming Candidate.`, "warn");
        addLog(`Node ${candidateId}: Term incremented. Sending RequestVote RPCs...`, "info");

        await new Promise(r => setTimeout(r, 1200));
        setStage("voting");

        const aliveNodes = [1, 2, 3, 4, 5].filter(n => n !== candidateId);
        addLog(`Nodes [${aliveNodes.join(',')}] granted vote to Node ${candidateId}.`, "success");

        await new Promise(r => setTimeout(r, 1200));

        setRoles(prev => ({ ...prev, [candidateId]: "leader" }));
        setStage("heartbeating");
        addLog(`Node ${candidateId}: Won election! I am the new Leader.`, "success");

        // Heartbeats
        await new Promise(r => setTimeout(r, 1000));
        addLog(`Leader ${candidateId}: Sending AppendEntries (Heartbeat)...`, "pulse");
        await new Promise(r => setTimeout(r, 1500));
        if (stage !== "killed") {
            addLog(`Leader ${candidateId}: Sending AppendEntries (Heartbeat)...`, "pulse");
        }
    };

    const killLeader = () => {
        const leaderId = Object.keys(roles).find(k => roles[parseInt(k)] === "leader");
        if (leaderId) {
            setRoles(prev => ({ ...prev, [parseInt(leaderId)]: "dead" }));
            setStage("killed");
            addLog(`Leader ${leaderId} CRASHED! Heartbeats stopped.`, "error");
        }
    };

    const resetCluster = () => {
        setRoles({ 1: "follower", 2: "follower", 3: "follower", 4: "follower", 5: "follower" });
        setStage("idle");
        setLogs([]);
    };

    const isRunning = stage === "election" || stage === "voting";
    const hasLeader = Object.values(roles).includes("leader");
    const leaderId = Object.keys(roles).find(k => roles[parseInt(k)] === "leader");
    const candidateId = Object.keys(roles).find(k => roles[parseInt(k)] === "candidate");

    const activeCentralNode = leaderId || candidateId;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <UserSquare2 size={20} className="text-neutral-500" />
                        Leader Election (Raft)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        In distributed databases, nodes must agree on who handles writes. Raft uses a randomized "Election Timeout". If a Follower stops hearing heartbeats, it becomes a Candidate and requests votes. A majority wins the Leadership.
                    </p>

                    <div className="space-y-3 mb-8">
                        <button
                            onClick={() => triggerElection(Math.floor(Math.random() * 5) + 1)}
                            disabled={isRunning || hasLeader}
                            className="w-full bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-all disabled:opacity-40 outline-none cursor-pointer text-xs"
                        >
                            <Zap size={16} /> Simulate Election Timeout
                        </button>

                        <button
                            onClick={killLeader}
                            disabled={!hasLeader}
                            className="w-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all disabled:opacity-40 outline-none cursor-pointer text-xs"
                        >
                            <Skull size={16} /> Crash the Leader
                        </button>
                    </div>
                </div>

                <button
                    onClick={resetCluster}
                    disabled={isRunning}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                    <RefreshCcw size={16} /> Reset Cluster
                </button>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 relative z-10 w-full max-w-lg mx-auto mt-4 px-4 py-8 pointer-events-none">

                    {[1, 2, 3, 4, 5].map(id => {
                        const role = roles[id];
                        const pos = (positions as any)[id];

                        return (
                            <div key={id} className="absolute flex flex-col items-center gap-2 transition-all duration-500" style={pos}>

                                <div className={`w-14 h-14 rounded-2xl border-2 flex flex-col items-center justify-center relative z-20 transition-all duration-300 ${role === 'leader' ? 'bg-indigo-500 border-indigo-300 shadow-[0_0_30px_rgba(99,102,241,0.5)] scale-110' :
                                        role === 'candidate' ? 'bg-yellow-500 border-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.5)] scale-110' :
                                            role === 'dead' ? 'bg-neutral-900 border-red-500/50 opacity-50 grayscale' :
                                                'bg-neutral-800 border-neutral-700 opacity-80'
                                    }`}>

                                    {role === 'leader' ? <UserSquare2 size={24} className="text-white" /> :
                                        role === 'candidate' ? <UserSquare2 size={24} className="text-yellow-900" /> :
                                            role === 'dead' ? <Skull size={24} className="text-red-500" /> :
                                                <Server size={24} className="text-neutral-500" />}

                                    {/* Vote Request Animation (Outgoing) */}
                                    <AnimatePresence>
                                        {role === 'candidate' && stage === 'election' && (
                                            <motion.div initial={{ scale: 0, opacity: 1 }} animate={{ scale: 5, opacity: 0 }} transition={{ duration: 1.5, repeat: Infinity }} className="absolute inset-0 rounded-2xl border-2 border-yellow-400 pointer-events-none" />
                                        )}
                                    </AnimatePresence>
                                </div>

                                <span className={`text-[10px] uppercase font-bold tracking-widest ${role === 'leader' ? 'text-indigo-400' :
                                        role === 'candidate' ? 'text-yellow-400' :
                                            role === 'dead' ? 'text-red-500' :
                                                'text-neutral-500'
                                    }`}>
                                    {role === 'leader' ? 'Leader' : role === 'candidate' ? 'Candidate' : role === 'dead' ? 'Dead' : 'Follower'}
                                </span>
                            </div>
                        )
                    })}

                    {/* Central Animations Overlay */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center">
                        <AnimatePresence>
                            {/* Heartbeats (Leader -> Followers) */}
                            {stage === 'heartbeating' && leaderId && (
                                <motion.div
                                    initial={{ scale: 0, opacity: 1 }}
                                    animate={{ scale: 3.5, opacity: 0 }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                    className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-indigo-500 shadow-[inset_0_0_20px_rgba(99,102,241,0.3)] bg-indigo-500/5 mix-blend-screen"
                                    style={{
                                        // offset to start roughly from the leader's position if we wanted to be perfectly precise,
                                        // but a central wave emitting from the middle looks great abstractly for a cluster heartbeat.
                                    }}
                                >
                                    <div className="absolute inset-0 flex items-center justify-center text-indigo-400 opacity-50">
                                        <HeartPulse size={48} />
                                    </div>
                                </motion.div>
                            )}

                            {/* Votes Returning (Followers -> Candidate) */}
                            {stage === 'voting' && candidateId && (
                                <motion.div
                                    initial={{ scale: 4, opacity: 0 }}
                                    animate={{ scale: 0, opacity: 1 }}
                                    transition={{ duration: 1 }}
                                    className="absolute inset-0 m-auto w-32 h-32 rounded-full border-2 border-emerald-400 border-dashed"
                                />
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Logs */}
                <div className="h-32 bg-black border-t border-neutral-800 p-4 font-mono text-[11px] overflow-y-auto z-30 shrink-0">
                    <AnimatePresence>
                        {logs.length === 0 && <span className="text-neutral-600">All nodes are healthy followers. Standing by...</span>}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`mb-1 flex gap-2 ${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'warn' ? 'text-yellow-400' :
                                                log.type === 'pulse' ? 'text-indigo-400' :
                                                    'text-neutral-300'
                                    }`}
                            >
                                <span className="opacity-50 shrink-0">{log.type === 'pulse' ? '~' : '>'}</span>
                                <span>{log.msg}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
