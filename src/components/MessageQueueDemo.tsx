"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Cpu, CheckCircle2, RotateCw, List } from "lucide-react";

interface QueueMessage {
    id: string;
    payload: string;
}

export default function MessageQueueDemo() {
    const [queue, setQueue] = useState<QueueMessage[]>([]);
    const [processedLog, setProcessedLog] = useState<{ id: string, worker: string }[]>([]);

    // Worker States
    const [worker1Active, setWorker1Active] = useState(false);
    const [worker2Active, setWorker2Active] = useState(false);

    // Publisher logic
    const publishMessage = () => {
        const id = crypto.randomUUID();
        const payload = `evt_${Math.floor(Math.random() * 9000) + 1000}`;
        setQueue((prev) => [...prev, { id, payload }]);
    };

    // Worker 1 logic (Faster worker - 1s)
    useEffect(() => {
        if (queue.length === 0 || worker1Active) return;

        setWorker1Active(true);
        setTimeout(() => {
            setQueue((prev) => {
                if (prev.length === 0) return prev;
                const [processed, ...rest] = prev;
                setProcessedLog((logs) => [{ id: processed.id, worker: "Worker A" }, ...logs].slice(0, 10));
                return rest;
            });
            setWorker1Active(false);
        }, 1000);
    }, [queue, worker1Active]);

    // Worker 2 logic (Slower worker - 2.5s)
    useEffect(() => {
        if (queue.length === 0 || worker2Active) return;

        // Slight delay so Worker 1 gets first pick if queue is exactly length 1
        const timeout = setTimeout(() => {
            setQueue((prev) => {
                if (prev.length === 0) return prev;
                const [processed, ...rest] = prev;
                setProcessedLog((logs) => [{ id: processed.id, worker: "Worker B" }, ...logs].slice(0, 10));
                return rest;
            });
            setWorker2Active(false);
        }, 2500);

        setWorker2Active(true);

        return () => clearTimeout(timeout);
    }, [queue, worker2Active]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Publisher & Queue */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <List size={20} className="text-neutral-500" />
                            Message Broker
                        </h3>
                        <span className="text-xs font-mono bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-neutral-500">
                            {queue.length} buffered
                        </span>
                    </div>

                    {/* Visual Queue */}
                    <div className="h-[120px] bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl p-3 flex flex-col justify-end overflow-hidden mb-8 relative">
                        {queue.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 text-sm">
                                Queue Empty
                            </div>
                        )}
                        <div className="flex gap-2 w-full overflow-hidden flex-nowrap">
                            <AnimatePresence>
                                {queue.map((msg, i) => (
                                    <motion.div
                                        key={msg.id}
                                        initial={{ opacity: 0, x: -20, scale: 0.8 }}
                                        animate={{ opacity: 1, x: 0, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, y: -20 }}
                                        className="h-16 min-w-[3rem] w-12 bg-indigo-500 rounded flex items-center justify-center text-white text-xs font-mono shadow-sm flex-shrink-0"
                                        style={{ zIndex: queue.length - i }}
                                    >
                                        {msg.payload.substring(4, 8)}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Publish Button */}
                <button
                    onClick={publishMessage}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                    <Send size={18} />
                    <span>Publish Event</span>
                </button>
            </div>

            {/* Workers & Log */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50"></div>

                <div className="flex gap-4 mb-6 pb-6 border-b border-neutral-800">
                    {/* Worker A */}
                    <div className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${worker1Active ? 'bg-indigo-900/40 border-indigo-500/50' : 'bg-neutral-800/50 border-neutral-800'}`}>
                        <div className="flex items-center gap-2 text-sm text-neutral-300 mb-2">
                            <Cpu size={14} className={worker1Active ? 'text-indigo-400' : 'text-neutral-500'} />
                            Worker A
                        </div>
                        <div className="h-4 flex items-center">
                            {worker1Active ? <RotateCw size={14} className="text-indigo-400 animate-spin" /> : <span className="text-xs text-neutral-600">Idle (fast)</span>}
                        </div>
                    </div>

                    {/* Worker B */}
                    <div className={`flex-1 flex flex-col items-center justify-center p-3 rounded-xl border transition-colors ${worker2Active ? 'bg-indigo-900/40 border-indigo-500/50' : 'bg-neutral-800/50 border-neutral-800'}`}>
                        <div className="flex items-center gap-2 text-sm text-neutral-300 mb-2">
                            <Cpu size={14} className={worker2Active ? 'text-indigo-400' : 'text-neutral-500'} />
                            Worker B
                        </div>
                        <div className="h-4 flex items-center">
                            {worker2Active ? <RotateCw size={14} className="text-indigo-400 animate-spin" /> : <span className="text-xs text-neutral-600">Idle (slow)</span>}
                        </div>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto pr-2 space-y-3 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        <AnimatePresence initial={false}>
                            {processedLog.length === 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-neutral-600 text-sm italic text-center mt-4"
                                >
                                    No events processed yet...
                                </motion.p>
                            )}

                            {processedLog.map((log) => (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm flex items-center gap-3 justify-between bg-neutral-800/40 p-2 rounded"
                                >
                                    <div className="flex items-center gap-2 text-green-400">
                                        <CheckCircle2 size={14} />
                                        <span>Processed</span>
                                    </div>
                                    <span className="text-neutral-400 text-xs">{log.worker}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
