"use client";

import React, { useState, useRef, useEffect } from "react";
import { Play, Pause } from "lucide-react";

interface PlayAudioButtonProps {
    audioUrl: string;
}

export default function PlayAudioButton({ audioUrl }: PlayAudioButtonProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        audioRef.current = new Audio(audioUrl);
        audioRef.current.addEventListener("ended", () => setIsPlaying(false));

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener("ended", () => setIsPlaying(false));
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    const togglePlay = (e: React.MouseEvent) => {
        // Prevent clicking the button from triggering the Link wrapper on the card
        e.preventDefault();
        e.stopPropagation();

        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
        } else {
            // Pause any other playing audio on the page (optional global state could be used here)
            document.querySelectorAll("audio").forEach((audio) => {
                audio.pause();
            });

            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    return (
        <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-lg text-sm font-bold font-serif hover:opacity-90 transition-opacity border border-neutral-800 dark:border-neutral-200 cursor-pointer"
            aria-label={isPlaying ? "Pause Audio" : "Play Theme Song"}
            title="Play Theme Song"
        >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>
    );
}
