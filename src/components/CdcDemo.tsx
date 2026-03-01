"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, Search, ArrowRight, Server, FileText, DatabaseZap, Trash2, Edit3, PlusCircle } from "lucide-react";

type Operation = "INSERT" | "UPDATE" | "DELETE" | null;

interface DbRow {
    id: number;
    name: string;
    status: string;
}

interface CdcEvent {
    id: string;
    op: "c" | "u" | "d"; // create, update, delete (Debezium style)
    before: DbRow | null;
    after: DbRow | null;
}

export default function CdcDemo() {
    // Primary DB State (Postgres)
    const [dbState, setDbState] = useState<DbRow[]>([
        { id: 1, name: "Alice", status: "active" },
        { id: 2, name: "Bob", status: "inactive" },
    ]);

    // Target DB State (Elasticsearch)
    const [searchState, setSearchState] = useState<DbRow[]>([
        { id: 1, name: "Alice", status: "active" },
        { id: 2, name: "Bob", status: "inactive" },
    ]);

    const [activeEvent, setActiveEvent] = useState<CdcEvent | null>(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [nextId, setNextId] = useState(3);

    const triggerCdcFlow = async (event: CdcEvent, newDbState: DbRow[], newSearchState: DbRow[]) => {
        if (isStreaming) return;
        setIsStreaming(true);

        // 1. Update Primary DB
        setDbState(newDbState);

        // 2. Animate Event through CDC Connector
        setActiveEvent(event);
        await new Promise(r => setTimeout(r, 1200)); // Time for animation to cross screen

        // 3. Apply to Target DB
        setSearchState(newSearchState);
        setActiveEvent(null);
        setIsStreaming(false);
    };

    const handleInsert = () => {
        const newUser = { id: nextId, name: `User_${nextId}`, status: "active" };
        setNextId(prev => prev + 1);

        const event: CdcEvent = {
            id: crypto.randomUUID(),
            op: "c",
            before: null,
            after: newUser
        };

        triggerCdcFlow(event, [...dbState, newUser], [...searchState, newUser]);
    };

    const handleUpdate = () => {
        if (dbState.length === 0) return;
        // Pick a random user to update
        const idxToUpdate = Math.floor(Math.random() * dbState.length);
        const userToUpdate = dbState[idxToUpdate];

        const updatedUser = {
            ...userToUpdate,
            status: userToUpdate.status === "active" ? "inactive" : "active"
        };

        const newDbState = [...dbState];
        newDbState[idxToUpdate] = updatedUser;

        const newSearchState = searchState.map(s => s.id === updatedUser.id ? updatedUser : s);

        const event: CdcEvent = {
            id: crypto.randomUUID(),
            op: "u",
            before: userToUpdate,
            after: updatedUser
        };

        triggerCdcFlow(event, newDbState, newSearchState);
    };

    const handleDelete = () => {
        if (dbState.length === 0) return;
        // Delete last user to keep it simple visually
        const userToDelete = dbState[dbState.length - 1];

        const newDbState = dbState.slice(0, -1);
        const newSearchState = searchState.filter(s => s.id !== userToDelete.id);

        const event: CdcEvent = {
            id: crypto.randomUUID(),
            op: "d",
            before: userToDelete,
            after: null
        };

        triggerCdcFlow(event, newDbState, newSearchState);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                        <DatabaseZap size={20} className="text-neutral-500" />
                        Change Data Capture
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        Rather than polling the database for changes (which is slow and resource-heavy), CDC listens to the database's internal transaction log (WAL) and instantly streams every row-level change to downstream systems like Search Indexes or Data Warehouses.
                    </p>

                    <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4">Simulate App Traffic</h4>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleInsert}
                            disabled={isStreaming}
                            className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-900 py-3 rounded-xl font-medium flex items-center gap-3 px-4 hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors disabled:opacity-50 cursor-pointer text-sm"
                        >
                            <PlusCircle size={16} /> INSERT INTO users
                        </button>
                        <button
                            onClick={handleUpdate}
                            disabled={isStreaming || dbState.length === 0}
                            className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900 py-3 rounded-xl font-medium flex items-center gap-3 px-4 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors disabled:opacity-50 cursor-pointer text-sm"
                        >
                            <Edit3 size={16} /> UPDATE users SET ...
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isStreaming || dbState.length === 0}
                            className="bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900 py-3 rounded-xl font-medium flex items-center gap-3 px-4 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors disabled:opacity-50 cursor-pointer text-sm"
                        >
                            <Trash2 size={16} /> DELETE FROM users
                        </button>
                    </div>
                </div>
            </div>

            {/* Visualizer Pipeline */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-neutral-950 p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex relative overflow-hidden h-[450px]">

                {/* 1. Primary Database (Left) */}
                <div className="w-1/3 h-full flex flex-col border border-neutral-800 rounded-xl bg-neutral-900 relative z-10">
                    <div className="bg-blue-900/30 p-3 border-b border-neutral-800 flex items-center gap-2 shrink-0">
                        <Database size={16} className="text-blue-400" />
                        <span className="text-xs font-bold text-blue-400 uppercase">Primary SQL</span>
                    </div>

                    {/* Database Rows View */}
                    <div className="flex-1 p-2 overflow-y-auto space-y-1 relative">
                        {/* Transaction Log Indicator */}
                        <div className={`absolute right-2 top-2 p-1.5 rounded bg-neutral-800 border transition-colors flex items-center gap-1 ${isStreaming ? 'border-yellow-500 shadow-[0_0_10px_#eab308]' : 'border-neutral-700'}`}>
                            <FileText size={10} className={isStreaming ? "text-yellow-400 animate-pulse" : "text-neutral-500"} />
                            <span className="text-[8px] font-mono text-neutral-400 uppercase tracking-widest">WAL Log</span>
                        </div>

                        <div className="mt-8 relative z-0">
                            <AnimatePresence mode="popLayout">
                                {dbState.map((row) => (
                                    <motion.div
                                        key={row.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                                        transition={{ duration: 0.2 }}
                                        className="text-[10px] font-mono p-1.5 border-b border-neutral-800 flex items-center justify-between text-neutral-300"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400">{row.id}</span>
                                            <span>{row.name}</span>
                                        </div>
                                        <span className={`px-1.5 py-0.5 rounded text-[8px] ${row.status === 'active' ? 'bg-green-500/10 text-green-400' : 'bg-neutral-500/10 text-neutral-400'}`}>
                                            {row.status}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* 2. CDC Pipeline / Broker (Middle) */}
                <div className="w-1/3 h-full flex flex-col items-center justify-center relative">
                    <div className="w-full h-1 bg-neutral-800/50 absolute top-1/2 -translate-y-1/2" />

                    {/* Debezium / Kafka Connect Node */}
                    <div className={`z-10 bg-neutral-900 border ${isStreaming ? 'border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'border-neutral-700'} p-3 rounded-xl flex flex-col items-center gap-1 transition-colors duration-300`}>
                        <Server size={20} className={isStreaming ? "text-yellow-400 animate-pulse" : "text-neutral-500"} />
                        <span className="text-[10px] font-bold text-neutral-300">CDC Connector</span>
                        <span className="text-[8px] text-neutral-500 font-mono">(e.g., Debezium)</span>
                    </div>

                    {/* Flying Event Animation */}
                    <AnimatePresence>
                        {activeEvent && (
                            <motion.div
                                initial={{ left: "0%", opacity: 0, scale: 0.5 }}
                                animate={{ left: "100%", opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1.2, ease: "linear" }}
                                className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 border px-2 py-1 flex flex-col gap-0.5 bg-neutral-900 rounded shadow-lg font-mono text-[8px] ${activeEvent.op === 'c' ? 'border-green-500 text-green-400 shadow-[0_0_10px_#22c55e]' :
                                        activeEvent.op === 'u' ? 'border-blue-500 text-blue-400 shadow-[0_0_10px_#3b82f6]' :
                                            'border-red-500 text-red-400 shadow-[0_0_10px_#ef4444]'
                                    }`}
                            >
                                <div className="font-bold flex items-center justify-between border-b border-current pb-0.5 mb-0.5">
                                    <span>Op: "{activeEvent.op}"</span>
                                    <ArrowRight size={8} />
                                </div>
                                {activeEvent.op === 'd' ? (
                                    <><span>before: {'{'}id:{activeEvent.before?.id}{'}'}</span></>
                                ) : (
                                    <><span>after: {'{'}id:{activeEvent.after?.id}{'}'}</span></>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* 3. Target Database (Right) */}
                <div className="w-1/3 h-full flex flex-col border border-neutral-800 rounded-xl bg-neutral-900 relative z-10">
                    <div className="bg-purple-900/30 p-3 border-b border-neutral-800 flex items-center justify-end gap-2 shrink-0">
                        <span className="text-xs font-bold text-purple-400 uppercase">Search Index</span>
                        <Search size={16} className="text-purple-400" />
                    </div>

                    {/* Elasticsearch view */}
                    <div className="flex-1 p-2 overflow-y-auto relative bg-neutral-950/50">
                        <AnimatePresence mode="popLayout">
                            {searchState.map((doc) => (
                                <motion.div
                                    key={`doc-${doc.id}`}
                                    layout
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="mb-2 p-1.5 bg-black border border-neutral-800 rounded font-mono text-[9px] text-neutral-400"
                                >
                                    <span className="text-purple-500">"_id":</span> {doc.id},<br />
                                    <span className="text-green-500">"name":</span> "{doc.name}",<br />
                                    <span className="text-green-500">"status":</span> "{doc.status}"
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </div>
    );
}
