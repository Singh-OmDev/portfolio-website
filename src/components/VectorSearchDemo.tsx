"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Search, Database, Fingerprint, Crosshair, HelpCircle } from "lucide-react";

// Mock 2D embeddings for visualization
interface VectorItem {
    id: string;
    text: string;
    x: number;
    y: number; // Values 0 to 100 for percentage positioning
    color: string;
}

const KNOWLEDGE_BASE: VectorItem[] = [
    // Animal Cluster
    { id: "1", text: "Dog", x: 20, y: 80, color: "bg-orange-500" },
    { id: "2", text: "Puppy", x: 25, y: 75, color: "bg-orange-400" },
    { id: "3", text: "Cat", x: 30, y: 85, color: "bg-orange-600" },
    { id: "10", text: "Wolf", x: 15, y: 85, color: "bg-orange-700" },
    // Vehicle Cluster
    { id: "4", text: "Car", x: 80, y: 20, color: "bg-blue-500" },
    { id: "5", text: "Truck", x: 85, y: 25, color: "bg-blue-600" },
    { id: "6", text: "Bus", x: 75, y: 15, color: "bg-blue-400" },
    { id: "11", text: "Bicycle", x: 70, y: 25, color: "bg-blue-300" },
    // Food/Fruit Cluster
    { id: "7", text: "Apple", x: 20, y: 20, color: "bg-red-500" },
    { id: "8", text: "Banana", x: 25, y: 15, color: "bg-yellow-500" },
    { id: "9", text: "Orange", x: 15, y: 25, color: "bg-orange-500" },
    { id: "12", text: "Burger", x: 30, y: 25, color: "bg-amber-600" },
    // Technology Cluster
    { id: "13", text: "Computer", x: 80, y: 80, color: "bg-purple-500" },
    { id: "14", text: "Phone", x: 75, y: 85, color: "bg-purple-400" },
    { id: "15", text: "Robot", x: 85, y: 75, color: "bg-purple-600" },
];

// A dictionary of exact mappings and common typos to simulate an embedding model's vocabulary
const DICTIONARY: Record<string, { x: number, y: number }> = {
    // Animals
    "dog": { x: 20, y: 80 }, "pet": { x: 25, y: 80 }, "animal": { x: 25, y: 85 },
    "puppy": { x: 25, y: 75 }, "cat": { x: 30, y: 85 }, "wolf": { x: 15, y: 85 },
    // Vehicles
    "car": { x: 80, y: 20 }, "vehicle": { x: 80, y: 25 }, "vechile": { x: 80, y: 25 }, /* typo */
    "truck": { x: 85, y: 25 }, "bus": { x: 75, y: 15 }, "drive": { x: 75, y: 20 },
    // Foods
    "fruit": { x: 20, y: 20 }, "fruite": { x: 20, y: 20 }, /* typo */ "food": { x: 25, y: 25 },
    "apple": { x: 20, y: 20 }, "banana": { x: 25, y: 15 }, "orange": { x: 15, y: 25 }, "burger": { x: 30, y: 25 },
    // Tech
    "computer": { x: 80, y: 80 }, "tech": { x: 80, y: 85 }, "phone": { x: 75, y: 85 }, "robot": { x: 85, y: 75 }
};

export default function VectorSearchDemo() {
    const [query, setQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [queryVector, setQueryVector] = useState<{ x: number, y: number } | null>(null);
    const [results, setResults] = useState<{ item: VectorItem, distance: number }[]>([]);
    const [breakdown, setBreakdown] = useState<{ word: string, x: number, y: number }[]>([]);

    // Simulated embedding model
    const getEmbedding = (text: string) => {
        const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/).filter(w => w.length > 0);
        const vectors: { word: string, x: number, y: number }[] = [];

        words.forEach(w => {
            if (DICTIONARY[w]) {
                vectors.push({ word: w, x: DICTIONARY[w].x, y: DICTIONARY[w].y });
            } else {
                // Determine a pseudo-random coordinate based on the word characters
                let hash = 0;
                for (let i = 0; i < w.length; i++) hash = w.charCodeAt(i) + ((hash << 5) - hash);
                vectors.push({
                    word: w,
                    x: Math.abs((hash % 80) + 10),
                    y: Math.abs(((hash >> 8) % 80) + 10)
                });
            }
        });

        if (vectors.length === 0) return { vector: { x: 50, y: 50 }, components: [] };

        // Average out all word vectors to get the "Sentence Embedding"
        const avgX = vectors.reduce((sum, v) => sum + v.x, 0) / vectors.length;
        const avgY = vectors.reduce((sum, v) => sum + v.y, 0) / vectors.length;

        return { vector: { x: avgX, y: avgY }, components: vectors };
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
        setBreakdown([]);

        // 1. Convert text to embeddings (Mock)
        setTimeout(() => {
            const { vector, components } = getEmbedding(query);
            setQueryVector(vector);
            setBreakdown(components);

            // 2. Perform KNN Search
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-h-[500px]">
            {/* Input & Results Panel */}
            <div className="bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 md:p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between overflow-hidden">
                <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                            <Brain size={20} className="text-neutral-500" />
                            Vector Search
                        </h3>
                    </div>

                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="e.g., 'pet vehicle fruit'"
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

                    {/* Explanation of Average Embedding */}
                    <AnimatePresence>
                        {breakdown.length > 1 && !isSearching && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/30 rounded-xl"
                            >
                                <h5 className="flex items-center gap-1.5 text-xs font-bold uppercase text-purple-600 dark:text-purple-400 mb-2">
                                    <HelpCircle size={14} /> Multi-Word Averages
                                </h5>
                                <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-3 leading-relaxed">
                                    When you type multiple words, AI averages their coordinates. Your query was grouped like this:
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {breakdown.map((b, i) => (
                                        <span key={i} className="text-[10px] font-mono bg-white dark:bg-neutral-950 px-2 py-1 rounded border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-300">
                                            "{b.word}": [{b.x.toFixed(0)}, {b.y.toFixed(0)}]
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-2">
                            <Fingerprint size={14} /> Semantic Neighbors (Found)
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

            {/* 2D Vector Space Visualization */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-4 md:p-6 relative flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-4 z-10 shrink-0">
                    <span className="text-neutral-400 text-sm font-mono flex items-center gap-2">
                        <Database size={16} /> 2D Embeddings Map
                    </span>
                </div>

                {/* Grid UI */}
                <div className="flex-1 relative border border-neutral-800 rounded-xl bg-black/50 overflow-hidden">

                    {/* Background Conceptual Clusters */}
                    <div className="absolute w-48 h-48 bg-orange-500/10 rounded-full blur-3xl" style={{ left: '25%', top: '80%', transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute w-48 h-48 bg-blue-500/10 rounded-full blur-3xl" style={{ left: '80%', top: '20%', transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute w-48 h-48 bg-red-500/10 rounded-full blur-3xl" style={{ left: '20%', top: '20%', transform: 'translate(-50%, -50%)' }} />
                    <div className="absolute w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" style={{ left: '80%', top: '80%', transform: 'translate(-50%, -50%)' }} />

                    {/* Semantic Labels */}
                    <span className="absolute left-[25%] top-[65%] -translate-x-1/2 text-[10px] font-bold text-orange-500/30 uppercase tracking-widest pointer-events-none z-0">Animals</span>
                    <span className="absolute left-[80%] top-[40%] -translate-x-1/2 text-[10px] font-bold text-blue-500/30 uppercase tracking-widest pointer-events-none z-0">Vehicles</span>
                    <span className="absolute left-[20%] top-[40%] -translate-x-1/2 text-[10px] font-bold text-red-500/30 uppercase tracking-widest pointer-events-none z-0">Food</span>
                    <span className="absolute left-[80%] top-[65%] -translate-x-1/2 text-[10px] font-bold text-purple-500/30 uppercase tracking-widest pointer-events-none z-0">Tech</span>

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
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 group z-10"
                            style={{ left: `${item.x}%`, top: `${item.y}%` }}
                        >
                            <div className={`w-3 h-3 rounded-full ${item.color} shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`} />
                            <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900/80 px-1 rounded opacity-50 group-hover:opacity-100">{item.text}</span>
                        </div>
                    ))}

                    {/* If multiple words, draw lines from the component words to the average center */}
                    <AnimatePresence>
                        {queryVector && breakdown.length > 1 && breakdown.map((b, i) => (
                            <motion.svg
                                key={`line-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 0.5 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 w-full h-full pointer-events-none z-10"
                            >
                                <line
                                    x1={`${b.x}%`} y1={`${b.y}%`}
                                    x2={`${queryVector.x}%`} y2={`${queryVector.y}%`}
                                    stroke="#ec4899" strokeWidth="1" strokeDasharray="4 4"
                                />
                            </motion.svg>
                        ))}
                    </AnimatePresence>

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
                                    <Crosshair size={24} className="text-purple-500 animate-pulse absolute drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]" />

                                    {/* Scan Radius */}
                                    {results.length > 0 && (
                                        <motion.div
                                            initial={{ width: 0, height: 0, opacity: 1 }}
                                            animate={{
                                                width: `${results[results.length - 1].distance * 2.5}%`,
                                                height: `${results[results.length - 1].distance * 2.5}%`,
                                                opacity: 0.15
                                            }}
                                            className="absolute border border-purple-500 bg-purple-500 rounded-full"
                                            style={{ aspectRatio: '1/1' }}
                                        />
                                    )}
                                </div>
                                <span className="absolute top-4 left-4 text-xs font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] whitespace-nowrap bg-purple-900/80 border border-purple-500/50 px-2 py-0.5 rounded shadow-lg">
                                    Query: "{query}"
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="text-[10px] text-neutral-500 text-center mt-4 shrink-0">
                    Text is converted into numerical coordinates. "Nearest Neighbors" are found using geometry (e.g., Cosine Similarity), not keyword matching. Multi-word queries compute an average coordinate!
                </p>
            </div>
        </div>
    );
}
