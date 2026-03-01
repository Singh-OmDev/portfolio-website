"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, Users, ArrowRight, RotateCcw, AlertTriangle, PlayCircle, ShieldCheck } from "lucide-react";

type EnvStatus = "idle" | "booting" | "ready" | "error";

export default function BlueGreenDeployDemo() {
    const [trafficSplit, setTrafficSplit] = useState<number>(0); // 0 = 100% Blue, 100 = 100% Green
    const [greenStatus, setGreenStatus] = useState<EnvStatus>("idle");
    const [blueStatus, setBlueStatus] = useState<EnvStatus>("ready");
    const [requests, setRequests] = useState<{ id: string; target: "blue" | "green" }[]>([]);

    // Simulated traffic generator
    useEffect(() => {
        const interval = setInterval(() => {
            const isGreen = Math.random() * 100 < trafficSplit;
            const targetEnv: "blue" | "green" = isGreen && (greenStatus === "ready" || greenStatus === "error") ? "green" : "blue";
            setRequests(prev => [
                ...prev,
                { id: crypto.randomUUID(), target: targetEnv }
            ].slice(-15)); // Keep last 15 for visual stream
        }, 300);

        return () => clearInterval(interval);
    }, [trafficSplit, greenStatus, blueStatus]);

    const deployV2 = async () => {
        if (greenStatus !== "idle" && greenStatus !== "error") return;
        setGreenStatus("booting");
        await new Promise(r => setTimeout(r, 2000));
        setGreenStatus("ready");
    };

    const triggerError = () => {
        if (trafficSplit > 0 && greenStatus === "ready") {
            setGreenStatus("error");
        }
    };

    const instantRollback = () => {
        setTrafficSplit(0);
        setGreenStatus("idle");
    };

    // Derived stats
    const blueReqs = requests.filter(r => r.target === "blue").length;
    const greenReqs = requests.filter(r => r.target === "green").length;
    const errorCount = greenStatus === 'error' ? greenReqs : 0;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="lg:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Network size={20} className="text-neutral-500" />
                        Blue/Green Deployment
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A release pattern that reduces downtime and risk by running two identical production environments. Traffic is gradually shifted to the new environment, allowing for instant zero-downtime rollbacks if issues occur.
                    </p>

                    {/* Step 1: Deploy */}
                    <div className="mb-6 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800">
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">1</span>
                            Provision New Environment
                        </h4>
                        <button
                            onClick={deployV2}
                            disabled={greenStatus !== "idle" && greenStatus !== "error"}
                            className="w-full bg-emerald-500 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                        >
                            {greenStatus === 'booting' ? <RotateCcw size={16} className="animate-spin" /> : <PlayCircle size={16} />}
                            {greenStatus === 'booting' ? "Booting V2 Servers..." : "Deploy V2 to Green"}
                        </button>
                    </div>

                    {/* Step 2: Traffic Shift */}
                    <div className={`mb-6 p-4 rounded-xl border transition-colors ${greenStatus === 'ready' || greenStatus === 'error' ? 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-800' : 'bg-neutral-100/50 dark:bg-neutral-900/10 border-neutral-200/50 dark:border-neutral-800/50 opacity-50'}`}>
                        <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-3 flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center text-xs">2</span>
                            Canary Traffic Shift
                        </h4>

                        <div className="flex justify-between text-xs font-mono font-bold mb-2">
                            <span className="text-blue-500">V1 (Blue): {100 - trafficSplit}%</span>
                            <span className="text-emerald-500">V2 (Green): {trafficSplit}%</span>
                        </div>

                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="10"
                            value={trafficSplit}
                            onChange={(e) => setTrafficSplit(Number(e.target.value))}
                            disabled={greenStatus !== 'ready' && greenStatus !== 'error'}
                            className="w-full appearance-none bg-neutral-200 dark:bg-neutral-800 h-2 rounded-full outline-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-md cursor-pointer disabled:cursor-not-allowed"
                            style={{
                                background: `linear-gradient(to right, #3b82f6 ${100 - trafficSplit}%, #10b981 ${100 - trafficSplit}%)`
                            }}
                        />
                    </div>

                </div>

                {/* Step 3: Crisis Management */}
                <div className="flex gap-2">
                    <button
                        onClick={triggerError}
                        disabled={trafficSplit === 0 || greenStatus !== 'ready'}
                        className="flex-1 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-200 dark:border-red-900 py-3 rounded-lg font-medium flex flex-col items-center justify-center hover:bg-red-100 dark:hover:bg-red-900/40 active:scale-95 transition-all outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[10px] text-center"
                    >
                        <AlertTriangle size={16} className="mb-1" />
                        Simulate Bug
                    </button>

                    <button
                        onClick={instantRollback}
                        disabled={trafficSplit === 0}
                        className="flex-1 bg-neutral-900 text-white dark:bg-white dark:text-black py-3 rounded-lg font-medium flex flex-col items-center justify-center hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer text-[10px] text-center"
                    >
                        <ShieldCheck size={16} className="mb-1" />
                        Instant Rollback
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="lg:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner overflow-hidden flex flex-col relative min-h-[400px]">

                {/* Traffic Generator */}
                <div className="absolute left-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 z-20">
                    <div className="w-16 h-16 bg-neutral-800 border border-neutral-700 rounded-full flex items-center justify-center shadow-lg relative">
                        <Users size={24} className="text-neutral-400" />

                        {/* Outbound Traffic Streams */}
                        <div className="absolute left-full top-1/2 -translate-y-1/2 w-48 h-[200%] flex flex-col justify-between py-6 opacity-30 pointer-events-none">
                            {/* Line to Blue */}
                            <svg className="w-full h-1/2 overflow-visible">
                                <path d="M 0 100 Q 100 100, 200 0" fill="none" stroke="#3b82f6" strokeWidth={1 + ((100 - trafficSplit) / 10)} strokeDasharray="5 5" className="animate-[dash_1s_linear_infinite]" />
                            </svg>
                            {/* Line to Green */}
                            <svg className="w-full h-1/2 overflow-visible">
                                <path d="M 0 0 Q 100 0, 200 100" fill="none" stroke="#10b981" strokeWidth={1 + (trafficSplit / 10)} strokeDasharray="5 5" className="animate-[dash_1s_linear_infinite]" />
                            </svg>
                        </div>
                    </div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-neutral-500 bg-black/50 px-2 rounded">Users</span>
                </div>

                {/* Load Balancer */}
                <div className="absolute left-[35%] top-1/2 -translate-y-1/2 flex flex-col items-center z-30">
                    <div className="h-40 w-12 bg-neutral-900 border border-neutral-700 rounded-xl relative flex flex-col items-center justify-between py-4 shadow-xl">
                        <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse border border-blue-400"></div>
                        <div className={`w-3 h-3 rounded-full transition-colors ${trafficSplit > 0 ? (greenStatus === 'error' ? 'bg-red-500 animate-pulse border-red-400' : 'bg-emerald-500 animate-pulse border-emerald-400') : 'bg-neutral-800 border-neutral-700'}`}></div>
                    </div>
                    <span className="text-[10px] font-bold mt-2 text-white bg-neutral-800 px-2 py-0.5 rounded uppercase tracking-wider">Load Balancer</span>
                </div>

                {/* Environment Clusters */}
                <div className="absolute right-6 top-6 bottom-6 w-[45%] flex flex-col justify-between z-10">

                    {/* Blue Environment */}
                    <div className="h-[45%] bg-blue-900/10 border-2 border-blue-500/30 rounded-2xl relative flex flex-col p-4">
                        <div className="flex items-center justify-between border-b border-blue-500/20 pb-2 mb-2">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-400 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                Blue (v1.0)
                            </span>
                            <span className="font-mono text-[10px] text-blue-300 bg-blue-500/20 px-1.5 rounded">{100 - trafficSplit}%</span>
                        </div>

                        {/* Servers */}
                        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className="bg-blue-500/20 border border-blue-500/40 rounded flex flex-col items-center justify-center transition-colors relative overflow-hidden">
                                    <Server size={14} className="text-blue-400/50 mb-1" />
                                    <span className="text-[8px] font-mono text-blue-300/50">Node {s}</span>

                                    {/* Request hits */}
                                    <AnimatePresence>
                                        {requests.filter(r => r.target === 'blue').slice(-8).map((req, i) => (
                                            <motion.div
                                                key={`req-${req.id}`}
                                                initial={{ scale: 0, opacity: 1 }}
                                                animate={{ scale: 3, opacity: 0 }}
                                                transition={{ duration: 1 }}
                                                className="absolute inset-0 m-auto w-2 h-2 rounded-full bg-blue-300 pointer-events-none"
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Green Environment */}
                    <div className={`h-[45%] rounded-2xl relative flex flex-col p-4 border-2 transition-colors ${greenStatus === 'idle' ? 'bg-neutral-900 border-neutral-800 opacity-50' :
                        greenStatus === 'booting' ? 'bg-yellow-900/10 border-yellow-500/30' :
                            greenStatus === 'error' ? 'bg-red-900/10 border-red-500/30' :
                                'bg-emerald-900/10 border-emerald-500/30'
                        }`}>
                        <div className={`flex items-center justify-between border-b pb-2 mb-2 transition-colors ${greenStatus === 'idle' ? 'border-neutral-800' :
                            greenStatus === 'error' ? 'border-red-500/20' :
                                'border-emerald-500/20'
                            }`}>
                            <span className={`text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors ${greenStatus === 'idle' ? 'text-neutral-500' :
                                greenStatus === 'error' ? 'text-red-400' :
                                    'text-emerald-400'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${greenStatus === 'idle' ? 'bg-neutral-700' :
                                    greenStatus === 'booting' ? 'bg-yellow-500 animate-pulse' :
                                        greenStatus === 'error' ? 'bg-red-500 animate-pulse' :
                                            'bg-emerald-500 animate-pulse'
                                    }`}></div>
                                Green (v2.0)
                            </span>
                            <span className={`font-mono text-[10px] px-1.5 rounded transition-colors ${greenStatus === 'error' ? 'text-red-300 bg-red-500/20' : 'text-emerald-300 bg-emerald-500/20'
                                }`}>{trafficSplit}%</span>
                        </div>

                        {/* Servers */}
                        <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-2">
                            {[1, 2, 3, 4].map(s => (
                                <div key={s} className={`rounded flex flex-col items-center justify-center transition-colors relative overflow-hidden border ${greenStatus === 'idle' ? 'bg-neutral-800/50 border-neutral-700' :
                                    greenStatus === 'booting' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                        greenStatus === 'error' ? 'bg-red-500/20 border-red-500/60 shadow-[0_0_10px_rgba(239,68,68,0.3)]' :
                                            'bg-emerald-500/20 border-emerald-500/40'
                                    }`}>
                                    {greenStatus === 'error' ? (
                                        <AlertTriangle size={14} className="text-red-500 mb-1 animate-pulse" />
                                    ) : (
                                        <Server size={14} className={greenStatus === 'idle' ? 'text-neutral-600 mb-1' : 'text-emerald-400/50 mb-1'} />
                                    )}
                                    <span className={`text-[8px] font-mono ${greenStatus === 'idle' ? 'text-neutral-600' : greenStatus === 'error' ? 'text-red-400' : 'text-emerald-300/50'}`}>Node {s}</span>

                                    {/* Request hits */}
                                    {greenStatus !== 'idle' && greenStatus !== 'booting' && (
                                        <AnimatePresence>
                                            {requests.filter(r => r.target === 'green').slice(-8).map((req, i) => (
                                                <motion.div
                                                    key={`req-${req.id}`}
                                                    initial={{ scale: 0, opacity: 1 }}
                                                    animate={{ scale: 3, opacity: 0 }}
                                                    transition={{ duration: 1 }}
                                                    className={`absolute inset-0 m-auto w-2 h-2 rounded-full pointer-events-none ${greenStatus === 'error' ? 'bg-red-400' : 'bg-emerald-400'}`}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Error Overlay */}
                        {greenStatus === 'error' && (
                            <div className="absolute inset-0 flex items-center justify-center bg-red-900/40 backdrop-blur-sm rounded-xl">
                                <span className="text-xs font-bold text-white bg-red-600 px-3 py-1 rounded-full animate-bounce shadow-xl">
                                    500 Internal Error
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Metrics Summary */}
                <div className="absolute bottom-4 left-4 right-4 flex gap-4 text-[10px] font-mono justify-center">
                    <div className="bg-blue-500/10 border border-blue-500/30 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-2">
                        <ArrowRight size={10} /> Blue 200 OKs: {blueReqs}
                    </div>
                    {trafficSplit > 0 && greenStatus !== 'idle' && (
                        <div className={`${greenStatus === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'} px-3 py-1.5 rounded-lg flex items-center gap-2`}>
                            {greenStatus === 'error' ? <AlertTriangle size={10} /> : <ArrowRight size={10} />}
                            Green {greenStatus === 'error' ? '500 ERRORs' : '200 OKs'}: {greenReqs}
                        </div>
                    )}
                </div>

                {/* Inject raw CSS animation for path dashes */}
                <style dangerouslySetInnerHTML={{
                    __html: `
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -20;
                      }
                    }
                 `}} />
            </div>
        </div>
    );
}
