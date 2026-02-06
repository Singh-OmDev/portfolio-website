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

        // Cleanup previous audio if it exists (and we're changing tracks or unmounting)
        // We handle this in the return, but also need to handle initial mount/updates carefully

        if (!trackUrl) {
            return;
        }

        // If audio doesn't exist, create it
        if (!audioRef.current) {
            audioRef.current = new Audio(trackUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 1.0;

            // If we were already playing (e.g. track changed), resume
            if (isPlaying) {
                audioRef.current.play().catch(e => console.error("Auto-resume failed:", e));
            }
        }
        // If audio exists but URL changed
        else if (audioRef.current.src !== trackUrl) {
            audioRef.current.pause();
            audioRef.current = new Audio(trackUrl);
            audioRef.current.loop = true;
            audioRef.current.volume = 1.0;
            if (isPlaying) audioRef.current.play().catch(e => console.error("Track change play failed:", e));
        }

        // Cleanup on specific dependency change or unmount
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
        };
    }, [data?.previewUrl]); // Removed isPlaying from dependencies

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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="w-full max-w-sm"
        >
            <div className={`relative flex items-center gap-4 p-4 bg-neutral-900 dark:bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl overflow-hidden group`}>

                {/* Green Glow Effect */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-green-500/20 blur-[50px] rounded-full pointer-events-none" />

                {/* Album Art */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-700/50 shadow-lg">
                    {data.albumImageUrl ? (
                        <Image
                            src={data.albumImageUrl}
                            alt={data.album || "Album Art"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center text-neutral-500">
                            <Music size={24} />
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-4 h-4 rounded-full bg-[#1DB954] flex items-center justify-center">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-black">
                                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.48.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
                            </svg>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-green-500">
                            {data.isPlaying ? "Now Playing" : "Last Played"}
                        </span>
                    </div>

                    <a href={data.songUrl || "#"} target="_blank" rel="noopener noreferrer" className="truncate group-hover:underline decoration-white/30 underline-offset-2 transition-all">
                        <h3 className="text-sm font-bold text-white truncate">
                            {data.title || "Not Playing"}
                        </h3>
                    </a>
                    <p className="text-xs text-neutral-400 truncate">
                        {data.artist || "Unknown Artist"}
                    </p>
                </div>

                {/* Play Button */}
                <button
                    onClick={togglePlay}
                    disabled={!hasPreview}
                    className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all active:scale-95 border ${hasPreview ? "bg-white/5 hover:bg-white/10 text-white border-white/10" : "bg-neutral-800 text-neutral-600 border-neutral-700 cursor-not-allowed"}`}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
                </button>

            </div>
        </motion.div>
    );
}
