"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Database, Zap, ArrowRightLeft, KeyRound, Receipt, AlertCircle } from "lucide-react";

export default function IdempotencyDemo() {
    const [logs, setLogs] = useState<{ id: string, msg: string, type: "info" | "success" | "warn" | "charge", source: "client" | "server" }[]>([]);
    const [dbBalance, setDbBalance] = useState(1000);
    const [isProcessing, setIsProcessing] = useState(false);

    // The shared idempotency key for this "transaction"
    const [currentKey, setCurrentKey] = useState("idx_99fa1b2");

    // Map of processed keys
    const [idempotencyStore, setIdempotencyStore] = useState<Record<string, boolean>>({});

    const addLog = (msg: string, type: "info" | "success" | "warn" | "charge", source: "client" | "server") => {
        setLogs(prev => [...prev, { id: crypto.randomUUID(), msg, type, source }]);
    };

    const processPayment = () => {
        if (isProcessing) return;
        setIsProcessing(true);

        const reqKey = currentKey;

        // Client triggers request
        addLog(`POST /v1/charges  [Idempotency-Key: ${reqKey}]`, "info", "client");

        setTimeout(() => {
            // Server receives
            addLog(`Received checkout request with key: ${reqKey}`, "info", "server");

            setTimeout(() => {
                // Check Idempotency Store
                if (idempotencyStore[reqKey]) {
                    // Cache Hit!
                    addLog("🚨 Idempotency key exists! Skipping payment processing to prevent double-charge.", "warn", "server");
                    setTimeout(() => {
                        addLog("200 OK - Returning cached success response", "success", "server");
                        addLog("Payment successful (Cached)", "success", "client");
                        setIsProcessing(false);
                    }, 400);
                } else {
                    // Cache Miss. Process real payment.
                    addLog("Key not found. Processing real credit card charge...", "charge", "server");

                    setTimeout(() => {
                        // Deduct funds
                        setDbBalance(prev => prev - 100);

                        // Save to Idempotency Store
                        setIdempotencyStore(prev => ({ ...prev, [reqKey]: true }));

                        addLog("Charge successful. Saved key to Idempotency Store.", "success", "server");

                        setTimeout(() => {
                            addLog("200 OK - Charge Processed", "success", "server");
                            addLog("Payment successful! -$100", "success", "client");
                            setIsProcessing(false);
                        }, 400);

                    }, 800);
                }
            }, 600);
        }, 200);
    };

    const resetTransaction = () => {
        // Generate a new random idempotency key for a "new" user checkout
        setCurrentKey("idx_" + Math.random().toString(36).substring(2, 9));
        setLogs([]);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Client / Checkout View */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-[500px]">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <CreditCard size={20} className="text-neutral-500" />
                            Checkout Flow
                        </h3>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 mb-6">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <p className="text-sm text-neutral-500 mb-1">Total Due</p>
                                <p className="text-3xl font-serif text-neutral-900 dark:text-white">$100.00</p>
                            </div>
                            <Receipt size={32} className="text-neutral-300 dark:text-neutral-700" />
                        </div>

                        <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-xl flex items-start gap-3 mb-6">
                            <AlertCircle size={16} className="text-blue-500 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                                Simulating a flaky network. Click &quot;Pay&quot; multiple times rapidly to simulate a user impatiently refreshing or re-submitting.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs text-neutral-500 font-mono">
                                <span>Idempotency-Key Header:</span>
                                <span>{currentKey}</span>
                            </div>
                            <button
                                onClick={processPayment}
                                disabled={isProcessing}
                                className="w-full bg-neutral-900 hover:bg-neutral-800 dark:bg-white dark:hover:bg-neutral-200 text-white dark:text-black py-3.5 rounded-xl font-medium shadow-sm active:scale-95 transition-all flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                            >
                                {isProcessing ? <Zap size={18} className="animate-pulse text-yellow-400" /> : <CreditCard size={18} />}
                                {isProcessing ? "Processing..." : "Pay $100.00"}
                            </button>
                        </div>
                    </div>
                </div>

                <button onClick={resetTransaction} className="text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors underline decoration-neutral-300 dark:decoration-neutral-700 cursor-pointer">
                    Start New Transaction
                </button>
            </div>

            {/* Server / Backend View */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative h-[500px]">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <h3 className="text-neutral-300 text-sm flex items-center gap-2">
                        <Database size={16} className="text-neutral-500" />
                        Payment Gateway Backend
                    </h3>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 rounded-full border border-neutral-700">
                            <KeyRound size={12} className="text-yellow-500" />
                            <span className="text-xs font-mono text-neutral-300">{Object.keys(idempotencyStore).length} stored</span>
                        </div>
                        <div className="text-sm font-mono text-green-400">
                            Merchant Balance: ${dbBalance}
                        </div>
                    </div>
                </div>

                {/* Vertical Logs */}
                <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                    <AnimatePresence>
                        {logs.length === 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 text-sm italic m-auto text-center mt-10">
                                Awaiting payment requests...
                            </motion.p>
                        )}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: log.source === "client" ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex flex-col max-w-[90%] ${log.source === "client" ? "self-start" : "self-end ml-auto"}`}
                            >
                                <span className="text-[10px] text-neutral-500 uppercase tracking-widest pl-1 mb-0.5">
                                    {log.source === "client" ? "Client" : "Server"}
                                </span>
                                <div className={`p-3 rounded-2xl text-xs font-mono
                                    ${log.type === "info" ? "bg-neutral-800/50 text-neutral-300 border border-neutral-800" : ""}
                                    ${log.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : ""}
                                    ${log.type === "warn" ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20" : ""}
                                    ${log.type === "charge" ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_15px_rgba(99,102,241,0.2)]" : ""}
                                `}>
                                    {log.type === "charge" && <Zap size={14} className="inline mr-1.5 mb-0.5 text-indigo-400" />}
                                    {log.msg}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
