"use client";

import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";

export default function VisitorCounter({ isInline = false }: { isInline?: boolean }) {
    const [count, setCount] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const hasFetched = useRef(false);

    useEffect(() => {
        if (hasFetched.current) return;
        hasFetched.current = true;

        const namespace = "minimal-portfolio-omsingh";
        const key = "visits";
        const localStorageKey = `visited_${namespace}_${key}`;

        const hasVisited = localStorage.getItem(localStorageKey);

        if (!hasVisited) {
            fetch("/api/visitor?action=up")
                .then((res) => res.json())
                .then((data) => {
                    setCount(data.count);
                    setLoading(false);
                    localStorage.setItem(localStorageKey, "true");
                })
                .catch((err) => {
                    console.error("Error incrementing visitor count:", err);
                    setLoading(false);
                });
        } else {
            fetch("/api/visitor")
                .then((res) => res.json())
                .then((data) => {
                    setCount(data.count);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error("Error fetching visitor count:", err);
                    setLoading(false);
                });
        }
    }, []);

    const containerClasses = isInline 
        ? "relative flex items-center justify-center gap-2 px-4 py-1.5 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-full select-none cursor-default"
        : "fixed bottom-24 md:bottom-8 right-8 z-[100] group cursor-default select-none pointer-events-auto";

    return (
        <div className={containerClasses}>
            {!isInline && (
                <div className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-10 transition-opacity duration-1000 bg-white" />
            )}
            
            <div className={isInline ? "flex items-center gap-2" : "relative flex items-center gap-2.5 px-5 py-2 bg-white/5 dark:bg-black/40 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-full shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] overflow-hidden transition-all duration-500 group-hover:border-white/20 group-hover:bg-white/10 group-hover:-translate-y-1"}>
                {!isInline && (
                    <div className="absolute inset-0 w-full h-full animate-shimmer pointer-events-none" 
                        style={{
                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)",
                            transform: "translateX(-100%)",
                        }}
                    />
                )}

                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)] animate-pulse" />

                <span className="text-[10px] md:text-[11px] font-medium tracking-widest uppercase text-neutral-500 dark:text-neutral-400">
                    Visitor <span className="text-neutral-900 dark:text-neutral-100 font-bold ml-1">{count > 0 ? count.toLocaleString() : "..."}</span>
                </span>
            </div>

            {!isInline && (
                <style jsx>{`
                    @keyframes shimmer {
                        0% { transform: translateX(-100%); }
                        30%, 100% { transform: translateX(100%); }
                    }
                    .animate-shimmer {
                        animation: shimmer 4s ease-in-out infinite;
                    }
                `}</style>
            )}
        </div>
    );
}
