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
        content: `Vybe is not just another programming language; it's a **cultural shift** in software development. Designed by Aquib Khan, it targets the high-performance needs of modern systems while maintaining a syntax that feels natural, expressive, and "elite."

**The Zero-Friction Vision**
Traditional languages force you to write for the machine. Vybe forces the machine to understand you. We've removed the boilerplate that kills flow, allowing you to go from thought to execution in seconds.

**Core Philosophy**
- **Implicit Intelligence**: We've removed explicit type declarations (\`int\`, \`string\`) and variable keywords (\`let\`, \`const\`). If you assign it, it exists.
- **Natural Verbs**: Actions like \`say\`, \`ask\`, \`wait\`, and \`fetch\` are first-class keywords, not library functions.
- **Async by Design**: Every I/O operation in Vybe is non-blocking. The language handles the event loop so you don't have to.
- **Generation-Z Lexicon**: We've replaced legacy jargon with expressive alternatives that map more accurately to human intent.`,
        examples: [
            {
                label: "The Ultimate Hello",
                code: `say "Welcome to Vybe! 🚀"\nsay "Let's get bussin fr"`
            },
            {
                label: "Quick Interaction",
                code: `user = ask "Who's there?"\nsay "Welcome to the elite club, {user}!"`
            }
        ]
    },
    {
        id: "keywords",
        title: "Keyword Dictionary",
        icon: SpellCheck,
        description: "Complete lexicon of the Vybe language.",
        content: `Vybe uses a carefully curated set of keywords designed to be expressive and memorable.

**Logic & Control Flow**
- **sus**: Starts a conditional block (\`if\`).
- **fr**: Continues a conditional chain (\`else if\`).
- **nah**: The final fallback (\`else\`).
- **match**: Pattern matching for complex branching.
- **try / catch**: Error handling blocks.

**Iteration & Loops**
- **grind**: Repeat a block a fixed number of times.
- **for**: Range-based iteration (e.g., \`1..10\`).
- **each**: Collection-based iteration (lists/objects).
- **spin**: Condition-based iteration (\`while\`).
- **bounce**: Break out of the current loop.
- **skip**: Jump to the next iteration.

**Natural Commands**
- **say**: Output data to the terminal.
- **ask**: Capture user input.
- **wait**: Pause execution (supports \`s\`, \`ms\`).
- **fetch**: Perform HTTP requests.
- **read / write**: File system operations.
- **move / delete**: OS file management.

**Data & Structure**
- **vibe**: Declares a function.
- **gng / squad**: Declares a class/module.
- **stash**: Creates a list.
- **ghost**: Represents null/nothing.
- **frfr / cap**: Boolean True and False.
- **once**: Code that runs only a single time ever.
- **zone**: Defines a recursive namespace.`,
        examples: [
            {
                label: "Lexicon in Action",
                code: `status = "cooking"\nsus status == "cooking" {\n  say "Let him cook!"\n} fr status == "finished" {\n  say "Served."\n} nah {\n  say "Mid."\n}`
            }
        ]
    },
    {
        id: "variables",
        title: "Variables & Types",
        icon: Hash,
        description: "Dynamic state and built-in primitives.",
        content: `Variables in Vybe are **implicitly declared** and **dynamically typed**. You don't need to specify types or use keywords like \`let\` or \`var\`.

**Basic Types**
- **Numbers**: Standard 64-bit floats. \`score = 100\`
- **Strings**: Unicode text. \`name = "Aquib"\`
- **Booleans**: \`frfr\` (true) and \`cap\` (false).
- **Ghost**: Represents the absence of a value (\`null\`).

**String Interpolation**
Vybe features premium string interpolation using curly braces:
\`say "Hello, {user}! Your score is {points}."\`

**Null Coalescing (The Fallback)**
Use the \`??\` operator to handle \`ghost\` values gracefully:
\`display_name = input ?? "Anonymous"\`

**Compound Assignment**
Standard operators for updating state: \`+=\`, \`-=\`, \`*=\`, \`/=\`, \`%=\`.`,
        examples: [
            {
                label: "State Management",
                code: `points = 10\npoints += 5\n\nleader = "Aquib"\nsay "Player: {leader}, Score: {points}"\n\nstatus = ghost\nsay "Status: {status ?? 'Checking...'}"`
            }
        ]
    },
    {
        id: "collections",
        title: "Lists & Objects",
        icon: List,
        description: "Working with Stash and Object literals.",
        content: `Vybe provides robust support for structured data through Lists (Stash) and Objects.

**Lists (Stash)**
Initialize a list using the \`stash\` keyword or square brackets:
\`inventory = stash ["axe", "shield"]\`
\`inventory = ["axe", "shield"]\`

**List Operations**
- **push**: Add an item to a list (\`push "pot" to inventory\`).
- **pop**: Remove the last item (\`last = pop stash\`).
- **size**: Get the length (\`n = size(stash)\`).

**Objects**
Objects are key-value pairs created with curly braces:
\`player = { "name": "Aquib", "hp": 100 }\`

**Accessing Data**
Use dot notation or brackets:
\`name = player.name\`
\`hp = player["hp"]\``,
        examples: [
            {
                label: "Inventory System",
                code: `items = ["sword", "map"]\npush "potion" to items\n\nsay "Inventory size: {size(items)}"\neach item in items {\n  say "You have: {item}"\n}\n\nconfig = { "ver": "1.0", "env": "prod" }\nsay "Running version {config.ver}"`
            }
        ]
    },
    {
        id: "functions",
        title: "Functions (vibe)",
        icon: FunctionSquare,
        description: "The core unit of logic in Vybe.",
        content: `Functions are declared using the **vibe** keyword. They are first-class, meaning they can be assigned to variables and passed as arguments.

**Standard Declaration**
\`vibe add(a, b) {\n  return a + b\n}\`

**Arrow Functions**
For concise logic, use the arrow (\`->\`) syntax:
\`square = (n) -> n * n\`

**Async Vibes**
Functions can be marked as \`async\` to enable non-blocking behavior:
\`async vibe load() {\n  data = await fetch "api/data"\n  return data\n}\`

**Anonymous Functions**
Often used as callbacks or for immediate execution:
\`(msg) -> say "LOG: {msg}"\``,
        examples: [
            {
                label: "Aura Calculator",
                code: `vibe calculate_aura(score) {\n  return score * 10\n}\n\n// Arrow usage\nget_title = (points) -> pts > 1000 ? "Elite" : "Mid"\n\nsay "Aura: {calculate_aura(50)}"\npts = 1500\nsay "Rank: {get_title(pts)}"`
            }
        ]
    },
    {
        id: "control-flow",
        title: "Control Flow",
        icon: GitBranch,
        description: "Branching and logical decision making.",
        content: `Vybe replaces confusing legacy conditionals with a more natural sounding flow.

**Sus - Nah Logic**
- **sus**: The primary check.
- **fr**: Secondary checks (else if).
- **nah**: The final fallback (else).

**Pattern Matching**
The \`match\` statement is the ultimate tool for handling multiple states:
\`match status {\n  "loading" => say "Wait..."\n  "success" => say "Done!"\n  _         => say "Error"\n}\`

**Comparison Operators**
Vybe uses the standard \`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`.`,
        examples: [
            {
                label: "The Vibe Check",
                code: `score = 85\n\nsus score > 90 {\n  say "Straight Elite!"\n} fr score > 50 {\n  say "Bussin."\n} nah {\n  say "L + Ratio."\n}\n\nmode = "dark"\nmatch mode {\n  "light" => say "Flashbang!"\n  "dark"  => say "Cool eyes."\n}`
            }
        ]
    },
    {
        id: "loops",
        title: "Loops & Iteration",
        icon: Repeat,
        description: "Efficient ways to repeat logic.",
        content: `Vybe offers four distinct ways to iterate, depending on your needs.

**1. Range-based (for)**
Best for iterating through a set of numbers:
\`for i = 1..10 { say i }\`

**2. Collection-based (each)**
Perfect for lists and objects:
\`each item in stash { say item }\`

**3. Fixed-count (grind)**
When you just want to repeat something N times:
\`grind 5 { say "repeat" }\`

**4. Conditional (spin)**
The traditional \`while\` loop for dynamic conditions:
\`spin count < 10 { count += 1 }\`

**Loop Control**
- **bounce**: Stop the loop immediately.
- **skip**: Skip the rest of the current turn and continue.`,
        examples: [
            {
                label: "Loop Variety",
                code: `say "Counting to 3:"\nfor i = 1..3 { say i }\n\nsay "Each member:"\nteam = ["Aquib", "Dev", "Lead"]\neach name in team { say name }\n\nsay "Grinding 2 times:"\ngrind 2 { say "Spinning..." }`
            }
        ]
    },
    {
        id: "classes",
        title: "Classes (gng/squad)",
        icon: Layers,
        description: "Object-oriented structures for elite systems.",
        content: `Vybe uses the **gng** (Gang) keyword to define blueprints for objects. It provides a clean, class-based structure.

**Constructors (init)**
Every \`gng\` can have an \`init\` function which runs when a new instance is created:
\`gng Bot {\n  init(id) { this.id = id }\n}\`

**Methods**
Methods are defined with the \`vibe\` keyword inside the class:
\`vibe activate() { say "Bot {this.id} online" }\`

**Namespaces (zone)**
The \`zone\` keyword allows you to group logic into a reusable namespace:
\`zone System {\n  vibe init() { ... }\n}\``,
        examples: [
            {
                label: "The Bot Squad",
                code: `gng Defender {\n  init(name) {\n    this.name = name\n    this.power = 100\n  }\n\n  vibe report() {\n    say "{this.name} reports {this.power} power!"\n  }\n}\n\nunit = new Defender("V-1")\nunit.report()`
            }
        ]
    },
    {
        id: "io-networking",
        title: "I/O & Networking",
        icon: Zap,
        description: "First-class commands for the real world.",
        content: `Vybe treats networking and file access as fundamental language features, not as library imports.

**Networking**
The \`fetch\` keyword is used for non-blocking HTTP requests:
\`resp = await fetch "https://api.example.com"\nstatus = resp.status\`

**User Interaction**
The \`ask\` command pauses execution to wait for terminal input from the user:
\`fav_lang = ask "What's your favorite language?"\`

**Waiting**
The \`wait\` command provides precise pauses:
\`wait 500ms\`
\`wait 2s\`

**File Operations**
Reading and writing files is incredibly clean:
\`data = read "config.json"\`
\`write "log.txt" with "Success at {time()}"\``,
        examples: [
            {
                label: "Network Ping",
                code: `say "Pinging..."\nres = fetch "https://api.github.com"\nsay "GitHub status: {res.status}"\n\nwait 1s\nsay "Continuing..."`
            }
        ]
    },
    {
        id: "advanced",
        title: "Advanced Features",
        icon: Cpu,
        description: "Elite tools for complex scenarios.",
        content: `Vybe includes high-level abstractions designed for specific workflow needs.

**Thread Safety (once)**
The \`once\` block ensures that a piece of code only runs a single time across the lifetime of the process, no matter how many times it is called.
\`once { say "Initialization synchronized." }\`

**Flexing (Debug Output)**
The \`flex\` command is an enhanced version of \`say\` designed for inspecting complex objects:
\`flex my_config_object\`

**Namespaces (zone)**
Nested namespaces allow for clean modularization:
\`zone Math {\n  add = (a, b) -> a + b\n}\``,
        examples: [
            {
                label: "Advanced Showcase",
                code: `grind 5 {\n  once { say "This only shows once!" }\n  say "This shows 5 times."\n}\n\nconfig = { "a": 1, "b": 2 }\nflex config`
            }
        ]
    },
    {
        id: "js-interop",
        title: "JS Interop",
        icon: RefreshCw,
        description: "Seamless integration with the Node.js ecosystem.",
        content: `When you need to drop down to raw JavaScript or use an existing library from NPM, Vybe provides a zero-overhead bridge.

**The JS Block**
Wrap raw JavaScript in a \`js\` block. You can return values from the JS environment back into your Vybe variables.
\`version = js { return process.version }\`

**Accessing NPM**
Since Vybe runs on V8, you can \`require\` or \`import\` standard Node modules inside the JS block to bring their power into your Vybe scripts.`,
        examples: [
            {
                label: "Library Bridge",
                code: `os_name = js {\n  const os = require('os');\n  return os.type();\n}\nsay "Host OS: {os_name}"`
            }
        ]
    },
    {
        id: "real-world",
        title: "Real World Tools",
        icon: Box,
        description: "Practical examples of Vybe in production.",
        content: `Vybe's efficiency and natural syntax make it ideal for rapidly building system utilities, automation scripts, and microservices.

**1. Scalable Log Scanner**
Quickly scan large log files for critical patterns without the overhead of heavy runtimes.
\`\`\`vybe
logs = read "./logs"
each file in logs {
  content = read file
  sus content.includes "CRITICAL" {
    say "Critical issue in {file}!"
  }
}
\`\`\`

**2. Constant Health Checker**
A recurring service that monitors endpoints and alerts on failure.
\`\`\`vybe
spin frfr {
  res = fetch "https://api.vybelang.com/health"
  sus res.status != 200 {
    say "Health check failed: {res.status}"
  }
  wait 60s
}
\`\`\`

**3. Minimal Dev Server**
A functional server proxy in just a few lines of code.
\`\`\`vybe
serve 3000 {
  get "/*" -> {
    path = req.url
    return read "./static" + path
  }
}
\`\`\``,
        examples: [
            {
                label: "Dev Utility",
                code: `// Simple Scraper\nresp = fetch "https://vybelang.netlify.app"\nsay "Page size: {size(resp.data)} bytes"`
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
