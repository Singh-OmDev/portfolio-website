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
        <div className="fixed bottom-10 right-10 z-50 flex items-center gap-2 px-3 py-1.5 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full shadow-2xl text-xs font-medium text-neutral-600 dark:text-neutral-400 pointer-events-none select-none animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Eye size={14} className="opacity-70" />
            <span>
                Visitor <span className="font-mono font-bold text-black dark:text-white">{count > 0 ? count.toLocaleString() : "..."}</span>
            </span>
        </div>
    );
}
