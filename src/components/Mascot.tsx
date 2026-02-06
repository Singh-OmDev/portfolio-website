"use client";

import { motion, useSpring, useTransform, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

const MASCOTS = [
    "/mascot-ghost.svg",
    "/mascot-cat.svg",
    "/mascot-bear.svg",
    "/mascot-robot.svg",
];

export default function Mascot() {
    const [mounted, setMounted] = useState(false);
    const [mascotSrc, setMascotSrc] = useState("/mascot-ghost.svg");
    const [isFlipped, setIsFlipped] = useState(false);

    useEffect(() => {
        setMounted(true);
        const randomMascot = MASCOTS[Math.floor(Math.random() * MASCOTS.length)];
        setMascotSrc(randomMascot);
    }, []);

    const mouse = {
        x: useSpring(0, { stiffness: 2, damping: 15, mass: 2 }), // Very slow, heavy follow
        y: useSpring(0, { stiffness: 2, damping: 15, mass: 2 })
    };

    const smoothMouse = {
        x: mouse.x,
        y: mouse.y
    };

    const rotate = useTransform(mouse.x, (current) => {
        const velocity = mouse.x.getVelocity();
        // Removed side-effect setIsFlipped from here to prevent re-renders during render phase
        return Math.min(Math.max(velocity * 0.05, -15), 15);
    });

    useMotionValueEvent(mouse.x, "change", (latest) => {
        const velocity = mouse.x.getVelocity();
        if (velocity < -5 && !isFlipped) {
            setIsFlipped(true);
        } else if (velocity > 5 && isFlipped) {
            setIsFlipped(false);
        }
    });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            mouse.x.set(clientX);
            mouse.y.set(clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouse.x]); // Removed mouse.y dependency as it's stable

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-40 overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-0 left-0"
                style={{
                    x: smoothMouse.x,
                    y: smoothMouse.y,
                    rotate: rotate,
                    scaleX: isFlipped ? -1 : 1 // Flip horizontal to face direction
                }}
            >
                <div className="relative w-16 h-16 translate-x-4 translate-y-4">
                    <motion.div>
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
