"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Book, Code2, Terminal, Zap, Cpu, ArrowRight, Box, GitBranch, Repeat, Package, AlertTriangle, List, Hash, FunctionSquare, Layers, RefreshCw, Shuffle, SpellCheck } from "lucide-react";
import VybeHighlighter from "@/components/VybeHighlighter";
import Navbar from "@/components/Navbar";

const docSections = [
    {
        id: "introduction",
        title: "Introduction",
        icon: Book,
        description: "Vision, philosophy, and the Vybe aesthetic.",
        content: `Vybe is a modern, high-performance programming language designed by **Aquib Khan**. It bridges the gap between low-level efficiency and high-level expressiveness. 

**The Vision**
Traditional programming often feels like mechanical translation. Vybe maps human culture and intent directly to machine instructions. We've removed the legacy boilerplate that kills developer flow, allowing you to go from a conceptual "vibe" to a running system in seconds.

**Core Pillars**
- **Dynamic & Implicit**: No more \`int\`, \`string\`, or \`let\`. Assign a value, and it exists.
- **Natural Language**: Actions like \`say\`, \`ask\`, \`wait\`, and \`fetch\` are first-class keywords.
- **Elite Performance**: Compiles to optimized JavaScript for the V8 engine, with a zero-overhead runtime.
- **Modern Ecosystem**: Built-in support for NPM packages and direct JavaScript interop.`,
        examples: [
            {
                label: "The Ultimate Hello",
                code: `say "Welcome to Vybe! 🚀"\nsay "Let's get bussin fr"`
            },
            {
                label: "Aura Check",
                code: `name = "Aquib"\naura = 9000\nsay "{name}'s aura level: {aura}"`
            }
        ]
    },
    {
        id: "variables",
        title: "Variables & State",
        icon: Hash,
        description: "Implicit declarations and dynamic typing.",
        content: `In Vybe, variables are **implicitly declared**. You don't need \`let\`, \`const\`, or \`var\`. 

**Assignment**
Simply use the equals sign to create or update a variable.
\`score = 100\`
\`name = "Elite User"\`

**Reassignment**
While initial assignment is implicit, you can use the \`swap\` keyword for explicit reassignment if you find it clarifies your intent (though it's optional in most cases).
\`swap score = 150\`

**Constants**
Vybe treats all top-level variables as stable. However, if you're coming from JS, remember that you don't need any prefix to start "cooking" with data.

**Null Safety**
The \`ghost\` keyword represents null. Use the \`??\` (Nothingness Fallback) to handle potential ghosts.
\`display = username ?? "Guest"\``,
        examples: [
            {
                label: "Variables in Action",
                code: `points = 10\npoints += 5\n\nleader = "Aquib"\nsay "Player: {leader}, Score: {points}"\n\nstatus = ghost\nsay "Status: {status ?? 'Checking...'}"`
            }
        ]
    },
    {
        id: "keywords",
        title: "The Dictionary",
        icon: SpellCheck,
        description: "A complete guide to Vybe's lexicon.",
        content: `Vybe's syntax is powered by expressive keywords that replace dry, traditional alternatives.

**Control Flow**
- **sus**: If (Check a condition)
- **fr**: Else If (Further check)
- **nah**: Else (Fallback)
- **match**: Detailed pattern matching
- **bounce / skip**: Break and Continue

**Values**
- **frfr**: True
- **cap**: False
- **ghost**: Null
- **it**: Default iterator in \`grind\` loops

**Structure**
- **vibe**: Function declaration
- **gng / squad**: Class / Module declaration
- **zone**: Namespace
- **stash**: List (Array) initialization`,
        examples: [
            {
                label: "The Logic Flow",
                code: `vibe check_vibe(aura) {\n  sus aura > 1000 {\n    say "Elite status frfr"\n  } fr aura > 0 {\n    say "Valid."\n  } nah {\n  say "Cap detected."\n  }\n}`
            }
        ]
    },
    {
        id: "loops",
        title: "Loops & Iteration",
        icon: Repeat,
        description: "Grinding through collections and ranges.",
        content: `Iteration in Vybe is designed to be concise.

**The Grind (Fixed Count)**
Use \`grind\` to repeat logic a specific number of times. It automatically provides an \`it\` variable for the current index.
\`grind 5 -> say "Round {it}"\`

**The Each (Collections)**
Iterate through lists (stashes) or objects with ease.
\`each item in inventory { say item }\`

**The Range Loop**
Classic range-based iteration using the \`..\` operator.
\`for i = 1..10 { say "Number {i}" }\`

**The Spin (While)**
Loop as long as a condition is met.
\`spin score < 100 { score += 1 }\``,
        examples: [
            {
                label: "Iteration Showcase",
                code: `say "Counting down:"\nfor i = 5..1 {\n  say i\n  wait 1s\n}\nsay "Blasted off! 🚀"`
            }
        ]
    },
    {
        id: "functions",
        title: "Functions & Vibes",
        icon: FunctionSquare,
        description: "Defining logic with vibe and arrows.",
        content: `Functions (or **vibes**) are first-class citizens in Vybe.

**Standard Vibes**
\`vibe calculate(x, y) {\n  return x * y\n}\`

**Arrow Shorthand**
Perfect for callbacks and one-liners.
\`double = (n) -> n * 2\`

**Async Vibes**
Vybe is built for the modern web. Every vibe can be \`async\`.
\`async vibe fetchData() {\n  return await fetch "https://api.vybe.dev"\n}\`

**The "Move" Modifier**
Use \`move vibe\` to indicate a function that migrates state or performs destructive operations.
\`move vibe wipe() { ... }\``,
        examples: [
            {
                label: "Callback Pattern",
                code: `process = (data, handle) -> handle(data)\n\nprocess("secret", (d) -> say "Processing {d}...")`
            }
        ]
    },
    {
        id: "npm-interop",
        title: "NPM & Packages",
        icon: Package,
        description: "Using the world's largest ecosystem.",
        content: `Vybe is fully compatible with NPM. You don't need a separate package manager for libraries; just use Vybe.

**Installing Packages**
Run the following in your terminal:
\`vybe install axios\`
\`vybe install lodash\`

**Importing (The 'yo' Keyword)**
To use a package in your Vybe code, use the \`yo\` (or \`plug\`) keyword.
\`yo axios\`
\`yo "path/to/local/file"\`

**Package Usage**
Once imported, you use them just like any other Vybe object.
\`res = axios.get("https://google.com")\``,
        examples: [
            {
                label: "Using Lodash",
                code: `yo lodash\n\nnums = [1, 2, 3]\nshuffled = lodash.shuffle(nums)\nsay shuffled`
            }
        ]
    },
    {
        id: "js-interop",
        title: "JavaScript Interop",
        icon: RefreshCw,
        description: "Directly running JS inside Vybe.",
        content: `Sometimes you need to escape the Vybe syntax and use raw JavaScript. Vybe makes this seamless with the \`js { ... }\` block.

**Raw Blocks**
Code inside the \`js\` block is executed as raw Node.js code.
\`res = js { return require('os').platform() }\`

**Why use it?**
- Access low-level Node.js APIs (fs, child_process, etc.)
- Use libraries that aren't easily wrapped in Vybe.
- Performance critical sections that require raw V8 optimizations.

**Sharing Scope**
Variables declared in Vybe are accessible in JS, and values returned from JS are stored back in Vybe.`,
        examples: [
            {
                label: "OS Info Bridge",
                code: `info = js {\n  const os = require('os');\n  return { \n    memory: os.totalmem(),\n    cpu: os.cpus().length\n  }\n}\nsay "System Specs: {info.cpu} cores, {info.memory} bytes"`
            }
        ]
    },
    {
        id: "natural-commands",
        title: "Natural Commands",
        icon: Terminal,
        description: "The power of built-in terminal verbs.",
        content: `Vybe includes high-level "Natural Commands" that make system tasks trivial.

**File System**
- **read "file.txt" into data**: Read file contents.
- **write data into "file.txt"**: Write or overwrite a file.
- **move "a.txt" to "b.txt"**: Rename or move files.
- **delete "temp.log"**: Remove a file.

**Networking**
- **fetch "url" into results**: Perform HTTP GET requests asynchronously.
- **serve 3000 -> "Hello"**: Start a web server on a port.

**Execution**
- **run "npm start"**: Execute shell commands and capture output.
- **wait 5s**: Pause the current execution thread.`,
        examples: [
            {
                label: "System Clean-up",
                code: `say "Cleaning logs..."\ndelete "./tmp/old.log"\nwait 500ms\nsay "Done."`
            }
        ]
    },
    {
        id: "advanced",
        title: "Elite Features",
        icon: Cpu,
        description: "Once-blocks, Namespaces, and Namespaces.",
        content: `For building large-scale systems, Vybe offers unique architectural tools.

**The Once Block**
Code inside a \`once\` block will ONLY execute the very first time it's encountered in the entire lifecycle of the program. 
\`once {\n  say "Initializing global singleton..."\n}\`

**Zones (Namespaces)**
Organize your code into logical modules.
\`zone Database {\n  vibe connect() { ... }\n}\`

**Squads (Classes)**
Classic object orientation with a modern twist.
\`gng Player {\n  init(name) { this.name = name }\n  vibe play() { say "{this.name} is playing" }\n}\``,
        examples: [
            {
                label: "Singleton Pattern",
                code: `init = () -> once {\n  say "Connect to Database 🔌"\n}\n\ngrind 10 {\n  init()\n  say "Querying..."\n}`
            }
        ]
    }
];

export default function DocsPage() {
    const [search, setSearch] = useState("");
    const [activeId, setActiveId] = useState("introduction");
    const [isMounted, setIsMounted] = useState(false);
    const mainRef = useRef<HTMLDivElement>(null);

    const navigateTo = (id: string) => {
        setActiveId(id);
        setTimeout(() => {
            mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 50);
    };

    useEffect(() => { setIsMounted(true); }, []);

    if (!isMounted) return null;

    const filtered = docSections.filter(s =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase())
    );

    const active = docSections.find(s => s.id === activeId) ?? docSections[0];

    const activeIdx = docSections.findIndex(s => s.id === activeId);

    return (
        <div className="min-h-screen bg-vybe-dark text-white flex flex-col">
            <Navbar />

            {/* Wrapper spanning screen minus navbar */}
            <div className="flex pt-16 flex-1 overflow-hidden" style={{ height: "100vh" }}>

                {/* Fixed, scrollable sidebar */}
                <aside className="hidden lg:flex flex-col w-72 xl:w-80 border-r border-white/5 bg-[#080C16] h-full overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="mb-6">
                        <h1 className="text-xl font-black italic mb-1">Documentation</h1>
                        <p className="text-xs text-white/30">Vybe Language v1.0.0</p>
                    </div>

                    <div className="relative mb-6">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                            type="text"
                            placeholder="Search docs..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-vybe-blue/50 transition-colors"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>

                    <nav className="space-y-1 pb-10">
                        {filtered.map(s => (
                            <button
                                key={s.id}
                                onClick={() => navigateTo(s.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${activeId === s.id
                                    ? "bg-vybe-purple/20 text-white border border-vybe-purple/20"
                                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                                    }`}
                            >
                                <s.icon className={`w-4 h-4 flex-shrink-0 ${activeId === s.id ? "text-vybe-blue" : ""}`} />
                                <div>
                                    <div className="text-xs font-bold tracking-wide">{s.title}</div>
                                    <div className="text-[10px] text-white/30 mt-0.5 line-clamp-1">{s.description}</div>
                                </div>
                            </button>
                        ))}
                    </nav>
                </aside>

                {/* Main scrollable content area */}
                <main ref={mainRef} className="flex-1 overflow-y-auto h-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-4xl mx-auto px-6 md:px-12 py-16 pb-32">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.3 }}
                            >
                                {/* Section header */}
                                <div className="mb-12 pb-8 border-b border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2.5 bg-vybe-blue/10 rounded-xl border border-vybe-blue/20">
                                            <active.icon className="w-5 h-5 text-vybe-blue" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-vybe-blue/60">
                                                {activeIdx + 1} / {docSections.length}
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="text-4xl md:text-5xl font-black mb-3">{active.title}</h1>
                                    <p className="text-lg text-white/40">{active.description}</p>
                                </div>

                                {/* Content */}
                                {active.content && (
                                    <div className="prose prose-invert max-w-none mb-12">
                                        {active.content.split("\n\n").map((block, i) => (
                                            <p key={i} className="text-base text-white/70 leading-relaxed mb-5 whitespace-pre-line">
                                                {block.split(/\*\*(.*?)\*\*/g).map((part, index) => {
                                                    if (index % 2 === 1) {
                                                        return <strong key={index} className="text-vybe-purple font-bold">{part}</strong>;
                                                    }
                                                    return <React.Fragment key={index}>{part}</React.Fragment>;
                                                })}
                                            </p>
                                        ))}
                                    </div>
                                )}

                                {/* Code Examples */}
                                {active.examples.map((ex, i) => (
                                    <div key={i} className="mb-8">
                                        <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-3">{ex.label}</h3>
                                        <div className="bg-[#0D1117] rounded-2xl border border-white/5 overflow-hidden">
                                            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
                                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/60" />
                                                <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-white/20">example.vybe</span>
                                            </div>
                                            <div className="p-6 overflow-x-auto">
                                                <VybeHighlighter code={ex.code} className="text-base" />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Navigation */}
                                <div className="flex items-center justify-between pt-12 border-t border-white/5 mt-12">
                                    {activeIdx > 0 && (
                                        <button
                                            onClick={() => navigateTo(docSections[activeIdx - 1].id)}
                                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                                        >
                                            <ChevronRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Previous</span>
                                        </button>
                                    )}
                                    <div />
                                    {activeIdx < docSections.length - 1 && (
                                        <button
                                            onClick={() => navigateTo(docSections[activeIdx + 1].id)}
                                            className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group"
                                        >
                                            <span className="text-xs font-bold uppercase tracking-widest">Next</span>
                                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div >
    );
}
