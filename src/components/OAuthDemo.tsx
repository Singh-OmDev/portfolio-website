"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Globe, KeyRound, ArrowRight, ShieldCheck, Github, Smartphone, Copy } from "lucide-react";

type Stage = "idle" | "req_auth" | "user_grant" | "auth_code" | "token_exchange" | "api_req" | "done";

export default function OAuthDemo() {
    const [stage, setStage] = useState<Stage>("idle");
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" | "code" }[]>([]);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error" | "code") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 7));
    };

    const runFlow = async () => {
        if (stage !== "idle" && stage !== "done") return;

        setStage("idle");
        setLogs([]);
        await new Promise(r => setTimeout(r, 200));

        // 1. Client requests authorization
        setStage("req_auth");
        addLog("Client: Redirecting user to Auth Server (github.com/login/oauth/authorize)...", "info");
        await new Promise(r => setTimeout(r, 1500));

        // 2. User grants permission
        setStage("user_grant");
        addLog("User: Clicks 'Authorize App'.", "success");
        await new Promise(r => setTimeout(r, 1500));

        // 3. Auth Server returns Auth Code
        setStage("auth_code");
        addLog("Auth Server: Redirects back with Authorization Code.", "info");
        addLog("?code=ghO_ab12cd34ef56gh78ij90", "code");
        await new Promise(r => setTimeout(r, 2000));

        // 4. Token Exchange (Backend)
        setStage("token_exchange");
        addLog("Client Backend: Exchanging Code + Client Secret for Access Token...", "warn");
        await new Promise(r => setTimeout(r, 2000));
        addLog("Auth Server: Returned Access Token.", "success");
        addLog("gho_1234567890abcdefghijklmnopqrstuvwxyz", "code");
        await new Promise(r => setTimeout(r, 1000));

        // 5. API Request
        setStage("api_req");
        addLog("Client: Fetching User Profile using Access Token...", "info");
        await new Promise(r => setTimeout(r, 1500));

        // 6. Done
        setStage("done");
        addLog("Resource Server: 200 OK. { name: 'Om Singh', repos: 42 }", "success");
    };

    const isRunning = stage !== "idle" && stage !== "done";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Lock size={20} className="text-neutral-500" />
                        OAuth 2.0 (Auth Code Flow)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        The industry-standard protocol for authorization. It allows a Third-Party Application to obtain limited access to a user's account on an HTTP service (like GitHub or Google), without the user ever giving their password to the Third-Party App.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 font-mono text-[10px] space-y-2">
                        <div className="flex justify-between items-center"><span className="text-neutral-500">Client ID:</span> <span className="text-indigo-500">app_12345</span></div>
                        <div className="flex justify-between items-center"><span className="text-neutral-500">Scope:</span> <span className="text-yellow-500">read:user</span></div>
                        <div className="flex justify-between items-center"><span className="text-neutral-500">Redirect URI:</span> <span className="text-emerald-500">/callback</span></div>
                    </div>
                </div>

                <button
                    onClick={runFlow}
                    disabled={isRunning}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                    {isRunning ? "OAuth Flow Running..." : "Login with GitHub"}
                </button>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-8 relative z-10 w-full px-4 md:px-12 py-8">

                    {/* Client Side (Left) */}
                    <div className="flex flex-col items-center gap-12 relative w-full md:w-auto">

                        {/* User */}
                        <div className={`flex flex-col items-center gap-2 relative transition-all duration-300 ${stage === 'user_grant' ? 'scale-110' : ''}`}>
                            <div className={`w-14 h-14 rounded-full flex items-center justify-center border-2 border-neutral-700 bg-neutral-800 text-neutral-400 relative z-20 ${stage === 'user_grant' ? 'border-yellow-400 text-yellow-300 shadow-[0_0_20px_rgba(250,204,21,0.3)]' : ''}`}>
                                <User size={24} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-neutral-400">Resource Owner</span>
                        </div>

                        {/* Client App */}
                        <div className={`flex flex-col items-center gap-2 relative transition-all duration-300 ${['req_auth', 'auth_code', 'token_exchange', 'api_req', 'done'].includes(stage) ? 'scale-110' : ''}`}>
                            <div className="w-24 py-4 rounded-xl border-2 border-indigo-500/50 bg-indigo-500/10 text-indigo-400 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                                <Smartphone size={28} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-indigo-400 text-center">Your App<br /><span className="text-[8px] font-normal opacity-70">(Client)</span></span>
                        </div>

                    </div>

                    {/* Server Side (Right) */}
                    <div className="flex flex-col items-center gap-12 relative w-full md:w-auto">

                        {/* Auth Server */}
                        <div className={`flex flex-col items-center gap-2 relative transition-all duration-300 ${['req_auth', 'user_grant', 'auth_code', 'token_exchange'].includes(stage) ? 'scale-110' : ''}`}>
                            <div className="w-24 py-4 rounded-xl border-2 border-emerald-500/50 bg-emerald-500/10 text-emerald-400 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                                <Github size={28} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-emerald-400 text-center">GitHub Auth<br /><span className="text-[8px] font-normal opacity-70">(Auth Server)</span></span>
                        </div>

                        {/* Resource Server */}
                        <div className={`flex flex-col items-center gap-2 relative transition-all duration-300 ${['api_req', 'done'].includes(stage) ? 'scale-110' : ''}`}>
                            <div className="w-24 py-4 rounded-xl border-2 border-blue-500/50 bg-blue-500/10 text-blue-400 flex items-center justify-center z-20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                                <Globe size={28} />
                            </div>
                            <span className="text-[10px] uppercase font-bold text-blue-400 text-center">GitHub API<br /><span className="text-[8px] font-normal opacity-70">(Resource Srv)</span></span>
                        </div>

                    </div>

                    {/* Network Animations (Absolute Center overlay) */}
                    <div className="absolute inset-0 pointer-events-none z-0">
                        <AnimatePresence>
                            {/* Client -> Auth Server (Request Auth) */}
                            {stage === 'req_auth' && (
                                <motion.div initial={{ left: "25%", top: "75%" }} animate={{ left: "75%", top: "25%" }} transition={{ duration: 1.5 }} className="absolute w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
                            )}

                            {/* Auth Server <-> User (Consent) */}
                            {stage === 'user_grant' && (
                                <>
                                    <motion.div initial={{ left: "75%", top: "25%" }} animate={{ left: "25%", top: "25%" }} transition={{ duration: 0.7 }} className="absolute w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                                    <motion.div initial={{ left: "25%", top: "25%" }} animate={{ left: "75%", top: "25%" }} transition={{ duration: 0.7, delay: 0.8 }} className="absolute w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_#facc15]" />
                                </>
                            )}

                            {/* Auth Server -> Client (Auth Code) */}
                            {stage === 'auth_code' && (
                                <motion.div initial={{ left: "75%", top: "25%" }} animate={{ left: "25%", top: "75%" }} transition={{ duration: 1.5 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-black/50 px-1 py-0.5 rounded border border-emerald-500/30">
                                    <Copy size={8} /> Auth Code
                                </motion.div>
                            )}

                            {/* Client <-> Auth Server (Token Exchange) */}
                            {stage === 'token_exchange' && (
                                <>
                                    {/* Code goes up (Client Secret hidden backend channel) */}
                                    <motion.div initial={{ left: "25%", top: "75%" }} animate={{ left: "75%", top: "25%" }} transition={{ duration: 1 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-orange-400 bg-black/50 px-1 py-0.5 rounded border border-orange-500/30">
                                        <ShieldCheck size={8} /> Code + Secret
                                    </motion.div>
                                    {/* Token comes back */}
                                    <motion.div initial={{ left: "75%", top: "25%" }} animate={{ left: "25%", top: "75%" }} transition={{ duration: 1, delay: 1 }} className="absolute flex items-center gap-1 text-[8px] font-bold text-emerald-400 bg-black/50 px-1 py-0.5 rounded border border-emerald-500/30">
                                        <KeyRound size={8} /> Access Token
                                    </motion.div>
                                </>
                            )}

                            {/* Client <-> Resource Server (API Data) */}
                            {stage === 'api_req' && (
                                <>
                                    <motion.div initial={{ left: "25%", top: "75%" }} animate={{ left: "75%", top: "75%" }} transition={{ duration: 0.7 }} className="absolute w-2 h-2 bg-indigo-400 rounded-full shadow-[0_0_10px_#818cf8]" />
                                    <motion.div initial={{ left: "75%", top: "75%" }} animate={{ left: "25%", top: "75%" }} transition={{ duration: 0.7, delay: 0.8 }} className="absolute w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_#60a5fa]" />
                                </>
                            )}
                        </AnimatePresence>
                    </div>

                </div>

                {/* Logs */}
                <div className="h-40 bg-black border-t border-neutral-800 p-4 font-mono text-[11px] overflow-y-auto z-30 shrink-0 flex flex-col-reverse">
                    <AnimatePresence>
                        {logs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`mb-1.5 flex gap-2 ${log.type === 'error' ? 'text-red-400' :
                                        log.type === 'success' ? 'text-green-400' :
                                            log.type === 'warn' ? 'text-yellow-400' :
                                                log.type === 'code' ? 'text-neutral-400 bg-neutral-900 border border-neutral-800 px-2 py-0.5 rounded-md inline-flex w-fit' :
                                                    'text-neutral-300'
                                    }`}
                            >
                                {log.type !== 'code' && <ArrowRight size={10} className="mt-1 opacity-50 shrink-0" />}
                                <span>{log.msg}</span>
                            </motion.div>
                        ))}
                        {logs.length === 0 && <span className="text-neutral-600">Click "Login" to begin OAuth sequence...</span>}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
