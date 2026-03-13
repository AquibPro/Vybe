"use client";

import React from "react";
import Link from "next/link";
import { Github, Menu } from "lucide-react";

export default function Navbar() {
    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 md:px-12 backdrop-blur-md border-b border-white/5 bg-black/20">
            <Link href="/" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-lg bg-vybe-gradient flex items-center justify-center p-0 shadow-lg overflow-hidden">
                    <img src="/logo.png" alt="V" className="w-full h-full object-cover" />
                </div>
                <span className="text-xl font-black tracking-tight gradient-text">
                    Vybe
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/70">
                <a href="#why" onClick={(e) => scrollToSection(e, 'why')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] cursor-pointer">Why Vybe</a>
                <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-white transition-colors uppercase tracking-widest text-[10px] cursor-pointer">Features</a>
                <Link href="/playground" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Playground</Link>
                <Link href="/docs" className="hover:text-white transition-colors uppercase tracking-widest text-[10px]">Documentation</Link>
            </div>

            <div className="flex items-center gap-4">
                <Link
                    href="https://github.com"
                    target="_blank"
                    className="p-2 text-white/70 hover:text-white transition-colors"
                >
                    <Github className="w-5 h-5" />
                </Link>
                <button className="md:hidden p-2 text-white/70">
                    <Menu className="w-5 h-5" />
                </button>
                <Link
                    href="#download"
                    className="hidden md:block px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] bg-vybe-gradient text-white rounded-xl shadow-[0_0_15px_rgba(127,90,240,0.2)] hover:shadow-[0_0_25px_rgba(127,90,240,0.4)] hover:scale-105 active:scale-95 transition-all duration-300"
                >
                    Download
                </Link>
            </div>
        </nav>
    );
}
