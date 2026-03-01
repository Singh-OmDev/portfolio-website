"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, MonitorSmartphone, Server, ArrowDown, ArrowUp, Zap } from "lucide-react";

type Strategy = "polling" | "long_polling" | "sse";
type LogMsg = { id: string, text: string, type: "req" | "res" | "push" };

export default function SseDemo() {
    const [strategy, setStrategy] = useState<Strategy>("sse");
    const [isRunning, setIsRunning] = useState(false);
    const [logs, setLogs] = useState<LogMsg[]>([]);

    const addLog = (text: string, type: "req" | "res" | "push") => {
        setLogs(prev => [{ id: crypto.randomUUID(), text, type }, ...prev].slice(0, 10));
    };

    // Simulation loops
    useEffect(() => {
        if (!isRunning) return;

        let interval: NodeJS.Timeout;
        let eventTarget = new EventTarget();

        // Server Event Generator (Emits every 3-5 seconds randomly)
        const serverLoop = setInterval(() => {
            eventTarget.dispatchEvent(new Event("data_ready"));
        }, 4000);

        if (strategy === "polling") {
            // Standard Polling: Client asks every 1s
            interval = setInterval(() => {
                addLog("Client: Any new data?", "req");
                setTimeout(() => {
                    // 25% chance of actually having data in this short window
                    if (Math.random() < 0.25) {
                        addLog("Server: Yes! Here it is.", "res");
                    } else {
                        addLog("Server: No, try again later.", "res");
                    }
                }, 300);
            }, 1000);

        } else if (strategy === "long_polling") {
            // Long Polling: Client asks, Server holds connection open until data arrives
            const startLongPoll = () => {
                if (!isRunning) return;
                addLog("Client: Any new data? I'll wait.", "req");

                const onData = () => {
                    addLog("Server: Data arrived! Returning response.", "res");
                    eventTarget.removeEventListener("data_ready", onData);
                    // Client immediately reconnects
                    setTimeout(startLongPoll, 300);
                };
                eventTarget.addEventListener("data_ready", onData);
            };
            startLongPoll();

        } else if (strategy === "sse") {
            // Server-Sent Events: One connection, continuous unidirectional stream
            addLog("Client: Opening ONE-WAY data stream.", "req");
            setTimeout(() => {
                addLog("Server: Connection kept ALIVE. Waiting...", "res");
            }, 500);

            const onData = () => {
                addLog("Server -> PUSH DATA: New event!", "push");
            };
            eventTarget.addEventListener("data_ready", onData);
        }

        return () => {
            clearInterval(interval);
            clearInterval(serverLoop);
            setIsRunning(false);
        };
    }, [strategy, isRunning]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Zap size={20} className="text-neutral-500" />
                        SSE vs Polling
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        If a client needs real-time updates (like a stock ticker), how does it get them?
                        <br /><br />
                        <strong>Polling</strong> wastes CPU/Bandwidth. <strong>Long Polling</strong> holds connections open but still requires reconnection. <strong>SSE (Server-Sent Events)</strong> keeps a single persistent HTTP connection open, allowing the server to <em>push</em> data downward anytime.
                    </p>

                    <div className="flex flex-col gap-2 mb-6">
                        {(["polling", "long_polling", "sse"] as Strategy[]).map(s => (
                            <button
                                key={s}
                                onClick={() => { setStrategy(s); setLogs([]); setIsRunning(false); }}
                                className={`px-4 py-2 rounded-xl text-left text-xs font-bold font-mono transition-colors border ${strategy === s
                                        ? 'bg-indigo-500 text-white border-indigo-600'
                                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                                    }`}
                            >
                                {s === 'polling' ? '1. STANDARD POLLING' : s === 'long_polling' ? '2. LONG POLLING' : '3. SERVER-SENT EVENTS'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => { setLogs([]); setIsRunning(!isRunning); }}
                        className={`flex-1 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-emerald-500 hover:bg-emerald-600'} text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none cursor-pointer text-sm`}
                    >
                        {isRunning ? <RotateCcw size={16} /> : <Play size={16} />}
                        {isRunning ? 'Stop Simulation' : 'Start Process'}
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex flex-col justify-between items-center py-4 relative z-10 w-full mb-8">

                    {/* Client */}
                    <div className="w-16 h-16 rounded-xl border-2 border-indigo-500 bg-indigo-500/10 text-indigo-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                        <MonitorSmartphone size={32} />
                        <span className="text-[10px] uppercase font-bold mt-1">Client</span>
                    </div>

                    {/* Server */}
                    <div className="w-16 h-16 rounded-xl border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 flex flex-col items-center justify-center shadow-[0_0_15px_rgba(52,211,153,0.2)] mt-32">
                        <Server size={32} />
                        <span className="text-[10px] uppercase font-bold mt-1">Server</span>
                    </div>

                    {/* Dynamic Network Lines */}
                    <div className="absolute inset-0 pointer-events-none -z-10 flex flex-col items-center justify-center">
                        {/* Main Connection Line */}
                        <div className={`w-1 transition-all duration-300 ${strategy === 'sse' && isRunning ? 'h-32 bg-indigo-500/50 shadow-[0_0_15px_#6366f1]' : 'h-32 border-l-2 border-dashed border-neutral-700'}`} />

                        {/* Animated Request/Responses */}
                        <AnimatePresence>
                            {logs.map((log) => {
                                // Determine animation based on type
                                if (log.type === 'req') {
                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ top: "25%" }} animate={{ top: "65%" }} exit={{ opacity: 0 }} transition={{ duration: strategy === 'long_polling' ? 2 : 0.8 }}
                                            className="absolute text-cyan-400 flex items-center -ml-6"
                                        >
                                            <ArrowDown size={20} />
                                        </motion.div>
                                    )
                                }
                                if (log.type === 'res' || log.type === 'push') {
                                    return (
                                        <motion.div
                                            key={log.id}
                                            initial={{ top: "65%" }} animate={{ top: "25%" }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
                                            className={`absolute flex items-center ml-6 ${log.type === 'push' ? 'text-emerald-400' : 'text-purple-400'}`}
                                        >
                                            <ArrowUp size={20} />
                                        </motion.div>
                                    )
                                }
                                return null;
                            })}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Logs */}
                <div className="h-48 bg-black border-t border-neutral-800 p-4 font-mono text-[11px] overflow-y-auto z-30 shrink-0 flex flex-col-reverse shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`mb-1.5 flex gap-2 ${log.type === 'req' ? 'text-cyan-400' :
                                        log.type === 'res' ? 'text-purple-400' :
                                            log.type === 'push' ? 'text-emerald-400 bg-emerald-900/20 px-1 rounded font-bold' :
                                                'text-neutral-300'
                                    }`}
                            >
                                <span>{log.text}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {!isRunning && logs.length === 0 && <span className="text-neutral-600">Select a strategy and click Start.</span>}
                </div>
            </div>
        </div>
    );
}
