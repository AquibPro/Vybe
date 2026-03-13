"use client";

import { motion } from "framer-motion";

export default function CodePreview() {
    const code = `score = rand(1, 100)

sus score > 80 {
  say "Absolute Vybe! {score} 🔥"
} nah {
  say "Score: {score}"
}`;

    return (
        <section className="py-24 relative overflow-hidden bg-vybe-dark/50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-black mb-4"
                    >
                        Code That <span className="gradient-text">Feels Right</span>
                    </motion.h2>
                    <p className="text-white/50 text-lg max-w-2xl mx-auto">
                        Experience the flow of a language designed for the modern era. No more boilerplate, just pure logic.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1 }}
                    className="max-w-4xl mx-auto relative group"
                >
                    {/* Main Glow */}
                    <div className="absolute inset-0 bg-vybe-purple/20 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="glass rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative">
                        <div className="bg-white/5 px-6 py-4 flex items-center justify-between border-b border-white/5">
                            <div className="flex gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-white/40">main.vybe</div>
                            <div className="w-12 h-1" />
                        </div>

                        <div className="p-8 md:p-12 font-mono text-lg md:text-xl leading-relaxed">
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">1</span>
                                <span className="text-white"><span className="text-vybe-blue">score</span> = <span className="text-vybe-blue">rand</span>(<span className="text-yellow-400">1</span>, <span className="text-yellow-400">100</span>)</span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">2</span>
                                <span></span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">3</span>
                                <span><span className="text-vybe-purple italic">sus</span> score {">"} <span className="text-yellow-400">80</span> {"{"}</span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">4</span>
                                <span className="pl-6"><span className="text-vybe-blue">say</span> <span className="text-yellow-400">&quot;Absolute Vybe! {"{"}score{"}"} 🔥&quot;</span></span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">5</span>
                                <span>{"}"} <span className="text-vybe-purple italic">nah</span> {"{"}</span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">6</span>
                                <span className="pl-6"><span className="text-vybe-blue">say</span> <span className="text-yellow-400">&quot;Score: {"{"}score{"}"}&quot;</span></span>
                            </div>
                            <div className="flex">
                                <span className="text-white/20 mr-6 select-none w-4">7</span>
                                <span>{"}"}</span>
                            </div>

                            {/* Cursor animation */}
                            <motion.div
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ duration: 0.8, repeat: Infinity }}
                                className="inline-block w-2.5 h-6 bg-vybe-blue align-middle ml-1"
                            />
                        </div>

                        {/* Visual enhancements inside code window */}
                        <div className="absolute top-1/4 -right-10 w-20 h-20 bg-vybe-purple/20 blur-3xl rounded-full" />
                        <div className="absolute bottom-1/4 -left-10 w-20 h-20 bg-vybe-blue/20 blur-3xl rounded-full" />
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
