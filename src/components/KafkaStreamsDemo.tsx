"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Database, PlusCircle, ArrowRight, Rss, Layers, Eye, Zap, ArrowRightCircle } from "lucide-react";

type LogEvent = { id: string; type: "USER_SIGNUP" | "ORDER_PLACED" | "PAYMENT_SUCCESS" | "EMAIL_SENT"; payload: string };

export default function KafkaStreamsDemo() {
    const [events, setEvents] = useState<LogEvent[]>([]);
    const [consumerIdx, setConsumerIdx] = useState<{ analytics: number, billing: number, email: number }>({ analytics: 0, billing: 0, email: 0 });
    const [isRunning, setIsRunning] = useState(false);

    // Keep latest events in ref so intervals don't get canceled and reset every time state changes
    const eventsRef = useRef(events);
    useEffect(() => { eventsRef.current = events; }, [events]);

    // Producer simulation
    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            if (eventsRef.current.length > 15) {
                setIsRunning(false); // Auto-stop after a bit
                return;
            }

            const types: LogEvent["type"][] = ["USER_SIGNUP", "ORDER_PLACED", "PAYMENT_SUCCESS", "EMAIL_SENT"];
            const newEvent: LogEvent = {
                id: crypto.randomUUID(),
                type: types[Math.floor(Math.random() * types.length)],
                payload: `Data_${Math.floor(Math.random() * 1000)}`
            };

            setEvents(prev => [...prev, newEvent]);
        }, 1200);

        return () => clearInterval(interval);
    }, [isRunning]); // No events.length dependency, so interval never resets

    // Consumers pulling from log offset independently
    useEffect(() => {
        // Analytics Consumer (Fast)
        const anaTimer = setInterval(() => {
            setConsumerIdx(prev => prev.analytics < eventsRef.current.length ? { ...prev, analytics: prev.analytics + 1 } : prev);
        }, 300);

        // Billing Consumer (Medium)
        const bilTimer = setInterval(() => {
            setConsumerIdx(prev => prev.billing < eventsRef.current.length ? { ...prev, billing: prev.billing + 1 } : prev);
        }, 800);

        // Email Consumer (Slow/Lagging)
        const emTimer = setInterval(() => {
            setConsumerIdx(prev => {
                if (prev.email < eventsRef.current.length) {
                    // Randomly pretend to be slow or fail, simulating real-world backpressure
                    if (Math.random() > 0.3) {
                        return { ...prev, email: prev.email + 1 };
                    }
                }
                return prev;
            });
        }, 1500);

        return () => { clearInterval(anaTimer); clearInterval(bilTimer); clearInterval(emTimer); };

    }, []); // No state dependencies! Consumers independently poll forever, just like real Kafka consumers


    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Layers size={20} className="text-neutral-500" />
                        Kafka Event Streams
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        Unlike traditional databases that overwrite state, Kafka is an <strong>Append-Only Log</strong>. Producers just blindly dump events onto the end of the log.
                        Independent Consumers read the log at their own pace, tracking their own "Offset".
                        <br /><br />
                        If the <i>Email Service</i> crashes for 2 hours, it just wakes up and resumes reading from its last saved offset. No data is lost!
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
                        <div className="flex justify-between items-center text-[10px] uppercase font-bold text-neutral-500 mb-2">
                            <span>Consumer Offsets (Lag)</span>
                        </div>
                        <div className="space-y-2 text-xs font-mono">
                            <div className="flex justify-between items-center text-blue-500">
                                <span>Analytics DB:</span>
                                <span>{consumerIdx.analytics} / {events.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-emerald-500">
                                <span>Billing Svc:</span>
                                <span>{consumerIdx.billing} / {events.length}</span>
                            </div>
                            <div className="flex justify-between items-center text-orange-500">
                                <span>Email Queue:</span>
                                <span className={events.length - consumerIdx.email > 3 ? 'text-red-500 animate-pulse' : ''}>{consumerIdx.email} / {events.length}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setIsRunning(!isRunning)}
                        className={`flex-1 ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'} text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none cursor-pointer text-sm`}
                    >
                        <Zap size={16} /> {isRunning ? "Stop Producer" : "Start Producer Simulator"}
                    </button>
                    <button
                        onClick={() => { setIsRunning(false); setEvents([]); setConsumerIdx({ analytics: 0, billing: 0, email: 0 }); }}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50 text-sm"
                        title="Clear Log"
                    >
                        Clear
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                {/* Top: Producer Action */}
                <div className="w-full flex justify-center mb-8 relative z-20">
                    <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-4 py-2 rounded-full">
                        <PlusCircle size={14} className={isRunning ? "animate-pulse" : ""} /> Order API (Producer)
                    </div>

                    {/* Down Arrow pointing to log */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 text-neutral-600">
                        <ArrowRightCircle size={16} className="rotate-90" />
                    </div>
                </div>

                {/* Middle: The Append-Only Log Array (Immutable) */}
                <div className="flex-1 w-full bg-neutral-800/50 rounded-xl border-x-4 border-b-4 border-neutral-700 relative overflow-hidden flex flex-col mt-4">

                    <div className="absolute top-2 left-4 text-[10px] uppercase font-bold tracking-widest text-neutral-500 flex items-center gap-2">
                        <Layers size={14} /> Immutable Event Log (Topic: 'orders')
                    </div>

                    {/* Events scrolling left */}
                    <div className="flex-1 flex items-center gap-2 px-4 overflow-x-hidden mt-6 relative w-full justify-end">
                        <AnimatePresence>
                            {events.map((evt, i) => (
                                <motion.div
                                    key={evt.id}
                                    initial={{ x: 50, opacity: 0, scale: 0.8 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    className="min-w-[120px] h-20 rounded-lg border border-neutral-600 bg-neutral-800 flex flex-col items-center justify-center relative shrink-0 shadow-lg"
                                >
                                    <span className="absolute -top-3 -left-2 bg-neutral-900 px-1 border border-neutral-700 rounded text-[8px] text-neutral-500 font-bold font-mono">
                                        offset:{i}
                                    </span>
                                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${evt.type === 'USER_SIGNUP' ? 'bg-cyan-500/20 text-cyan-400' :
                                        evt.type === 'ORDER_PLACED' ? 'bg-indigo-500/20 text-indigo-400' :
                                            evt.type === 'PAYMENT_SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                                                'bg-orange-500/20 text-orange-400'
                                        }`}>
                                        {evt.type}
                                    </span>
                                    <span className="text-[10px] mt-2 text-neutral-400">{evt.payload}</span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Bottom: Consumers tracking their offsets */}
                <div className="w-full flex justify-between mt-8 relative z-20 px-8">

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-900/20 px-2 py-1 rounded border border-blue-500/30">
                            <Database size={12} /> Analytics
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px]">idx: {consumerIdx.analytics}</div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-900/20 px-2 py-1 rounded border border-emerald-500/30">
                            <Zap size={12} /> Billing
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px]">idx: {consumerIdx.billing}</div>
                    </div>

                    <div className="flex flex-col items-center gap-2">
                        <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded border ${events.length - consumerIdx.email > 3 ? 'text-red-400 bg-red-900/20 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.5)]' : 'text-orange-400 bg-orange-900/20 border-orange-500/30'}`}>
                            <Rss size={12} /> Email
                        </div>
                        <div className="bg-neutral-800 border border-neutral-700 px-2 py-0.5 rounded text-[10px]">idx: {consumerIdx.email}</div>
                    </div>

                </div>

                {/* Visual Pointers connecting Consumers to the Log Array */}
                {/* (Simulated roughly with SVG depending on offset diffs) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10 opacity-30">
                    {/* Paths drawn based on visual lag distance - abstract representation */}
                    {events.length > 0 && (
                        <>
                            <line x1="20%" y1="90%" x2={`${90 - (events.length - consumerIdx.analytics) * 5}%`} y2="60%" stroke="#60a5fa" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="50%" y1="90%" x2={`${90 - (events.length - consumerIdx.billing) * 5}%`} y2="60%" stroke="#34d399" strokeWidth="2" strokeDasharray="4 4" />
                            <line x1="80%" y1="90%" x2={`${90 - (events.length - consumerIdx.email) * 5}%`} y2="60%" stroke="#fb923c" strokeWidth="2" strokeDasharray="4 4" />
                        </>
                    )}
                </svg>

            </div>
        </div>
    );
}
