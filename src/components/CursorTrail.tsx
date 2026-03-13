"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    color: string;
    opacity: number;
}

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles: Particle[] = [];
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();

        const createParticle = (x: number, y: number) => {
            const size = Math.random() * 2 + 1;
            const speedX = (Math.random() - 0.5) * 1.5;
            const speedY = (Math.random() - 0.5) * 1.5;
            const color = Math.random() > 0.5 ? "#7F5AF0" : "#2CB9FF";

            return { x, y, size, speedX, speedY, color, opacity: 1 };
        };

        const mouse = { x: 0, y: 0 };
        const delayedMouse = { x: 0, y: 0 };

        const handleMouseMove = (e: MouseEvent) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        window.addEventListener("mousemove", handleMouseMove);

        let rafId: number;
        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Interpolate mouse for "smooth lag"
            delayedMouse.x += (mouse.x - delayedMouse.x) * 0.15;
            delayedMouse.y += (mouse.y - delayedMouse.y) * 0.15;

            // Spawn particles at delayed position
            if (Math.abs(mouse.x - delayedMouse.x) > 0.1 || Math.abs(mouse.y - delayedMouse.y) > 0.1) {
                for (let i = 0; i < 1; i++) {
                    particles.push(createParticle(delayedMouse.x, delayedMouse.y));
                }
            }

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.speedX * 0.5; // Slower particles
                p.y += p.speedY * 0.5;
                p.opacity -= 0.015; // Longer life

                if (p.opacity <= 0) {
                    particles.splice(i, 1);
                    i--;
                    continue;
                }

                ctx.globalAlpha = p.opacity;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();

                // Add subtle glow
                ctx.shadowBlur = 10;
                ctx.shadowColor = p.color;
            }

            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none z-[9999]"
            style={{ mixBlendMode: "screen" }}
        />
    );
}
