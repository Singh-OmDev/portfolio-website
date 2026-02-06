"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Music, ExternalLink } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SpotifyWidget() {
    const { data } = useSWR("/api/now-playing", fetcher, { refreshInterval: 10000 });
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);



    // Handle audio preview if available
    // For Last.fm, we often don't get a preview. We'll use the "Cutiepie" preview as a fallback demo
    // so the button always does something fun, unless text says specifically "Now Playing" and we want to be strict.
    // Keeping "Cutiepie" as a hidden Easter egg / demo track seems preferred for "personality".
    useEffect(() => {
        const trackUrl = data?.previewUrl;

        if (!trackUrl) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            return;
        }

        if (!audioRef.current) {
            audioRef.current = new Audio(trackUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
        } else if (audioRef.current.src !== trackUrl) {
            audioRef.current.pause();
            audioRef.current = new Audio(trackUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 0.5;
            if (isPlaying) audioRef.current.play().catch(e => console.error(e));
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [data?.previewUrl, isPlaying]);

    const [error, setError] = useState(false);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(false), 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);



    const togglePlay = () => {
        if (!data?.previewUrl) return;

        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play().catch(e => {
                    console.error("Audio playback failed:", e);
                    setError(true);
                    setIsPlaying(false);
                });
            }
        }
        setIsPlaying(!isPlaying);
    };

    // If initial loading, render nothing
    if (!data) return null;

    const hasPreview = !!data.previewUrl;

    return (
        <motion.div
        // ...
        >
            <div className={`bg-neutral-900/90 backdrop-blur-md border ${error ? "border-red-500/50" : "border-neutral-800"} rounded-2xl p-4 flex items-center gap-4 shadow-2xl overflow-hidden relative group transition-colors duration-300`}>


                {/* Visualizer Background (Subtle) */}
                {isPlaying && (
                    <div className="absolute inset-x-0 bottom-0 h-full w-full opacity-10 pointer-events-none flex items-end justify-center gap-1">
                        {[...Array(12)].map((_, i) => (
                            <motion.div
                                key={i}
                                className="w-4 bg-green-500/50 rounded-t-sm"
                                animate={{
                                    height: ["10%", "60%", "30%", "100%", "20%"],
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 0.8,
                                    ease: "easeInOut",
                                    delay: i * 0.1,
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Album Art */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden shadow-lg border border-neutral-800">
                    {data.albumImageUrl ? (
                        <Image
                            src={data.albumImageUrl}
                            alt={data.album || "Album Art"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-white/50">
                            <Music size={24} />
                        </div>
                    )}

                    {/* Spinning disk effect if playing */}
                    {isPlaying && (
                        <motion.div
                            className="absolute inset-0 rounded-full border-2 border-white/20"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                        />
                    )}
                </div>

                {/* Content */}
                <a href={data.songUrl || "#"} target="_blank" rel="noopener noreferrer" className="flex-1 min-w-0 flex flex-col justify-center group-hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="relative flex h-2 w-2">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isPlaying ? "bg-green-500" : "bg-neutral-500"}`}></span>
                            <span className={`relative inline-flex rounded-full h-2 w-2 ${isPlaying ? "bg-green-500" : "bg-neutral-500"}`}></span>
                        </span>
                        <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">
                            {data.isPlaying ? "Last.fm • Now Playing" : "Last.fm • Last Played"}
                        </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate pr-2">
                        {data.title || "Not Playing"}
                    </h3>
                    <p className="text-xs text-neutral-400 truncate">
                        {data.artist || "Unknown Artist"}
                    </p>
                </a>

                {/* Controls */}
                <button
                    onClick={togglePlay}
                    disabled={!hasPreview}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border ${hasPreview ? "bg-white/5 hover:bg-white/10 text-white border-white/5" : "bg-neutral-800 text-neutral-600 border-neutral-700 cursor-not-allowed"}`}
                    title={hasPreview ? "Play Preview" : "No Preview Available"}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>

            </div>
        </motion.div>
    );
}
