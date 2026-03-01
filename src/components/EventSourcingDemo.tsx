"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, Database, RotateCcw, PlusCircle, MinusCircle } from "lucide-react";

interface BankEvent {
    id: string;
    type: "DEPOSIT" | "WITHDRAWAL";
    amount: number;
    timestamp: Date;
}

export default function EventSourcingDemo() {
    // We strictly store EVENTS, not the "balance"
    const [eventStore, setEventStore] = useState<BankEvent[]>([]);

    const appendEvent = (type: "DEPOSIT" | "WITHDRAWAL", amount: number) => {
        setEventStore(prev => [
            { id: crypto.randomUUID().slice(0, 8), type, amount, timestamp: new Date() },
            ...prev
        ]);
    };

    const undoLastEvent = () => {
        if (eventStore.length === 0) return;
        setEventStore(prev => prev.slice(1));
    };

    // CQRS Projection: We derive the state purely by folding the event log
    const calculateBalance = (events: BankEvent[]) => {
        return events.reduce((acc, ev) => {
            return ev.type === "DEPOSIT" ? acc + ev.amount : acc - ev.amount;
        }, 0);
    };

    const currentBalance = calculateBalance(eventStore);

    return (
        <div className="w-full bg-neutral-900 border border-neutral-800 shadow-2xl rounded-[2rem] overflow-hidden flex flex-col md:flex-row min-h-[500px]">

            {/* WRITE SIDE (Command) */}
            <div className="w-full md:w-1/2 p-8 border-r border-neutral-800 bg-neutral-950 flex flex-col">
                <div className="mb-8 pb-4 border-b border-neutral-800">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <Database size={20} className="text-emerald-500" />
                        Command Side (Write)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">Appends immutable facts to Event Store</p>
                </div>

                <div className="flex gap-4 mb-8">
                    <button
                        onClick={() => appendEvent("DEPOSIT", 100)}
                        className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl py-4 flex flex-col items-center justify-center gap-2 transition-colors group cursor-pointer"
                    >
                        <PlusCircle size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold tracking-wide">Deposit $100</span>
                    </button>
                    <button
                        onClick={() => appendEvent("WITHDRAWAL", 50)}
                        className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-xl py-4 flex flex-col items-center justify-center gap-2 transition-colors group disabled:cursor-not-allowed cursor-pointer"
                        disabled={currentBalance < 50}
                    >
                        <MinusCircle size={24} className="group-hover:scale-110 transition-transform" />
                        <span className="font-bold tracking-wide">Withdraw $50</span>
                    </button>
                </div>

                <div className="flex flex-col flex-1 bg-black p-4 rounded-xl border border-neutral-800 relative z-0">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-mono text-neutral-500 uppercase">Event Store Log</span>
                        <button
                            onClick={undoLastEvent}
                            disabled={eventStore.length === 0}
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-300 px-3 py-1 rounded text-xs flex items-center gap-1 transition-colors disabled:opacity-30 disabled:cursor-not-allowed z-10 cursor-pointer"
                        >
                            <RotateCcw size={12} /> Rewind 1 Step
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-neutral-800">
                        <AnimatePresence>
                            {eventStore.length === 0 && (
                                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 text-sm italic text-center mt-10">
                                    No events recorded. Book is empty.
                                </motion.div>
                            )}
                            {eventStore.map((ev, i) => (
                                <motion.div
                                    key={ev.id}
                                    initial={{ opacity: 0, x: -20, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: "auto" }}
                                    exit={{ opacity: 0, x: 20, height: 0 }}
                                    className="bg-neutral-900 border border-neutral-800 p-3 rounded-lg font-mono text-xs flex justify-between items-center"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-neutral-500">Event_{ev.id}</span>
                                        <span className={ev.type === "DEPOSIT" ? "text-emerald-400" : "text-rose-400"}>
                                            {ev.type}
                                        </span>
                                    </div>
                                    <span className="text-white text-sm font-bold">${ev.amount}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* READ SIDE (Query) */}
            <div className="w-full md:w-1/2 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />

                <div className="mb-8 pb-4 border-b border-neutral-800 z-10">
                    <h3 className="text-lg font-medium text-white flex items-center gap-2">
                        <DollarSign size={20} className="text-indigo-400" />
                        Query Side (Read)
                    </h3>
                    <p className="text-xs text-neutral-500 mt-1">Projects state purely by deriving from logs</p>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center z-10">
                    <div className="bg-neutral-950 border border-neutral-800 p-8 rounded-3xl shadow-2xl flex flex-col items-center w-full max-w-sm">
                        <span className="text-neutral-500 font-medium uppercase tracking-widest text-sm mb-4">Total Balance</span>

                        <div className="text-6xl font-serif font-medium text-white tracking-widest flex items-start gap-1">
                            <span className="text-2xl mt-2 text-neutral-400">$</span>
                            <motion.span
                                key={currentBalance}
                                initial={{ scale: 1.2, color: "#10b981" }}
                                animate={{ scale: 1, color: "#ffffff" }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            >
                                {currentBalance}
                            </motion.span>
                        </div>

                        <div className="w-full h-px bg-neutral-800 my-8" />

                        <div className="w-full space-y-3">
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Total Transactions</span>
                                <span className="font-mono text-white">{eventStore.length}</span>
                            </div>
                            <div className="flex justify-between text-xs text-neutral-400">
                                <span>Derived State</span>
                                <span className={eventStore.length === 0 ? "text-yellow-500" : "text-emerald-500"}>
                                    {eventStore.length === 0 ? "Empty" : "Synced"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-neutral-500 mt-6 text-center max-w-[200px]">
                        Even if this database crashes, it can recreate this exact balance by re-reading the event logs!
                    </p>
                </div>
            </div>
        </div>
    );
}
