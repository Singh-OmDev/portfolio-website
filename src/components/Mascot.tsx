"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const MASCOTS = [
    "/mascot-ghost.svg",
    "/mascot-cat.svg",
    "/mascot-bear.svg",
    "/mascot-robot.svg",
];

export default function Mascot() {
    const [mascotSrc, setMascotSrc] = useState("/mascot-ghost.svg");

    const mouse = {
        x: useSpring(0, { stiffness: 5, damping: 20, mass: 1 }), // Very slow, laggy follow
        y: useSpring(0, { stiffness: 5, damping: 20, mass: 1 })
    };

    // Smooth physics values
    const smoothMouse = {
        x: mouse.x,
        y: mouse.y
    };

    // Optional: Calculate rotation based on X velocity (lean forward/back)
    const rotate = useTransform(mouse.x, (current) => {
        const velocity = mouse.x.getVelocity();
        // Limit rotation to small angles (-10 to 10 degrees)
        return Math.min(Math.max(velocity * 0.02, -10), 10);
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouse.x.set(clientX);
            mouse.y.set(clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouse.x, mouse.y]);

    useEffect(() => {
        // Randomly select a mascot on mount
        const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
        setMascotSrc(randomMascot);
    }, []);

    return (
        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-0 left-0"
                style={{
                    x: smoothMouse.x,
                    y: smoothMouse.y,
                    rotate: rotate
                }}
            >
                <div className="relative w-16 h-16 -translate-x-1/2 -translate-y-1/2">
                    {/* -translate to center the mascot on the cursor */}

                    {/* Floating hover animation remains for life */}
                    <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }}
                    >
                        <Image
                            src={mascotSrc}
                            alt="Mascot"
                            width={64}
                            height={64}
                            className="drop-shadow-2xl"
                            draggable={false}
                            priority
                        />
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}
