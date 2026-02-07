"use client";

import { useEffect, useRef } from "react";

// Add your skin files to public/oneko/ and list them here
const SKINS = [
    "/oneko/oneko.gif",
    "/oneko/oneko-dog.gif",
    "/oneko/oneko-tora.gif",
    "/oneko/oneko-maia.gif",
    "/oneko/oneko-vaporwave.gif",
];

const Oneko = ({
    initialPos = { x: 32, y: 32 },
    targetOffset = { x: 0, y: 0 }
}: {
    initialPos?: { x: number, y: number },
    targetOffset?: { x: number, y: number }
}) => {
    const nekoRef = useRef<HTMLDivElement>(null);
    const posRef = useRef(initialPos);
    const mouseRef = useRef({ x: 0, y: 0 });
    const frameRef = useRef(0);
    const idleTimeRef = useRef(0);
    const idleAnimationRef = useRef<string | null>(null);
    const idleAnimationFrameRef = useRef(0);
    const lastFrameTimestampRef = useRef<number>(0);
    const requestRef = useRef<number>(0);

    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });

    // Select skin once on mount
    const skinRef = useRef("/oneko/oneko.gif");

    useEffect(() => {
        // Randomly select a skin on mount (client-side only to avoid hydration mismatch if using random)
        // Since this runs in useEffect, it's safe.
        skinRef.current = SKINS[Math.floor(Math.random() * SKINS.length)];

        const isReducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches;
        if (isReducedMotion) return;

        const nekoEl = nekoRef.current;
        if (!nekoEl) return;

        // Apply the selected skin
        nekoEl.style.backgroundImage = `url('${skinRef.current}')`;

        // Randomize initial idle time so they don't all sleep/scratch at once
        idleTimeRef.current = Math.floor(Math.random() * 10);


        const nekoSpeed = 10;
        const spriteSets: { [key: string]: number[][] } = {
            idle: [[-3, -3]],
            alert: [[-7, -3]],
            scratchSelf: [[-5, 0], [-6, 0], [-7, 0]],
            scratchWallN: [[0, 0], [0, -1]],
            scratchWallS: [[-7, -1], [-6, -2]],
            scratchWallE: [[-2, -2], [-2, -3]],
            scratchWallW: [[-4, 0], [-4, -1]],
            tired: [[-3, -2]],
            sleeping: [[-2, 0], [-2, -1]],
            N: [[-1, -2], [-1, -3]],
            NE: [[0, -2], [0, -3]],
            E: [[-3, 0], [-3, -1]],
            SE: [[-5, -1], [-5, -2]],
            S: [[-6, -3], [-7, -2]],
            SW: [[-5, -3], [-6, -1]],
            W: [[-4, -2], [-4, -3]],
            NW: [[-1, 0], [-1, -1]],
        };

        function setSprite(name: string, frame: number) {
            const sprite = spriteSets[name][frame % spriteSets[name].length];
            if (nekoEl) {
                nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
            }
        }

        function resetIdleAnimation() {
            idleAnimationRef.current = null;
            idleAnimationFrameRef.current = 0;
        }

        function idle() {
            idleTimeRef.current += 1;

            // every ~ 20 seconds
            if (
                idleTimeRef.current > 10 &&
                Math.floor(Math.random() * 200) === 0 &&
                idleAnimationRef.current === null
            ) {
                let availableIdleAnimations = ["sleeping", "scratchSelf"];
                if (posRef.current.x < 32) availableIdleAnimations.push("scratchWallW");
                if (posRef.current.y < 32) availableIdleAnimations.push("scratchWallN");
                if (posRef.current.x > window.innerWidth - 32) availableIdleAnimations.push("scratchWallE");
                if (posRef.current.y > window.innerHeight - 32) availableIdleAnimations.push("scratchWallS");
                idleAnimationRef.current = availableIdleAnimations[Math.floor(Math.random() * availableIdleAnimations.length)];
            }

            switch (idleAnimationRef.current) {
                case "sleeping":
                    if (idleAnimationFrameRef.current < 8) {
                        setSprite("tired", 0);
                        break;
                    }
                    setSprite("sleeping", Math.floor(idleAnimationFrameRef.current / 4));
                    if (idleAnimationFrameRef.current > 192) {
                        resetIdleAnimation();
                    }
                    break;
                case "scratchWallN":
                case "scratchWallS":
                case "scratchWallE":
                case "scratchWallW":
                case "scratchSelf":
                    setSprite(idleAnimationRef.current, idleAnimationFrameRef.current);
                    if (idleAnimationFrameRef.current > 9) {
                        resetIdleAnimation();
                    }
                    break;
                default:
                    setSprite("idle", 0);
                    return;
            }
            idleAnimationFrameRef.current += 1;
        }

        function frame() {
            // Skip autonomous movement if dragging
            if (isDraggingRef.current) {
                if (nekoEl) {
                    nekoEl.style.left = `${posRef.current.x - 16}px`;
                    nekoEl.style.top = `${posRef.current.y - 16}px`;
                    setSprite("scratchSelf", 0);
                }
                return;
            }

            frameRef.current += 1;

            // Target is mouse position + offset
            const targetX = mouseRef.current.x + targetOffset.x;
            const targetY = mouseRef.current.y + targetOffset.y;

            const diffX = posRef.current.x - targetX;
            const diffY = posRef.current.y - targetY;
            const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

            if (distance < nekoSpeed || distance < 48) {
                idle();
                return;
            }

            idleAnimationRef.current = null;
            idleAnimationFrameRef.current = 0;

            if (idleTimeRef.current > 1) {
                setSprite("alert", 0);
                idleTimeRef.current = Math.min(idleTimeRef.current, 7);
                idleTimeRef.current -= 1;
                return;
            }

            let direction = "";
            direction = diffY / distance > 0.5 ? "N" : "";
            direction += diffY / distance < -0.5 ? "S" : "";
            direction += diffX / distance > 0.5 ? "W" : "";
            direction += diffX / distance < -0.5 ? "E" : "";
            setSprite(direction, frameRef.current);

            posRef.current.x -= (diffX / distance) * nekoSpeed;
            posRef.current.y -= (diffY / distance) * nekoSpeed;

            posRef.current.x = Math.min(Math.max(16, posRef.current.x), window.innerWidth - 16);
            posRef.current.y = Math.min(Math.max(16, posRef.current.y), window.innerHeight - 16);

            if (nekoEl) {
                nekoEl.style.left = `${posRef.current.x - 16}px`;
                nekoEl.style.top = `${posRef.current.y - 16}px`;
            }
        }

        const onAnimationFrame = (timestamp: number) => {
            if (!lastFrameTimestampRef.current) {
                lastFrameTimestampRef.current = timestamp;
            }
            if (timestamp - lastFrameTimestampRef.current > 100) {
                lastFrameTimestampRef.current = timestamp;
                frame();
            }
            requestRef.current = window.requestAnimationFrame(onAnimationFrame);
        };

        const handleMouseMove = (event: MouseEvent) => {
            mouseRef.current.x = event.clientX;
            mouseRef.current.y = event.clientY;

            if (isDraggingRef.current) {
                const newX = event.clientX - dragOffsetRef.current.x;
                const newY = event.clientY - dragOffsetRef.current.y;
                posRef.current.x = newX + 16;
                posRef.current.y = newY + 16;
            }
        };

        const handleMouseDown = (event: MouseEvent) => {
            if (event.button !== 0) return;
            event.preventDefault();

            isDraggingRef.current = true;

            const rect = nekoEl.getBoundingClientRect();
            dragOffsetRef.current = {
                x: event.clientX - rect.left,
                y: event.clientY - rect.top
            };
        };

        const handleMouseUp = () => {
            isDraggingRef.current = false;
        };

        document.addEventListener("mousemove", handleMouseMove);
        document.addEventListener("mouseup", handleMouseUp);
        nekoEl.addEventListener("mousedown", handleMouseDown);

        requestRef.current = window.requestAnimationFrame(onAnimationFrame);

        return () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
            if (nekoEl) nekoEl.removeEventListener("mousedown", handleMouseDown);

            if (requestRef.current) {
                window.cancelAnimationFrame(requestRef.current);
            }
        };
    }, [targetOffset]);

    return (
        <div
            ref={nekoRef}
            aria-hidden="true"
            style={{
                width: "32px",
                height: "32px",
                position: "fixed",
                pointerEvents: "auto",
                cursor: "grab",
                imageRendering: "pixelated",
                left: `${initialPos.x - 16}px`,
                top: `${initialPos.y - 16}px`,
                zIndex: 9999,
                // backgroundImage set in useEffect
            }}
        />
    );
};

export default function Mascot() {
    return (
        <Oneko initialPos={{ x: 32, y: 32 }} targetOffset={{ x: 0, y: 0 }} />
    );
}
