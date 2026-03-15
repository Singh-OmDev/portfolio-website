"use client";

import { useEffect, useState, useRef } from "react";
import { Eye } from "lucide-react";

export default function VisitorCounter() {
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
            // New visitor: Increment count via proxy
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
            // Return visitor: Just get the count (read-only) via proxy
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

    // if (loading) return null; // Commented out to ensure it ALWAYS renders, even if loading/failed
    // We want the user to see the badge, even if it says "..." or "0"


    return (
        <div className="fixed bottom-10 right-10 z-[100] group pointer-events-none select-none">
            {/* The Subtle Glow Effect */}
            <div 
                className="absolute inset-0 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-700 bg-neutral-400 dark:bg-white"
            />
            
            {/* The Main Pill */}
            <div className="relative flex items-center gap-2 px-6 py-2.5 bg-white/90 dark:bg-neutral-950/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full shadow-2xl text-sm font-medium tracking-tight">
                <span className="text-neutral-500 dark:text-neutral-400">
                    You are the <span className="font-mono font-bold text-neutral-900 dark:text-white tracking-wider">{count > 0 ? count.toLocaleString() : "..."}</span> th visitor
                </span>
            </div>
        </div>
    );
}
