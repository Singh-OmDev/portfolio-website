"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Network, FileJson2, ArrowRightCircle, Database, Server, RefreshCcw } from "lucide-react";

export default function GraphqlDemo() {
    const [isFetching, setIsFetching] = useState(false);

    // REST State
    const [restProgress, setRestProgress] = useState(0); // 0, 1, 2, 3 (Done)
    const [restData, setRestData] = useState<any>(null);

    // GQL State
    const [gqlProgress, setGqlProgress] = useState(0); // 0 or 1 (Done)
    const [gqlData, setGqlData] = useState<any>(null);

    const startRace = () => {
        if (isFetching) return;

        setIsFetching(true);
        setRestProgress(0);
        setRestData(null);
        setGqlProgress(0);
        setGqlData(null);

        // --- REST Waterfall Simulation ---
        // Step 1: /api/user
        setTimeout(() => {
            setRestProgress(1);

            // Step 2: /api/posts
            setTimeout(() => {
                setRestProgress(2);

                // Step 3: /api/friends
                setTimeout(() => {
                    setRestProgress(3);
                    setRestData({ name: "Om", posts: ["Post 1", "Post 2"], friends: 42 });
                }, 500); // TTT = 1500ms
            }, 500);
        }, 500);

        // --- GraphQL Single Query Simulation ---
        // 1 Trip, but slightly longer processing time on backend
        setTimeout(() => {
            setGqlProgress(1);
            setGqlData({ name: "Om", posts: ["Post 1", "Post 2"], friends: 42 });
        }, 800); // TTT = 800ms
    };

    return (
        <div className="w-full bg-neutral-50 dark:bg-black p-8 rounded-[2rem] border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-col gap-8 min-h-[500px]">

            <div className="flex justify-between items-center">
                <h3 className="text-xl font-medium text-neutral-900 dark:text-white flex items-center gap-2">
                    <ArrowRightCircle size={20} className="text-neutral-500" />
                    Data Fetching Race
                </h3>
                <button
                    onClick={startRace}
                    disabled={isFetching && restProgress < 3}
                    className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-full text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                    <RefreshCcw size={16} className={isFetching && restProgress < 3 ? "animate-spin" : ""} />
                    {isFetching && restProgress < 3 ? "Fetching..." : "Run Benchmark"}
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6 flex-1">

                {/* REST Lane */}
                <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/50 p-6 flex flex-col overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-neutral-800 dark:text-neutral-200">REST API</span>
                        <span className="text-xs bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 px-2 py-1 rounded font-mono">Multiple Round Trips</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center gap-4 border-l-2 border-neutral-200 dark:border-neutral-800 ml-4 pl-6 py-4">

                        {/* Request 1 */}
                        <div className="relative">
                            <div className={`absolute -left-[35px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-900 z-10 transition-colors duration-300 ${restProgress >= 1 ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                            <div className={`p-3 rounded-xl border transition-all duration-300 ${restProgress === 0 && isFetching ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950'} ${restProgress >= 1 ? 'opacity-50' : ''}`}>
                                <div className="text-xs font-mono text-neutral-500 mb-1">GET /api/users/me</div>
                                <div className="text-xs text-neutral-800 dark:text-neutral-300">{restProgress >= 1 ? 'Returns { name: "Om" }' : 'Waiting...'}</div>
                            </div>
                        </div>

                        {/* Request 2 (Waterfall) */}
                        <div className="relative">
                            <div className={`absolute -left-[35px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-900 z-10 transition-colors duration-300 ${restProgress >= 2 ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                            <div className={`p-3 rounded-xl border transition-all duration-300 ${restProgress === 1 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950'} ${restProgress >= 2 ? 'opacity-50' : ''}`}>
                                <div className="text-xs font-mono text-neutral-500 mb-1">GET /api/users/me/posts</div>
                                <div className="text-xs text-neutral-800 dark:text-neutral-300">{restProgress >= 2 ? 'Returns { posts: [...] }' : 'Blocked by Req 1'}</div>
                            </div>
                        </div>

                        {/* Request 3 (Waterfall) */}
                        <div className="relative">
                            <div className={`absolute -left-[35px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-neutral-900 z-10 transition-colors duration-300 ${restProgress >= 3 ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                            <div className={`p-3 rounded-xl border transition-all duration-300 ${restProgress === 2 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950'} ${restProgress >= 3 ? 'opacity-50' : ''}`}>
                                <div className="text-xs font-mono text-neutral-500 mb-1">GET /api/users/me/friends</div>
                                <div className="text-xs text-neutral-800 dark:text-neutral-300">{restProgress >= 3 ? 'Returns { count: 42 }' : 'Blocked by Req 2'}</div>
                            </div>
                        </div>

                    </div>
                </div>

                {/* GraphQL Lane */}
                <div className="flex-1 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/50 p-6 flex flex-col overflow-hidden relative">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-bold text-[#E10098]">GraphQL</span>
                        <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded font-mono">Single Round Trip</span>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center h-full">
                        <div className={`w-full p-4 rounded-xl border transition-all duration-500 ${isFetching && gqlProgress === 0 ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/10 scale-105 shadow-xl' : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 scale-100'}`}>
                            <div className="text-xs font-mono text-[#E10098] font-bold mb-3 flex items-center justify-between">
                                POST /graphql
                                {isFetching && gqlProgress === 0 && <span className="animate-pulse w-2 h-2 rounded-full bg-blue-500"></span>}
                            </div>

                            <pre className="text-[10px] text-neutral-600 dark:text-neutral-400 font-mono leading-relaxed bg-neutral-200/50 dark:bg-black/50 p-3 rounded-lg overflow-hidden">
                                {`query {
  user(id: "me") {
    name
    posts { title }
    friends { count }
  }
}`}
                            </pre>

                            <AnimatePresence>
                                {gqlProgress === 1 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        className="mt-3 pt-3 border-t border-neutral-200 dark:border-neutral-800 text-xs text-green-600 dark:text-green-400 font-mono flex items-center gap-2"
                                    >
                                        <FileJson2 size={14} /> Exact Payload Returned
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
