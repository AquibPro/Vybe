"use client";

import { motion } from "framer-motion";
import { Coffee, MessageCircle, Download, Github, Layout, Package, Terminal as TerminalIcon, Copy, Check, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Ecosystem() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    const tools = [
        { icon: TerminalIcon, name: "CLI Toolchain", desc: "Build, test, and manage packages from a single unified binary.", link: "/docs#toolchain" },
        { icon: Layout, name: "VS Code Extension", desc: "Rich syntax highlighting, intelligent autocompletion, and real-time linting." },
        { icon: Package, name: "NPM Native", desc: "Use any NPM package. Install with 'vybe install' and import with 'yo'." },
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
        {
            name: "Windows",
            icon: (
                <svg className="w-12 h-12 mb-6 text-vybe-blue" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M0 3.449L9.75 2.1V11.7H0V3.449zM0 12.3h9.75v9.6L0 20.551V12.3zM10.55 1.95L24 0v11.7H10.55V1.95zM10.55 12.3H24v11.7l-13.45-1.95V12.3z" />
                </svg>
            ),
            subtitle: "x64 & ARM64",
            label: "Download v1.0.0",
            available: true,
            comingSoon: false,
        },
        {
            name: "macOS",
            icon: (
                <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-12 h-12 mb-6 invert opacity-80" alt="macOS" />
            ),
            subtitle: "Apple Silicon & Intel",
            label: "Coming Soon",
            available: false,
            comingSoon: true,
        },
        {
            name: "Linux",
            icon: (
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/35/Tux.svg" className="w-12 h-12 mb-6 opacity-80" alt="Linux" />
            ),
            subtitle: "Binary & DEB Packages",
            label: "Coming Soon",
            available: false,
            comingSoon: true,
        }
    ];

    return (
        <section id="download" className="py-24 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto glass rounded-[2.5rem] p-8 md:p-16 border border-vybe-blue/20 relative shadow-[0_0_50px_rgba(44,185,255,0.1)]">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Downloads</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-4">Start Your <span className="gradient-text">Elite Journey</span></h3>
                        <p className="text-white/60">Version 1.0.0 is here. High performance, zero compromises.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {platforms.map((p, i) => (
                            <motion.div
                                key={i}
                                whileHover={p.available ? { y: -10, scale: 1.02 } : {}}
                                className={`p-8 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 ${
                                    p.available 
                                    ? "bg-white/5 border border-white/10 hover:border-vybe-blue/50 hover:bg-vybe-blue/5 cursor-pointer shadow-lg" 
                                    : "bg-white/[0.02] border border-white/[0.05] grayscale opacity-50"
                                }`}
                            >
                                {p.icon}
                                <h4 className={`text-2xl font-black mb-1 ${p.available ? "text-white" : "text-white/40"}`}>{p.name}</h4>
                                <p className="text-xs text-white/40 mb-8 font-medium">{p.subtitle}</p>
                                
                                {p.available ? (
                                    <a 
                                        href="https://vybelang.netlify.app/vybe-1.0.0-win-x64.exe"
                                        className="w-full btn-premium py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
                                    >
                                        {p.label} <Download className="w-4 h-4 transition-transform group-hover:translate-y-1" />
                                    </a>
                                ) : (
                                    <div className="w-full py-4 rounded-xl border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 bg-white/5">
                                        {p.label}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-white/10 border border-white/20 backdrop-blur-xl">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">
                                Latest Release: <span className="text-white">v1.0.0-vybe</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}export function VSCodeExtension() {
    const [copied, setCopied] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    
    useEffect(() => { setIsMounted(true); }, []);

    const copyCommand = () => {
        navigator.clipboard.writeText("code --install-extension vybe-lang.vybe");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const methods = [
        {
            name: "VS Marketplace",
            icon: <img src="https://upload.wikimedia.org/wikipedia/commons/9/9a/Visual_Studio_Code_1.35_icon.svg" className="w-12 h-12 mb-6" alt="VS Code" />,
            subtitle: "Web Browser",
            label: "Visit Marketplace",
            link: "https://marketplace.visualstudio.com/items?itemName=vybe-lang.vybe",
            type: "link"
        },
        {
            name: "VS Code CLI",
            icon: <TerminalIcon className="w-12 h-12 mb-6 text-vybe-blue" />,
            subtitle: "Command Line",
            label: "code --install-extension vybe-lang.vybe",
            type: "command"
        }
    ];

    return (
        <section id="vscode" className="py-24 relative overflow-hidden bg-vybe-dark/30">
            <div className="container mx-auto px-6">
                <div className="max-w-5xl mx-auto glass rounded-[2.5rem] p-8 md:p-16 border border-vybe-blue/20 relative shadow-[0_0_50px_rgba(44,185,255,0.05)]">
                    <div className="text-center mb-16">
                        <h2 className="text-sm font-bold uppercase tracking-[0.3em] gradient-text mb-4">Editor Support</h2>
                        <h3 className="text-4xl md:text-5xl font-black mb-4">Official <span className="gradient-text italic">VS Code</span> Extension</h3>
                        <p className="text-white/60 max-w-2xl mx-auto">
                            Get the best developer experience for <span className="text-white font-bold">.vybe</span> files. 
                            Syntax highlighting, intelligent autocompletion, and real-time linting—proudly verified.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {methods.map((method, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -10, scale: 1.02 }}
                                className="p-8 rounded-[2rem] flex flex-col items-center text-center transition-all duration-300 bg-white/5 border border-white/10 hover:border-vybe-blue/50 hover:bg-vybe-blue/5 shadow-lg"
                            >
                                {method.icon}
                                <h4 className="text-2xl font-black mb-1 text-white">{method.name}</h4>
                                <p className="text-xs text-white/40 mb-8 font-medium uppercase tracking-widest">{method.subtitle}</p>
                                
                                {method.type === "link" ? (
                                    <a 
                                        href={method.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full btn-premium py-4 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 group"
                                    >
                                        {method.label} <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                    </a>
                                ) : (
                                    <button 
                                        onClick={copyCommand}
                                        className="w-full relative group/cmd"
                                    >
                                        <div className="w-full py-4 rounded-xl border border-white/10 text-[10px] font-mono text-vybe-blue bg-black/40 px-4 break-all min-h-[56px] flex items-center justify-center">
                                            {method.label}
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center bg-vybe-blue rounded-xl opacity-0 group-hover/cmd:opacity-100 transition-opacity">
                                            <span className="text-xs font-black uppercase tracking-widest text-white flex items-center gap-2">
                                                {copied ? <><Check className="w-4 h-4" /> Copied</> : <><Copy className="w-4 h-4" /> Copy Command</>}
                                            </span>
                                        </div>
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-16 text-center">
                        <p className="text-xs text-white/30 font-medium italic">
                            &quot;Recommended for all developers editing .vybe source files.&quot;
                        </p>
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
                        <Link href="https://instagram.com/vybelang" target="_blank" className="flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-tr from-[#FFB353] via-[#FF2C7D] to-[#9900FA] hover:opacity-90 transition-opacity font-bold text-sm uppercase tracking-widest text-white">
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.947.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                            </svg>
                            Instagram
                        </Link>
                        <Link href="https://github.com/vybe-lang" target="_blank" className="flex items-center gap-3 px-8 py-3 rounded-full bg-white text-black hover:bg-gray-200 transition-colors font-bold text-sm uppercase tracking-widest group">
                            <Github className="w-5 h-5 transition-transform group-hover:scale-110" /> GitHub
                        </Link>
                        <Link href="mailto:support@vybelang.org" className="flex items-center gap-3 px-8 py-3 rounded-full glass hover:bg-white/10 transition-colors font-bold text-sm uppercase tracking-widest">
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
                        <p className="text-[10px] text-white/40 uppercase tracking-widest font-black">By Aquib Khan</p>
                        <p className="text-[9px] text-vybe-blue font-bold uppercase tracking-widest -mt-2">Founder & Creator of Vybe</p>
                    </div>

                    {/* Links */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Language</h5>
                            <div className="space-y-2">
                                <Link href="/docs" className="block text-xs text-white/40 hover:text-white transition-colors">Documentation</Link>
                                <Link href="/playground" className="block text-xs text-white/40 hover:text-white transition-colors">Playground</Link>
                                <Link href="/#download" className="block text-xs text-white/40 hover:text-white transition-colors">Download</Link>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Sections</h5>
                            <div className="space-y-2">
                                <Link href="/#what-is-vybe" className="block text-xs text-white/40 hover:text-white transition-colors">What is Vybe?</Link>
                                <Link href="/#why-vybe" className="block text-xs text-white/40 hover:text-white transition-colors">Why Vybe?</Link>
                                <Link href="/#features" className="block text-xs text-white/40 hover:text-white transition-colors text-ellipsis overflow-hidden">Features</Link>
                                <Link href="/#download" className="block text-xs text-white/40 hover:text-white transition-colors">Downloads</Link>
                            </div>
                        </div>
                        <div>
                            <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-4">Connect</h5>
                             <div className="space-y-2">
                                <Link href="https://github.com/vybe-lang" target="_blank" className="block text-xs text-white/40 hover:text-white transition-colors">GitHub</Link>
                                <Link href="https://instagram.com/vybelang" target="_blank" className="block text-xs text-white/40 hover:text-white transition-colors">Instagram</Link>
                                <Link href="mailto:support@vybelang.org" className="block text-xs text-white/40 hover:text-white transition-colors font-bold text-vybe-blue">Support</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-white/5">
                    <div className="text-[10px] font-medium text-white/20 uppercase tracking-widest">
                        © 2026 Vybe. All rights reserved. Unauthorized copying or redistribution is strictly prohibited.
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
