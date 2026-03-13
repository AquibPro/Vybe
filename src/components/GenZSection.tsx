"use client";

import { motion } from "framer-motion";
import VybeHighlighter from "./VybeHighlighter";

const comparisons = [
    {
        label: "Hello World",
        traditional: {
            lang: "Java",
            code: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`
        },
        vybe: { code: `say "Hello, Vybe! 🚀"` }
    },
    {
        label: "Web Server",
        traditional: {
            lang: "C (Standard Library)",
            code: `#include <stdio.h>\n#include <string.h>\n#include <unistd.h>\n#include <netinet/in.h>\n\nint main() {\n    int server_fd = socket(AF_INET, SOCK_STREAM, 0);\n    struct sockaddr_in addr;\n    addr.sin_family = AF_INET;\n    addr.sin_port = htons(3000);\n    addr.sin_addr.s_addr = INADDR_ANY;\n\n    bind(server_fd, (struct sockaddr*)&addr, sizeof(addr));\n    listen(server_fd, 5);\n\n    while (1) {\n        int client = accept(server_fd, NULL, NULL);\n        char response[] = \n            "HTTP/1.1 200 OK\\r\\n"\n            "Content-Type: text/plain\\r\\n\\r\\n"\n            "Hello from Vybe! 🚀";\n        write(client, response, strlen(response));\n        close(client);\n    }\n}`
        },
        vybe: { code: `serve 3000 -> "Hello from Vybe! 🚀"` }
    },
    {
        label: "Loops",
        traditional: { lang: "Python", code: `for i in range(1, 6):\n    print(f"Round {i}")` },
        vybe: { code: `for i = 1..5 {\n  say "Round {i}"\n}` }
    },
    {
        label: "File Ops",
        traditional: {
            lang: "Node.js",
            code: `const fs = require('fs');\nconst data = fs.readFileSync('vibe.txt', 'utf8');\nfs.renameSync('a.txt', 'b.txt');`
        },
        vybe: { code: `data = read "vibe.txt"\nmove "a.txt" into "b.txt"` }
    },
    {
        label: "Web Requests",
        traditional: {
            lang: "Node.js",
            code: `const res = await fetch(url);\nconst data = await res.json();\nsay(data.status);`
        },
        vybe: { code: `fetch url into data\nsay data.status` }
    },
    {
        label: "Variables",
        traditional: { lang: "Java", code: `int age = 24;\nString name = "Aquib";\nboolean isElite = true;` },
        vybe: { code: `age = 24\nname = "Aquib"\nisElite = frfr` }
    }
];

const keywords = [
    { vybe: "implicit", means: "declare a variable (x = 10)" },
    { vybe: "swap", means: "reassign a variable" },
    { vybe: "vibe", means: "define a function" },
    { vybe: "sus", means: "if - check condition" },
    { vybe: "nah", means: "else - fallback" },
    { vybe: "say", means: "print to console" },
    { vybe: "return", means: "return a value" },
    { vybe: "grind", means: "repeat N times" },
    { vybe: "gng", means: "define a class" },
    { vybe: "serve", means: "start web server" },
    { vybe: "stash", means: "dynamic array" },
    { vybe: "yo", means: "import package" },
    { vybe: "once", means: "run only once" },
    { vybe: "frfr", means: "true" },
    { vybe: "cap", means: "false" },
    { vybe: "ghost", means: "null / nothing" },
];

export default function GenZSection() {
    return (
        <section id="genz" className="py-32 relative overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 rounded-full bg-vybe-purple/10 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-vybe-blue/10 blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    className="text-center mb-20"
                >
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-vybe-blue border border-vybe-blue/30 px-4 py-2 rounded-full mb-6">
                        <span>✦</span> Built for Gen-Z
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black italic mb-6">
                        Code in your{" "}
                        <span className="gradient-text shimmer">
                            own language
                        </span>
                    </h2>
                    <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                        Programming is easier when the syntax matches how your brain works. Vybe maps culture to code — so you stop translating and start creating.
                    </p>
                </motion.div>

                {/* Keyword Glossary */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.1 }}
                    className="mb-20"
                >
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 text-center">Vybe Keyword Dictionary</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {keywords.map((kw, i) => (
                            <motion.div
                                key={kw.vybe}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.04 }}
                                whileHover={{ y: -4, scale: 1.03 }}
                                className="glass rounded-2xl p-4 border border-white/5 cursor-default group"
                            >
                                <div className="font-mono font-black text-lg mb-1 gradient-text transition-colors group-hover:scale-110 duration-300">{kw.vybe}</div>
                                <div className="text-[11px] text-white/40 leading-tight">{kw.means}</div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Side-by-side comparisons */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                >
                    <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-8 text-center">Traditional vs. Vybe</h3>
                    <div className="space-y-6">
                        {comparisons.map((cmp, i) => (
                            <motion.div
                                key={cmp.label}
                                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="grid grid-cols-1 lg:grid-cols-2 gap-4"
                            >
                                {/* Traditional */}
                                <div className="bg-[#0D1117] rounded-2xl border border-white/5 overflow-hidden opacity-60 hover:opacity-80 transition-opacity">
                                    <div className="px-5 py-3 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{cmp.label}</span>
                                        <span className="text-[10px] text-red-400/60 font-bold uppercase tracking-widest">{cmp.traditional.lang}</span>
                                    </div>
                                    <div className="p-5 font-mono text-sm text-white/50 whitespace-pre">{cmp.traditional.code}</div>
                                </div>

                                {/* Vybe */}
                                <div className="bg-[#0D1117] rounded-2xl border border-vybe-purple/20 overflow-hidden shadow-[0_0_30px_rgba(127,90,240,0.1)]">
                                    <div className="px-5 py-3 border-b border-vybe-purple/10 flex items-center justify-between bg-vybe-purple/5">
                                        <span className="text-[10px] font-bold uppercase tracking-widest gradient-text">{cmp.label}</span>
                                        <span className="text-[10px] font-black uppercase tracking-widest gradient-text">Vybe ✦</span>
                                    </div>
                                    <div className="p-5">
                                        <VybeHighlighter code={cmp.vybe.code} className="text-sm" />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* Call to action */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="text-center mt-20"
                >
                    <p className="text-2xl font-black italic text-white/80 mb-2">
                        Less boilerplate. More <span className="gradient-text">vibe.</span>
                    </p>
                    <p className="text-white/30 text-sm">The shortest path from idea to running code.</p>
                </motion.div>
            </div>
        </section>
    );
}
