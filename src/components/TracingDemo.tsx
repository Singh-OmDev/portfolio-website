"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BarChart, Play, RefreshCcw } from "lucide-react";

interface Span {
    id: string;
    service: string;
    duration: number; // ms
    startTime: number; // relative visually
    color: string;
}

export default function TracingDemo() {
    const [isTracing, setIsTracing] = useState(false);
    const [spans, setSpans] = useState<Span[]>([]);

    // Simulate a random DB bottleneck
    const [dbDelay, setDbDelay] = useState(800);

    const runTrace = () => {
        if (isTracing) return;
        setIsTracing(true);
        setSpans([]);

        // Randomize the bottleneck to make it realistic
        const newDbDelay = Math.floor(Math.random() * 1500) + 300;
        setDbDelay(newDbDelay);

        // Sequence:
        // Gateway (0 - Total Time) -> Auth (50-250) -> Inventory (250-X) -> Payment (X - X+300)

        const S1 = { id: "req_gate", service: "API Gateway", duration: 50 + 200 + newDbDelay + 300, startTime: 0, color: "bg-blue-500 text-blue-100 border-blue-600" };
        const S2 = { id: "req_auth", service: "Authentication", duration: 200, startTime: 50, color: "bg-emerald-500 text-emerald-100 border-emerald-600" };
        const S3 = { id: "req_inv", service: "Inventory DB", duration: newDbDelay, startTime: 250, color: newDbDelay > 1000 ? "bg-red-500 text-red-100 border-red-600" : "bg-purple-500 text-purple-100 border-purple-600" };
        const S4 = { id: "req_pay", service: "Payment Stripe", duration: 300, startTime: 250 + newDbDelay, color: "bg-orange-500 text-orange-100 border-orange-600" };

        let time = 0;
        const totalSimTime = S1.duration;
        const TICK = 50; // evaluate every 50ms

        const interval = setInterval(() => {
            time += TICK;

            setSpans(curr => {
                let next = [...curr];
                if (time >= S1.startTime && !next.find(s => s.id === S1.id)) next.push(S1);
                if (time >= S2.startTime && !next.find(s => s.id === S2.id)) next.push(S2);
                if (time >= S3.startTime && !next.find(s => s.id === S3.id)) next.push(S3);
                if (time >= S4.startTime && !next.find(s => s.id === S4.id)) next.push(S4);
                return next;
            });

            if (time >= totalSimTime) {
                clearInterval(interval);
                setIsTracing(false);
            }
        }, TICK);
    };

    return (
        <div className="w-full bg-[#1e1e1e] border border-neutral-800 shadow-2xl rounded-[2rem] p-8 min-h-[500px] flex flex-col font-sans">

            {/* Header / Controls */}
            <div className="flex justify-between items-center mb-8 border-b border-neutral-800 pb-6">
                <h3 className="text-xl font-medium text-white flex items-center gap-2">
                    <BarChart size={24} className="text-indigo-400" />
                    Datadog Trace Visualizer
                </h3>

                <button
                    onClick={runTrace}
                    disabled={isTracing}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-indigo-500/50 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    {isTracing ? <RefreshCcw size={16} className="animate-spin" /> : <Play size={16} />}
                    {isTracing ? "Tracing..." : "Generate New Trace Request"}
                </button>
            </div>

            {/* Trace View */}
            <div className="flex-1 bg-[#111111] border border-neutral-800 rounded-xl overflow-hidden flex flex-col">

                {/* Timeline Axis Header */}
                <div className="flex items-center text-[10px] text-neutral-500 font-mono border-b border-neutral-800 bg-[#151515] p-2 pl-32 relative">
                    <span className="absolute left-4">Service</span>
                    <div className="flex-1 relative h-4">
                        <span className="absolute left-0">0ms</span>
                        <span className="absolute left-1/4">500ms</span>
                        <span className="absolute left-2/4">1000ms</span>
                        <span className="absolute left-3/4">1500ms</span>
                        <span className="absolute right-0">2000ms</span>
                    </div>
                </div>

                {/* Spans Container */}
                <div className="flex-1 p-4 flex flex-col gap-2 relative overflow-hidden bg-[linear-gradient(90deg,transparent_24%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_26%,transparent_27%,transparent_74%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_76%,transparent_77%,transparent)] bg-[length:400px_100%]">

                    <AnimatePresence>
                        {spans.length === 0 && !isTracing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 flex items-center justify-center text-neutral-600 font-mono text-sm">
                                Click "Generate New Trace Request" to trace a user Checkout action
                            </motion.div>
                        )}

                        {spans.map(span => {
                            // Map 2000ms max to 100% width
                            const leftPercent = (span.startTime / 2000) * 100;
                            const widthPercent = (span.duration / 2000) * 100;

                            return (
                                <div key={span.id} className="relative flex items-center h-8">
                                    <div className="w-28 shrink-0 text-xs text-neutral-400 font-medium truncate pr-2">
                                        {span.service}
                                    </div>
                                    <div className="flex-1 relative h-full group">
                                        <motion.div
                                            initial={{ width: "0%", opacity: 0 }}
                                            animate={{ width: `${Math.min(widthPercent, 100)}%`, opacity: 1 }}
                                            transition={{ duration: span.duration / 1000, ease: "linear" }}
                                            className={`absolute h-6 rounded border ${span.color} flex items-center justify-end px-2 overflow-hidden hover:brightness-110 cursor-pointer shadow-sm`}
                                            style={{ left: `${leftPercent}%` }}
                                        >
                                            <span className="text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-md font-bold">
                                                {span.duration}ms
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Insights Panel */}
                <div className="bg-[#151515] p-4 text-xs font-mono border-t border-neutral-800 flex justify-between items-center text-neutral-400">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500"></span> 200 OK</span>
                        <span>Trace ID: {Math.random().toString(36).substring(2, 9)}</span>
                    </div>
                    {dbDelay > 1000 && !isTracing && (
                        <div className="text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                            🚨 High Latency Detected: database query critically slow resulting in 1.4s overall delay
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
