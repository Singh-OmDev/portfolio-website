"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Server, User, Globe, Hash, Type, Play, RotateCcw } from "lucide-react";

type ShardingStrategy = "hash" | "range" | "geo";

interface DataRecord {
    id: string; // e.g., "u_101"
    name: string; // e.g., "Alex"
    region: string; // e.g., "US", "EU", "AS"
    shardId?: number; // 0, 1, or 2
}

const SAMPLE_DATA: Omit<DataRecord, "shardId">[] = [
    { id: "101", name: "Alex", region: "EU" },
    { id: "102", name: "Bob", region: "US" },
    { id: "103", name: "Chen", region: "AS" },
    { id: "104", name: "David", region: "US" },
    { id: "105", name: "Elena", region: "EU" },
    { id: "106", name: "Fakir", region: "AS" },
    { id: "107", name: "Grace", region: "US" },
    { id: "108", name: "Hans", region: "EU" },
    { id: "109", name: "Ivy", region: "AS" },
    { id: "110", name: "Jack", region: "US" },
];

const SHARDS = [
    { id: 0, name: "Shard 0 (Node A)", color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/30" },
    { id: 1, name: "Shard 1 (Node B)", color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/30" },
    { id: 2, name: "Shard 2 (Node C)", color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/30" },
];

export default function ShardingDemo() {
    const [strategy, setStrategy] = useState<ShardingStrategy>("hash");
    const [incomingQueue, setIncomingQueue] = useState<Omit<DataRecord, "shardId">[]>([]);
    const [processingRecord, setProcessingRecord] = useState<DataRecord | null>(null);
    const [shardData, setShardData] = useState<Record<number, DataRecord[]>>({ 0: [], 1: [], 2: [] });
    const [isRunning, setIsRunning] = useState(false);

    // Determines which shard a record belongs to based on the current strategy
    const calculateShard = (record: Omit<DataRecord, "shardId">, currentStrategy: ShardingStrategy): number => {
        if (currentStrategy === "hash") {
            // Hash key: ID % 3
            return parseInt(record.id) % 3;
        } else if (currentStrategy === "range") {
            // Range key: Alphabetical A-I, J-R, S-Z
            const initial = record.name.charAt(0).toUpperCase();
            if (initial < 'J') return 0;
            if (initial < 'S') return 1;
            return 2;
        } else {
            // Geo key: US -> 0, EU -> 1, AS -> 2
            if (record.region === "US") return 0;
            if (record.region === "EU") return 1;
            return 2;
        }
    };

    const startStreaming = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setShardData({ 0: [], 1: [], 2: [] });

        // Load the queue
        const queue = [...SAMPLE_DATA];

        for (let i = 0; i < queue.length; i++) {
            const record = queue[i];

            // 1. Enter router
            setProcessingRecord({ ...record });
            await new Promise(r => setTimeout(r, 600));

            // 2. Determine Shard
            const targetShard = calculateShard(record, strategy);
            setProcessingRecord({ ...record, shardId: targetShard });
            await new Promise(r => setTimeout(r, 800));

            // 3. Save to Shard
            setShardData(prev => ({
                ...prev,
                [targetShard]: [...prev[targetShard], { ...record, shardId: targetShard }]
            }));
            setProcessingRecord(null);
        }

        setIsRunning(false);
    };

    const reset = () => {
        setIsRunning(false);
        setProcessingRecord(null);
        setShardData({ 0: [], 1: [], 2: [] });
    };

    // Change strategy automatically resets
    useEffect(() => {
        reset();
    }, [strategy]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                        <Database size={20} className="text-neutral-500" />
                        Database Sharding
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        Split massive datasets across multiple servers (shards) so no single database node forms a bottleneck.
                    </p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-3">Shard Key Strategy</h4>
                    <div className="space-y-2 mb-8">
                        <StrategyBtn
                            active={strategy === 'hash'}
                            onClick={() => setStrategy('hash')}
                            icon={<Hash size={16} />}
                            title="Algorithmic Hash"
                            desc="ID % 3 (Even distribution)"
                            disabled={isRunning}
                        />
                        <StrategyBtn
                            active={strategy === 'range'}
                            onClick={() => setStrategy('range')}
                            icon={<Type size={16} />}
                            title="Key Range"
                            desc="Alphabetical by Name (A-I, J-R, S-Z)"
                            disabled={isRunning}
                        />
                        <StrategyBtn
                            active={strategy === 'geo'}
                            onClick={() => setStrategy('geo')}
                            icon={<Globe size={16} />}
                            title="Directory / Geo"
                            desc="Mapped by Region (US, EU, AS)"
                            disabled={isRunning}
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={startStreaming}
                        disabled={isRunning}
                        className="flex-1 bg-neutral-900 dark:bg-white text-white dark:text-black py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isRunning ? <RotateCcw size={16} className="animate-spin" /> : <Play size={16} />}
                        {isRunning ? "Streaming..." : "Stream Data"}
                    </button>
                    <button
                        onClick={reset}
                        disabled={isRunning}
                        className="p-3 bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 rounded-xl hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                    >
                        <RotateCcw size={18} />
                    </button>
                </div>
            </div>

            {/* Visualization Panel */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                {/* Router Layer */}
                <div className="flex flex-col items-center justify-center mb-12 mt-4 relative z-10">
                    <div className="text-white/50 text-xs mb-2 uppercase tracking-widest flex items-center gap-2">
                        <Server size={14} /> Application Router
                    </div>

                    <div className="w-64 h-24 border border-indigo-500/50 bg-indigo-500/10 rounded-2xl flex items-center justify-center relative shadow-[0_0_30px_rgba(99,102,241,0.1)]">
                        <AnimatePresence mode="wait">
                            {processingRecord ? (
                                <motion.div
                                    key="record"
                                    initial={{ y: -50, opacity: 0, scale: 0.8 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: 50, opacity: 0, scale: 0.8 }}
                                    className={`px-4 py-2 rounded-lg border flex flex-col items-center bg-white dark:bg-neutral-900 border-neutral-700 shadow-xl ${processingRecord.shardId !== undefined ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-neutral-900' : ''}`}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <User size={14} className="text-neutral-400" />
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">{processingRecord.name}</span>
                                            <div className="flex gap-2 text-[10px] text-neutral-500">
                                                <span>ID:{processingRecord.id}</span>
                                                <span>Reg:{processingRecord.region}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {processingRecord.shardId !== undefined && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-2 text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded w-full text-center"
                                        >
                                            Routing → Shard {processingRecord.shardId}
                                        </motion.div>
                                    )}
                                </motion.div>
                            ) : (
                                <motion.div key="waiting" className="text-indigo-500/50 text-sm animate-pulse flex items-center gap-2">
                                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                    Awaiting payload...
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Connection Lines from Router to Shards */}
                        <svg className="absolute top-full left-0 w-full h-12 pointer-events-none" style={{ overflow: 'visible' }}>
                            {/* Left Path */}
                            <path d="M 32 0 Q 32 24, -80 24 T -192 48" fill="none" className="stroke-blue-500/20" strokeWidth="2" strokeDasharray="4 4" />
                            {/* Center Path */}
                            <path d="M 128 0 L 128 48" fill="none" className="stroke-green-500/20" strokeWidth="2" strokeDasharray="4 4" />
                            {/* Right Path */}
                            <path d="M 224 0 Q 224 24, 336 24 T 448 48" fill="none" className="stroke-purple-500/20" strokeWidth="2" strokeDasharray="4 4" />
                        </svg>
                    </div>
                </div>

                {/* Database Nodes Layer */}
                <div className="flex-1 grid grid-cols-3 gap-4 lg:gap-8 mt-4 relative z-0">
                    {SHARDS.map((shard) => (
                        <div key={shard.id} className={`rounded-2xl border ${shard.border} ${shard.bg} flex flex-col overflow-hidden relative transition-colors`}>
                            {/* Node Header */}
                            <div className="p-3 border-b border-white/5 flex flex-col items-center justify-center bg-black/20">
                                <Database size={20} className={`${shard.color} mb-1`} />
                                <span className={`text-xs font-bold ${shard.color}`}>{shard.name}</span>
                                <span className="text-[10px] text-neutral-500 mt-0.5">
                                    {strategy === 'hash' && `ID % 3 == ${shard.id}`}
                                    {strategy === 'range' && (shard.id === 0 ? 'A - I' : shard.id === 1 ? 'J - R' : 'S - Z')}
                                    {strategy === 'geo' && (shard.id === 0 ? 'US Region' : shard.id === 1 ? 'EU Region' : 'AS Region')}
                                </span>
                            </div>

                            {/* Data Rows */}
                            <div className="flex-1 p-3 overflow-y-auto space-y-2 relative">
                                {/* Highlight Overlay when writing */}
                                <AnimatePresence>
                                    {processingRecord?.shardId === shard.id && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 bg-white/5 z-0"
                                        />
                                    )}
                                </AnimatePresence>

                                <AnimatePresence>
                                    {shardData[shard.id].map((record, idx) => (
                                        <motion.div
                                            key={`${record.id}-${idx}`}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="bg-black/40 border border-white/5 p-2 rounded flex items-center justify-between text-[11px] z-10 relative"
                                        >
                                            <span className="text-neutral-300 font-bold w-12 truncate">{record.name}</span>
                                            <div className="flex gap-2">
                                                <span className={`${strategy === 'hash' ? shard.color : 'text-neutral-500'}`}>{record.id}</span>
                                                <span className={`${strategy === 'geo' ? shard.color : 'text-neutral-500'}`}>{record.region}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {shardData[shard.id].length === 0 && (
                                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                        <span className="text-white/10 text-xs italic">Empty</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}

function StrategyBtn({ active, onClick, icon, title, desc, disabled }: any) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${active
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10'
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-neutral-700 cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
        >
            <div className={`mt-0.5 ${active ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500'}`}>
                {icon}
            </div>
            <div>
                <div className={`text-sm font-bold ${active ? 'text-indigo-900 dark:text-indigo-300' : 'text-neutral-700 dark:text-neutral-300'}`}>{title}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{desc}</div>
            </div>
        </button>
    );
}
