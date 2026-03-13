"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { Terminal, ChevronRight, Code2, Zap, ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

export default function Hero() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-48 pb-32">
            {/* Background Animated Gradient */}
            <div className="absolute inset-0 -z-10 bg-[#0B0F1A]">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#7F5AF0]/20 blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#2CB9FF]/20 blur-[150px] animate-pulse-slow" />
                <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] rounded-full bg-[#7F5AF0]/15 blur-[120px] animate-glow-slow" />
                <div className="absolute top-[60%] left-[15%] w-[30%] h-[30%] rounded-full bg-[#2CB9FF]/10 blur-[100px] animate-glow-slow" />
            </div>

            {/* Grid Background */}
            <div className="absolute inset-0 -z-10 opacity-[0.25] pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "60px 60px"
                }} />

            <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
                {/* Glowing Logo */}
                <motion.div
                    initial={isMounted ? { scale: 0.8, opacity: 0 } : false}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="relative mb-8"
                >
                    <div className="w-24 h-24 rounded-[2rem] bg-vybe-gradient flex items-center justify-center p-0 shadow-[0_0_50px_rgba(127,90,240,0.3)] group cursor-pointer overflow-hidden">
                        <img src="/logo.png" alt="VybeLogo" className="w-full h-full object-cover" />
                    </div>
                    <div className="absolute inset-0 bg-vybe-gradient blur-2xl opacity-20 -z-10 animate-pulse" />
                </motion.div>

                {/* Title Section */}
                <motion.div
                    initial={isMounted ? { y: 20, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                >
                    <h1 className="text-6xl md:text-9xl font-black mb-6 tracking-tighter leading-none italic shimmer text-transparent">
                        VYBE
                    </h1>
                </motion.div>

                <motion.div
                    initial={isMounted ? { y: 20, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="max-w-3xl"
                >
                    <p className="text-xl md:text-3xl font-bold uppercase tracking-[0.2em] text-white mb-6">
                        Strictly <span className="gradient-text">Elite.</span> No <span className="gradient-text italic line-through">Cap.</span>
                    </p>
                    <p className="text-lg text-white/50 leading-relaxed mb-6 font-medium max-w-2xl mx-auto">
                        The programming language built for the next generation of systems. Blazing fast, purely expressive, and designed for flow.
                    </p>
                    <p className="text-vybe-blue font-bold text-lg mb-12 tracking-wide">
                        Build APIs, automation scripts, and servers in a few lines.
                    </p>
                </motion.div>

                {/* CTA Elements */}
                <motion.div
                    initial={isMounted ? { y: 20, opacity: 0 } : false}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 items-center"
                >
                    <Link
                        href="#download"
                        className="btn-premium flex items-center gap-3"
                    >
                        Get Vybe <ArrowRight className="w-5 h-5" />
                    </Link>

                    <Link href="/playground" className="btn-secondary">
                        <Play className="w-5 h-5 fill-current" />
                        Live Playground
                    </Link>
                </motion.div>

                {/* Stats / Proof */}
                <motion.div
                    initial={isMounted ? { opacity: 0 } : false}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1 }}
                    className="mt-20 flex gap-12 border-t border-white/5 pt-10"
                >
                    <div>
                        <div className="text-2xl font-black gradient-text italic">1.2ms</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Avg Runtime Latency</div>
                    </div>
                    <div>
                        <div className="text-2xl font-black gradient-text italic">&lt;2MB</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">Binary Footprint</div>
                    </div>
                </motion.div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute top-1/4 left-10 w-2 h-2 rounded-full bg-[#2CB9FF] blur-sm animate-ping" />
            <div className="absolute bottom-1/4 right-10 w-3 h-3 rounded-full bg-[#7F5AF0] blur-md animate-pulse" />
        </section>
    );
}
