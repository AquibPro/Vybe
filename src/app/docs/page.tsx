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
        description: "What is Vybe and why it slaps.",
        content: `Vybe is a high-performance, expressive, and cultural programming language designed for the modern developer who values flow over friction. It blends ultra-readable minimal syntax with powerful natural language instructions that feel like writing poetry.

Developed by Aquib Khan, Vybe is built on a custom high-speed bridge to the Node.js ecosystem, giving you the power of millions of packages with a syntax that actually matches your vibe. It's not just a language; it's a productivity multiplier designed for the next generation of software engineers.

**Why Vybe?**
- **Zero Boilerplate**: No main functions, no complex imports for basic tasks. Just write code.
- **Natural Language**: Commands like \`say\`, \`ask\`, and \`wait\` make code readable for humans, not just compilers.
- **Blazing Fast**: Optimized runtime bridge for elite performance.
- **Built-in Web Battery**: Start high-performance servers in literally 3 lines of code.`,
        examples: [
            {
                label: "The Ultimate Hello World",
                code: `say "Hello, Vybe! 🚀"`
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
        description: "Glossary of all Vybe keywords.",
        content: `Vybe replaces boring legacy keywords with expressive vocabulary that maps directly to intent.

- **implicit** (declare): No keyword needed for declaration. Just assign! (\`x = 10\`)
- **swap** (assign): Reassign an existing variable's value safely.
- **vibe** (function): Define a block of reusable logic.
- **return**: Yeet a value back from a function.
- **say**: The ultimate output command for debugging and logging.
- **sus**: Start a conditional block (Short for suspicious).
- **nah**: The fallback path when things aren't sus enough.
- **grind**: Loop logic for repetitive tasks.
- **serve**: Launch a lightning-fast web server.
- **stash**: Create dynamic, optimized arrays.
- **ghost**: The representation of nothingness (null/void).`,
        examples: [
            {
                label: "Core Keyword Usage",
                code: `mood = "bussin"\nsus mood == "bussin" {\n  say "No cap, it's lit!"\n} nah {\n  say "Mid."\n}`
            }
        ]
    },
    {
        id: "toolchain",
        title: "CLI Toolchain",
        icon: Terminal,
        description: "The vybe binary commands.",
        content: `The \`vybe\` CLI is your all-in-one command center for building and shipping.

- **run [file]**: Executes a Vybe script instantly.
- **watch [file]**: Development mode with hot-reloading on every save.
- **fmt [file]**: Auto-formats your code to the elite 2-space Vybe style.
- **repl**: Jump into an interactive terminal session to test logic.
- **install [pkg]**: Installs packages to \`vybe_modules\` from the global registry.`,
        examples: [
            {
                label: "Running a Script",
                code: `vybe run main.vybe`
            },
            {
                label: "Watcher Mode",
                code: `vybe watch server.vybe`
            }
        ]
    },
    {
        id: "variables",
        title: "Variables",
        icon: Hash,
        description: "Declaration & Assignment.",
        content: `Variables in Vybe are "cooked" into existence implicitly. There is no need for \`let\`, \`var\`, or \`const\`.

**Declaration**
Simply assign a value to a name. Vybe handles memory and scoping automatically.
\`name = "Aquib Khn"\`

**Reassignment**
To update a variable that already exists, use the \`swap\` keyword. This prevents accidental creation of global variables when you intend to update local state.
\`swap score = 100\`

**Scoping**
Vybe is block-scoped. Variables defined inside curly braces \`{ }\` stay inside those braces.`,
        examples: [
            {
                label: "Assignment Flow",
                code: `points = 10\nswap points = points + 5\nsay "Total: {points}"`
            }
        ]
    },
    {
        id: "types",
        title: "Types & Values",
        icon: Box,
        description: "Numbers, Strings, Booleans, Ghost.",
        content: `Vybe is dynamically typed but internally optimized.

- **Numbers**: 64-bit floating point by default. Supports large integers and decimals.
- **Strings**: UTF-8 encoded text. Supports interpolation using \`{expression}\`.
- **Booleans**: Use \`frfr\` for true and \`cap\` for false.
- **Stash**: High-performance dynamic arrays. (\`l = stash [1, 2]\`)
- **Ghost**: Represents the absence of a value (equivalent to null).`,
        examples: [
            {
                label: "String Interpolation",
                code: `user = "Elite"\nsay "Status: {user} Mode activated!"`
            },
            {
                label: "Boolean Logic",
                code: `is_lit = frfr\nsus is_lit { say "Bussin" }`
            }
        ]
    },
    {
        id: "operators",
        title: "Operators",
        icon: Zap,
        description: "Arithmetic & Logic.",
        content: `Standard operators follow the principle of least surprise, but logic operators use English for maximum readability.

**Arithmetic**
\`+\`, \`-\`, \`*\`, \`/\`, \`%\`, \`**\` (power)

**Comparison**
\`==\`, \`!=\`, \`>\`, \`<\`, \`>=\`, \`<=\`

**Logic**
Use \`and\`, \`or\`, \`not\` instead of symbols.
\`sus points > 10 and points < 100 { ... }\``,
        examples: [
            {
                label: "Logical Combo",
                code: `age = 24\nmember = frfr\nsus age > 18 and member {\n  say "Entry granted"\n}`
            }
        ]
    },
    {
        id: "conditions",
        title: "Conditions",
        icon: GitBranch,
        description: "sus / fr / nah.",
        content: `Vybe uses cultural mappings for control flow, making the logic feel more natural.

- **sus**: The primary condition (if).
- **fr**: Follow-up conditions (else if).
- **nah**: The final fallback (else).

Blocks must be enclosed in curly braces \`{ }\`.`,
        examples: [
            {
                label: "Complex Condition",
                code: `score = rand(1, 100)\nsus score > 90 {\n  say "Aura points +1000"\n} fr score > 50 {\n  say "Solid mid."\n} nah {\n  say "Skill issue detected."\n}`
            }
        ]
    },
    {
        id: "loops",
        title: "Loops",
        icon: Repeat,
        description: "for, each, grind, spin.",
        content: `Vybe provides specialized loops for every scenario.

- **for**: Range-based iteration.
- **each**: Iterate over elements in a \`stash\` or object.
- **grind**: Repeat a block exactly N times.
- **spin**: Traditional while-loop for dynamic conditions.

You can use \`bounce\` to break a loop and \`skip\` to continue to the next iteration.`,
        examples: [
            {
                label: "Range Loop",
                code: `for i = 1..5 {\n  say "Iteration {i}"\n}`
            },
            {
                label: "Grinding Data",
                code: `grind 3 {\n  say "Working..."\n}`
            }
        ]
    },
    {
        id: "natural-commands",
        title: "Natural Commands",
        icon: Zap,
        description: "Async I/O and networking.",
        content: `Vybe excels at tasks that feel like English sentences. All natural commands are asynchronous by default, powered by an underlying non-blocking event loop.

- **say**: Sends data to standard output. Optimized for high-volume logs.
- **ask**: Pauses execution to wait for user terminal input. Returns a string.
- **fetch**: A high-level wrapper for network requests. Supports automatic JSON parsing and header injection.
- **wait**: Non-blocking sleep. Supports human-readable time units like \`ms\`, \`s\`, \`m\`.
- **read / write**: Direct file system hooks. \`read "path" into var\` and \`write "path" with data\`.

These commands allow you to write complex automation scripts that read like a set of instructions, making your code maintainable and approachable for others.`,
        examples: [
            {
                label: "Asynchronous Interaction",
                code: `say "Connecting..."\nfetch "https://api.vybe.dev" into res\nsus res.status == 200 {\n  write "log.txt" with res.data\n  say "Success. Check log.txt"\n}`
            }
        ]
    },
    {
        id: "native-files",
        title: "Natural File Operations",
        icon: Package,
        description: "Direct OS interaction.",
        content: `Vybe treats the file system as an extension of the language itself. Forget boilerplate imports and complex buffer handling; Vybe uses natural verbs to interact with the OS.

**Core Verbs**
- **read**: Pulls contents of a file. Supports direct assignment or pipe into variables.
- **write**: Flushes data into a file path. Works with strings, buffers, and objects.
- **move**: Renames or relocates files using the \`into\` keyword.
- **delete**: Nukes a file or directory permanently.
- **run**: Executes a shell command or binary instantly.

These verbs are non-blocking, ensuring your system scripts stay reactive even during heavy I/O.`,
        examples: [
            {
                label: "Elite File Management",
                code: `data = read "source.txt"\nwrite "backup.txt" with data\nmove "backup.txt" into "./vault/backup.txt"\nsay "Ops complete."`
            }
        ]
    },
    {
        id: "web-servers",
        title: "Web Servers (serve)",
        icon: RefreshCw,
        description: "Elite backend performance.",
        content: `Vybe is first-class for web development. The \`serve\` command initializes a high-performance HTTP server instance with built-in routing and middleware support.

**Booting up**
Use \`serve [port] { ... }\` to open a socket and start listening.

**Routing**
Define routes using method keywords (\`get\`, \`post\`, \`put\`, \`delete\`). Use arrows \`->\` for simple responses or blocks \`{ }\` for complex logic.

**Request & Response**
Inside a handler, you have access to the \`req\` object containing params, query, and body data. Use \`say\` or \`return\` to send data back to the client.`,
        examples: [
            {
                label: "3-Line API Server",
                code: `serve 3000 {\n  get "/" -> "Vybe is running! 🚀"\n  get "/ping" -> { "status": "online" }\n}`
            },
            {
                label: "Dynamic Routes",
                code: `serve 3000 {\n  get "/user/:id" { \n    id = req.params.id\n    say "Fetching user {id}"\n    return { "id": id, "name": "Elite dev" }\n  }\n}`
            }
        ]
    },
    {
        id: "js-interop",
        title: "JS Interop",
        icon: Cpu,
        description: "Executing raw JavaScript.",
        content: `Vybe provides a seamless bridge to the JavaScript ecosystem. This allows you to leverage any NPM package or legacy Node.js script while maintaining the Vybe aesthetic for your logic layer.

**The js Block**
Any code inside \`js { ... }\` is executed as raw JavaScript. The return value of the block is passed back into the Vybe runtime.

**Piping Data**
Use the pipe operator \`|>\` to send Vybe variables into JS blocks or JS results into Vybe commands. This creates a powerful hybrid environment where you choose the best tool for the job.`,
        examples: [
            {
                label: "Node.js OS Integration",
                code: `mem = js { \n  const os = require('os');\n  return os.freemem();\n}\nsay "Free memory: {mem} bytes"`
            }
        ]
    },
    {
        id: "advanced-flow",
        title: "Advanced Control Flow",
        icon: GitBranch,
        description: "Pipelines, Once, and Match.",
        content: `Vybe introduces modern patterns that eliminate redundant logic and deep nesting.

**Pipelines ( |> )**
Thread data through functions in a left-to-right flow. This makes sequence-of-operations extremely clear.
\`data |> clean |> process |> say\`

**Once Blocks**
The \`once\` keyword ensures a block of code runs exactly one time in the lifetime of the process, regardless of how many times the surrounding function is called. Perfect for database initializations.

**Match (Pattern Matching)**
A powerful declaration-based alternative to \`sus\` chains. Match against literals, types, or structure.`,
        examples: [
            {
                label: "The Pipeline Vibe",
                code: `vibe double(x) -> x * 2\nvibe add_ten(x) -> x + 10\n\nres = 5 |> double |> add_ten\nsay res // 20`
            },
            {
                label: "Singleton Execution",
                code: `vibe setup() {\n  once {\n    say "Initializing system core..."\n  }\n}\n\nsetup() // Prints\nsetup() // Silent\nsetup() // Silent`
            }
        ]
    },
    {
        id: "namespaces",
        title: "Namespaces & Modules",
        icon: Box,
        description: "Zone & Yo.",
        content: `Vybe scaling is handled through \`zone\` (Namespaces) and \`yo\` (Imports).

**Zones**
A \`zone\` acts as a container for related logic, preventing naming collisions. Everything inside a zone is accessible via dot notation once declared.

**Imports**
Use \`yo\` to pull in external modules or local files. Vybe's module system is compatible with both native Vybe \`zone\` files and existing Node.js modules.`,
        examples: [
            {
                label: "Organizing with Zones",
                code: `zone Auth {\n  vibe login(user) {\n    return frfr\n  }\n}\n\nAuth.login("Elite")`
            },
            {
                label: "Importing Modules",
                code: `yo "math-utils"\nsay math.square(4)`
            }
        ]
    },
    {
        id: "functions",
        title: "Functions (vibe)",
        icon: FunctionSquare,
        description: "Logic & Logic blocks.",
        content: `Functions in Vybe (\`vibe\`) are first-class citizens. They can be passed as variables, returned from other functions, and support advanced features like optional parameters and rest arguments.

**Implicit vs. Explicit Return**
Standard blocks use \`return\` to yeet values. Arrow functions (\`->\`) implicitly return the evaluation of the expression, perfect for mathematical transformations or predicates.

**Higher-Order Functions**
Vybe's functional primitives (\`map\`, \`filter\`, \`reduce\`) accept vibes as callbacks, enabling a clean declarative style.`,
        examples: [
            {
                label: "Higher Order Vibe",
                code: `multiply = (a, b) -> a * 2\n\nvibe calculate(x, y, op) {\n  return op(x, y)\n}\n\nres = calculate(10, 5, multiply)\nsay res // 50`
            }
        ]
    },
    {
        id: "lists",
        title: "Lists (stash)",
        icon: List,
        description: "Dynamic collections.",
        content: `The \`stash\` is a versatile, growable collection that acts as both an array and a stack.

**Performance**
Stashes are optimized for fast appends and indexed access. Internal memory management is handled by the Vybe engine, ensuring low overhead even with large datasets.

**Manipulation**
- \`stash.push(val)\`: Add to end.
- \`stash.pop()\`: Remove from end.
- \`stash.shift()\`: Remove from start.
- \`stash.size\`: Property for total element count.`,
        examples: [
            {
                label: "Stash Operations",
                code: `data = stash [1, 2, 3]\ndata.push 4\nsay "Size is now {data.size}"\nsay "Last item: {data.pop()}"`
            }
        ]
    },
    {
        id: "objects",
        title: "Objects",
        icon: Box,
        description: "Key-value records.",
        content: `Objects in Vybe are flexible schemas for structured data. They support dot notation, dynamic property assignment, and shorthand property names.

Nested objects are fully supported, and you can leverage the \`each\` keyword to iterate over keys or values within an object.`,
        examples: [
            {
                label: "Dynamic Records",
                code: `config = {\n  env: "prod",\n  port: 8080\n}\n\nconfig.status = "up"\nsay "{config.env} is {config.status}"`
            }
        ]
    },
    {
        id: "classes",
        title: "Classes (gng)",
        icon: Layers,
        description: "Elite Blueprints.",
        content: `The \`gng\` (Gang) keyword is Vybe's way of doing Object-Oriented Programming. It creates a blueprint for high-level abstractions.

**The Blueprint**
- \`init\`: The constructor method. Called automatically when a new instance is created via \`new\`.
- **Properties**: Accessible via \`this\`.
- **Methods**: Functions defined inside the block that operate on instance state.

**Encapsulation**
Vybe encourages clean interfaces. Methods are public by default, while prefixing properties with \`_\` indicates a cultural convention for private state.`,
        examples: [
            {
                label: "Gang Logic",
                code: `gng Bot {\n  init(name) {\n    this.name = name\n    this.status = "idle"\n  }\n\n  vibe zap() {\n    say "{this.name} zapping!"\n  }\n}\n\nsparky = new Bot("Sparky")\nsparky.zap()`
            }
        ]
    },
    {
        id: "match",
        title: "Pattern Matching",
        icon: Shuffle,
        description: "Modern control flow.",
        content: `Pattern matching is the elite alternative to complex if-else chains or switch statements. It allows you to match against values, types, and even complex object structures.

**Wildcards**
The underscore \`_\` acts as a catch-all for any pattern not explicitly handled, ensuring your logic is exhaustive and safe.`,
        examples: [
            {
                label: "Structured Matching",
                code: `input = "ping"\n\nmatch input {\n  "ping" => say "pong"\n  "exit" => exit()\n  _      => say "unknown command"\n}`
            }
        ]
    },
    {
        id: "error-handling",
        title: "Error Handling",
        icon: AlertTriangle,
        description: "try / catch / crash.",
        content: `Reliability is a core pillar of Vybe. The error handling system ensures that unexpected external environment changes don't take down your service.

- **try**: Wraps risky logic.
- **catch**: Intercepts errors, providing the error object for logging or recovery.
- **crash**: Explicitly terminates a block when an unrecoverable "vibe check" fails.`,
        examples: [
            {
                label: "Risk Management",
                code: `try {\n  fetch "https://bad-url" into res\n} catch (err) {\n  say "Connection failed: {err}"\n}`
            }
        ]
    },
    {
        id: "async",
        title: "Async / Await",
        icon: RefreshCw,
        description: "Asynchronous flow.",
        content: `Vybe handles concurrency with elegant \`async\` and \`await\` keywords. This allows you to perform long-running tasks like database queries or file I/O without blocking the main execution thread.

Any \`vibe\` marked as \`async\` returns a promise-like object that can be awaited, ensuring your code remains synchronous in appearance but asynchronous in execution.`,
        examples: [
            {
                label: "Non-blocking Flow",
                code: `async vibe process() {\n  say "Starting task..."\n  await wait 2s\n  say "Task finished!"\n}\n\nprocess()\nsay "Main thread continues..."`
            }
        ]
    },
    {
        id: "stdlib",
        title: "Standard Library",
        icon: Cpu,
        description: "Built-in modules.",
        content: `Vybe ships with a "batteries-included" standard library that covers the most essential developer needs out of the box.

- **Math**: Sophisticated functions for calculation (\`PI\`, \`sin\`, \`cos\`, \`rand\`).
- **JSON**: Lightning-fast parsing and serialization for API work.
- **os**: Access environment variables, platform info, and memory stats.
- **Time**: Advanced date/time manipulation and formatting.
- **Network**: Low-level sockets, HTTP clients, and server utilities.`,
        examples: [
            {
                label: "Standard Utils",
                code: `now = Time.now()\nsay "Current year: {now.year}"\n\ndata = JSON.stringify({ "id": 1 })\nsay data`
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
