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
        <div className="fixed bottom-10 right-10 z-[100] group">
            {/* The Animated Glow Effect */}
            <div 
                className="absolute inset-0 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-rainbow"
                style={{
                    background: "linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
                    backgroundSize: "200% auto",
                }}
            />
            
            {/* The Main Pill */}
            <div className="relative flex items-center gap-2 px-6 py-2.5 bg-neutral-950 border-[2px] border-transparent rounded-full shadow-2xl text-sm font-medium tracking-tight overflow-hidden p-[1px]">
                {/* Border Animation Layer */}
                <div 
                    className="absolute inset-0 animate-rainbow"
                    style={{
                        background: "linear-gradient(90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000)",
                        backgroundSize: "200% auto",
                        margin: "-2px",
                    }}
                />
                
                {/* Content Overlay */}
                <div className="relative flex items-center gap-2 px-5 py-2 bg-neutral-950 rounded-full w-full h-full">
                    <span className="text-neutral-300">
                        You are the <span className="font-mono font-bold text-white tracking-wider">{count > 0 ? count.toLocaleString() : "..."}</span> th visitor
                    </span>
                </div>
            </div>

            <style jsx>{`
                @keyframes rainbow {
                    0% { background-position: 0% 50%; }
                    100% { background-position: 200% 50%; }
                }
                .animate-rainbow {
                    animation: rainbow 3s linear infinite;
                }
            `}</style>
        </div>
    );
}
