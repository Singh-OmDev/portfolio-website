"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, Shield, Lock, Unlock, AlertTriangle, ArrowRight, Activity, Send } from "lucide-react";

type RequestStage = "idle" | "serviceA" | "sidecarA" | "network" | "sidecarB" | "serviceB" | "response" | "failed";

export default function ServiceMeshDemo() {
    const [stage, setStage] = useState<RequestStage>("idle");
    const [simulateFailure, setSimulateFailure] = useState(false);
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" }[]>([]);
    const [retryCount, setRetryCount] = useState(0);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 8));
    };

    const runSimulation = async () => {
        if (stage !== "idle" && stage !== "response" && stage !== "failed") return;

        setLogs([]);
        setRetryCount(0);

        // 1. Service A initiates
        setStage("serviceA");
        addLog("Service A: Initiated HTTP request to Service B.", "info");
        await new Promise(r => setTimeout(r, 800));

        // 2. Intercepted by Sidecar A
        setStage("sidecarA");
        addLog("Sidecar Proxy A: Intercepted outbound request.", "warn");
        await new Promise(r => setTimeout(r, 600));
        addLog("Sidecar Proxy A: Applied mTLS Encryption.", "success");
        await new Promise(r => setTimeout(r, 800));

        // 3. Network Transit (Encrypted)
        setStage("network");
        addLog("Network: Encrypted payload in transit.", "info");
        await new Promise(r => setTimeout(r, 1000));

        // 4. Hit Sidecar B
        setStage("sidecarB");
        addLog("Sidecar Proxy B: Received encrypted payload.", "warn");
        await new Promise(r => setTimeout(r, 600));
        addLog("Sidecar Proxy B: Validated mTLS certificate & Decrypted.", "success");
        await new Promise(r => setTimeout(r, 800));

        // 5. Service B processes
        setStage("serviceB");

        if (simulateFailure) {
            addLog("Service B: 500 Internal Server Error! (Simulated Crash)", "error");
            await new Promise(r => setTimeout(r, 800));

            // Sidecar B handles failure and retries
            setStage("sidecarB");
            setRetryCount(1);
            addLog("Sidecar Proxy B: Detected 500 error. Initiating transparent retry 1/3...", "warn");
            await new Promise(r => setTimeout(r, 1200));

            setRetryCount(2);
            addLog("Sidecar Proxy B: Initiating transparent retry 2/3...", "warn");
            await new Promise(r => setTimeout(r, 1200));

            // Allow success on 3rd try to show proxy resilience
            setStage("serviceB");
            addLog("Service B: 200 OK (Recovered on retry!).", "success");
            await new Promise(r => setTimeout(r, 800));
        } else {
            addLog("Service B: 200 OK. Processed successfully.", "success");
            await new Promise(r => setTimeout(r, 800));
        }

        // 6. Response Back
        setStage("response");
        if (simulateFailure) {
            addLog("Service A: Received 200 OK. (Unaware that 2 retries happened!)", "info");
        } else {
            addLog("Service A: Received 200 OK.", "info");
        }
    };

    const isRunning = stage !== "idle" && stage !== "response" && stage !== "failed";

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="lg:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-6">
                        <Network size={20} className="text-neutral-500" />
                        Service Mesh (mTLS)
                    </h3>

                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A dedicated infrastructure layer that handles secure service-to-service communication, making encryption (mTLS) and retries invisible to the application code.
                    </p>

                    <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-xl mb-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={simulateFailure}
                                onChange={(e) => setSimulateFailure(e.target.checked)}
                                disabled={isRunning}
                                className="w-4 h-4 text-amber-500 rounded border-amber-300 focus:ring-amber-500 disabled:opacity-50"
                            />
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-amber-900 dark:text-amber-500">Simulate Intermittent Failure</span>
                                <span className="text-xs text-amber-700 dark:text-amber-700/70 mt-0.5">Proxy will auto-retry without Service A knowing.</span>
                            </div>
                        </label>
                    </div>
                </div>

                <button
                    onClick={runSimulation}
                    disabled={isRunning}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isRunning ? <Activity size={18} className="animate-pulse" /> : <Send size={18} />}
                    {isRunning ? "Mesh Active..." : "Send Request across Mesh"}
                </button>
            </div>

            {/* Visualization & Logs Panel */}
            <div className="lg:col-span-8 flex flex-col gap-6">

                {/* Visualizer */}
                <div className="bg-neutral-900 dark:bg-black p-8 rounded-[2rem] border border-neutral-800 shadow-inner relative overflow-hidden flex items-center justify-between min-h-[250px]">

                    {/* Background connection line */}
                    <div className="absolute top-1/2 left-24 right-24 h-1 -translate-y-1/2 bg-neutral-800 z-0">
                        {stage === "network" && (
                            <motion.div
                                initial={{ width: "0%", left: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 1, ease: "linear" }}
                                className="h-full bg-green-500 shadow-[0_0_15px_#22c55e]"
                            />
                        )}
                        {stage === "response" && (
                            <motion.div
                                initial={{ width: "0%", right: "0%", left: "auto" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 0.5, ease: "linear" }}
                                className="h-full bg-indigo-500 shadow-[0_0_15px_#6366f1]"
                            />
                        )}
                    </div>

                    {/* Service A (Frontend) + Sidecar */}
                    <div className="flex flex-col gap-2 relative z-10 w-1/3 max-w-[160px]">
                        {/* Application Box */}
                        <div className={`p-4 rounded-xl border border-neutral-700 bg-neutral-800/80 flex flex-col items-center gap-2 transition-colors ${stage === 'serviceA' || stage === 'response' ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : ''}`}>
                            <Server size={24} className="text-indigo-400" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Service A</span>
                            <span className="text-[10px] text-neutral-400">Frontend UI</span>
                        </div>

                        {/* The Packet Animation from App to Sidecar */}
                        <AnimatePresence>
                            {stage === 'serviceA' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 15 }} exit={{ opacity: 0 }}
                                    className="absolute top-16 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1] z-20"
                                />
                            )}
                        </AnimatePresence>

                        {/* Sidecar Proxy A */}
                        <div className={`mt-4 p-3 rounded-lg border border-neutral-700 bg-neutral-900/90 flex flex-col items-center gap-1 transition-colors ${stage === 'sidecarA' ? 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''}`}>
                            <Shield size={16} className={stage === 'sidecarA' ? "text-green-400 animate-pulse" : "text-neutral-500"} />
                            <span className="text-[10px] font-mono text-neutral-300">Envoy Sidecar</span>

                            {/* Encryption Lock Toggle */}
                            <div className="h-4 flex items-center justify-center mt-1">
                                <AnimatePresence mode="wait">
                                    {(stage === 'sidecarA' || stage === 'network' || stage === 'sidecarB') ? (
                                        <motion.div key="locked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <Lock size={12} className="text-green-500" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="unlocked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                            <Unlock size={12} className="text-neutral-600" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Network Transit Area Label */}
                    <div className="absolute left-1/2 top-1/4 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-neutral-500 z-0">
                        <span className="text-[10px] tracking-widest uppercase font-bold mb-1">Zero-Trust Network</span>
                        {stage === 'network' && (
                            <motion.span initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-500 font-mono bg-green-500/10 px-2 py-0.5 rounded border border-green-500/30">
                                mTLS Encrypted
                            </motion.span>
                        )}
                    </div>

                    {/* Service B (Backend) + Sidecar */}
                    <div className="flex flex-col gap-2 relative z-10 w-1/3 max-w-[160px]">
                        {/* Application Box */}
                        <div className={`p-4 rounded-xl border border-neutral-700 bg-neutral-800/80 flex flex-col items-center gap-2 transition-colors ${stage === 'serviceB' ? (simulateFailure && retryCount < 2 ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]') : ''}`}>
                            {stage === 'serviceB' && simulateFailure && retryCount < 2 ? (
                                <AlertTriangle size={24} className="text-red-400 animate-pulse" />
                            ) : (
                                <Server size={24} className="text-indigo-400" />
                            )}
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Service B</span>
                            <span className="text-[10px] text-neutral-400">Payment API</span>
                        </div>

                        {/* The Packet Animation from Sidecar to App */}
                        <AnimatePresence>
                            {(stage === 'sidecarB' || stage === 'serviceB') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: -10 }} exit={{ opacity: 0 }}
                                    className={`absolute top-16 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full z-20 ${stage === 'serviceB' && simulateFailure && retryCount < 2 ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`}
                                />
                            )}
                        </AnimatePresence>

                        {/* Sidecar Proxy B */}
                        <div className={`mt-4 p-3 rounded-lg border border-neutral-700 bg-neutral-900/90 flex flex-col items-center gap-1 transition-colors ${stage === 'sidecarB' ? (retryCount > 0 ? 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.3)]' : 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.3)]') : ''}`}>
                            <Shield size={16} className={stage === 'sidecarB' ? (retryCount > 0 ? "text-amber-400" : "text-green-400 animate-pulse") : "text-neutral-500"} />
                            <span className="text-[10px] font-mono text-neutral-300">Envoy Sidecar</span>

                            {/* Retry Indicator */}
                            <div className="h-4 flex items-center justify-center mt-1">
                                <AnimatePresence mode="wait">
                                    {retryCount > 0 ? (
                                        <motion.span key="retry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-1.5 rounded">
                                            RETRY {retryCount}/3
                                        </motion.span>
                                    ) : (
                                        <motion.div key="unlocked" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="text-[9px] text-neutral-600">
                                            decrypted
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Logs terminal */}
                <div className="flex-1 bg-black rounded-[2rem] border border-neutral-800 p-6 font-mono text-xs overflow-hidden flex flex-col relative h-[200px]">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-neutral-800 shrink-0">
                        <span className="text-neutral-500">Service Mesh Logs (Control Plane)</span>
                        {logs.length > 0 && <span className="text-[10px] text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Tracking</span>}
                    </div>

                    <div className="overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-neutral-800 flex-1 flex flex-col justify-end">
                        <AnimatePresence>
                            {logs.length === 0 && (
                                <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 italic text-center my-auto">
                                    Awaiting network activity...
                                </motion.p>
                            )}
                            {logs.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                    className={`flex items-start gap-2 ${log.type === 'error' ? 'text-red-400' :
                                            log.type === 'success' ? 'text-green-400' :
                                                log.type === 'warn' ? 'text-amber-400' :
                                                    'text-neutral-300'
                                        }`}
                                >
                                    <ArrowRight size={12} className="shrink-0 mt-0.5 opacity-50" />
                                    <span>{log.msg}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
