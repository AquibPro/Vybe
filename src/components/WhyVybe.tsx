"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Smartphone, Cpu } from "lucide-react";
import { useEffect, useState } from "react";

const reasons = [
    {
        icon: Sparkles,
        title: "Expressive Syntax",
        description: "Write code that feels like poetry. Clean, intuitive, and remarkably powerful.",
        color: "text-vybe-purple"
    },
    {
        icon: Zap,
        title: "Minimal Boilerplate",
        description: "Focus on what matters. Vybe takes care of the noise so you can build faster.",
        color: "text-vybe-blue"
    },
    {
        icon: Smartphone,
        title: "Fun Developer Experience",
        description: "Built by developers, for developers. Every tool, every error, every 'vybe' is crafted for joy.",
        color: "text-vybe-purple"
    },
    {
        icon: Cpu,
        title: "Powerful Runtime",
        description: "High performance meets modern safety. Scale without limits on our optimized engine.",
        color: "text-vybe-blue"
    }
];

export default function WhyVybe() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    return (
        <section id="why" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={isMounted ? { opacity: 0, x: -20 } : false}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Philosophy</h2>
                            <h3 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
                                Built for the <br /> <span className="gradient-text italic">Next Generation</span> of Developers
                            </h3>
                            <p className="text-white/60 mb-12 text-lg">
                                Vybe isn&apos;t just another language. It&apos;s a movement. We believe programming should be as fluid as a conversation and as vibrant as a city at night.
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {reasons.map((reason, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1, duration: 0.5 }}
                                        whileHover={{ y: -8, scale: 1.03, boxShadow: "0 20px 60px rgba(127,90,240,0.15)" }}
                                        className="group glass p-6 rounded-2xl border border-white/5 cursor-default"
                                    >
                                        <div className={`mb-4 transition-transform group-hover:scale-110 duration-300`}>
                                            <reason.icon className={`w-8 h-8 ${reason.color} group-hover:drop-shadow-[0_0_8px_rgba(44,185,255,0.5)]`} />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2 text-white group-hover:text-vybe-blue transition-colors">{reason.title}</h4>
                                        <p className="text-sm text-white/50 leading-relaxed">{reason.description}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className="relative p-1 rounded-3xl bg-vybe-gradient shadow-[0_0_30px_rgba(127,90,240,0.2)]"
                        >
                            <div className="bg-[#0D111C] rounded-[calc(1.5rem-1px)] p-8 overflow-hidden relative">
                                <div className="flex gap-1.5 mb-6">
                                    <div className="w-3 h-3 rounded-full bg-red-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/30" />
                                </div>

                                <pre className="font-mono text-sm md:text-base leading-relaxed">
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.5, duration: 0.5 }}
                                    >
                                        <span className="gradient-text italic">vibe</span> <span className="text-white font-bold">Main</span> {"{"}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.7, duration: 0.5 }}
                                    >
                                        {"  "}<span className="text-white">user</span> = <span className="gradient-text">fetch</span> <span className="text-yellow-400">&quot;/api/user&quot;</span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.9, duration: 0.5 }}
                                    >
                                        {"  "}<span className="gradient-text italic">sus</span> user.isVibing {"{"}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.1, duration: 0.5 }}
                                    >
                                        <span className="pl-6"><span className="gradient-text">say</span> <span className="text-yellow-400">&quot;The energy is elite! 🚀&quot;</span></span>
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.3, duration: 0.5 }}
                                    >
                                        {"  "} {"}"}
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1.5, duration: 0.5 }}
                                    >
                                        {"}"}
                                    </motion.div>
                                </pre>

                                {/* Glow Overlay */}
                                <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-vybe-blue/10 blur-[80px] rounded-full pointer-events-none" />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
