"use client";
import { motion } from "framer-motion";

const principles = [
    { icon: "✦", title: "Expressive Syntax", desc: "Code reads like how you think. No curly brace hell, no boilerplate ceremonies." },
    { icon: "⚡", title: "Minimal Boilerplate", desc: "Say more with less. One line does what five lines needed before." },
    { icon: "🛠️", title: "Built for Scripting", desc: "Automation, CLI tools, API scripts — Vybe handles everything with ease." },
    { icon: "🚀", title: "Modern CLI Tooling", desc: "One binary ships everything: run, build, fmt, watch, repl, and more." },
    { icon: "🎨", title: "Readable by Design", desc: "Code that your team can read without a manual. Clear intent, every time." },
];

export default function WhyVybeExists() {
    return (
        <section id="why-vybe" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-vybe-blue/6 blur-[150px]" />
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-vybe-purple/6 blur-[150px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-start gap-20">
                    {/* Left — text */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 lg:sticky top-32"
                    >
                        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-blue border border-vybe-blue/30 px-4 py-2 rounded-full mb-6">
                            <span>✦</span> Motivation
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black italic mb-8 leading-tight">
                            Why Vybe<br />
                            <span className="gradient-text">Exists</span>
                        </h2>
                        <p className="text-xl text-white/50 leading-relaxed mb-6">
                            Developers constantly write scripts for automation, CLI tools, APIs, and small utilities. Many existing tools are either too verbose or difficult to read.
                        </p>
                        <p className="text-xl text-white/50 leading-relaxed">
                            Vybe was created to make scripting <span className="text-white/80 font-semibold">expressive</span>, <span className="text-white/80 font-semibold">minimal</span>, and <span className="text-white/80 font-semibold">enjoyable</span> — a language that gets out of your way so you can focus on building.
                        </p>
                    </motion.div>

                    {/* Right — animated principle cards */}
                    <div className="lg:w-1/2 space-y-4">
                        {principles.map((p, i) => (
                            <motion.div
                                key={p.title}
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.6 }}
                                whileHover={{ x: 8, boxShadow: "0 0 40px rgba(127,90,240,0.15)" }}
                                className="flex items-start gap-5 glass rounded-2xl p-6 border border-white/5 cursor-default group transition-all duration-300"
                            >
                                <div className="text-2xl flex-shrink-0 group-hover:scale-125 transition-transform duration-300">{p.icon}</div>
                                <div>
                                    <h4 className="font-black text-lg mb-1 group-hover:text-vybe-blue transition-colors">{p.title}</h4>
                                    <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
