"use client";

import { useEffect, useRef } from "react";

interface Ripple {
    id: number;
    x: number;
    y: number;
}

export default function ClickRipple() {
    const containerRef = useRef<HTMLDivElement>(null);
    const rippleId = useRef(0);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleClick = (e: MouseEvent) => {
            const id = ++rippleId.current;
            const ripple = document.createElement("div");
            ripple.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0px;
        height: 0px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        border: 1.5px solid rgba(127, 90, 240, 0.7);
        animation: ripple-grow 800ms cubic-bezier(0.4, 0, 0.6, 1) forwards;
      `;

            // Second ring (delayed)
            const ripple2 = document.createElement("div");
            ripple2.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top: ${e.clientY}px;
        width: 0px;
        height: 0px;
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 99999;
        border: 1px solid rgba(44, 185, 255, 0.4);
        animation: ripple-grow 800ms cubic-bezier(0.4, 0, 0.6, 1) 120ms forwards;
      `;

            document.body.appendChild(ripple);
            document.body.appendChild(ripple2);

            setTimeout(() => {
                ripple.remove();
                ripple2.remove();
            }, 1000);
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, []);

    return (
        <>
            <style>{`
        @keyframes ripple-grow {
          from {
            width: 0px;
            height: 0px;
            opacity: 1;
          }
          to {
            width: 120px;
            height: 120px;
            opacity: 0;
          }
        }
      `}</style>
            <div ref={containerRef} />
        </>
    );
}
