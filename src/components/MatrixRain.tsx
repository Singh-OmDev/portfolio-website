"use client";

import React, { useEffect, useRef } from "react";

export default function MatrixRain({ active }: { active: boolean }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Katakana characters + latin + numbers
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;':,./<>?ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
        const charArray = chars.split("");

        const fontSize = 16;
        const columns = canvas.width / fontSize;

        // Array of drops - one per column
        const drops: number[] = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = Math.random() * -100; // Start off-screen
        }

        const draw = () => {
            // Translucent black background to create trail effect
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = "#0F0"; // Neon green text
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                const text = charArray[Math.floor(Math.random() * charArray.length)];

                // x = i*fontSize, y = value of drops[i]*fontSize
                ctx.fillText(text, i * fontSize, drops[i] * fontSize);

                // Send drop back to top randomly after it has crossed the screen
                if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }

                // Increment Y coordinate
                drops[i]++;
            }
        };

        const interval = setInterval(draw, 33); // ~30fps

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            // Re-initialize drops if screen size changes drastically
        };

        window.addEventListener("resize", handleResize);

        return () => {
            clearInterval(interval);
            window.removeEventListener("resize", handleResize);
        };
    }, [active]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 z-[9998] pointer-events-none"
            style={{ backgroundColor: "black" }} // Ensure solid black background
        />
    );
}
