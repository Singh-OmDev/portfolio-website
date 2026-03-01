"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, Server, User, Search, ShieldAlert, ArrowRight, ShieldCheck, Database, LayoutTemplate } from "lucide-react";

type RequestType = "auth" | "product" | "aggregate" | "malicious";
type Stage = "idle" | "gateway" | "processing" | "response" | "blocked";

export default function ApiGatewayDemo() {
    const [requestType, setRequestType] = useState<RequestType>("product");
    const [stage, setStage] = useState<Stage>("idle");
    const [activeServices, setActiveServices] = useState<string[]>([]);
    const [logs, setLogs] = useState<{ id: string; msg: string; type: "info" | "success" | "warn" | "error" }[]>([]);

    const addLog = (msg: string, type: "info" | "success" | "warn" | "error") => {
        setLogs(prev => [{ id: crypto.randomUUID(), msg, type }, ...prev].slice(0, 6));
    };

    const sendRequest = async () => {
        if (stage !== "idle" && stage !== "response" && stage !== "blocked") return;

        setStage("idle");
        setActiveServices([]);
        setLogs([]);
        await new Promise(r => setTimeout(r, 100));

        // 1. Hit Gateway
        setStage("gateway");
        addLog(`Client: Sent [${requestType.toUpperCase()}] request.`, "info");
        await new Promise(r => setTimeout(r, 800));

        // 2. Gateway Auth/Firewall Check
        if (requestType === "malicious") {
            addLog("API Gateway: WAF blocked malicious SQL payload.", "error");
            setStage("blocked");
            return;
        }

        addLog("API Gateway: Rate limit OK. Auth token OK.", "success");
        await new Promise(r => setTimeout(r, 600));

        // 3. Routing / Processing
        setStage("processing");
        if (requestType === "auth") {
            addLog("API Gateway: Routing to Auth Service (/api/users).", "info");
            setActiveServices(["auth"]);
            await new Promise(r => setTimeout(r, 1200));
        } else if (requestType === "product") {
            addLog("API Gateway: Routing to Product Service (/api/products).", "info");
            setActiveServices(["product"]);
            await new Promise(r => setTimeout(r, 1200));
        } else if (requestType === "aggregate") {
            addLog("API Gateway: Aggregation Required. Splitting request.", "warn");
            setActiveServices(["auth", "product", "inventory"]);
            await new Promise(r => setTimeout(r, 1500));
            addLog("API Gateway: Gathered responses and merged JSON.", "success");
        }

        // 4. Response
        setStage("response");
        setActiveServices([]);
        addLog("Client: Received 200 OK Response.", "success");
    };

    const isRunning = stage === "gateway" || stage === "processing";

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Network size={20} className="text-neutral-500" />
                        API Gateway
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        A single entry point for all clients. It handles cross-cutting concerns (Auth, Rate Limiting, WAF) at the edge, routes requests to the correct internal microservices, and can aggregate multiple backend responses into one payload.
                    </p>

                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Client Request Type</h4>
                    <div className="space-y-2 mb-8">
                        <ReqBtn
                            active={requestType === "product"}
                            onClick={() => setRequestType("product")}
                            icon={<Search size={14} />}
                            title="Simple Route (/api/product)"
                            disabled={isRunning}
                        />
                        <ReqBtn
                            active={requestType === "aggregate"}
                            onClick={() => setRequestType("aggregate")}
                            icon={<LayoutTemplate size={14} />}
                            title="Aggregation (/api/dashboard)"
                            disabled={isRunning}
                        />
                        <ReqBtn
                            active={requestType === "malicious"}
                            onClick={() => setRequestType("malicious")}
                            icon={<ShieldAlert size={14} />}
                            title="Malicious Payload"
                            disabled={isRunning}
                            color="red"
                        />
                    </div>
                </div>

                <button
                    onClick={sendRequest}
                    disabled={isRunning}
                    className="w-full bg-neutral-900 dark:bg-white text-white dark:text-black py-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all disabled:opacity-50 cursor-pointer text-sm"
                >
                    {isRunning ? "Processing..." : "Send Request"}
                </button>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col relative overflow-hidden font-mono min-h-[450px]">

                <div className="flex-1 flex items-center justify-center gap-12 relative z-10 w-full pl-8 pr-16 max-w-2xl mx-auto py-8">

                    {/* 1. Client */}
                    <div className="flex flex-col items-center gap-2 relative">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-neutral-700 bg-neutral-800 text-neutral-400 relative z-20 transition-all ${stage === 'response' ? 'border-green-500 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.3)]' : ''}`}>
                            <User size={24} />

                            {/* Animated Outbound Packet */}
                            <AnimatePresence>
                                {stage === 'gateway' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 0 }}
                                        animate={{ opacity: 1, x: 100 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-30 ${requestType === 'malicious' ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`}
                                    />
                                )}
                            </AnimatePresence>

                            {/* Animated Inbound Packet */}
                            <AnimatePresence>
                                {stage === 'response' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8 }}
                                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-30 bg-green-500 shadow-[0_0_10px_#22c55e]"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-500">Client</span>
                    </div>

                    {/* 2. Gateway Node */}
                    <div className="flex flex-col items-center gap-2 relative">
                        <div className={`w-28 py-6 rounded-2xl flex flex-col items-center justify-center border border-indigo-500/50 bg-indigo-500/10 text-indigo-400 z-10 relative transition-all duration-300 ${stage === 'gateway' || stage === 'processing' ? 'shadow-[0_0_30px_rgba(99,102,241,0.2)] border-indigo-400' :
                                stage === 'blocked' ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : ''
                            }`}>
                            {stage === 'blocked' ? <ShieldAlert size={28} className="mb-2 animate-bounce" /> : <Network size={28} className="mb-2" />}
                            <span className="text-xs font-bold leading-none">API Gateway</span>
                            <span className="text-[9px] mt-1 opacity-70">Kong/NGINX</span>

                            {/* WAF/Auth Check Indicator */}
                            {(stage === 'gateway' || stage === 'blocked') && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute -top-3 -right-3">
                                    {stage === 'blocked' ?
                                        <div className="bg-red-500 text-white rounded-full p-1 shadow-lg animate-pulse"><ShieldAlert size={12} /></div> :
                                        <div className="bg-green-500 text-white rounded-full p-1 shadow-lg"><ShieldCheck size={12} /></div>
                                    }
                                </motion.div>
                            )}

                            {/* Scatter-Gather packet animations */}
                            <AnimatePresence>
                                {stage === 'processing' && requestType === 'aggregate' && (
                                    <>
                                        {/* To top service */}
                                        <motion.div initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: 1, x: 100, y: -65 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }} className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-yellow-400 shadow-[0_0_10px_#facc15] rounded-full z-0" />
                                        {/* To middle service */}
                                        <motion.div initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: 1, x: 100, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.2, repeat: Infinity, repeatType: "reverse" }} className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-yellow-400 shadow-[0_0_10px_#facc15] rounded-full z-0" />
                                        {/* To bottom service */}
                                        <motion.div initial={{ opacity: 0, x: 0, y: 0 }} animate={{ opacity: 1, x: 100, y: 65 }} exit={{ opacity: 0 }} transition={{ duration: 0.8, delay: 0.1, repeat: Infinity, repeatType: "reverse" }} className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-yellow-400 shadow-[0_0_10px_#facc15] rounded-full z-0" />
                                    </>
                                )}
                                {stage === 'processing' && requestType !== 'aggregate' && (
                                    <motion.div
                                        initial={{ opacity: 0, x: 0, y: 0 }}
                                        animate={{ opacity: 1, x: 100, y: requestType === 'auth' ? -65 : requestType === 'product' ? 0 : 0 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                                        className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-indigo-400 shadow-[0_0_10px_#818cf8] rounded-full z-0"
                                    />
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* 3. Microservices Base */}
                    <div className="flex flex-col gap-6 relative z-10">
                        <ServiceNode name="Auth API" icon={<ShieldCheck size={16} />} active={activeServices.includes("auth")} />
                        <ServiceNode name="Product API" icon={<Database size={16} />} active={activeServices.includes("product")} />
                        <ServiceNode name="Inventory API" icon={<Server size={16} />} active={activeServices.includes("inventory")} />
                    </div>

                    {/* Network Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none -z-10" style={{ strokeDasharray: "4 4" }}>
                        {/* Client to Gateway */}
                        <path d="M 0 0" /> {/* Just placeholder, usually easier to use absolute pos divs for straight lines */}
                        <line x1="20%" y1="50%" x2="40%" y2="50%" className="stroke-neutral-800" strokeWidth="2" />

                        {/* Gateway to Services */}
                        <line x1="55%" y1="50%" x2="70%" y2="25%" className={activeServices.includes("auth") ? "stroke-indigo-500/50" : "stroke-neutral-800"} strokeWidth="2" />
                        <line x1="55%" y1="50%" x2="70%" y2="50%" className={activeServices.includes("product") ? "stroke-indigo-500/50" : "stroke-neutral-800"} strokeWidth="2" />
                        <line x1="55%" y1="50%" x2="70%" y2="75%" className={activeServices.includes("inventory") ? "stroke-indigo-500/50" : "stroke-neutral-800"} strokeWidth="2" />
                    </svg>

                </div>

                {/* Logs Terminal */}
                <div className="h-32 bg-black border-t border-neutral-800 p-4 overflow-y-auto space-y-1 mt-auto shrink-0 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] relative">
                    <div className="absolute top-2 right-4 text-[9px] text-neutral-600 uppercase tracking-widest hidden md:block">Edge Logs</div>
                    <AnimatePresence>
                        {logs.length === 0 && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-neutral-600 italic">Waiting for connection...</motion.span>
                        )}
                        {logs.map(log => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                                className={`text-[11px] flex gap-2 ${log.type === 'error' ? 'text-red-400' : log.type === 'success' ? 'text-green-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-neutral-300'}`}
                            >
                                <span className="opacity-50">&gt;</span> {log.msg}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

function ServiceNode({ name, icon, active }: { name: string, icon: React.ReactNode, active: boolean }) {
    return (
        <div className={`p-3 rounded-xl border flex items-center gap-3 transition-all duration-300 bg-neutral-900 ${active ? 'border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)]' : 'border-neutral-800 opacity-60'
            }`}>
            <div className={active ? 'text-indigo-400 animate-pulse' : 'text-neutral-500'}>{icon}</div>
            <span className={`text-[10px] uppercase font-bold tracking-wider ${active ? 'text-indigo-300' : 'text-neutral-500'}`}>{name}</span>
        </div>
    )
}

function ReqBtn({ active, onClick, icon, title, disabled, color = "indigo" }: any) {
    const isRed = color === "red";
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full text-left p-3 rounded-xl border transition-all flex items-center gap-3 ${active
                    ? (isRed ? 'border-red-500 bg-red-500/10' : 'border-indigo-500 bg-indigo-500/10')
                    : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 cursor-pointer opacity-70 hover:opacity-100 disabled:opacity-40 disabled:cursor-not-allowed'
                }`}
        >
            <div className={`p-1.5 rounded-lg ${active ? (isRed ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400') : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'}`}>
                {icon}
            </div>
            <div className={`text-xs font-bold ${active ? (isRed ? 'text-red-500' : 'text-indigo-300') : 'text-neutral-700 dark:text-neutral-300'}`}>
                {title}
            </div>
        </button>
    );
}
