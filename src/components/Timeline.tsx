"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const milestones = [
    { era: "2024", title: "The Spark", desc: "The idea of a language that matches the speed of modern culture was born." },
    { era: "Q1 2025", title: "Syntax Design", desc: "Crafting the 'fire' and 'sus' syntax. Making code expressive and fun." },
    { era: "Q2 2025", title: "The Engine", desc: "Core compiler development began. Focus on zero-cost abstractions." },
    { era: "Q3 2025", title: "CLI Release", desc: "The 'vybe' single binary toolchain was released to the world." },
    { era: "Q4 2025", title: "Ecosystem Growth", desc: "VS Code extension and the VYPM package manager went live." },
    { era: "2026", title: "The Future", desc: "Global scaling, optimized runtimes, and a vibrant community." },
];

export default function Timeline() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    return (
        <section className="py-32 relative overflow-hidden bg-vybe-dark">
            <div className="container mx-auto px-6">
                <div className="text-center mb-24">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Evolution</h2>
                    <h3 className="text-5xl md:text-7xl font-black italic">The Story of <span className="gradient-text">Vybe</span></h3>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[50%] top-0 bottom-0 w-px bg-white/10 hidden md:block" />

                    <div className="space-y-24">
                        {milestones.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={isMounted ? { opacity: 0, y: 50 } : false}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, delay: i * 0.1 }}
                                className={`flex flex-col md:flex-row items-center gap-8 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                                    }`}
                            >
                                <div className={`flex-1 ${i % 2 === 0 ? "md:text-right" : "md:text-left"} text-center`}>
                                    <span className="gradient-text font-mono font-bold text-lg mb-2 block">{m.era}</span>
                                    <h4 className="text-2xl font-bold text-white mb-4">{m.title}</h4>
                                    <p className="text-white/40 leading-relaxed">{m.desc}</p>
                                </div>

                                <div className="relative z-10">
                                    <div className="w-12 h-12 rounded-full bg-vybe-dark border border-vybe-gradient flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(44,185,255,0.3)]">
                                        <div className="w-full h-full rounded-full bg-vybe-gradient" />
                                    </div>
                                </div>

                                <div className="flex-1" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
