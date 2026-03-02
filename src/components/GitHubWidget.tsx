"use client";

import React from "react";
import { motion } from "framer-motion";
import { GitCommit, Github } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GitHubWidget() {
    const { data } = useSWR("/api/github", fetcher, { refreshInterval: 60000 });

    if (!data || data.error) return null;

    // Simple relative time formatter
    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return "just now";
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="w-full max-w-sm"
        >
            <div className={`relative flex items-center gap-4 p-4 bg-neutral-900 dark:bg-black/50 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-xl overflow-hidden group`}>

                {/* Purple Glow Effect */}
                <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />

                {/* Icon */}
                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border border-neutral-700/50 shadow-lg bg-neutral-800 flex items-center justify-center text-white">
                    <Github size={28} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">
                            Latest Commit
                        </span>
                    </div>

                    <a href={data.url} target="_blank" rel="noopener noreferrer" className="truncate group-hover:underline decoration-white/30 underline-offset-2 transition-all">
                        <h3 className="text-sm font-bold text-white truncate">
                            {data.message}
                        </h3>
                    </a>
                    <div className="flex items-center gap-1 text-xs text-neutral-400 truncate">
                        <GitCommit size={12} />
                        <span className="truncate">{data.repo}</span>
                        <span className="mx-1">•</span>
                        <span>{getRelativeTime(data.createdAt)}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
