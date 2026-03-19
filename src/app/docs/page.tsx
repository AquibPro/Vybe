"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronRight, Book, Code2, Terminal, Zap, Cpu, ArrowRight, Box, GitBranch, Repeat, Package, AlertTriangle, List, Hash, FunctionSquare, Layers, RefreshCw, Shuffle, SpellCheck, Shield, Activity, HardDrive, Globe, Wrench, Briefcase, Info } from "lucide-react";
import VybeHighlighter from "@/components/VybeHighlighter";
import Navbar from "@/components/Navbar";

const docSections = [
    {
        id: "introduction",
        title: "Introduction & Philosophy",
        icon: Info,
        description: "Vision, culture, and high-level architecture.",
        overview: "Vybe is a high-performance, culture-first programming language designed to bridge the gap between low-level efficiency and high-level expressivity. Developed for the next generation of software architects, Vybe eliminates legacy boilerplate while providing a zero-overhead runtime built on the V8 engine. Our philosophy is simple: code should reflect human intent as directly as possible, without sacrificing the mechanical sympathy required for high-scale systems.",
        syntax: "// The core tenet: Intent over Ceremony\nsay \"Hello World\"",
        behavior: "Vybe is JIT-compiled into optimized bytecode compatible with the V8 engine. Unlike traditional scripting languages, Vybe uses a 'stability-first' memory model where top-level state is optimized for long-running processes. The compiler performs aggressive constant folding and dead-code elimination before the runtime even touches the entry point.",
        advancedConcepts: "The 'Vibe-State' architecture allows for hot-reloading logic without losing heap state. This is achieved through a specialized 'Zone' system that tracks dependency graphs in real-time. Developers can swap out entire function implementations (Vibes) while the application is live, making it ideal for distributed systems and real-time interactive apps.",
        bestPractices: [
            "Write code that reads like a conversation.",
            "Utilize implicit declarations for local logic.",
            "Avoid deep class hierarchies; favor composition via GNGs."
        ],
        commonMistakes: [
            "Attempting to use legacy 'let' or 'const' keywords from JS.",
            "Over-engineering simple tasks with unnecessary abstraction layers.",
            "Thinking Vybe is 'just another JS wrapper'—it has its own semantics for state and scope."
        ],
        examples: [
            {
                label: "The Ultimate Hello",
                code: `say \"Welcome to Vybe! 🚀\"\nsay \"Mapping intent to machine...\"`
            },
            {
                label: "Reactive State",
                code: `vibe check_vibe() {\n  say \"All systems go.\"\n}\n\ncheck_vibe()`
            },
            {
                label: "Distributed Intent",
                code: `async vibe sync_node(id) {\n  data = fetch \"https://node-{id}.vybe.pro\"\n  say \"Node {id} synchronized.\"\n}`
            }
        ],
        quickRef: [
            { cmd: "say <expr>", desc: "Standard output command" },
            { cmd: "vibe", desc: "Function declaration" },
            { cmd: "async", desc: "Asynchronous task modifier" }
        ]
    },
    {
        id: "lexical-structure",
        title: "Lexical Structure",
        icon: SpellCheck,
        description: "Encoding, tokens, and formatting rules.",
        overview: "The lexical structure of Vybe is designed for maximum clarity and speed. It uses a custom tokenizer that prioritizes natural language tokens while maintaining strict separation between commands and identifiers. Vybe is case-sensitive and uses UTF-8 encoding by default, allowing for modern expressive symbols and international character sets in identifiers.",
        syntax: "// Single line comment\n/* Multi-line \n   comment */\nidentifier_name = \"value\"",
        behavior: "The Vybe lexer ignores extraneous whitespace but enforces vertical placement for certain commands like 'serve' and 'match' to prevent ambiguity. It uses a 'greedy' matching algorithm for operators, ensuring that complex symbols like '->' and '??' are correctly identified without needing surrounding spaces.",
        advancedConcepts: "Vybe supports 'Shadow Identifiers' using the '$' prefix for temporary, internal variables that are automatically cleaned up at the end of a block. Additionally, hex, binary, and octal literals are supported with standard prefixes (0x, 0b, 0o) but are strictly typed to 'int' unless combined with decimal components.",
        bestPractices: [
            "Use snake_case for all variable and vibe identifiers.",
            "Avoid using emoji in production identifiers for better accessibility.",
            "Keep comments meaningful; the code should mostly speak for itself."
        ],
        commonMistakes: [
            "Using PascalCase for variables (conventionally reserved for GNGs).",
            "Leaving trailing underscores in public identifiers.",
            "Forgetting that multi-line comments cannot be nested in the current parser version."
        ],
        examples: [
            {
                label: "Comment Styles",
                code: `// This is a vibe\nvibe hello() {\n  say \"Hi\"\n} /* A longer \n   description */`
            },
            {
                label: "Numeric Literals",
                code: `count = 0xFF // Hex\nmask = 0b1010 // Binary\npi = 3.14159 // Float`
            },
            {
                label: "Shadow Vars",
                code: `$temp = read \"input.txt\"\nsay $temp\n// $temp is gone here`
            }
        ],
        quickRef: [
            { cmd: "//", desc: "Single line comment" },
            { cmd: "/* */", desc: "Multi-line block comment" },
            { cmd: "$", desc: "Shadow identifier prefix" }
        ]
    },
    {
        id: "type-system",
        title: "Type System & Stability",
        icon: Shield,
        description: "Deep dive into types and inference.",
        overview: "Vybe features a 'Fluid-Strong' type system. While it appears dynamic and allows for rapid prototyping, the JIT compiler tracks types intensely. Once a variable's type 'stabilizes' (remains consistent for several cycles), the runtime locks it into a machine-optimized representation to avoid type-check overhead.",
        syntax: "x = 10 // inferred as int\nname = \"Vybe\" // inferred as str\nlist = [1, 2, 3] // inferred as stash<int>",
        behavior: "Under the hood, Vybe uses Hidden Classes (similar to V8) to optimize object access. However, it extends this with 'Stability Guards'—if a variable changes type multiple times, the JOT marks it as 'volatile', which triggers a warning in strict mode but allows the program to continue with slower check-paths.",
        advancedConcepts: "The 'ghost' type represents the total absence of a value, but unlike 'null' in other languages, it is 'active'. You can call methods on ghost, which will safely return ghost rather than crashing (Short-circuiting null safety). The 'type' keyword can be used to query or enforce types in critical loops.",
        bestPractices: [
            "Keep variable types consistent within a single scope.",
            "Use 'ghost' sparingly; prefer default initializers.",
            "Leverage 'type' checks in public API vibes."
        ],
        commonMistakes: [
            "Mixing types in a 'stash' (e.g., [1, \"a\"])—this degrades performance.",
            "Expecting 'ghost' to behave like a boolean 'false'.",
            "Manually casting types when the compiler would handle it implicitly."
        ],
        examples: [
            {
                label: "Type Inference",
                code: `score = 42\nuser = \"Aquib\"\nsay type score // Prints \"int\"\nsay type user  // Prints \"str\"`
            },
            {
                label: "Ghost Safety",
                code: `data = ghost\nsay data.name.to_upper() // Safely prints ghost, no crash`
            },
            {
                label: "Strict Stashes",
                code: `nums = [1, 2, 3, 4] // Optimized as a contiguous int array`
            }
        ],
        quickRef: [
            { cmd: "ghost", desc: "The 'Null' value" },
            { cmd: "type <var>", desc: "Returns the current type name" },
            { cmd: "int/float/str", desc: "Primary primitive types" }
        ]
    },
    {
        id: "variables",
        title: "Variables & State",
        icon: Hash,
        description: "Implicit declarations and scope management.",
        overview: "State in Vybe is implicit by default. We believe that declaring every variable with 'let' or 'const' adds unnecessary noise to the code. Instead, the first assignment to an identifier defines its scope and initial state.",
        syntax: "identifier = value\nswap identifier = new_value",
        behavior: "Identifiers are scoped to their nearest containing block (Vibe, Loop, or GNG). Vybe uses 'Implicit Stability'—if a variable is defined at the top level of a file (zone), it is treated as a stable export. Inside vibes, variables are local and stack-allocated where possible.",
        advancedConcepts: "Shadowing is permitted but discouraged. A local variable can 'shadow' a global one, but the global remains accessible through the explicit 'zone' reference. The 'swap' keyword is not just syntactic sugar; it signals to the compiler that a value is 'mutable', allowing it to optimize for in-place updates vs. persistent snapshots.",
        bestPractices: [
            "Use 'swap' explicitly for clarity in long vibes.",
            "Minimize the use of global variables; encapsulate in GNGs.",
            "Initialize all members of a GNG in the 'cook' vibe."
        ],
        commonMistakes: [
            "Accidentally creating a global variable by misspelling a local one.",
            "Attempting to 'swap' a variable that hasn't been initialized.",
            "Forgetting that blocks (like 'sus' or 'grind') create a new scope level."
        ],
        examples: [
            {
                label: "Basic Assignment",
                code: `msg = \"Hello\"\nsay msg\nswap msg = \"Goodbye\"\nsay msg`
            },
            {
                label: "Scoping",
                code: `status = \"active\"\nvibe stop() {\n  status = \"internal\" // Shadows global\n  say status\n}\nstop()\nsay status // Still \"active\"`
            },
            {
                label: "Explicit Swap",
                code: `total = 0\ngrind 5 -> swap total += 10\nsay \"Final total: {total}\"`
            }
        ],
        quickRef: [
            { cmd: "=", desc: "Assignment / Declaration" },
            { cmd: "swap", desc: "Mutable update operator" },
            { cmd: "??", desc: "Null-coalescing / Fallback" }
        ]
    },
    {
        id: "collections",
        title: "Collections & Stashes",
        icon: Layers,
        description: "Arrays, maps, and specialized data structures.",
        overview: "Vybe provides two primary collection types: the 'Stash' (an ordered, growable array) and the 'Vault' (a key-value map). Both are high-level abstractions designed for ease of use but backed by high-performance memory buffers.",
        syntax: "my_stash = [1, 2, 3]\nmy_vault = { \"key\": \"value\" }\npush val in stash",
        behavior: "Stashes in Vybe are not fixed-size. They dynamically resize based on usage. The `push` and `pop` commands provide O(1) average time complexity. Vaults use a hash-map implementation optimized for string keys, which is the most common use case in Vybe.",
        advancedConcepts: "You can perform 'Flash Iteration' on collections using the '->' operator directly on a stash. This triggers a multi-threaded mapping operation if the stash size exceeds a certain threshold (Auto-parallelization). Stashes also support 'Slicing' using the `[start..end]` syntax.",
        bestPractices: [
            "Use stashes for ordered sequences.",
            "Prefer vaults for fast lookups by unique identifiers.",
            "Always use 'size stash' to check for emptiness."
        ],
        commonMistakes: [
            "Using nested loops to search a stash when a vault would be faster.",
            "Forgetting that indices in Vybe are 0-based.",
            "Modifying a collection while iterating through it with 'each'."
        ],
        examples: [
            {
                label: "Stash Basics",
                code: `items = [\"apple\", \"banana\"]\npush \"cherry\" in items\nsay items // [\"apple\", \"banana\", \"cherry\"]`
            },
            {
                label: "Vault Usage",
                code: `scores = { \"Aquib\": 100, \"Ben\": 85 }\nsay scores[\"Aquib\"]\nswap scores[\"Ben\"] = 90`
            },
            {
                label: "Advanced Slicing",
                code: `nums = [10, 20, 30, 40, 50]\ntop_three = nums[0..3]\nsay top_three // [10, 20, 30]`
            }
        ],
        quickRef: [
            { cmd: "[]", desc: "Declare a Stash (Array)" },
            { cmd: "{}", desc: "Declare a Vault (Map)" },
            { cmd: "push/pop", desc: "Add/Remove items" },
            { cmd: "size", desc: "Count items in collection" }
        ]
    },
    {
        id: "control-flow",
        title: "Control Flow",
        icon: Shuffle,
        description: "Branching, conditions, and pattern matching.",
        overview: "Vybe simplifies control flow by using conversational keywords. Instead of traditional 'if/else', we use 'sus' (suspicious/check), 'fr' (for real/else if), and 'nah' (no/else). This makes logic paths clearly identifiable at a glance.",
        syntax: "sus cond { ... }\nfr cond { ... }\nnah { ... }\nmatch value { ... }",
        behavior: "The 'sus' block only executes if the condition evaluates to `frfr` (true). Values like 0, empty strings, and `ghost` are considered `cap` (false). The 'match' statement performs deep structural equality checks and can destructure objects in real-time.",
        advancedConcepts: "The 'maybe' keyword is a specialized control structure for dealing with probabilistic logic or uncertain data. It executes a block with a given percentage chance, which is incredibly useful for game development or randomized testing.",
        bestPractices: [
            "Keep 'sus' conditions simple.",
            "Use 'match' instead of long 'fr' chains for readability.",
            "Leverage 'nah' to always handle the default case."
        ],
        commonMistakes: [
            "Using 'if' (legacy) which will throw a syntax error.",
            "Forgetting curly braces—Vybe requires them for all blocks.",
            "Using '=' instead of '==' in conditions."
        ],
        examples: [
            {
                label: "Logic Branching",
                code: `score = 85\nsus score >= 90 {\n  say \"A+\"\n} fr score >= 80 {\n  say \"B\"\n} nah {\n  say \"Keep grinding\"\n}`
            },
            {
                label: "Pattern Match",
                code: `user = { \"role\": \"admin\", \"id\": 1 }\nmatch user {\n  { \"role\": \"admin\" } -> say \"Hello Admin\"\n  { \"role\": \"user\" }  -> say \"Hello Member\"\n  _ -> say \"Unknown role\"\n}`
            },
            {
                label: "Probabilistic Logic",
                code: `maybe 50% {\n  say \"You got lucky!\"\n} nah {\n  say \"Try again.\"\n}`
            }
        ],
        quickRef: [
            { cmd: "sus/fr/nah", desc: "Standard branching" },
            { cmd: "match", desc: "Advanced pattern matching" },
            { cmd: "maybe", desc: "Probabilistic execution" }
        ]
    },
    {
        id: "loops",
        title: "Loops & Iteration",
        icon: Repeat,
        description: "Repeating tasks and data traversal.",
        overview: "Vybe offers streamlined looping with 'grind' and 'each'. 'Grind' is used for fixed repetitions, while 'Each' is for iterating over collections. Both provide the implicit 'it' variable for index/item access.",
        syntax: "grind 10 { ... }\neach item in stash { ... }\nspin cond { ... }",
        behavior: "The 'grind' loop is optimized for numeric counts and maps directly to a high-speed machine loop. 'Each' uses a standard iterator protocol that works for stashes, vaults, and even string characters.",
        advancedConcepts: "Loop control is handled via 'bounce' (break) and 'skip' (continue). Additionally, Vybe supports 'Infinite Spins' using just `spin { ... }`, which are used in server heartbeats and background agents.",
        bestPractices: [
            "Use 'grind' for pure repetition.",
            "Prefer 'each' for data processing.",
            "Always include an exit condition in a 'spin' loop."
        ],
        commonMistakes: [
            "Creating accidental infinite loops in 'spin'.",
            "Confusing 'it' (item) with index in specialized 'each' loops.",
            "Deeply nesting 'grind' loops, which can lead to performance hits."
        ],
        examples: [
            {
                label: "The Grind",
                code: `grind 3 {\n  say \"Loading bit {it}...\"\n}`
            },
            {
                label: "Collection Each",
                code: `users = [\"Aquib\", \"Ben\", \"Charlie\"]\neach u in users {\n  say \"Welcome {u}\"\n}`
            },
            {
                label: "While Logic",
                code: `energy = 10\nspin energy > 0 {\n  say \"Working...\"\n  swap energy -= 1\n}`
            }
        ],
        quickRef: [
            { cmd: "grind", desc: "Fixed repetition" },
            { cmd: "each", desc: "Collection iteration" },
            { cmd: "spin", desc: "Conditional loop (While)" },
            { cmd: "bounce/skip", desc: "Loop control" }
        ]
    },
    {
        id: "functions",
        title: "Functions & Vibes",
        icon: FunctionSquare,
        description: "Logic encapsulation and async execution.",
        overview: "Vibes are the heart of modular Vybe code. They are first-class functions that support closures, async execution, and specialized modifiers like 'move' to denote ownership transfer.",
        syntax: "vibe name(args) { ... }\nasync vibe task() { ... }\narrow = (x) -> x * 2",
        behavior: "Vibes are hoisted to the top of their scope. They capture variables from their lexical environment. Async vibes automatically wrap their return values in a Promise, which must be passed 'into' a variable.",
        advancedConcepts: "The 'move' modifier on a vibe declaration indicates that the function 'takes ownership' of its arguments or modifies external state destructively. This is a compiler-level hint that prevents accidental double-modification of critical buffers.",
        bestPractices: [
            "Keep vibes small and focused.",
            "Use arrow syntax for simple callbacks.",
            "Always denote side-effect heavy vibes with the 'move' keyword."
        ],
        commonMistakes: [
            "Misplacing the 'async' keyword.",
            "Forgetting that results are promises, leading to raw promise objects.",
            "Returning from a 'grind' loop inside a vibe inconsistently."
        ],
        examples: [
            {
                label: "Standard Vibe",
                code: `vibe add(a, b) {\n  return a + b\n}\nsay add(5, 10)`
            },
            {
                label: "Async Workflow",
                code: `async vibe load_user() {\n  res = fetch \"/api/user\"\n  return res.json()\n}\n\nu = load_user()`
            },
            {
                label: "Move Modifier",
                code: `move vibe update_db(data) {\n  // Destructively updates state\n  write \"db.json\" data\n}`
            }
        ],
        quickRef: [
            { cmd: "vibe", desc: "Function declaration" },
            { cmd: "async", desc: "Async task handling" },
            { cmd: "->", desc: "Arrow function shorthand" }
        ]
    },
    {
        id: "gng",
        title: "GNG (Object Oriented Vybe)",
        icon: Box,
        description: "Object-oriented programming and structures.",
        overview: "Vybe groups related state and logic into 'GNGs'. A GNG is a blueprint for objects. Unlike traditional classes, GNGs are designed to be lightweight and favor composition over deep inheritance.",
        syntax: "gng Player {\n  cook(name) {\n    this.name = name\n    this.hp = 100\n  }\n  vibe attack() { ... }\n}",
        behavior: "GNGs are instantiated using the name directly (no 'new' keyword required). The 'cook' vibe is the constructor. All properties are public by default, but internal state can be protected by naming conventions or lexical closures within the cook vibe.",
        advancedConcepts: "GNGs support 'Plug-ins'—you can extend an existing GNG's functionality from outside its definition using the `ext` keyword. This allows for clean separation between data definitions and domain logic.",
        bestPractices: [
            "Keep GNGs small.",
            "Initialize all properties in 'cook'.",
            "Use GNGs to represent meaningful domain entities, not just data containers."
        ],
        commonMistakes: [
            "Using 'new' to create an instance (Vybe doesn't use it).",
            "Deeply nesting GNGs (use composition instead).",
            "Forgetting to use 'this' when accessing properties inside vibes."
        ],
        examples: [
            {
                label: "Basic GNG",
                code: `gng Bot {\n  cook(id) {\n    this.id = id\n  }\n  vibe greet() {\n    say \"Bot {this.id} online.\"\n  }\n}\n\nmy_bot = Bot(1)\nmy_bot.greet()`
            },
            {
                label: "Composition",
                code: `gng Weapon {\n  cook(dmg) { this.dmg = dmg }\n}\ngng Player {\n  cook(wep) { this.wep = wep }\n}`
            },
            {
                label: "Extensions",
                code: `ext Player {\n  vibe heal() {\n    swap this.hp = 100\n  }\n}`
            }
        ],
        quickRef: [
            { cmd: "gng", desc: "Define a class" },
            { cmd: "cook", desc: "Constructor method" },
            { cmd: "this", desc: "Self-reference" },
            { cmd: "ext", desc: "Extend a gng" }
        ]
    },
    {
        id: "error-handling",
        title: "Error Handling",
        icon: AlertTriangle,
        description: "Dealing with failures and debugging.",
        overview: "Vybe treats errors as first-class citizens. We provide traditional `try/catch` for recoverable errors and `crash/panic` for unrecoverable system failures that require immediate shutdown.",
        syntax: "try { ... } catch error { ... }\ncrash \"Unplayable vibe\" if cond",
        behavior: "When a 'crash' occurs, Vybe performs an immediate stack trace 'spill' to the console and exits with a non-zero code. 'Try' blocks wrap regions that might fail (e.g., file I/O or network requests), and 'Catch' receives a specialized error object with metadata.",
        advancedConcepts: "The 'spill' command is a powerful debugging tool that prints the current value, its type, and its memory address without interrupting the flow of execution. It is the preferred way to logger in Vybe.",
        bestPractices: [
            "Use 'try/catch' for network and file operations.",
            "Use 'crash' only for logic errors that shouldn't happen in production.",
            "Spill variables early and often during development."
        ],
        commonMistakes: [
            "Using 'try/catch' for basic logic checks (use 'sus' instead).",
            "Forgetting that 'crash' terminates the entire process.",
            "Leaving 'spill' commands in production code (they add overhead)."
        ],
        examples: [
            {
                label: "Safe Fetch",
                code: `try {\n  data = fetch \"/missing\"\n} catch e {\n  say \"Failed to load: {e.msg}\"\n}`
            },
            {
                label: "Panic Injection",
                code: `vibe process(val) {\n  crash \"Value too low\" if val < 0\n  return val * 10\n}`
            },
            {
                label: "Spilling Data",
                code: `complex_obj = { \"a\": 1, \"b\": 2 }\nspill complex_obj // Detailed debug info`
            }
        ],
        quickRef: [
            { cmd: "try/catch", desc: "Handle errors" },
            { cmd: "crash/panic", desc: "Terminate on error" },
            { cmd: "spill", desc: "Debug/Log variable" }
        ]
    },
    {
        id: "ecosystem",
        title: "Ecosystem & Interop",
        icon: Globe,
        description: "NPM, JS Blocks, and Plugin system.",
        overview: "Vybe is designed to play nice with the existing web ecosystem. You can import any NPM package using the `yo` command and even write raw JavaScript inside a `js` block for low-level optimizations.",
        syntax: "yo \"axios\"\njs { console.log(\"JS logic\") }",
        behavior: "The `yo` command intelligently handles dependency resolution and maps NPM exports into the Vybe namespace. `js` blocks are passed directly to the V8 engine without translation, providing a zero-cost escape hatch for complex logic.",
        advancedConcepts: "Vybe 'Zones' allow you to isolate different parts of the ecosystem. You can yo a legacy library into a specific zone to prevent it from polluting the global state. The `vybe` CLI manages these dependencies seamlessly.",
        bestPractices: [
            "Prefer native Vybe commands over NPM yos where possible.",
            "Use 'js' blocks only for performance-critical bottlenecks.",
            "Version your yos strictly in the `config.vybe` file."
        ],
        commonMistakes: [
            "Attempting to use Vybe variables inside a 'yo' block without explicit mapping.",
            "Over-using yos for small utilities that could be written in native Vybe.",
            "Neglecting security: always check the source of the packages you use."
        ],
        examples: [
            {
                label: "Importing NPM",
                code: `yo \"lodash\"\n// Use lodash methods implicitly\nres = _.map([1,2], (x) -> x + 1)`
            },
            {
                label: "JS Escape Hatch",
                code: `js {\n  // Raw JS for browser specifics\n  localStorage.setItem('vibe', 'check');\n}`
            },
            {
                label: "Zone Isolation",
                code: `zone legacy {\n  yo \"moment\"\n  say moment().format()\n}`
            }
        ],
        quickRef: [
            { cmd: "yo <pkg>", desc: "Import NPM / Package" },
            { cmd: "js { js }", desc: "Raw JavaScript block" },
            { cmd: "zone", desc: "Isolate dependencies" }
        ]
    },
    {
        id: "cli-tooling",
        title: "CLI & Tooling",
        icon: Wrench,
        description: "Official CLI, REPL, and Package management.",
        overview: "The Vybe CLI is a unified tool for creating, running, and managing Vybe projects. It handles everything from lightning-fast JIT execution to standalone binary compilation and integrated package management.",
        syntax: "vybe <command> [options]\nvybe run <file.vybe>\nvybe build <file.vybe> -o <name>\nvybe repl",
        behavior: "The `vybe run` command executes a script, defaulting to the entry point in `vybe.config.json` if no file is provided. `vybe build` produces a standalone executable using the `-o` flag for naming. The `repl` command starts the interactive Vybe shell for rapid prototyping.",
        advancedConcepts: "The CLI supports project-wide metadata via `vybe info`. Use `vybe watch` to automatically rerun your project whenever files change. The built-in `fmt` command ensures your Vybe scripts adhere to the collective style guide.",
        bestPractices: [
            "Use `vybe build` with `-o` for final deployment binaries.",
            "Leverage `vybe watch` during development for instant feedback.",
            "Initialize new projects with `vybe create` for the standard structure."
        ],
        commonMistakes: [
            "Running production loads without building (slower JIT startup).",
            "Ignoring compiler warnings about volatile types.",
            "Manual package management instead of using `vybe install`."
        ],
        examples: [
            {
                label: "Project Setup",
                code: `$ vybe create VybeTest\n📦 Cooking up a new Vybe project...\n\nProject name: VybeTest\nDescription: First vybe project!\nVersion (default 1.0.0):\nAuthor: John Doe\n\n📦 Spawning your Vybe project...\n\nProject: VybeTest\n\nFiles created:\n  main.vybe\n  vybe.config.json\n  README.md\n\n✨ You're ready to vibe.\n\nNext steps:\n  cd VybeTest\n  vybe run`
            },
            {
                label: "Running & REPL",
                code: `$ vybe run\n$ vybe repl\n> say \"Hello from REPL\"`
            },
            {
                label: "Building & Packages",
                code: `$ vybe build app.vybe -o MyApp\n⚡ Cooking the build for main.vybe...\nProgress |████████████████████████████████████████| 100% | Build success\n\n📦 Vybe Build Complete\n\nSource: main.vybe\nOutput: dist\\MyApp.exe\nSize:   35.9 MB\n\n$ vybe install axios\n\n📦 Installing axios...\n√ axios installed successfully`
            }
        ],
        quickRef: [
            { cmd: "vybe create", desc: "Interactive project setup" },
            { cmd: "vybe run", desc: "Execute script / project" },
            { cmd: "vybe repl", desc: "Start interactive REPL" },
            { cmd: "vybe build", desc: "Compile to executable" },
            { cmd: "vybe install", desc: "Install a package" },
            { cmd: "vybe watch", desc: "Watch and rerun" }
        ]
    },
    {
        id: "performance",
        title: "Performance & Internals",
        icon: Activity,
        description: "V8 integration and memory management.",
        overview: "Vybe is engineered for raw speed. By leveraging the V8 engine and extending it with domain-specific optimizations, Vybe achieves execution speeds that rival compiled languages for many common tasks. Our internal 'Flex-Buffer' system handles I/O with zero-copy semantics.",
        syntax: "// No special syntax; speed is implicit",
        behavior: "The Vybe compiler generates highly predictable bytecode. It avoids the 'de-optimization' traps common in pure dynamic languages by strictly controlling object property insertion and hidden class transitions. Memory is managed via a generational scavenger GC with specialized 'Zones' for short-lived state.",
        advancedConcepts: "The 'Inline Cache' (IC) in Vybe is optimized for natural commands. Commands like `say` and `fetch` are pre-compiled into specialized machine code stubs that bypass the standard function call overhead. Additionally, the 'Once-Block' ensures that heavy initialization code only runs once per zone lifecycle.",
        bestPractices: [
            "Avoid changing the structure of GNG instances after creation.",
            "Use 'Stash' for numeric data to trigger vector optimizations.",
            "Keep critical path vibes under the size limit for inlining."
        ],
        commonMistakes: [
            "Polluting the global namespace with temporary variables.",
            "Using expensive string concatenation in hot loops (use `str_builder`).",
            "Allocating many small objects when a single Vault would suffice."
        ],
        examples: [
            {
                label: "Once Block",
                code: `once {\n  // Setup heavy DB connection\n  db = connect \"proto://...\"\n}\nsay \"DB initialized.\"`
            },
            {
                label: "Flex Buffer",
                code: `// High throughput I/O\nstream = read \"huge.log\"\neach chunk in stream {\n  process(chunk)\n}`
            },
            {
                label: "Vector Optimization",
                code: `pts = [1.5, 2.5, 3.5] // Compiler treats this as Float64Array`
            }
        ],
        quickRef: [
            { cmd: "once", desc: "Initialize-only block" },
            { cmd: "flex", desc: "Low-level buffer access" },
            { cmd: "zone", desc: "Memory/State isolation" }
        ]
    },
    {
        id: "stdlib-reference",
        title: "Standard Library Reference",
        icon: Briefcase,
        description: "Built-in commands and system APIs.",
        overview: "The Vybe Standard Library is built into the language itself. We don't believe in 'importing' common needs like file access or networking. These are first-class commands that are always available and highly optimized.",
        syntax: "read <file> into <var>\nserve <port> -> <response>\nwait <time>",
        behavior: "Commands map directly to asynchronous runtime stubs. For instance, `read` uses non-blocking fs-streams, and `serve` uses a high-performance HTTP engine. These commands handle their own threading, leaving your main vibe logic clean.",
        advancedConcepts: "You can 'Hook' into these commands using the interop architecture to add middleware, logging, or encryption layers globally. For example, using a security module can automatically encrypt all data handled by the `write` command.",
        bestPractices: [
            "Use native commands for all I/O.",
            "Use 'wait' to manage backpressure in loops.",
            "Handle errors from 'fetch' and 'read' with 'try/catch'."
        ],
        commonMistakes: [
            "Attempting to use absolute OS paths in 'read/write' (portability risk).",
            "Using `wait` inside a hot sync loop needlessly.",
            "Forgetting to specify the protocol in 'fetch' URLs."
        ],
        examples: [
            {
                label: "File System",
                code: `content = read \"config.txt\"\nwrite \"copy.txt\" content`
            },
            {
                label: "Networking",
                code: `res = fetch \"https://api.vybe.dev\"\nsay res.status`
            },
            {
                label: "System Wait",
                code: `grind 5 {\n  say \"Step {it}\"\n  wait 500ms\n}`
            }
        ],
        quickRef: [
            { cmd: "read/write", desc: "File I/O" },
            { cmd: "fetch/serve", desc: "Network commands" },
            { cmd: "wait", desc: "Time delaying" },
            { cmd: "run", desc: "Shell execution" }
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

                                {/* Structured Content */}
                                {active.overview && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-vybe-blue rounded-full" />
                                            Overview
                                        </h2>
                                        <p className="text-base text-white/70 leading-relaxed mb-5">
                                            {active.overview}
                                        </p>
                                    </div>
                                )}

                                {active.syntax && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-vybe-purple rounded-full" />
                                            Syntax
                                        </h2>
                                        <div className="bg-[#05060A] rounded-2xl border border-white/5 p-6 mb-4">
                                            <VybeHighlighter code={active.syntax} className="text-sm opacity-90" />
                                        </div>
                                    </div>
                                )}

                                {/* Code Examples */}
                                {active.examples?.length > 0 && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-yellow-400 rounded-full" />
                                            Examples
                                        </h2>
                                        {active.examples.map((ex, i) => (
                                            <div key={i} className="mb-8 last:mb-0">
                                                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-white/30 mb-3">{ex.label}</h3>
                                                <div className="bg-[#0D1117] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                                                    <div className="flex items-center gap-2 px-5 py-3 border-b border-white/5 bg-white/[0.02]">
                                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
                                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
                                                        <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-white/20">demo.vybe</span>
                                                    </div>
                                                    <div className="p-6 overflow-x-auto">
                                                        <VybeHighlighter code={ex.code} className="text-base" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {active.behavior && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-green-400 rounded-full" />
                                            Behavior
                                        </h2>
                                        <p className="text-base text-white/70 leading-relaxed">
                                            {active.behavior}
                                        </p>
                                    </div>
                                )}

                                {active.advancedConcepts && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-4 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-vybe-blue rounded-full" />
                                            Advanced Concepts
                                        </h2>
                                        <div className="p-6 rounded-2xl bg-vybe-blue/5 border border-vybe-blue/10">
                                            <p className="text-sm text-white/80 leading-relaxed italic">
                                                {active.advancedConcepts}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-8 mb-12">
                                    {active.bestPractices && (
                                        <div className="p-8 rounded-3xl bg-green-500/5 border border-green-500/10">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-green-400 mb-6 flex items-center gap-2">
                                                <Zap className="w-4 h-4" /> Best Practices
                                            </h3>
                                            <ul className="space-y-4">
                                                {active.bestPractices.map((bp, i) => (
                                                    <li key={i} className="flex gap-3 text-xs text-white/60 leading-relaxed">
                                                        <span className="text-green-400 font-bold">•</span>
                                                        {bp}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    {active.commonMistakes && (
                                        <div className="p-8 rounded-3xl bg-red-500/5 border border-red-500/10">
                                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-red-400 mb-6 flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4" /> Common Mistakes
                                            </h3>
                                            <ul className="space-y-4">
                                                {active.commonMistakes.map((cm, i) => (
                                                    <li key={i} className="flex gap-3 text-xs text-white/60 leading-relaxed">
                                                        <span className="text-red-400 font-bold">×</span>
                                                        {cm}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {active.quickRef && (
                                    <div className="mb-12">
                                        <h2 className="text-xl font-black italic mb-6 flex items-center gap-2">
                                            <span className="w-1.5 h-6 bg-white/20 rounded-full" />
                                            Quick Reference
                                        </h2>
                                        <div className="overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02]">
                                            <table className="w-full text-left border-collapse">
                                                <thead>
                                                    <tr className="border-b border-white/5 bg-white/[0.02]">
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Syntax</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/40">Description</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {active.quickRef.map((ref, i) => (
                                                        <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                                                            <td className="px-6 py-4 font-mono text-xs text-vybe-blue">{ref.cmd}</td>
                                                            <td className="px-6 py-4 text-xs text-white/60">{ref.desc}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

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
        </div>
    );
}
