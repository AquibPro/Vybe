"use client";

import React from "react";
import Link from "next/link";
import { Github, Menu } from "lucide-react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        setIsMenuOpen(false);
        if (id.startsWith('/#')) {
            return; // Let standard Link handle it
        }
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/20">
            <Link href="/" className="flex items-center gap-2 group" onClick={() => setIsMenuOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-vybe-gradient flex items-center justify-center p-0 shadow-lg overflow-hidden">
                    <img src="/logo.png" alt="V" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black tracking-tight gradient-text">
                    Vybe
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                <Link href="/#why" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] cursor-pointer">Why Vybe</Link>
                <Link href="/#features" className="hover:text-white transition-colors uppercase tracking-widest text-[10px] cursor-pointer">Features</Link>
                <Link href="/playground" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Playground</Link>
                <Link href="/docs" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Documentation</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="https://github.com/vybe-lang"
                    target="_blank"
                    className="p-2 text-white/70 hover:text-white transition-colors"
                >
                    <Github className="w-5 h-5" />
                </Link>
                <button 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="md:hidden p-2 text-white/70"
                >
                    <Menu className="w-5 h-5" />
                </button>
                <Link
                    href="/#download"
                    className="hidden md:block px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-vybe-gradient text-white rounded-xl shadow-[0_0_15px_rgba(127,90,240,0.2)] hover:shadow-[0_0_25px_rgba(127,90,240,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Download
                </Link>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="absolute top-full left-0 right-0 bg-black/95 border-b border-white/10 md:hidden animate-in slide-in-from-top duration-300">
                    <div className="flex flex-col p-6 gap-6 text-center">
                        <Link href="/#why" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">Why Vybe</Link>
                        <Link href="/#features" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">Features</Link>
                        <Link href="/playground" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">Playground</Link>
                        <Link href="/docs" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase tracking-[0.2em] text-white/70 hover:text-white">Documentation</Link>
                        <Link href="/#download" onClick={() => setIsMenuOpen(false)} className="mx-auto px-8 py-3 text-xs font-black uppercase tracking-[0.2em] bg-vybe-gradient text-white rounded-xl shadow-lg">Download</Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
