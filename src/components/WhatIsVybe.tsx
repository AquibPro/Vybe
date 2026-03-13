"use client";
import { motion } from "framer-motion";
import VybeHighlighter from "./VybeHighlighter";

const CODE = `user = ask "Who's coding?"
say "Watching {user} cook... 👨‍🍳"

res = fetch "https://api.vybe.dev/status"

sus res.mood == "bussin" {
  say "The vibe is elite. No cap."
} nah {
  say "Wait, let him cook."
}`;

export default function WhatIsVybe() {
    return (
        <section id="what-is-vybe" className="py-32 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-vybe-purple/8 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] gradient-text border border-vybe-purple/30 px-4 py-2 rounded-full mb-6">
                        <span>✦</span> Language Overview
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic mb-6">
                        What is{" "}
                        <span className="gradient-text shimmer">Vybe?</span>
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Vybe is a modern scripting language designed for developers who want expressive, readable, and enjoyable code. Inspired by modern culture and developer workflows, Vybe focuses on simplicity, clarity, and powerful scripting capabilities.
                    </p>
                </motion.div>

                {/* Code window */}
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.97 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.15 }}
                    whileHover={{ y: -6 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="glass rounded-[2rem] overflow-hidden border border-vybe-purple/20 shadow-[0_0_60px_rgba(127,90,240,0.15)] bg-[#0D1117]">
                        {/* Title bar */}
                        <div className="bg-[#121826] px-6 py-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/20">hello.vybe</span>
                            <div className="w-12" />
                        </div>
                        {/* Code */}
                        <div className="p-8 md:p-12">
                            <VybeHighlighter code={CODE} className="text-lg" />
                        </div>
                    </div>
                </motion.div>

                {/* Quick stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="flex flex-wrap justify-center gap-8 mt-16"
                >
                    {[
                        { val: "Gen-Z", label: "Inspired Syntax" },
                        { val: "Zero", label: "Boilerplate" },
                        { val: "1 Binary", label: "Full Toolchain" },
                        { val: "Fast", label: "Native Executables" },
                    ].map((stat) => (
                        <div key={stat.label} className="text-center">
                            <div className="text-2xl font-black gradient-text">{stat.val}</div>
                            <div className="text-xs text-white/30 font-bold uppercase tracking-widest mt-1">{stat.label}</div>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
