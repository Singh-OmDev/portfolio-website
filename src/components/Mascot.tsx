"use client";

import { motion, useAnimation } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

export default function Mascot() {
    const controls = useAnimation();

    const wander = async () => {
        // Calculate random position within the viewport (with some padding)
        // Using window.innerWidth/Height directly in animate can be tricky with hydration,
        // so we use percentages or a safer approach. Here we'll use viewport units for simplicity
        // or just calculate random pixels if we are client-side.

        const randomX = Math.random() * (window.innerWidth - 64); // subtract width
        const randomY = Math.random() * (window.innerHeight - 64); // subtract height

        // Calculate a duration based on distance to keep speed roughly constant
        // For simplicity, just a random slow duration between 5s and 10s
        const duration = 5 + Math.random() * 5;

        try {
            await controls.start({
                x: randomX,
                y: randomY,
                transition: {
                    duration: duration,
                    ease: "linear"
                }
            });
            // Recursively wander to next point
            wander();
        } catch (e) {
            // Animation stopped (e.g. by dragging), do nothing
        }
    };

    useEffect(() => {
        // Start wandering on mount
        wander();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
            {/* 
                Container is pointer-events-none to let clicks pass through to the site, 
                BUT the mascot itself will have pointer-events-auto.
            */}
            <motion.div
                className="absolute cursor-grab active:cursor-grabbing pointer-events-auto"
                drag
                dragMomentum={false}
                animate={controls}
                onDragStart={() => {
                    // Stop wandering when user grabs the mascot
                    controls.stop();
                }}
                onDragEnd={() => {
                    // Resume wandering from the new position
                    wander();
                }}
                whileTap={{ scale: 1.1 }}
            >
                <div className="relative w-16 h-16">
                    {/* Bouncing animation to simulate floating/walking - keeps running even while dragging */}
                    <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Image
                            src="/mascot.svg"
                            alt="Pixel Mascot"
                            width={64}
                            height={64}
                            className="pixelated drop-shadow-xl select-none"
                            style={{ imageRendering: "pixelated" }}
                            draggable={false}
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
