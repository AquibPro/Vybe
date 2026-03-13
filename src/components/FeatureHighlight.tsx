"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import VybeHighlighter from "./VybeHighlighter";

const features = [
    {
        tag: "Syntax",
        title: "Expressive\nSyntax",
        desc: "Coding should feel like poetry. Vybe's syntax is designed for the modern developer who values flow over friction.",
        code: `mood = "bussin"\n\nsus mood == "bussin" {\n  say "This language is fire 🔥"\n} nah {\n  say "Nah fr..."\n}`
    },
    {
        tag: "Tooling",
        title: "Elite\nCLI Tooling",
        desc: "A powerful single-binary toolchain. Build, test, format, and ship your code with one command.",
        code: `// One binary. Everything you need.\nvybe run main.vybe\nvybe watch main.vybe\nvybe fmt main.vybe\nvybe build -o app.exe`
    },
    {
        tag: "Scripting",
        title: "Easy\nScripting",
        desc: "From tiny automation scripts to complex systems. Vybe scales elegantly with your ambition.",
        code: `for i = 1..5 {\n  score = rand(1, 100)\n  say "Round {i}: {score} pts"\n}`
    },
    {
        tag: "Runtime",
        title: "Modern\nRuntime",
        desc: "High performance meets memory safety. Compile to tiny executables that run blindingly fast.",
        code: `// Build output stats\nvybe build main.vybe\n\n✓ Compiled in 0.8s\n✓ Binary: 1.2MB\n✓ Optimized: elite mode`
    }
];

// Each sentinel is 100vh. IntersectionObserver fires when it enters viewport center.
// This works with ANY scroll library including Lenis.

function FeatureHighlightClient() {
    const [activeFeature, setActiveFeature] = useState(0);
    const sentinelRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null]);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observers: IntersectionObserver[] = [];

        sentinelRefs.current.forEach((el, i) => {
            if (!el) return;
            const obs = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            setActiveFeature(i);
                        }
                    });
                },
                {
                    // Fire when the center 20% of the sentinel is visible
                    rootMargin: "-40% 0px -40% 0px",
                    threshold: 0,
                }
            );
            obs.observe(el);
            observers.push(obs);
        });

        return () => observers.forEach((o) => o.disconnect());
    }, []);

    const scrollToFeature = (idx: number) => {
        const el = sentinelRefs.current[idx];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    return (
        <section
            id="features"
            ref={containerRef}
            className="relative bg-vybe-dark"
            // 100vh per feature + sticky panel is 100vh = total scroll space = N*100vh
            style={{ height: `${features.length * 100}vh` }}
        >
            {/* ── Sentinel divs: one per feature, each 100vh tall ── */}
            {features.map((_, i) => (
                <div
                    key={i}
                    ref={(el) => { sentinelRefs.current[i] = el; }}
                    aria-hidden="true"
                    style={{
                        position: "absolute",
                        top: `${i * 100}vh`,
                        left: 0,
                        width: "100%",
                        height: "100vh",
                        pointerEvents: "none",
                    }}
                />
            ))}

            {/* ── Sticky content panel ── */}
            <div className="sticky top-0 h-screen flex items-center overflow-hidden">
                <div className="container mx-auto px-6 h-full flex items-center relative">

                    {/* Progress rail */}
                    <div className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex flex-col gap-3 z-20">
                        {features.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollToFeature(i)}
                                aria-label={`Go to feature ${i + 1}`}
                                className={`rounded-full transition-all duration-500 ${i === activeFeature
                                    ? "bg-vybe-blue w-2 h-8"
                                    : "bg-white/20 w-2 h-2 hover:bg-white/40"
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Main content */}
                    <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-12 pl-10">

                        {/* Left: animated feature text */}
                        <div className="lg:w-1/2 relative" style={{ minHeight: "16rem" }}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeFeature}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -40 }}
                                    transition={{ duration: 0.45, ease: "easeOut" }}
                                    className="absolute inset-0 flex flex-col justify-center"
                                >
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-[10px] font-black uppercase tracking-[0.3em] gradient-text border border-vybe-blue/30 px-3 py-1 rounded-full">
                                            {activeFeature + 1} / {features.length}
                                        </span>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                                            {features[activeFeature].tag}
                                        </span>
                                    </div>
                                    <h3 className="text-4xl md:text-6xl font-black mb-6 leading-tight whitespace-pre-line">
                                        {features[activeFeature].title}
                                    </h3>
                                    <p className="text-lg text-white/50 leading-relaxed max-w-lg">
                                        {features[activeFeature].desc}
                                    </p>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Right: code window */}
                        <div className="lg:w-1/2 w-full">
                            <motion.div
                                whileHover={{ y: -6 }}
                                transition={{ duration: 0.3 }}
                                className="glass rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-[#0D1117]"
                            >
                                <div className="bg-[#121826] px-6 py-4 flex items-center justify-between border-b border-white/5">
                                    <div className="flex gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                        <div className="w-3 h-3 rounded-full bg-green-500/70" />
                                    </div>
                                    <div className="text-[10px] font-bold uppercase tracking-widest text-white/30">
                                        VibeIDE — {features[activeFeature].tag.toLowerCase()}.vybe
                                    </div>
                                    <div className="w-12" />
                                </div>

                                <div className="p-8 md:p-12 overflow-hidden" style={{ height: 300 }}>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={`code-${activeFeature}`}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -20 }}
                                            transition={{ duration: 0.35, ease: "easeOut" }}
                                        >
                                            <VybeHighlighter code={features[activeFeature].code} className="text-xl" />
                                        </motion.div>
                                    </AnimatePresence>
                                </div>
                            </motion.div>
                        </div>
                    </div>

                    {/* Scroll hint */}
                    {activeFeature < features.length - 1 && (
                        <motion.div
                            animate={{ y: [0, 8, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
                        >
                            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll</span>
                            <div className="w-0.5 h-8 bg-gradient-to-b from-white to-transparent" />
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Bottom fade into next section */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-vybe-dark to-transparent pointer-events-none" />
        </section>
    );
}

export default function FeatureHighlight() {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) {
        return (
            <section id="features" className="bg-vybe-dark py-24">
                <div className="container mx-auto px-6 space-y-24">
                    {features.map((f, i) => (
                        <div key={i} className="flex flex-col gap-8 border-t border-white/5 pt-12">
                            <div>
                                <h2 className="text-xs font-bold uppercase tracking-[0.3em] gradient-text mb-4">
                                    Feature {i + 1}
                                </h2>
                                <h3 className="text-4xl font-black mb-6 whitespace-pre-line">{f.title}</h3>
                                <p className="text-xl text-white/50 leading-relaxed max-w-lg">{f.desc}</p>
                            </div>
                            <div className="glass rounded-2xl p-6 bg-[#0D1117] border border-white/10">
                                <VybeHighlighter code={f.code} />
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    return <FeatureHighlightClient />;
}
