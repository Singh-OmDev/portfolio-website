"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Code2, Database } from "lucide-react";

const STATUES = [
    { text: "Architecting Microservices", icon: Database, color: "text-blue-400" },
    { text: "Optimizing Serverless Functions", icon: Terminal, color: "text-amber-400" },
    { text: "Refactoring React Components", icon: Code2, color: "text-indigo-400" },
];

export default function IDEWidget() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % STATUES.length);
        }, 5000); // Rotate every 5 seconds
        return () => clearInterval(timer);
    }, []);

    const currentStatus = STATUES[currentIndex];
    const Icon = currentStatus.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="w-full max-w-sm"
        >
            <div className={`relative flex items-center gap-4 p-4 bg-neutral-900 dark:bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl overflow-hidden group`}>

                {/* Blue Glow Effect */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-blue-500/20 blur-[50px] rounded-full pointer-events-none" />

                {/* Icon */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-700/50 shadow-lg bg-[#007ACC] flex items-center justify-center text-white">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M23.15 2.587L18.21.21a1.494 1.494 0 0 0-1.705.29l-9.46 8.63-4.12-3.128a.999.999 0 0 0-1.276.057L.327 7.261A1 1 0 0 0 .326 8.74L3.899 12 .326 15.26a1 1 0 0 0 .001 1.479L1.65 17.94a.999.999 0 0 0 1.276.057l4.12-3.128 9.46 8.63a1.492 1.492 0 0 0 1.704.29l4.942-2.377A1.5 1.5 0 0 0 24 20.06V3.939a1.5 1.5 0 0 0-.85-1.352zm-5.146 14.861L10.826 12l7.178-5.448v10.896z" />
                    </svg>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">
                            VS Code Activity
                        </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                        Singh-OmDev Profile
                    </h3>

                    <div className="h-4 relative overflow-hidden flex items-center mt-0.5">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={currentIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-center gap-1.5 absolute inset-0 text-xs text-neutral-400"
                            >
                                <Icon size={12} className={currentStatus.color} />
                                <span className="truncate pr-2">{currentStatus.text}</span>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
