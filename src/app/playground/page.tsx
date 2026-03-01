"use client";

import React from "react";
import Playground from "@/components/Playground";
import { ArrowLeft } from "lucide-react";
import NextLink from "next/link";

export default function PlaygroundPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-black text-neutral-900 dark:text-neutral-50 selection:bg-neutral-200 dark:selection:bg-neutral-800">
            {/* Top Navigation Bar */}
            <nav className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
                <NextLink
                    href="/"
                    className="flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors group"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Portfolio
                </NextLink>
                <div className="text-xl font-serif font-bold tracking-tight">
                    OS.
                </div>
            </nav>

            <div className="pt-20">
                <Playground />
            </div>

        </main>
    );
}
