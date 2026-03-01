"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, MonitorSmartphone, ArrowRight, Play, RotateCcw } from "lucide-react";

type Stage = "idle" | "browser_cache" | "isp_resolver" | "root_server" | "tld_server" | "auth_server" | "done";

export default function DnsResolutionDemo() {
    const [stage, setStage] = useState<Stage>("idle");
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" | "req" | "res" }[]>([]);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error" | "req" | "res") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 6));
    };

    const runResolution = async () => {
        if (stage !== "idle" && stage !== "done") return;

        setStage("idle");
        setLogs([]);
        await new Promise(r => setTimeout(r, 400));

        // 1. Browser/OS Cache
        setStage("browser_cache");
        addLog("Browser: Checking local OS cache for 'google.com'...", "info");
        await new Promise(r => setTimeout(r, 1500));
        addLog("Browser Cache MISS. Not found locally.", "warn");
        await new Promise(r => setTimeout(r, 1000));

        // 2. ISP Resolver
        setStage("isp_resolver");
        addLog("OS: Asking ISP DNS Resolver (e.g. 8.8.8.8)...", "req");
        await new Promise(r => setTimeout(r, 1500));
        addLog("ISP Resolver: I don't know either. I'll find out for you.", "info");
        await new Promise(r => setTimeout(r, 1000));

        // 3. Root Server
        setStage("root_server");
        addLog("ISP: Asking Root DNS Server (.)", "req");
        await new Promise(r => setTimeout(r, 1500));
        addLog("Root: I don't know 'google.com', but ask the '.com' TLD Server at 192.x.x.x", "res");
        await new Promise(r => setTimeout(r, 1000));

        // 4. TLD Server
        setStage("tld_server");
        addLog("ISP: Asking '.com' TLD Server", "req");
        await new Promise(r => setTimeout(r, 1500));
        addLog("TLD: I don't know IP, but 'google.com' is registered to NameServers [ns1.google.com]", "res");
        await new Promise(r => setTimeout(r, 1000));

        // 5. Authoritative Server
        setStage("auth_server");
        addLog("ISP: Asking Authoritative Server (ns1.google.com)", "req");
        await new Promise(r => setTimeout(r, 1500));
        addLog("Auth: Yes! The A Record for google.com is 142.250.190.46", "success");
        await new Promise(r => setTimeout(r, 1000));

        // 6. Return Data
        setStage("done");
        addLog("ISP: Caching result and returning to Browser.", "info");
        addLog("Browser: Connecting to HTTP server at 142.250.190.46...", "success");
    };

    const isRunning = stage !== "idle" && stage !== "done";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Globe size={20} className="text-neutral-500" />
                        DNS Resolution Flow
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        What happens when you type <code>google.com</code> into your browser? Computers only understand IP addresses. The Domain Name System (DNS) is the phonebook of the internet, recursively querying servers across the globe to find an address.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6">
                        <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest block mb-2">Target Domain</span>
                        <div className="text-lg font-mono font-bold text-indigo-500 bg-white dark:bg-black p-2 rounded border border-neutral-200 dark:border-neutral-700 text-center">
                            google.com
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={runResolution}
                        disabled={isRunning}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <Play size={16} /> Resolve Domain
                    </button>
                    <button
                        onClick={() => { setStage("idle"); setLogs([]); }}
                        disabled={isRunning}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50 text-sm"
                        title="Reset"
                    >
                        <RotateCcw size={16} />
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 relative z-10 w-full mb-8">

                    <div className="flex justify-between items-center h-full px-4">

                        {/* Left Side: Client -> ISP */}
                        <div className="flex w-1/3 flex-col items-center justify-center gap-20 relative h-full">

                            {/* Client */}
                            <div className={`flex flex-col items-center gap-2 z-20 transition-all ${['browser_cache', 'done'].includes(stage) ? 'scale-110' : ''}`}>
                                <div className="w-16 h-16 rounded-xl border-2 border-indigo-500 bg-indigo-500/10 text-indigo-400 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                    <MonitorSmartphone size={32} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-indigo-400">Browser</span>
                            </div>

                            {/* ISP Resolver */}
                            <div className={`flex flex-col items-center gap-2 z-20 transition-all ${['isp_resolver', 'root_server', 'tld_server', 'auth_server'].includes(stage) ? 'scale-110' : ''}`}>
                                <div className="w-16 h-16 rounded-xl border-2 border-blue-500 bg-blue-500/10 text-blue-400 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                    <Server size={32} />
                                </div>
                                <span className="text-[10px] uppercase font-bold text-blue-400 text-center">ISP Resolver<br /><span className="text-[8px] font-normal opacity-70">(Recursive)</span></span>
                            </div>

                        </div>

                        {/* Right Side: DNS Hierarchy Servers */}
                        <div className="flex w-1/3 flex-col justify-between h-4/5 relative z-20">

                            {/* Root Server */}
                            <div className={`flex flex-col items-center gap-1 transition-all ${stage === 'root_server' ? 'scale-110 opacity-100' : 'opacity-60 grayscale'}`}>
                                <div className="w-12 h-12 rounded border-2 border-purple-500 bg-purple-500/10 text-purple-400 flex items-center justify-center">
                                    <Server size={20} />
                                </div>
                                <span className="text-[8px] uppercase font-bold text-purple-400">Root Server (.)</span>
                            </div>

                            {/* TLD Server */}
                            <div className={`flex flex-col items-center gap-1 transition-all ${stage === 'tld_server' ? 'scale-110 opacity-100' : 'opacity-60 grayscale'}`}>
                                <div className="w-12 h-12 rounded border-2 border-orange-500 bg-orange-500/10 text-orange-400 flex items-center justify-center">
                                    <Server size={20} />
                                </div>
                                <span className="text-[8px] uppercase font-bold text-orange-400">TLD Server (.com)</span>
                            </div>

                            {/* Authoritative Server */}
                            <div className={`flex flex-col items-center gap-1 transition-all ${stage === 'auth_server' ? 'scale-110 opacity-100' : 'opacity-60 grayscale'}`}>
                                <div className="w-12 h-12 rounded border-2 border-emerald-500 bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                                    <Server size={20} />
                                </div>
                                <span className="text-[8px] uppercase font-bold text-emerald-400 text-center">Auth Server<br />(ns.google.com)</span>
                            </div>

                        </div>

                    </div>

                    {/* Animated Networking Lines Overlay */}
                    <div className="absolute inset-0 z-10 pointer-events-none">
                        <AnimatePresence>

                            {/* Client <-> ISP */}
                            {stage === 'isp_resolver' && (
                                <motion.div initial={{ top: "20%", left: "16%" }} animate={{ top: "65%", left: "16%" }} transition={{ duration: 1 }} className="absolute w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_#60a5fa] -translate-x-1/2 -translate-y-1/2" />
                            )}
                            {stage === 'done' && (
                                <motion.div initial={{ top: "65%", left: "16%" }} animate={{ top: "20%", left: "16%" }} transition={{ duration: 1 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-black/80 px-2 py-1 rounded border border-emerald-500/30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                    142.250.190.46
                                </motion.div>
                            )}

                            {/* ISP <-> Root */}
                            {stage === 'root_server' && (
                                <>
                                    <motion.div initial={{ top: "65%", left: "16%" }} animate={{ top: "15%", left: "83%" }} transition={{ duration: 0.7 }} className="absolute w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc] -translate-x-1/2 -translate-y-1/2" />
                                    <motion.div initial={{ top: "15%", left: "83%" }} animate={{ top: "65%", left: "16%" }} transition={{ duration: 0.7, delay: 0.8 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-purple-400 bg-black/80 px-2 py-1 rounded border border-purple-500/30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                        Go ask .com TLD
                                    </motion.div>
                                </>
                            )}

                            {/* ISP <-> TLD */}
                            {stage === 'tld_server' && (
                                <>
                                    <motion.div initial={{ top: "65%", left: "16%" }} animate={{ top: "50%", left: "83%" }} transition={{ duration: 0.7 }} className="absolute w-2 h-2 rounded-full bg-orange-400 shadow-[0_0_10px_#fb923c] -translate-x-1/2 -translate-y-1/2" />
                                    <motion.div initial={{ top: "50%", left: "83%" }} animate={{ top: "65%", left: "16%" }} transition={{ duration: 0.7, delay: 0.8 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-orange-400 bg-black/80 px-2 py-1 rounded border border-orange-500/30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                        Go ask ns1.google.com
                                    </motion.div>
                                </>
                            )}

                            {/* ISP <-> Auth */}
                            {stage === 'auth_server' && (
                                <>
                                    <motion.div initial={{ top: "65%", left: "16%" }} animate={{ top: "85%", left: "83%" }} transition={{ duration: 0.7 }} className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] -translate-x-1/2 -translate-y-1/2" />
                                    <motion.div initial={{ top: "85%", left: "83%" }} animate={{ top: "65%", left: "16%" }} transition={{ duration: 0.7, delay: 0.8 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-black/80 px-2 py-1 rounded border border-emerald-500/30 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap">
                                        IP: 142.250.190.46
                                    </motion.div>
                                </>
                            )}

                        </AnimatePresence>
                    </div>

                </div>

                {/* Logs */}
                <div className="h-40 bg-black border-t border-neutral-800 p-4 font-mono text-[11px] overflow-y-auto z-30 shrink-0 flex flex-col-reverse shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`mb-1.5 flex gap-2 ${log.type === 'error' ? 'text-red-400' :
                                    log.type === 'success' ? 'text-green-400' :
                                        log.type === 'warn' ? 'text-yellow-400' :
                                            log.type === 'req' ? 'text-cyan-400' :
                                                log.type === 'res' ? 'text-purple-400' :
                                                    'text-neutral-300'
                                    }`}
                            >
                                <span className="opacity-50 shrink-0"><ArrowRight size={12} /></span>
                                <span>{log.msg}</span>
                            </motion.div>
                        ))}
                        {logs.length === 0 && <span className="text-neutral-600">Click "Resolve Domain" to begin recursive DNS lookup...</span>}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
