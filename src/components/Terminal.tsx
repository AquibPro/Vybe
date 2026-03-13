"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const commands = [
    { text: "vybe create project", delay: 1000 },
    { text: "vybe run", delay: 2000 },
    { text: "vybe build --release", delay: 1500 },
    { text: "Successfully built stand-alone executable!", delay: 500, type: "success" }
];

export default function Terminal() {
    const [visibleLines, setVisibleLines] = useState<number>(0);
    const [currentText, setCurrentText] = useState("");
    const [commandIndex, setCommandIndex] = useState(0);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (commandIndex >= commands.length) return;

        const command = commands[commandIndex];
        let charIndex = 0;

        const typingInterval = setInterval(() => {
            if (charIndex < command.text.length) {
                setCurrentText((prev) => prev + command.text[charIndex]);
                charIndex++;
            } else {
                clearInterval(typingInterval);
                setTimeout(() => {
                    setCommandIndex((prev) => prev + 1);
                    setVisibleLines((prev) => prev + 1);
                    setCurrentText("");
                }, command.delay);
            }
        }, 50);

        return () => clearInterval(typingInterval);
    }, [commandIndex]);

    return (
        <section id="cli" className="py-24 bg-vybe-dark">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                        <h2 className="text-sm font-bold uppercase tracking-widest text-vybe-blue mb-4">CLI Experience</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-6">Master the Toolchain <br /><span className="gradient-text italic">Zero Configuration</span></h3>
                        <p className="text-white/60 mb-8 max-w-lg leading-relaxed text-lg">
                            Everything you need comes built-in. From package management to formatting, the Vybe CLI is your control center for shipping elite software.
                        </p>
                        <div className="flex gap-4">
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white mb-1">Single Binary</span>
                                <span className="text-xs text-white/40 uppercase tracking-widest">No dependencies required</span>
                            </div>
                            <div className="w-px h-12 bg-white/10 mx-4" />
                            <div className="flex flex-col">
                                <span className="text-2xl font-bold text-white mb-1">Auto-fmt</span>
                                <span className="text-xs text-white/40 uppercase tracking-widest">Built-in opinionated formatter</span>
                            </div>
                        </div>
                    </div>

                    <div className="lg:w-1/2 w-full">
                        <motion.div
                            initial={isMounted ? { opacity: 0, x: 20 } : false}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="glass rounded-2xl overflow-hidden border border-white/5 shadow-2xl"
                        >
                            <div className="bg-white/5 px-4 py-3 flex items-center justify-between border-b border-white/5">
                                <div className="flex gap-1.5">
                                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/30" />
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/30" />
                                </div>
                                <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">zsh — 80x24</div>
                                <div className="w-8" />
                            </div>
                            <div className="p-6 md:p-8 font-mono text-sm md:text-base h-80 overflow-y-auto">
                                {commands.slice(0, visibleLines).map((cmd, i) => (
                                    <div key={i} className="mb-2">
                                        <span className="text-green-500 mr-2">➜</span>
                                        <span className="text-white/40 mr-2">~</span>
                                        <span className={cmd.type === "success" ? "text-vybe-blue font-bold" : "text-white"}>{cmd.text}</span>
                                    </div>
                                ))}

                                {commandIndex < commands.length && (
                                    <div className="flex">
                                        <span className="text-green-500 mr-2">➜</span>
                                        <span className="text-white/40 mr-2">~</span>
                                        <span className="text-white">{currentText}</span>
                                        <motion.span
                                            animate={{ opacity: [0, 1] }}
                                            transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                                            className="w-2 h-5 bg-white ml-0.5 mt-0.5"
                                        />
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
