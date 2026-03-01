"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CloudLightning, Zap, Clock, Snowflake, Flame, Play, Terminal } from "lucide-react";

export default function ServerlessColdStartDemo() {
    const [status, setStatus] = useState<"sleeping" | "booting" | "executing">("sleeping");
    const [isWarm, setIsWarm] = useState(false);
    const [logs, setLogs] = useState<{ id: string; msg: string; timestamp: Date; type: "info" | "action" | "warn" | "success" }[]>([]);

    // Warm down counter
    const [warmSecondsLeft, setWarmSecondsLeft] = useState(0);

    const WARM_LIFESPAN = 10; // Seconds before it goes to sleep
    const COLD_START_TIME = 2500; // ms
    const WARM_START_TIME = 50; // ms
    const EXEC_TIME = 300; // ms

    const addLog = (msg: string, type: "info" | "action" | "warn" | "success") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, timestamp: new Date(), type }, ...prev].slice(0, 8));
    };

    // Warm-down timer tick
    useEffect(() => {
        if (!isWarm) return;

        if (warmSecondsLeft <= 0) {
            setIsWarm(false);
            setStatus("sleeping");
            addLog("Container idle timeout reached. Scaling down to 0.", "warn");
            return;
        }

        const timer = setTimeout(() => {
            setWarmSecondsLeft(prev => prev - 1);
        }, 1000);

        return () => clearTimeout(timer);
    }, [isWarm, warmSecondsLeft]);

    const handleInvoke = () => {
        if (status === "booting" || status === "executing") return;

        addLog(`Invoking function: GET /api/hello`, "action");

        if (!isWarm) {
            // Cold Start Path
            setStatus("booting");
            addLog("No active containers. Provisioning new environment...", "warn");

            setTimeout(() => {
                addLog("Environment provisioned. Downloading code & dependencies...", "info");
                setTimeout(() => {
                    addLog("Node.js runtime started. Handling request.", "info");
                    setStatus("executing");

                    setTimeout(() => {
                        finishExecution(COLD_START_TIME + EXEC_TIME);
                    }, EXEC_TIME);
                }, COLD_START_TIME / 2);
            }, COLD_START_TIME / 2);
        } else {
            // Warm Start Path
            setStatus("executing");
            addLog("Active container found. Forwarding request...", "info");

            setTimeout(() => {
                finishExecution(WARM_START_TIME + EXEC_TIME);
            }, WARM_START_TIME + EXEC_TIME);
        }
    };

    const finishExecution = (totalTimeMs: number) => {
        setStatus("sleeping"); // Technically it goes idle but remains warm
        setIsWarm(true);
        setWarmSecondsLeft(WARM_LIFESPAN);
        addLog(`Execution completed in ${totalTimeMs}ms. Returning 200 OK.`, "success");
        addLog("Container kept warm for 10s for future requests.", "info");
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <CloudLightning size={20} className="text-neutral-500" />
                            Serverless Function
                        </h3>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 transition-colors ${isWarm ? 'bg-orange-500/10 text-orange-600 border-orange-500/30' : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
                            }`}>
                            {isWarm ? <Flame size={14} className="animate-pulse" /> : <Snowflake size={14} />}
                            {isWarm ? `Warm (${warmSecondsLeft}s)` : "Cold (Scale-to-Zero)"}
                        </div>
                    </div>

                    {/* Vercel / AWS Lambda Simulator UI */}
                    <div className="flex flex-col items-center justify-center p-8 bg-neutral-100 dark:bg-neutral-950 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-8 relative overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            {status === "sleeping" && !isWarm && (
                                <motion.div key="cold" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-3 text-blue-500">
                                    <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center border border-blue-200 dark:border-blue-800">
                                        <Snowflake size={32} />
                                    </div>
                                    <span className="font-mono text-sm tracking-widest uppercase">Zzz... (0 Instances)</span>
                                </motion.div>
                            )}

                            {status === "booting" && (
                                <motion.div key="booting" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-3 text-purple-500">
                                    <div className="w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center border border-purple-200 dark:border-purple-800 animate-spin-slow relative">
                                        <Clock size={32} className="absolute" />
                                        <div className="w-full h-full rounded-full border-t-2 border-purple-500"></div>
                                    </div>
                                    <span className="font-mono text-sm tracking-widest uppercase animate-pulse">Cold Start...</span>
                                </motion.div>
                            )}

                            {(status === "executing" || (status === "sleeping" && isWarm)) && (
                                <motion.div key="warm" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="flex flex-col items-center gap-3 text-orange-500">
                                    <div className={`w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center border border-orange-200 dark:border-orange-800 transition-all ${status === 'executing' ? 'shadow-[0_0_20px_rgba(249,115,22,0.4)] scale-110' : ''}`}>
                                        <Flame size={32} className={status === 'executing' ? "animate-bounce" : ""} />
                                    </div>
                                    <span className="font-mono text-sm tracking-widest uppercase">
                                        {status === 'executing' ? 'Executing API...' : 'Ready (1 Instance)'}
                                    </span>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Trigger Button */}
                <button
                    onClick={handleInvoke}
                    disabled={status === "booting" || status === "executing"}
                    className={`w-full relative overflow-hidden text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer ${isWarm
                            ? 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'
                            : 'bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95'
                        }`}
                >
                    {status === "booting" ? <Clock size={18} className="animate-spin" /> :
                        status === "executing" ? <Zap size={18} className="animate-pulse" /> :
                            <Play size={18} />}

                    <span>
                        {status === "booting" ? "Provisioning..." :
                            status === "executing" ? "Running code..." :
                                "Invoke Trigger"}
                    </span>
                </button>
            </div>

            {/* Execution Logs */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden">
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm flex items-center gap-2">
                        <Terminal size={16} /> Edge Network Logs
                    </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-neutral-700 font-mono text-xs">
                    <AnimatePresence>
                        {logs.length === 0 && (
                            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 italic text-center mt-10">
                                Waiting for edge requests...
                            </motion.p>
                        )}
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3"
                            >
                                <span className="text-neutral-500 shrink-0">
                                    {log.timestamp.toLocaleTimeString([], { hour12: false, second: '2-digit', fractionalSecondDigits: 3 })}
                                </span>
                                <span className={`${log.type === 'action' ? 'text-blue-400 font-bold' :
                                        log.type === 'warn' ? 'text-yellow-500' :
                                            log.type === 'success' ? 'text-green-400 font-bold' :
                                                'text-neutral-300'
                                    }`}>
                                    {log.msg}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {/* Cost / Scale Explainer */}
                <div className="mt-4 pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 leading-relaxed text-center">
                    Serverless scales to zero to save costs. The first request takes 1-3 seconds (Cold Start). Subsequent requests hitting the "warm" instance take {"<"}50ms.
                </div>
            </div>
        </div>
    );
}
