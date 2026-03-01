"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Map, MapPin, Grid3X3, ArrowRight, MousePointerClick, Zap } from "lucide-react";

export default function GeohashingDemo() {
    const [zoomLevel, setZoomLevel] = useState(0); // 0 to 4

    // Abstract grid definitions for visual purposes
    const grids = [
        { level: 0, code: "", size: 1, cols: 2, rows: 2, prefix: "" }, // Base World (4 quadrants for simplicity, real geohash uses base32)
        { level: 1, code: "g", size: 0.5, cols: 4, rows: 4, prefix: "g" },
        { level: 2, code: "gc", size: 0.25, cols: 8, rows: 8, prefix: "gc" },
        { level: 3, code: "gcp", size: 0.125, cols: 16, rows: 16, prefix: "gcp" },
        { level: 4, code: "gcpv", size: 0.0625, cols: 32, rows: 32, prefix: "gcpv" },
    ];

    const currentGrid = grids[zoomLevel];

    // Simulate finding the target "Central Park" coordinate
    const targetX = 0.65; // Percentage
    const targetY = 0.35; // Percentage

    // Determine which cell the target falls into for the current grid
    const getActiveCellIndex = (cols: number, rows: number) => {
        const col = Math.floor(targetX * cols);
        const row = Math.floor(targetY * rows);
        return row * cols + col;
    };

    const activeCellIndex = getActiveCellIndex(currentGrid.cols, currentGrid.rows);

    const handleZoomIn = () => {
        if (zoomLevel < 4) setZoomLevel(prev => prev + 1);
    };

    const handleZoomOut = () => {
        if (zoomLevel > 0) setZoomLevel(prev => prev - 1);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full min-h-[500px]">
            {/* Control Panel */}
            <div className="md:col-span-4 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm p-6 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col justify-between h-full">
                <div>
                    <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2 mb-4">
                        <Map size={20} className="text-neutral-500" />
                        Geohashing (Spatial Indexing)
                    </h3>

                    <p className="text-xs text-neutral-600 dark:text-neutral-400 mb-6 leading-relaxed">
                        How do Uber or Tinder find people near you without calculating the math distance between *every single user* in the database? They chop the world map into a grid, assigning a short string to each square.
                    </p>

                    <div className="bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 mb-6 space-y-3">
                        <div className="flex flex-col gap-1">
                            <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest">Target String</span>
                            <div className="flex gap-1 items-baseline">
                                <span className="text-2xl font-bold font-mono text-indigo-500 tracking-widest">
                                    {currentGrid.code || "?"}
                                </span>
                                <span className="text-xs text-neutral-400 font-mono tracking-widest">
                                    {"_".repeat(4 - zoomLevel)}
                                </span>
                            </div>
                        </div>
                        <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-2" />
                        <div className="flex justify-between items-center text-[10px] text-neutral-500 font-bold uppercase">
                            <span>Precision</span>
                            <span className="text-emerald-500">Level {zoomLevel}</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleZoomIn}
                        disabled={zoomLevel === 4}
                        className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-medium flex items-center justify-center gap-2 active:scale-95 transition-all outline-none disabled:opacity-50 cursor-pointer text-sm"
                    >
                        <Zap size={16} /> Enhance Grid Precision
                    </button>
                    <button
                        onClick={handleZoomOut}
                        disabled={zoomLevel === 0}
                        className="px-6 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-medium border border-neutral-800 dark:border-neutral-200 hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-95 transition-all outline-none cursor-pointer flex items-center justify-center disabled:opacity-50 text-sm"
                        title="Zoom Out"
                    >
                        Back
                    </button>
                </div>
            </div>

            {/* Visualization Layer */}
            <div className="md:col-span-8 bg-neutral-900 dark:bg-black p-6 rounded-[2rem] border border-neutral-800 shadow-inner flex flex-col items-center justify-center relative overflow-hidden font-mono min-h-[450px]">

                {/* Map Container */}
                <div className="relative w-80 h-80 bg-neutral-800 rounded-xl overflow-hidden shadow-2xl border-4 border-neutral-700">

                    {/* Background Map Graphic (Abstract World) */}
                    <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiLz48cGF0aCBkPSJNMTAgMjBWMzBoMTBWNTBIMTBWODBoMTJWOTJoMTVWODBoMzBWNjBIMzBWMzBIMTB6IiBmaWxsPSIjNTViYzk4Ii8+PHBhdGggZD0iTTUwIDE1VjUwaDE1VjgwaDEwVjg1aDMwVjQwSDgwdjIwaC0xMFYzMEg4MFYxNUg1MHoiIGZpbGw9IiM1NWJjOTgiLz48L3N2Zz4=')] bg-cover bg-center"></div>

                    {/* The Target Pin */}
                    <div
                        className="absolute w-4 h-4 text-red-500 -translate-x-1/2 -translate-y-full z-40 transition-all duration-300 drop-shadow-md"
                        style={{ left: `${targetX * 100}%`, top: `${targetY * 100}%` }}
                    >
                        <MapPin size={24} fill="currentColor" className="text-red-900" />
                    </div>

                    {/* Dynamic Grid Overlay */}
                    <div
                        className="absolute inset-0 grid z-30 transition-all duration-500"
                        style={{
                            gridTemplateColumns: `repeat(${currentGrid.cols}, 1fr)`,
                            gridTemplateRows: `repeat(${currentGrid.rows}, 1fr)`
                        }}
                    >
                        {Array.from({ length: currentGrid.cols * currentGrid.rows }).map((_, i) => {
                            const isActive = i === activeCellIndex;

                            // Generate a dummy char for visual sake
                            const char = String.fromCharCode(97 + (i % 26));

                            return (
                                <motion.div
                                    key={`${zoomLevel}-${i}`}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: (i % 10) * 0.02 }}
                                    className={`border border-indigo-500/30 flex items-center justify-center relative overflow-hidden transition-colors ${isActive ? 'bg-indigo-500/40 border-indigo-400' : 'hover:bg-indigo-500/10'}`}
                                >
                                    {/* Show characters only if they fit (zoom 0-2) */}
                                    {zoomLevel < 3 && (
                                        <span className={`text-[10px] md:text-xs font-bold ${isActive ? 'text-white' : 'text-indigo-500/50'}`}>
                                            {currentGrid.prefix}{char}
                                        </span>
                                    )}

                                    {isActive && (
                                        <motion.div
                                            layoutId="activeHighlight"
                                            className="absolute inset-0 border-2 border-indigo-400 shadow-[inset_0_0_20px_rgba(99,102,241,0.5)] z-10"
                                        />
                                    )}
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                {/* Explanation Text relative to zoom */}
                <div className="mt-8 max-w-sm text-center">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={zoomLevel}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-xs text-neutral-400"
                        >
                            {zoomLevel === 0 && "Level 0: The world is divided into large quadrants."}
                            {zoomLevel === 1 && "Level 1: Adding a character 'g' narrows the bounding box significantly."}
                            {zoomLevel === 2 && "Level 2: 'gc' now represents a specific city/region level precision."}
                            {zoomLevel === 3 && "Level 3: 'gcp' represents a neighborhood scale. Notice the grid multiplying."}
                            {zoomLevel === 4 && "Level 4: 'gcpv' identifies a granular bounding box (e.g., Central Park area). To find users nearby, the DB just runs `SELECT * WHERE geohash LIKE 'gcpv%'` - an ultra-fast string prefix search!"}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </div>
        </div>
    );
}
