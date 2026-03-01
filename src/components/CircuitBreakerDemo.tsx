"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, PowerOff, RefreshCw, XCircle, CheckCircle2, ShieldAlert } from "lucide-react";

type CircuitState = "CLOSED" | "OPEN" | "HALF_OPEN";
type LogStatus = "ok" | "fail" | "blocked";

export default function CircuitBreakerDemo() {
    const [circuitState, setCircuitState] = useState<CircuitState>("CLOSED");
    const [serviceHealthy, setServiceHealthy] = useState(true);
    const [log, setLog] = useState<{ id: string, msg: string, status: LogStatus }[]>([]);
    const [failureCount, setFailureCount] = useState(0);

    const THRESHOLD = 3; // Break after 3 failures
    const RECOVERY_TIMEOUT = 5000; // Wait 5s before half-open

    // Circuit Breaker State Machine Logic
    useEffect(() => {
        if (circuitState === "CLOSED" && failureCount >= THRESHOLD) {
            setCircuitState("OPEN");
        }
    }, [failureCount, circuitState]);

    useEffect(() => {
        if (circuitState === "OPEN") {
            const timer = setTimeout(() => {
                setCircuitState("HALF_OPEN");
            }, RECOVERY_TIMEOUT);
            return () => clearTimeout(timer);
        }
    }, [circuitState]);

    const sendRequest = () => {
        const id = crypto.randomUUID();

        // 1. OPEN STATE: Instantly block requests
        if (circuitState === "OPEN") {
            setLog(prev => [{ id, msg: "FAIL FAST - Circuit is OPEN", status: "blocked" as LogStatus }, ...prev].slice(0, 8));
            return;
        }

        // 2. HALF-OPEN STATE: Allow 1 test request through
        if (circuitState === "HALF_OPEN") {
            if (serviceHealthy) {
                // Success! Close the circuit.
                setCircuitState("CLOSED");
                setFailureCount(0);
                setLog(prev => [{ id, msg: "TEST OK - Circuit CLOSED", status: "ok" as LogStatus }, ...prev].slice(0, 8));
            } else {
                // Failed again! Re-open immediately.
                setCircuitState("OPEN");
                setLog(prev => [{ id, msg: "TEST FAILED - Circuit RE-OPENED", status: "fail" as LogStatus }, ...prev].slice(0, 8));
            }
            return;
        }

        // 3. CLOSED STATE: Normal Operation
        if (serviceHealthy) {
            setLog(prev => [{ id, msg: "200 OK - Downstream Success", status: "ok" as LogStatus }, ...prev].slice(0, 8));
            // Heal any previous minor failures if we get a success
            if (failureCount > 0) setFailureCount(0);
        } else {
            setFailureCount(prev => prev + 1);
            setLog(prev => [{ id, msg: "503 ERR - Downstream Timeout", status: "fail" as LogStatus }, ...prev].slice(0, 8));
        }
    };

    const toggleService = () => setServiceHealthy(!serviceHealthy);

    // Dynamic UI styling based on state
    const stateColors = {
        CLOSED: "bg-green-500/20 text-green-600 border-green-500/30",
        OPEN: "bg-red-500/20 text-red-600 border-red-500/30",
        HALF_OPEN: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30"
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* Control Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-neutral-500" />
                            API Gateway
                        </h3>
                        <div className={`px-3 py-1 text-xs font-bold rounded-full border tracking-wide ${stateColors[circuitState]}`}>
                            {circuitState.replace("_", "-")}
                        </div>
                    </div>

                    {/* Downstream Service Toggle */}
                    <div className="mb-8 p-6 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                            <span className="font-mono text-sm text-neutral-600 dark:text-neutral-400">Mock Downstream Service</span>
                            <span className={`flex items-center gap-1.5 text-xs font-medium ${serviceHealthy ? 'text-green-500' : 'text-red-500'}`}>
                                <span className={`h-2 w-2 rounded-full ${serviceHealthy ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                                {serviceHealthy ? 'Healthy' : 'Failing'}
                            </span>
                        </div>
                        <button
                            onClick={toggleService}
                            className={`w-full py-2.5 rounded-lg border text-sm font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer
                                ${serviceHealthy
                                    ? 'border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950'
                                    : 'border-green-500/50 text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
                                }`}
                        >
                            <PowerOff size={16} />
                            Bring Service {serviceHealthy ? 'DOWN' : 'UP'}
                        </button>
                    </div>
                </div>

                {/* Fire Request Button */}
                <button
                    onClick={sendRequest}
                    className="w-full relative overflow-hidden bg-neutral-900 dark:bg-white text-white dark:text-black py-4 px-6 rounded-full font-medium transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm hover:shadow-md cursor-pointer"
                >
                    <RefreshCw size={18} />
                    <span>Send Request</span>
                </button>
            </div>

            {/* Terminal / Log */}
            <div className="bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col font-mono relative overflow-hidden h-[350px]">
                {/* Visual Trip Wire */}
                <div className={`absolute top-0 left-0 w-full h-1 transition-all duration-300
                    ${circuitState === 'CLOSED' ? 'bg-gradient-to-r from-transparent via-green-500/50 to-transparent opacity-50' : ''}
                    ${circuitState === 'OPEN' ? 'bg-gradient-to-r from-red-500/80 via-red-500 to-red-500/80 animate-pulse' : ''}
                    ${circuitState === 'HALF_OPEN' ? 'bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent opacity-50' : ''}
                `}></div>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-800">
                    <span className="text-neutral-400 text-sm">gateway_router.log</span>
                    {circuitState === "CLOSED" && failureCount > 0 && (
                        <span className="text-red-400 text-xs">Failures: {failureCount}/{THRESHOLD}</span>
                    )}
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div className="absolute inset-0 overflow-y-auto pr-2 space-y-3 pb-4 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
                        <AnimatePresence initial={false}>
                            {log.length === 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-neutral-600 text-sm italic mt-4"
                                >
                                    Awaiting incoming traffic...
                                </motion.p>
                            )}

                            {log.map((entry) => (
                                <motion.div
                                    key={entry.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className="text-sm flex items-center gap-3"
                                >
                                    {entry.status === "ok" && <CheckCircle2 size={16} className="text-green-500 shrink-0" />}
                                    {entry.status === "fail" && <XCircle size={16} className="text-red-500 shrink-0" />}
                                    {entry.status === "blocked" && <ShieldAlert size={16} className="text-yellow-500 shrink-0" />}

                                    <span className={
                                        entry.status === "ok" ? "text-green-400" :
                                            entry.status === "fail" ? "text-red-400" : "text-yellow-400"
                                    }>
                                        {entry.msg}
                                    </span>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
