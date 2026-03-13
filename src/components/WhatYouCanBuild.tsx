"use client";
import { motion } from "framer-motion";
import VybeHighlighter from "./VybeHighlighter";

const useCases = [
    {
        icon: "⚙️",
        title: "CLI Tools",
        desc: "Ship interactive command-line apps in minutes.",
        code: `// Define CLI commands with ease
vibe greet(name) {
  say "Hello, {name}! 👋"
}

ask "Your name?" into name
greet name`,
    },
    {
        icon: "🤖",
        title: "Automation Scripts",
        desc: "Process files, run tasks, and automate workflows.",
        code: `// Process a list of tasks
tasks = ["lint", "test", "build"]

each task in tasks {
  say "Running: {task}..."
}

say "All done! ✨"`,
    },
    {
        icon: "🌐",
        title: "Data Processing",
        desc: "Crunch data, transform lists, and compute results.",
        code: `scores = [82, 91, 67, 95, 73]
total = 0

each s in scores {
  total += s
}

avg = int(total / size scores)
say "Average score: {avg}"`,
    },
    {
        icon: "🧩",
        title: "Scripting & Glue",
        desc: "Connect APIs, parse data, and build fast utilities.",
        code: `// Pattern-match HTTP status codes
status = 404

match status {
  200 => { say "OK — All good ✓" }
  404 => { say "Not Found — mid fr" }
  500 => { say "Server Error — nah" }
  _   => { say "Unknown status" }
}`,
    },
];

export default function WhatYouCanBuild() {
    return (
        <section id="use-cases" className="py-32 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[300px] rounded-full bg-vybe-blue/6 blur-[120px]" />
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] gradient-text border border-vybe-blue/30 px-4 py-2 rounded-full mb-6">
                        <span>✦</span> Use Cases
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic mb-6">
                        What You Can{" "}
                        <span className="gradient-text shimmer">Build</span>
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                        From tiny scripts to complete CLI tools — Vybe handles it all with expressive, minimal code.
                    </p>
                </motion.div>

                {/* Cards grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {useCases.map((uc, i) => (
                        <motion.div
                            key={uc.title}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1, duration: 0.6 }}
                            whileHover={{ y: -8, boxShadow: "0 24px 60px rgba(44,185,255,0.1)" }}
                            className="glass rounded-[2rem] overflow-hidden border border-white/5 transition-all duration-300 group cursor-default"
                        >
                            {/* Card header */}
                            <div className="px-7 pt-7 pb-4 flex items-start gap-4">
                                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">{uc.icon}</div>
                                <div>
                                    <h3 className="text-xl font-black group-hover:text-vybe-blue transition-colors">{uc.title}</h3>
                                    <p className="text-sm text-white/40 mt-1">{uc.desc}</p>
                                </div>
                            </div>

                            {/* Code window */}
                            <div className="mx-5 mb-5 bg-[#0D1117] rounded-2xl overflow-hidden border border-white/5">
                                <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-[#121826]">
                                    <div className="w-2 h-2 rounded-full bg-red-500/60" />
                                    <div className="w-2 h-2 rounded-full bg-yellow-500/60" />
                                    <div className="w-2 h-2 rounded-full bg-green-500/60" />
                                    <span className="ml-3 text-[10px] font-bold uppercase tracking-widest text-white/20">{uc.title.toLowerCase().replace(/ /g, "_")}.vybe</span>
                                </div>
                                <div className="p-5">
                                    <VybeHighlighter code={uc.code} className="text-sm" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
