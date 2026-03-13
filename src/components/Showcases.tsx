"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import VybeHighlighter from "./VybeHighlighter";
import { Terminal as TerminalIcon, Sparkles, Layers, Terminal as IconTerminal } from "lucide-react";

export function VybeIdentity() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const identities = [
        { icon: <Sparkles className="w-6 h-6" />, title: "Fire Syntax", desc: "Expressive and modern." },
        { icon: <Layers className="w-6 h-6" />, title: "Zero Lag", desc: "Optimized for speed." },
        { icon: <IconTerminal className="w-6 h-6" />, title: "Strictly Elite", desc: "Built for systems." },
        { icon: <Sparkles className="w-6 h-6" />, title: "Strictly Fun", desc: "No more boring code." },
    ];

    return (
        <section className="py-32 relative overflow-hidden bg-vybe-dark">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-vybe-purple/10 blur-[150px] -z-10 rounded-full" />

            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={isMounted ? { opacity: 0, x: -30 } : false}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Identity</h2>
                            <h3 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                                Code with <br /> <span className="gradient-text italic">Character.</span>
                            </h3>
                            <p className="text-xl text-white/50 leading-relaxed mb-8">
                                Vybe isn&apos;t just a programming language; it&apos;s a cultural shift. We believe tools should be as expressive as the people who use them. From Gen-Z inspired syntax to elite developer tooling, everything is built for flow.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-vybe-blue mt-2.5 shrink-0" />
                                    <p className="text-white/70 italic font-medium">&quot;Clean syntax that actually makes sense for the modern web.&quot;</p>
                                </div>
                                <div className="flex gap-4 items-start">
                                    <div className="w-1.5 h-1.5 rounded-full bg-vybe-purple mt-2.5 shrink-0" />
                                    <p className="text-white/70 italic font-medium">&quot;Blazing fast runtime with a developer experience that&apos;s strictly bussin.&quot;</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
                        {identities.map((card, i) => (
                            <motion.div
                                key={i}
                                initial={isMounted ? { opacity: 0, scale: 0.9 } : false}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-3xl border border-white/5 hover:border-vybe-blue/20 transition-all group"
                            >
                                <div className="text-vybe-blue mb-4 group-hover:scale-110 transition-transform duration-300">{card.icon}</div>
                                <h4 className="font-bold text-lg mb-2">{card.title}</h4>
                                <p className="text-xs text-white/40 uppercase tracking-widest">{card.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

export function TinyGameShowcase() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [output, setOutput] = useState<string[]>([]);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => { setIsMounted(true); }, []);

    const runGame = () => {
        setIsPlaying(true);
        setOutput(["➜ vybe run game.vybe"]);

        setTimeout(() => {
            setOutput(prev => [...prev, "Guess the number! (1-10)"]);
            setTimeout(() => {
                setOutput(prev => [...prev, "Input: 7", "Checking...", "Absolute Vybe! You guessed it! 🎉"]);
                setIsPlaying(false);
            }, 1000);
        }, 800);
    };

    const codeExample = `target = rand(1, 10)
say "Guess the number! (1-10)"

guess = ask "Your guess: "

sus guess == target {
  say "Absolute Vybe! You guessed it! 🎉"
} nah {
  say "Not it. L."
}`;

    return (
        <section className="py-32 bg-vybe-dark relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-full h-[500px] bg-vybe-blue/5 blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-20">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Interactive Demo</h2>
                    <h3 className="text-4xl md:text-6xl font-black italic">Build Anything. <span className="gradient-text">Fast.</span></h3>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-stretch max-w-6xl mx-auto">
                    {/* Code Editor Mockup */}
                    <div className="lg:w-7/12">
                        <div className="glass rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden h-full flex flex-col bg-[#0D1117]">
                            <div className="bg-[#121826] px-6 py-4 flex items-center justify-between border-b border-white/5">
                                <div className="flex items-center gap-3">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                                        <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                                        <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/30 ml-2">game.vybe</span>
                                </div>
                                <button
                                    onClick={runGame}
                                    disabled={isPlaying}
                                    className="px-6 py-2 rounded-full bg-vybe-gradient text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_20px_rgba(44,185,255,0.2)]"
                                >
                                    {isPlaying ? "Executing..." : "Run Project"}
                                </button>
                            </div>
                            <div className="p-8 md:p-12 flex-1">
                                <VybeHighlighter code={codeExample} className="text-sm md:text-base leading-relaxed" />
                            </div>
                        </div>
                    </div>

                    {/* Terminal Window Mockup */}
                    <div className="lg:w-5/12">
                        <div className="glass rounded-[2rem] bg-[#0A0D14] border border-white/10 h-full flex flex-col shadow-2xl relative overflow-hidden">
                            <div className="bg-[#1a1f2e] px-6 py-4 flex items-center gap-2 border-b border-white/5">
                                <TerminalIcon className="w-4 h-4 text-vybe-blue" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">zsh — vybe-runtime</span>
                            </div>
                            <div className="p-8 font-mono text-sm md:text-base space-y-4 flex-1">
                                {output.length === 0 && !isPlaying && (
                                    <div className="text-white/10 h-full flex items-center justify-center italic text-center px-12 pt-20">
                                        The runtime is idle. Ready for deployment.
                                    </div>
                                )}
                                <div className="space-y-3">
                                    {output.map((line, i) => (
                                        <motion.div
                                            key={i}
                                            initial={isMounted ? { opacity: 0, x: -10 } : false}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={line.startsWith("➜") ? "text-vybe-blue font-bold" : "text-white/70"}
                                        >
                                            {line}
                                        </motion.div>
                                    ))}
                                    {isPlaying && (
                                        <motion.div
                                            animate={{ opacity: [0, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity }}
                                            className="w-2 h-5 bg-vybe-blue inline-block align-middle ml-1"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Subtle scanline effect for terminal */}
                            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
