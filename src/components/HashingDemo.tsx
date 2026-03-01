"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copyright, Server, Database, Plus, Minus } from "lucide-react";

export default function HashingDemo() {
    const [nodes, setNodes] = useState<{ id: number; deg: number }[]>([
        { id: 1, deg: 0 },
        { id: 2, deg: 120 },
        { id: 3, deg: 240 }
    ]);

    // Generate 36 static data blocks around the 360 ring
    const [data] = useState(Array.from({ length: 36 }).map((_, i) => ({
        id: `data_${i}`,
        deg: i * 10
    })));

    const RADIUS = 140;

    const addNode = () => {
        if (nodes.length >= 6) return; // Max 6 nodes for visual sanity

        // Find largest gap to place new node
        let maxGap = 0;
        let bestDeg = 0;

        const sorted = [...nodes].sort((a, b) => a.deg - b.deg);
        for (let i = 0; i < sorted.length; i++) {
            const current = sorted[i].deg;
            const next = sorted[(i + 1) % sorted.length].deg;
            let gap = next - current;
            if (gap <= 0) gap += 360;

            if (gap > maxGap) {
                maxGap = gap;
                bestDeg = (current + gap / 2) % 360;
            }
        }

        setNodes([...nodes, { id: Date.now(), deg: bestDeg }]);
    };

    const removeNode = (idToRemove: number) => {
        if (nodes.length <= 1) return; // Must have at least 1 node
        setNodes(nodes.filter(n => n.id !== idToRemove));
    };

    // Calculate which node owns which data (Consistent Hashing logic: First node moving clockwise)
    const getAssignedNode = (dataDeg: number) => {
        const sortedNodes = [...nodes].sort((a, b) => a.deg - b.deg);
        for (const node of sortedNodes) {
            if (node.deg >= dataDeg) return node.id;
        }
        // Wrap around to first node
        return sortedNodes[0].id;
    };

    const getNodeStyles = (nodeId: number) => {
        // Deterministic highly-contrasting colors based on ID
        const colors = [
            "bg-blue-500 shadow-blue-500",
            "bg-green-500 shadow-green-500",
            "bg-purple-500 shadow-purple-500",
            "bg-orange-500 shadow-orange-500",
            "bg-pink-500 shadow-pink-500",
            "bg-cyan-500 shadow-cyan-500"
        ];
        return colors[nodeId % colors.length];
    };

    return (
        <div className="w-full bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row gap-8 items-center min-h-[500px]">

            {/* Context Panel */}
            <div className="w-full md:w-1/3 flex flex-col gap-6">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-2">
                        <Copyright size={20} className="text-neutral-500" />
                        The Hash Ring
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                        Data (small dots) maps to the nearest Server Node (large circles) by moving clockwise around the ring.
                    </p>
                </div>

                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl p-5 flex flex-col gap-3">
                    <button
                        onClick={addNode}
                        disabled={nodes.length >= 6}
                        className="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        <Plus size={16} /> Add Server Node
                    </button>
                    <p className="text-xs text-neutral-500 text-center italic">
                        Watch how adding/removing nodes only requires moving a tiny fraction of data keys!
                    </p>
                </div>
            </div>

            {/* Visualizer */}
            <div className="w-full md:w-2/3 flex justify-center items-center py-10 relative">
                {/* The physical ring */}
                <div
                    className="absolute border-[4px] border-neutral-200 dark:border-neutral-800 rounded-full"
                    style={{ width: RADIUS * 2, height: RADIUS * 2 }}
                />

                {/* Data Keys */}
                {data.map(d => {
                    const assignedNodeId = getAssignedNode(d.deg);
                    const isWrapAround = assignedNodeId === [...nodes].sort((a, b) => a.deg - b.deg)[0].id && d.deg > [...nodes].sort((a, b) => b.deg - a.deg)[0].deg;

                    // Trig math to place on ring
                    const rad = (d.deg * Math.PI) / 180;
                    const x = Math.sin(rad) * RADIUS;
                    const y = -Math.cos(rad) * RADIUS;

                    return (
                        <motion.div
                            key={d.id}
                            className={`absolute w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] transition-colors duration-1000 ${getNodeStyles(assignedNodeId)}`}
                            style={{ x, y }}
                            // The layout animation is what makes them "slide" when ownership changes
                            layout
                        />
                    );
                })}

                {/* Server Nodes */}
                <AnimatePresence>
                    {nodes.map(n => {
                        const rad = (n.deg * Math.PI) / 180;
                        const x = Math.sin(rad) * RADIUS;
                        const y = -Math.cos(rad) * RADIUS;

                        const dataOwned = data.filter(d => getAssignedNode(d.deg) === n.id).length;

                        return (
                            <motion.div
                                key={n.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1, x, y }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute flex flex-col items-center group z-10"
                            >
                                <div className={`w-12 h-12 rounded-full border-4 border-white dark:border-black flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform ${getNodeStyles(n.id)}`}>
                                    <Server size={20} className="text-white drop-shadow-md" />
                                </div>

                                {/* Node Stats Panel */}
                                <div className="absolute top-14 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] px-3 py-2 rounded-lg whitespace-nowrap z-20 pointer-events-none flex flex-col items-center shadow-xl border border-neutral-700">
                                    <span className="font-bold mb-1">Node {n.id.toString().slice(-4)}</span>
                                    <span>{dataOwned} keys owned</span>
                                </div>

                                {/* Remove Button */}
                                {nodes.length > 1 && (
                                    <button
                                        onClick={() => removeNode(n.id)}
                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-md cursor-pointer"
                                    >
                                        <Minus size={12} />
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </AnimatePresence>

            </div>
        </div>
    );
}
