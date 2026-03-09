"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { Home, Moon, Sun, Github, Globe, FileText } from "lucide-react";
import { portfolioData } from "@/data/portfolio";

export default function Navbar() {
    const [isDark, setIsDark] = useState(false);
    const { socials } = portfolioData;
    const mouseX = useMotionValue(Infinity);

    useEffect(() => {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            // eslint-disable-next-line react-hooks/exhaustive-deps
            setIsDark(true);
            document.documentElement.classList.add("dark");
        }
    }, []);

    const toggleTheme = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <div
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2"
            onMouseLeave={() => mouseX.set(Infinity)}
            onMouseMove={(e) => mouseX.set(e.clientX)}
        >
            <div className="flex items-end gap-2 px-4 py-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 rounded-full shadow-2xl">

                <DockIcon
                    mouseX={mouseX}
                    icon={Home}
                    label="Home"
                    onClick={() => document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" })}
                />

                <div className="w-px h-6 bg-neutral-300 dark:bg-neutral-700 mx-1 self-center" />

                <DockIcon
                    mouseX={mouseX}
                    icon={Github}
                    label="Github"
                    onClick={() => window.open(socials.github, "_blank")}
                />
                <DockIcon
                    mouseX={mouseX}
                    icon={Globe}
                    label="Articles"
                    onClick={() => window.open(socials.medium, "_blank")}
                />
                <DockIcon
                    mouseX={mouseX}
                    icon={XIcon}
                    label="X (Twitter)"
                    onClick={() => window.open(socials.twitter, "_blank")}
                />
                <DockIcon
                    mouseX={mouseX}
                    icon={FileText}
                    label="Resume"
                    onClick={() => window.open(socials.resume, "_blank")}
                />

                <div className="w-px h-6 bg-neutral-700 mx-1 self-center" />

                <button
                    onClick={toggleTheme}
                    className="relative p-3 rounded-full text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer"
                >
                    {isDark ? <Sun size={20} /> : <Moon size={20} />}
                </button>

            </div>
        </div>
    );
}

function DockIcon({ mouseX, icon: Icon, label, onClick }: { mouseX: MotionValue, icon: React.ElementType, label: string, onClick?: () => void }) {
    const ref = useRef<HTMLButtonElement>(null);

    const distance = useTransform(mouseX, (val) => {
        const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
        return val - bounds.x - bounds.width / 2;
    });

    // Subtle expansion: 40px base -> 55px max width
    const widthSync = useTransform(distance, [-150, 0, 150], [40, 55, 40]);
    const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            style={{ width }}
            className="aspect-square rounded-full flex items-center justify-center relative group cursor-pointer"
        >
            <Icon size={20} className="text-neutral-500 group-hover:text-black dark:text-neutral-400 dark:group-hover:text-white transition-colors" />

            {/* Tooltip */}
            <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-neutral-900 dark:bg-white text-white dark:text-black text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-sm">
                {label}
            </span>
        </motion.button>
    );
}

// Custom X Icon
const XIcon = ({ size, className }: { size?: number, className?: string }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="currentColor"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
    >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);
