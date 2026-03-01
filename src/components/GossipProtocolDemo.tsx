"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, Play, RotateCcw, Activity } from "lucide-react";

type NodeState = "clean" | "infected";
type MessageTick = { id: string; from: number; to: number };

export default function GossipProtocolDemo() {
    const [nodes, setNodes] = useState<Record<number, NodeState>>({
        1: "clean", 2: "clean", 3: "clean", 4: "clean", 5: "clean",
        6: "clean", 7: "clean", 8: "clean", 9: "clean", 10: "clean"
    });

    const [messages, setMessages] = useState<MessageTick[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Positions for 10 nodes (roughly a circle)
    const positions = Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2;
        const radius = 40; // percentage
        return {
            left: `${50 + radius * Math.cos(angle)}%`,
            top: `${50 + radius * Math.sin(angle)}%`,
        };
    });

    const triggerInfection = (startNode: number) => {
        if (isRunning) return;
        setNodes(prev => ({ ...prev, [startNode]: "infected" }));
        setIsRunning(true);
        setTickCount(0);
        setMessages([]);
    };

    const resetSimulation = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setNodes(Object.fromEntries(Array.from({ length: 10 }).map((_, i) => [i + 1, "clean"])) as any);
        setMessages([]);
        setIsRunning(false);
        setTickCount(0);
    };

    useEffect(() => {
        if (!isRunning) return;

        intervalRef.current = setInterval(() => {
            setTickCount(prev => prev + 1);

            setNodes(currentNodes => {
                const infectedNodes = Object.keys(currentNodes).map(Number).filter(n => currentNodes[n] === "infected");

                if (infectedNodes.length === 10) {
                    setIsRunning(false);
                    return currentNodes; // All infected, halt
                }

                const newMessages: MessageTick[] = [];
                const nextNodes = { ...currentNodes };

                // Each infected node picks 1 random peer to gossip to
                infectedNodes.forEach(fromNode => {
                    let toNode: number;
                    do {
                        toNode = Math.floor(Math.random() * 10) + 1;
                    } while (toNode === fromNode);

                    // Record the message animation
                    newMessages.push({ id: crypto.randomUUID(), from: fromNode, to: toNode });

                    // Infect the target
                    nextNodes[toNode] = "infected";
                });

                setMessages(newMessages); // Just keep the current tick's messages for animation
                return nextNodes;
            });

        }, 1200); // 1.2s per tick

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning]);

    const infectedCount = Object.values(nodes).filter(v => v === "infected").length;
    const isComplete = infectedCount === 10;

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Network size={20} className="text-neutral-500" />
                        Gossip Protocol
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        Masterless distributed databases (like Apache Cassandra) don't have a central leader. Instead, nodes randomly select a peer every second to "gossip" with, trading state updates. Like a viral infection, data synchronizes exponentially fast across the entire cluster.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 font-mono text-[10px] flex justify-between items-center">
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-500">Infected Nodes</span>
                            <span className="text-lg font-bold text-indigo-500">{infectedCount} / 10</span>
                        </div>
                        <div className="flex flex-col gap-1 text-right">
                            <span className="text-neutral-500">Gossip Rounds</span>
                            <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">{tickCount}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => triggerInfection(1)}
                        disabled={isRunning || infectedCount > 0}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <Play size={16} /> Start Gossip
                    </button>
                    <button
                        onClick={resetSimulation}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                {isComplete && (
                    <div className="absolute inset-0 flex items-center justify-center z-30 bg-black/50 backdrop-blur-sm">
                        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-indigo-500/20 border border-indigo-500/50 px-6 py-4 rounded-2xl flex flex-col items-center gap-2 shadow-[0_0_30px_rgba(99,102,241,0.3)]">
                            <Activity size={32} className="text-indigo-400 mb-2" />
                            <span className="text-sm font-bold text-white tracking-widest uppercase">Eventually Consistent</span>
                            <span className="text-[10px] text-indigo-300">Cluster synchronized in {tickCount} rounds.</span>
                        </motion.div>
                    </div>
                )}

                <div className="flex-1 relative z-10 w-full h-full my-8">

                    {/* Draw Nodes */}
                    {Array.from({ length: 10 }).map((_, i) => {
                        const id = i + 1;
                        const isInfected = nodes[id] === "infected";
                        const pos = positions[i];

                        return (
                            <div key={id} className="absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300" style={pos}>

                                <div className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center relative z-20 transition-all duration-500 ${isInfected
                                        ? 'bg-indigo-500 border-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] scale-110 text-white'
                                        : 'bg-neutral-800 border-neutral-600 text-neutral-500'
                                    }`}>
                                    <Server size={20} />

                                    {/* Pulse effect if freshly infected or gossiping */}
                                    <AnimatePresence>
                                        {isInfected && isRunning && (
                                            <motion.div
                                                initial={{ scale: 1, opacity: 0.8 }}
                                                animate={{ scale: 2, opacity: 0 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 1.2, repeat: Infinity }}
                                                className="absolute inset-0 rounded-xl border-2 border-indigo-400 pointer-events-none"
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>
                                <span className={`text-[9px] font-bold mt-2 tracking-widest uppercase ${isInfected ? 'text-indigo-300' : 'text-neutral-500'}`}>Node {id}</span>
                            </div>
                        )
                    })}

                    {/* Draw Flying Particles (Messages) */}
                    <AnimatePresence>
                        {messages.map((msg, idx) => {
                            const fromPos = positions[msg.from - 1];
                            const toPos = positions[msg.to - 1];

                            return (
                                <motion.div
                                    key={`${msg.id}-${idx}`}
                                    initial={{
                                        left: fromPos.left,
                                        top: fromPos.top,
                                        opacity: 0,
                                        scale: 0.5
                                    }}
                                    animate={{
                                        left: toPos.left,
                                        top: toPos.top,
                                        opacity: 1,
                                        scale: 1
                                    }}
                                    exit={{ opacity: 0, scale: 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                    className="absolute w-3 h-3 bg-indigo-400 rounded-full shadow-[0_0_15px_#818cf8] z-30 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                                />
                            );
                        })}
                    </AnimatePresence>

                </div>
            </div>
        </div>
    );
}
