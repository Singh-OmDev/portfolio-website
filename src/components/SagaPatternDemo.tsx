"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Package, CreditCard, XCircle, CheckCircle2, RotateCcw, AlertTriangle } from "lucide-react";

type ServiceStatus = "idle" | "processing" | "success" | "compensating" | "failed";

interface Step {
    id: string;
    title: string;
    icon: React.ReactNode;
    status: ServiceStatus;
}

export default function SagaPatternDemo() {
    const [steps, setSteps] = useState<Step[]>([
        { id: "order", title: "Order Service", icon: <ShoppingCart size={20} />, status: "idle" },
        { id: "inventory", title: "Inventory Service", icon: <Package size={20} />, status: "idle" },
        { id: "payment", title: "Payment Service", icon: <CreditCard size={20} />, status: "idle" },
    ]);
    const [isRunning, setIsRunning] = useState(false);
    const [shouldFail, setShouldFail] = useState(false);
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "error" | "warn" }[]>([]);

    const addLog = (msg: string, type: "info" | "success" | "error" | "warn") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 10));
    };

    const runSaga = async () => {
        if (isRunning) return;
        setIsRunning(true);
        setSteps(s => s.map(step => ({ ...step, status: "idle" })));
        setLogs([]);
        addLog("Saga Transaction Started", "info");

        let failedAt = -1;

        // Forward Execution
        for (let i = 0; i < steps.length; i++) {
            const stepId = steps[i].id;

            // Mark as processing
            setSteps(s => s.map((st, idx) => idx === i ? { ...st, status: "processing" } : st));
            addLog(`Executing ${steps[i].title}...`, "info");

            await new Promise(r => setTimeout(r, 1000)); // Simulate work

            if (shouldFail && i === 2) { // Fail at the last step (Payment)
                setSteps(s => s.map((st, idx) => idx === i ? { ...st, status: "failed" } : st));
                addLog(`ERROR in ${steps[i].title}! Insufficient funds.`, "error");
                failedAt = i;
                break;
            } else {
                setSteps(s => s.map((st, idx) => idx === i ? { ...st, status: "success" } : st));
                addLog(`Successfully completed ${steps[i].title}.`, "success");
            }
        }

        // Compensation / Rollback
        if (failedAt !== -1) {
            addLog("Saga Failed! Initiating Compensating Transactions...", "warn");
            await new Promise(r => setTimeout(r, 800));

            for (let i = failedAt - 1; i >= 0; i--) {
                setSteps(s => s.map((st, idx) => idx === i ? { ...st, status: "compensating" } : st));
                addLog(`Rolling back ${steps[i].title}...`, "warn");

                await new Promise(r => setTimeout(r, 1000)); // Simulate rollback

                setSteps(s => s.map((st, idx) => idx === i ? { ...st, status: "failed" } : st));
                addLog(`Rollback complete for ${steps[i].title}.`, "error");
            }
            addLog("Saga fully rolled back. Data is consistent.", "info");
        } else {
            addLog("Saga Transaction completed successfully! All services committed.", "success");
        }

        setIsRunning(false);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full h-full min-h-[500px]">
            {/* Visualization Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <ShoppingCart size={20} className="text-neutral-500" />
                            Checkout Flow
                        </h3>
                        <label className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shouldFail}
                                onChange={(e) => setShouldFail(e.target.checked)}
                                disabled={isRunning}
                                className="rounded text-indigo-500 cursor-pointer focus:ring-indigo-500 disabled:opacity-50"
                            />
                            Simulate Payment Failure
                        </label>
                    </div>

                    <div className="flex flex-col gap-4 relative">
                        {/* Connecting Lines */}
                        <div className="absolute left-[39px] top-6 bottom-6 w-1 bg-neutral-200 dark:bg-neutral-800 -z-10 rounded-full"></div>

                        {steps.map((step, index) => (
                            <div key={step.id} className="relative flex items-center gap-6">
                                {/* Node */}
                                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center border-4 relative bg-neutral-50 dark:bg-neutral-950 transition-colors duration-500 ${
                                    step.status === 'idle' ? 'border-neutral-200 dark:border-neutral-800 text-neutral-400' :
                                        step.status === 'processing' ? 'border-blue-500 text-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] bg-blue-50/50 dark:bg-blue-900/20' :
                                            step.status === 'success' ? 'border-green-500 text-green-500 bg-green-50/50 dark:bg-green-900/20' :
                                                step.status === 'compensating' ? 'border-yellow-500 text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)] bg-yellow-50/50 dark:bg-yellow-900/20' :
                                                    'border-red-500 text-red-500 bg-red-50/50 dark:bg-red-900/20'
                                }`}>
                                <div className={`${step.status === 'processing' || step.status === 'compensating' ? 'animate-pulse' : ''}`}>
                                {step.icon}
                            </div>
                                    
                                    {/* Status Icon */ }
                            < div className = "absolute -top-2 -right-2" >
                            <AnimatePresence>
                                {step.status === 'success' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><CheckCircle2 size={24} className="text-green-500 bg-white dark:bg-neutral-900 rounded-full border border-green-500" /></motion.div>}
                                {step.status === 'failed' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><XCircle size={24} className="text-red-500 bg-white dark:bg-neutral-900 rounded-full border border-red-500" /></motion.div>}
                                {step.status === 'compensating' && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><RotateCcw size={24} className="text-yellow-500 bg-white dark:bg-neutral-900 rounded-full border border-yellow-500 animate-spin-slow" /></motion.div>}
                            </AnimatePresence>
                                    </div>
                </div>

                {/* Label */}
                <div className="flex-1">
                    <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-lg">{step.title}</h4>
                    <p className="text-sm font-mono text-neutral-500">
                        {step.status === 'idle' ? 'Waiting...' :
                            step.status === 'processing' ? 'Executing local tx...' :
                                step.status === 'success' ? 'Local commit done.' :
                                    step.status === 'compensating' ? 'Applying rollback...' :
                                        'Transaction failed / rolled back.'}
                    </p>
                </div>
            </div>
                        ))}
        </div>
                </div >

        <div className="mt-8">
            <button
                onClick={runSaga}
                disabled={isRunning}
                className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isRunning ? (
                    <><RotateCcw size={18} className="animate-spin" /> Processing Saga...</>
                ) : (
                    <>Execute Saga Transaction</>
                )}
            </button>
        </div>
            </div >

        {/* Logs Panel */ }
        < div className = "bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden" >
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">Saga Orchestrator Logs</span>
                    {logs.length > 0 && <span className="text-xs text-neutral-500">Live</span>}
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-700">
                    <AnimatePresence>
                        {logs.length === 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 text-sm italic text-center mt-10">
                                Orchestrator idle. Awaiting transaction request.
                            </motion.p>
                        )}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`text-xs p-3 rounded-xl border flex items-start gap-3 ${
                                    log.type === 'info' ? 'bg-neutral-800/50 text-neutral-300 border-neutral-700' :
                                    log.type === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/30' :
                                    log.type === 'warn' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' :
                                    'bg-red-500/10 text-red-400 border-red-500/30'
                                }`}
                            >
                                {log.type === 'error' && <XCircle size={14} className="shrink-0 mt-0.5" />}
                                {log.type === 'success' && <CheckCircle2 size={14} className="shrink-0 mt-0.5" />}
                                {log.type === 'warn' && <AlertTriangle size={14} className="shrink-0 mt-0.5" />}
                                <span>{log.msg}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div >
            </div >
        </div >
    );
}
