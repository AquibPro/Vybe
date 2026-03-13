"use client";

import { motion } from "framer-motion";
import { Coffee, MessageCircle, Download, Github, Layout, Package, Terminal as TerminalIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Ecosystem() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const tools = [
        { icon: TerminalIcon, name: "CLI Toolchain", desc: "Build, test, and manage packages from a single unified binary.", link: "/docs#toolchain" },
        { icon: Layout, name: "VS Code Extension", desc: "Rich syntax highlighting, intelligent autocompletion, and real-time linting." },
        { icon: Package, name: "VYPM", desc: "The Vybe Package Manager. Secure, fast, and remarkably easy to use." },
        { icon: Coffee, name: "Documentation", desc: "Comprehensive guides, API references, and interactive tutorials.", link: "/docs" }
    ];

    return (
        <section className="py-24 bg-vybe-dark relative">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Ecosystem</h2>
                    <h3 className="text-4xl md:text-5xl font-black">Supported by an <br /><span className="gradient-text italic">Elite Stack</span></h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {tools.map((tool, i) => tool.link ? (
                        <Link href={tool.link} key={i}>
                            <motion.div
                                initial={isMounted ? { opacity: 0, scale: 0.9 } : false}
                                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="glass p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-white/5 transition-colors h-full"
                            >
                                <div className="mb-6 p-4 rounded-full bg-vybe-blue/10 group-hover:bg-vybe-blue/20 transition-colors">
                                    <tool.icon className="w-8 h-8 text-vybe-blue" />
                                </div>
                                <h4 className="text-lg font-bold mb-3 group-hover:gradient-text transition-all duration-300">{tool.name}</h4>
                                <p className="text-sm text-white/40 leading-relaxed">{tool.desc}</p>
                            </motion.div>
                        </Link>
                    ) : (
                        <motion.div
                            key={i}
                            initial={isMounted ? { opacity: 0, scale: 0.9 } : false}
                            whileInView={{ opacity: 1, x: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="glass p-8 rounded-2xl flex flex-col items-center text-center group hover:bg-white/5 transition-colors h-full"
                        >
                            <div className="mb-6 p-4 rounded-full bg-vybe-blue/10 group-hover:bg-vybe-blue/20 transition-colors">
                                <tool.icon className="w-8 h-8 text-vybe-blue" />
                            </div>
                            <h4 className="text-lg font-bold mb-3">{tool.name}</h4>
                            <p className="text-sm text-white/40 leading-relaxed">{tool.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export function Installation() {
    const platforms = [
        { name: "Windows", icon: "🪟", cmd: "vybe install" },
        { name: "macOS", icon: "🍎", cmd: "brew install vybe" },
        { name: "Linux", icon: "🐧", cmd: "curl vybe.dev | sh" }
    ];

    return (
        <section id="download" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto glass rounded-3xl p-8 md:p-16 border border-vybe-blue/20 relative shadow-[0_0_50px_rgba(44,185,255,0.1)]">
                    <div className="text-center mb-12">
                        <h3 className="text-4xl font-black mb-4">Get Started with <span className="gradient-text">Vybe</span></h3>
                        <p className="text-white/60">Choose your platform and start vibing in seconds.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {platforms.map((p, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/5 flex flex-col items-center text-center cursor-pointer hover:border-vybe-blue/40 transition-colors duration-300"
                            >
                                <span className="text-4xl mb-4">{p.icon}</span>
                                <h4 className="font-bold mb-2">{p.name}</h4>
                                <code className="text-[10px] font-black gradient-text bg-vybe-blue/5 px-3 py-1.5 rounded-lg mb-4">{p.cmd}</code>
                                <button className="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white flex items-center gap-1 mt-auto">
                                    Download <Download className="w-3 h-3" />
                                </button>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <button className="btn-premium px-12 text-sm font-bold uppercase tracking-widest">
                            Latest Stable Release: v1.0.4-vybe
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}

export function Community() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    return (
        <section className="py-24 relative">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-vybe-purple/10 blur-[150px] -z-10 rounded-full" />

            <div className="container mx-auto px-6 text-center">
                <motion.div
                    initial={isMounted ? { opacity: 0, y: 30 } : false}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h3 className="text-4xl md:text-5xl font-black mb-8 italic">Join the Movement.</h3>
                    <p className="max-w-xl mx-auto text-white/50 mb-12 text-lg">
                        Vybe is more than a language. It&apos;s a collective of creators, builders, and dreamers shaping the future of software. Join us on our journey.
                    </p>

                    <div className="flex flex-wrap justify-center gap-6">
                        <Link href="#" className="flex items-center gap-3 px-8 py-3 rounded-full bg-[#5865F2] hover:bg-[#4752C4] transition-colors font-bold text-sm uppercase tracking-widest">
                            <MessageCircle className="w-5 h-5" /> Discord
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-bold text-sm uppercase tracking-widest group">
                            <Github className="w-5 h-5 transition-transform group-hover:scale-110" /> GitHub
                        </Link>
                        <Link href="#" className="flex items-center gap-3 px-8 py-3 rounded-full glass hover:bg-white/10 transition-colors font-bold text-sm uppercase tracking-widest">
                            <Coffee className="w-5 h-5 text-vybe-purple" /> Support
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export function Footer() {
    return (
        <footer className="py-16 border-t border-white/5">
            <div className="container mx-auto px-6">
                {/* Top row */}
                <div className="flex flex-col md:flex-row justify-between items-start gap-10 mb-12">
                    {/* Brand */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-3">
                            <img
                                src="/vybe.png"
                                alt="Vybe logo"
                                width={36}
                                height={36}
                                className="rounded-lg"
                            />
                            <span className="text-xl font-black tracking-tight gradient-text">Vybe</span>
                        </div>
                        <p className="text-xs text-white/30 max-w-xs leading-relaxed">
                            A modern expressive scripting language designed for clarity, creativity, and powerful developer workflows.
                        </p>
                        <p className="text-[10px] text-white/20 uppercase tracking-widest font-bold">By Aquib Khan</p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Language</h5>
                            <div className="space-y-2">
                                <Link href="/docs" className="block text-xs text-white/40 hover:text-white transition-colors">Documentation</Link>
                                <Link href="/playground" className="block text-xs text-white/40 hover:text-white transition-colors">Playground</Link>
                                <Link href="#download" className="block text-xs text-white/40 hover:text-white transition-colors">Download</Link>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Sections</h5>
                            <div className="space-y-2">
                                <Link href="#what-is-vybe" className="block text-xs text-white/40 hover:text-white transition-colors">What is Vybe?</Link>
                                <Link href="#why-vybe" className="block text-xs text-white/40 hover:text-white transition-colors">Why Vybe?</Link>
                                <Link href="#use-cases" className="block text-xs text-white/40 hover:text-white transition-colors">Use Cases</Link>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Connect</h5>
                            <div className="space-y-2">
                                <Link href="#" className="block text-xs text-white/40 hover:text-white transition-colors">GitHub</Link>
                                <Link href="#" className="block text-xs text-white/40 hover:text-white transition-colors">Discord</Link>
                                <Link href="mailto:support@vybe.dev" className="block text-xs text-white/40 hover:text-white transition-colors">Support</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <div className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                        © 2026 Vybe Core Team. All Vibes Reserved.
                    </div>
                    <div className="flex gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
                        <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link href="/license" className="hover:text-white transition-colors">License</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
