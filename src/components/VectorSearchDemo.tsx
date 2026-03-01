"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Database, Fingerprint, Crosshair } from "lucide-react";

// Mock 2D embeddings for visualization
interface VectorItem {
    id: string;
    text: string;
    x: number;
    y: number; // Values 0 to 100 for percentage positioning
    color: string;
}

const KNOWLEDGE_BASE: VectorItem[] = [
    { id: "1", text: "Dog", x: 20, y: 80, color: "bg-orange-500" },
    { id: "2", text: "Puppy", x: 25, y: 75, color: "bg-orange-400" },
    { id: "3", text: "Cat", x: 30, y: 85, color: "bg-orange-600" },
    { id: "4", text: "Car", x: 80, y: 20, color: "bg-blue-500" },
    { id: "5", text: "Truck", x: 85, y: 25, color: "bg-blue-600" },
    { id: "6", text: "Bus", x: 75, y: 15, color: "bg-blue-400" },
    { id: "7", text: "Apple", x: 20, y: 20, color: "bg-red-500" },
    { id: "8", text: "Banana", x: 25, y: 15, color: "bg-yellow-500" },
    { id: "9", text: "Orange", x: 15, y: 25, color: "bg-orange-500" },
];

export default function VectorSearchDemo() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [queryVector, setQueryVector] = useState<{ x: number, y: number } | null>(null);
    const [results, setResults] = useState<{ item: VectorItem, distance: number }[]>([]);

    // Simulated embedding model
    const getEmbedding = (text: string) => {
        const t = text.toLowerCase();
        // Fake mapping for demo purposes
        if (t.includes("dog") || t.includes("pet") || t.includes("animal")) return { x: 22, y: 78 };
        if (t.includes("car") || t.includes("vehicle") || t.includes("drive")) return { x: 78, y: 22 };
        if (t.includes("fruit") || t.includes("food") || t.includes("eat")) return { x: 22, y: 22 };

        // Random fallback if no match, hash the string to coordinates
        let hash = 0;
        for (let i = 0; i < t.length; i++) {
            hash = t.charCodeAt(i) + ((hash << 5) - hash);
        }
        return {
            x: Math.abs((hash % 80) + 10),
            y: Math.abs(((hash >> 8) % 80) + 10)
        };
    };

    const calculateDistance = (v1: { x: number, y: number }, v2: { x: number, y: number }) => {
        return Math.sqrt(Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2));
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim() || isSearching) return;

        setIsSearching(true);
        setQueryVector(null);
        setResults([]);

        // 1. Convert text to embeddings (Mock)
        setTimeout(() => {
            const vector = getEmbedding(query);
            setQueryVector(vector);

            // 2. Perform KNN Search (Mock calculated distances)
            setTimeout(() => {
                const distances = KNOWLEDGE_BASE.map(item => ({
                    item,
                    distance: calculateDistance(vector, { x: item.x, y: item.y })
                })).sort((a, b) => a.distance - b.distance).slice(0, 3); // Get Top 3 K-Nearest Neighbors

                setResults(distances);
                setIsSearching(false);
            }, 800);
        }, 600);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-h-[500px]">
            {/* Input & Results Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between">
                <div>
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Brain size={20} className="text-neutral-500" />
                            Vector Search
                        </h3>
                    </div>

                    <form onSubmit={handleSearch} className="mb-8">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Try 'pet', 'vehicle', or 'fruit'..."
                                className="w-full bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl py-4 pl-4 pr-12 outline-none focus:ring-2 focus:ring-purple-500 transition-shadow dark:text-white"
                            />
                            <button
                                type="submit"
                                disabled={isSearching || !query.trim()}
                                className="absolute right-2 top-2 bottom-2 aspect-square bg-purple-500 text-white rounded-lg flex items-center justify-center hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <Search size={18} />
                            </button>
                        </div>
                    </form>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <Fingerprint size={14} /> Semantic Results
                        </h4>

                        <div className="space-y-3">
                            {results.length === 0 && !isSearching && (
                                <p className="text-sm text-neutral-400 italic">Enter a query to find semantically similar items, rather than exact keyword matches.</p>
                            )}
                            {isSearching && results.length === 0 && (
                                <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex gap-3 animate-pulse">
                                    <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800"></div>
                                    <div className="flex-1 space-y-2 py-1">
                                        <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded w-1/2"></div>
                                        <div className="h-2 bg-neutral-200 dark:bg-neutral-800 rounded w-1/4"></div>
                                    </div>
                                </div>
                            )}
                            <AnimatePresence>
                                {results.map((result, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${result.item.color}`}>
                                                {idx + 1}
                                            </div>
                                            <span className="font-medium text-neutral-800 dark:text-neutral-200">{result.item.text}</span>
                                        </div>
                                        <div className="text-xs font-mono text-neutral-500">
                                            Dist: {result.distance.toFixed(1)}
                                        </div>
                                    </motion.div>
                                ))}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>

            {/* 2D Vector Space Visualization */ }
    <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 relative overflow-hidden flex flex-col">
        <div className="flex items-center justify-between mb-4 z-10">
            <span className="text-neutral-400 text-sm font-mono flex items-center gap-2">
                <Database size={16} /> 2D Vector Embedding Space
            </span>
        </div>

        {/* Grid UI */}
        <div className="flex-1 relative border border-neutral-800 rounded-xl overflow-hidden bg-black/50">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none opacity-20">
                {Array.from({ length: 16 }).map((_, i) => (
                    <div key={i} className="border border-neutral-700"></div>
                ))}
            </div>

            {/* Data Points */}
            {KNOWLEDGE_BASE.map(item => (
                <div
                    key={item.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group"
                    style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        >
            <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`} />
            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900/80 px-1 rounded opacity-50 group-hover:opacity-100">{item.text}</span>
        </div>
                    ))}

        {/* Query Point and Search Radius */}
        <AnimatePresence>
            {queryVector && (
                <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
                    style={{ left: `${queryVector.x}%`, top: `${queryVector.y}%` }}
                            >
            <div className="relative flex items-center justify-center">
                <Crosshair size={24} className="text-purple-500 animate-pulse absolute" />

                {/* Scan Radius */}
                {results.length > 0 && (
                    <motion.div
                        initial={{ width: 0, height: 0, opacity: 1 }}
                        animate={{
                            width: `${results[results.length - 1].distance * 2}%`,
                height: `${results[results.length - 1].distance * 2}%`,
                opacity: 0.1 
                                            }}
                className="absolute border border-purple-500 bg-purple-500 rounded-full"
                style={{
                    // Adjust visual radius so it's a circle matching aspect ratio roughly
                    aspectRatio: '1/1'
                }}
                                        />
                                    )}
            </div>
            <span className="absolute top-4 left-4 text-xs font-bold text-purple-400 drop-shadow-md whitespace-nowrap bg-black/50 px-1 rounded">Query: "{query}"</span>
        </motion.div>
                        )}
    </AnimatePresence>
                </div >

        <p className="text-[10px] text-neutral-500 text-center mt-4">
            Text is converted into numerical coordinates. 'Nearest Neighbors' are found using geometry (e.g., Cosine Similarity or Euclidean Distance), not keyword matching.
        </p>
            </div >
        </div >
    );
}
