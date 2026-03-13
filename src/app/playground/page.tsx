"use client";
import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, RotateCcw, ChevronDown, Terminal, Info } from "lucide-react";
import VybeHighlighter from "@/components/VybeHighlighter";
import Navbar from "@/components/Navbar";
import { tokenize } from "@/lib/vybe/lexer";
import { Parser } from "@/lib/vybe/parser";
import { evaluate } from "@/lib/vybe/interpreter";
import { createGlobalEnv } from "@/lib/vybe/environment";
import { VybeError } from "@/lib/vybe/error";

// ─── Playground UI ─────────────────────────────────────────────────────────

const EXAMPLES = [
    {
        label: "The Vibe Check",
        code: `say "Welcome to Vybe v1.0.0! 🚀"\n\nscore = 85\nsus score > 90 {\n  say "Aura points: +1000 (Elite)"\n} fr score > 50 {\n  say "Status: Bussin (Solid)"\n} nah {\n  say "Status: Skill Issue (Mid)"\n}`
    },
    {
        label: "Natural Commands",
        code: `say "Initializing network probe..."\nwait 1s\n\nsay "Fetching data..."\ndata = fetch "https://api.github.com/repos/vybe-lang/vybe"\n\nsus data.status == 200 {\n  say "Bussin! Repository: {data.name}"\n  say "Stars: {data.stargazers_count} ⭐"\n} nah {\n  say "Cap. Request failed."\n}`
    },
    {
        label: "The Bot Squad",
        code: `gng Defender {\n  init(name) {\n    this.name = name\n    this.power = 100\n  }\n\n  vibe activate() {\n    say "System Online: {this.name}"\n    say "Power Level: {this.power}"\n  }\n}\n\nsquad = [new Defender("V-1"), new Defender("X-9")]\n\neach bot in squad {\n  bot.activate()\n}`
    },
    {
        label: "Iteration Flow",
        code: `say "Grinding the calculation..."\n\nresults = stash []\n\nfor i = 1..5 {\n  res = i * i\n  push res to results\n}\n\nsay "Results: {results}"\nsay "Final Count: {size(results)}"`
    },
    {
        label: "Elite Fallbacks",
        code: `// The Null Coalescing vibe\nuser_input = ghost\nusername = user_input ?? "Elite_Dev"\n\nsay "Welcome back, {username}!"\n\nonce {\n  say "Core engine initialized."\n}`
    }
];

export default function PlaygroundPage() {
    const [code, setCode] = useState(EXAMPLES[0].code);
    const [output, setOutput] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [running, setRunning] = useState(false);
    const [selectedEx, setSelectedEx] = useState(0);
    const [showExDropdown, setShowExDropdown] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // IDE State
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [suggestionPos, setSuggestionPos] = useState({ top: 0, left: 0 });
    const [focusedSuggestion, setFocusedSuggestion] = useState(0);
    // Close returndown on ANY document mousedown — returndown's onMouseDown stopPropagation
    // prevents this from firing when clicking on suggestion options
    useEffect(() => {
        const handler = () => setSuggestions([]);
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const run = useCallback(() => {
        setRunning(true);
        setError(null);
        setOutput([]);
        setTimeout(async () => {
            try {
                const env = createGlobalEnv({}, (msg: string) => {
                    setOutput(prev => [...prev, msg]);
                });
                const tokens = tokenize(code);
                const parser = new Parser();
                const ast = parser.produceAST(tokens);
                await evaluate(ast, env);
            } catch (e: any) {
                if (e instanceof VybeError) {
                    const VYBE_MSGS = [
                        "Lowkey this line is acting sus.",
                        "This operation ain't bussin.",
                        "Something here is straight cap.",
                        "That variable ghosted the runtime.",
                        "The parser is not vibing with this syntax.",
                        "Deadass something broke here."
                    ];
                    const randMsg = VYBE_MSGS[Math.floor(Math.random() * VYBE_MSGS.length)];
                    const lines = code.split('\n');
                    const errLine = lines[(e.line || 1) - 1] || "";
                    const col = Math.max(1, e.column || 1);
                    const pointer = " ".repeat(col - 1) + "^";
                    const block = [
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                        `❌  Vybe ${e.category}`,
                        ``,
                        `Line ${e.line}  Column ${col}`,
                        ``,
                        `  ${e.line} │ ${errLine}`,
                        `     │ ${pointer}`,
                        ``,
                        `${e.message}`,
                        ``,
                        `🔥  Vybe says: ${randMsg}`,
                        `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
                    ].join('\n');
                    setError(block);
                } else {
                    setError(e instanceof Error ? e.message : String(e));
                }
            }
            setRunning(false);
        }, 80);
    }, [code]);

    const loadExample = (idx: number) => {
        setSelectedEx(idx); setCode(EXAMPLES[idx].code);
        setOutput([]); setError(null); setShowExDropdown(false);
    };

    const updateSuggestions = useCallback((val: string, cursorOffset: number) => {
        const textBeforeCursor = val.slice(0, cursorOffset);
        const match = textBeforeCursor.match(/[a-zA-Z_]w*$/);
        const ALL_KEYWORDS = [
            "cook", "swap", "vibe", "move", "say", "say", "sus", "fr", "nah", "maybe",
            "each", "in", "for", "to", "grind", "spin", "match", "gng", "return", "bounce",
            "skip", "crash", "panic", "try", "catch", "async", "await", "push", "pop",
            "size", "type", "once", "yo", "plug", "zone", "frfr", "cap", "ghost", "rand",
            "flow", "time", "int", "float", "str", "Math", "String", "File", "read",
            "write", "fetch", "run", "delete", "into", "with", "seconds", "js", "return"
        ];

        if (match) {
            const currentWord = match[0];
            const matches = ALL_KEYWORDS.filter(k => k.startsWith(currentWord) && k !== currentWord);
            setSuggestions(matches);
            setFocusedSuggestion(0);
        } else {
            setSuggestions([]);
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(e.target.value);
        updateSuggestions(e.target.value, e.target.selectionStart);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        const ta = e.currentTarget;
        const s = ta.selectionStart;
        const eEnd = ta.selectionEnd;
        const v = ta.value;

        // Autocomplete Navigation
        if (suggestions.length > 0) {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setFocusedSuggestion(p => (p + 1) % suggestions.length);
                return;
            }
            if (e.key === "ArrowUp") {
                e.preventDefault();
                setFocusedSuggestion(p => (p - 1 + suggestions.length) % suggestions.length);
                return;
            }
            if (e.key === "Enter" || e.key === "Tab") {
                e.preventDefault();
                const match = v.slice(0, s).match(/[a-zA-Z_]w*$/);
                if (match) {
                    const wordStart = s - match[0].length;
                    const completion = suggestions[focusedSuggestion];
                    const newCode = v.slice(0, wordStart) + completion + v.slice(eEnd);
                    setCode(newCode);
                    setSuggestions([]);
                    setTimeout(() => ta.setSelectionRange(wordStart + completion.length, wordStart + completion.length), 0);
                }
                return;
            }
        }

        // Bracket / Quote Pairing
        const pairs: Record<string, string> = { "(": ")", "{": "}", "[": "]", '"': '"', "'": "'" };
        if (e.key in pairs) {
            // For closing chars, skip if already present
            const closing = [')', '}', ']', '"', "'"];
            if (closing.includes(e.key) && v[s] === e.key) {
                e.preventDefault();
                setTimeout(() => ta.setSelectionRange(s + 1, s + 1), 0);
                return;
            }
            e.preventDefault();
            setCode(v.slice(0, s) + e.key + pairs[e.key] + v.slice(eEnd));
            setTimeout(() => ta.setSelectionRange(s + 1, s + 1), 0);
            return;
        }

        // Smart Indent: Tab
        if (e.key === "Tab") {
            e.preventDefault();
            setCode(v.slice(0, s) + "  " + v.slice(eEnd));
            setTimeout(() => ta.setSelectionRange(s + 2, s + 2), 0);
            return;
        }

        // Smart Indent: Enter
        if (e.key === "Enter") {
            const lineBefore = v.slice(0, s).split('n').pop() || "";
            const matchIndent = lineBefore.match(/^s*/);
            const indent = matchIndent ? matchIndent[0] : "";

            if (v[s - 1] === "{") {
                e.preventDefault();
                const extraIndent = "  ";
                const isClosingMatched = v[s] === "}";
                if (isClosingMatched) {
                    setCode(v.slice(0, s) + "n" + indent + extraIndent + "n" + indent + v.slice(eEnd));
                    setTimeout(() => ta.setSelectionRange(s + 1 + indent.length + extraIndent.length, s + 1 + indent.length + extraIndent.length), 0);
                } else {
                    setCode(v.slice(0, s) + "n" + indent + extraIndent + v.slice(eEnd));
                    setTimeout(() => ta.setSelectionRange(s + 1 + indent.length + extraIndent.length, s + 1 + indent.length + extraIndent.length), 0);
                }
                return;
            } else {
                e.preventDefault();
                setCode(v.slice(0, s) + "n" + indent + v.slice(eEnd));
                setTimeout(() => ta.setSelectionRange(s + 1 + indent.length, s + 1 + indent.length), 0);
                return;
            }
        }

        // Update suggestions if not handled
        setTimeout(() => updateSuggestions(ta.value, ta.selectionStart), 0);
    };

    return (
        <div className="min-h-screen bg-vybe-dark text-white">
            <Navbar />
            <div className="pt-16 container mx-auto px-6 py-8">
                {/* Disclaimer */}
                <div className="mb-6 mt-4 flex items-start gap-3 bg-vybe-blue/10 border border-vybe-blue/20 rounded-2xl p-4">
                    <Info className="w-4 h-4 text-vybe-blue flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-white/60 leading-relaxed">
                        <span className="text-vybe-blue font-bold">Playground Mode</span> — This playground executes code directly in your browser using the true Vybe compiler AST. While it correctly covers the entire logic syntaxes, some system-level features (CLI imports, OS utilities) are unavailable.
                    </p>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
                    <div className="relative">
                        <button onClick={() => setShowExDropdown(!showExDropdown)} className="flex items-center gap-2 glass border border-white/10 rounded-xl px-4 py-2.5 text-sm hover:border-white/20 transition-colors">
                            <span className="text-white/60">Example:</span>
                            <span className="font-bold">{EXAMPLES[selectedEx].label}</span>
                            <ChevronDown className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                            {showExDropdown && (
                                <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="absolute top-full mt-2 left-0 z-50 glass border border-white/10 rounded-2xl py-2 min-w-[200px]">
                                    {EXAMPLES.map((ex, i) => (
                                        <button key={i} onClick={() => loadExample(i)} className={`w-full text-left px-5 py-3 text-sm hover:bg-white/5 transition-colors ${i === selectedEx ? "text-vybe-blue" : "text-white/70"}`}>{ex.label}</button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex items-center gap-3">
                        <button onClick={() => { setCode(""); setOutput([]); setError(null); }} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/5">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <motion.button whileTap={{ scale: 0.96 }} onClick={run} disabled={running}
                            className="flex items-center gap-2 bg-vybe-gradient text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:shadow-lg hover:shadow-vybe-purple/20 transition-all disabled:opacity-50">
                            <Play className="w-4 h-4" fill="white" />
                            {running ? "Running..." : "Run Code"}
                        </motion.button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4" style={{ minHeight: "60vh" }}>
                    {/* Editor */}
                    <div className="glass rounded-2xl overflow-hidden border border-white/5">
                        <div className="flex items-center gap-2 px-5 py-3 bg-[#121826] border-b border-white/5">
                            <div className="w-3 h-3 rounded-full bg-red-500/60" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                            <div className="w-3 h-3 rounded-full bg-green-500/60" />
                            <span className="ml-4 text-[10px] font-bold uppercase tracking-widest text-white/20">main.vybe</span>
                        </div>
                        {/* Editor body: gutter + content side by side */}
                        <div className="relative overflow-auto" style={{ minHeight: 400 }}>
                            <div className="flex font-mono text-sm" style={{ minHeight: 400 }}>
                                {/* Line number gutter */}
                                <div className="select-none text-right bg-[#0d1220] border-r border-white/5" style={{ minWidth: 44, padding: "20px 8px" }}>
                                    {code.split("n").map((_, i) => (
                                        <div key={i} className="leading-6 text-xs text-white/20">{i + 1}</div>
                                    ))}
                                </div>
                                {/* Code area */}
                                <div
                                    className="relative flex-1"
                                    style={{ padding: "20px 16px" }}
                                    onMouseDown={() => setSuggestions([])}
                                >
                                    {/* Syntax highlighter layer */}
                                    <VybeHighlighter code={code} className="text-sm pointer-events-none absolute inset-0" style={{ padding: "20px 16px" }} />
                                    {/* Editable textarea layer */}
                                    <textarea
                                        ref={textareaRef}
                                        value={code}
                                        onChange={handleChange}
                                        onKeyDown={handleKeyDown}
                                        onSelect={(e) => {
                                            const ta = e.currentTarget;
                                            const s = ta.selectionStart;
                                            const lines = ta.value.slice(0, s).split('n');
                                            const currentLineStr = lines[lines.length - 1];
                                            const topOffset = (lines.length - 1) * 24 + 20;
                                            const leftOffset = currentLineStr.length * 7.2 + 16;
                                            setSuggestionPos({ top: topOffset, left: leftOffset });
                                        }}
                                        spellCheck={false}
                                        className="absolute inset-0 w-full h-full resize-none bg-transparent text-transparent caret-white font-mono text-sm leading-6 focus:outline-none z-10"
                                        style={{ padding: "20px 16px" }}
                                    />
                                    {/* Autocomplete Dropdown */}
                                    <AnimatePresence>
                                        {suggestions.length > 0 && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -4, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                className="absolute z-50 bg-[#1e2536] border border-vybe-purple/30 rounded-lg shadow-xl overflow-hidden py-1 min-w-[120px]"
                                                style={{ top: suggestionPos.top, left: suggestionPos.left }}
                                                onMouseDown={(e) => e.stopPropagation()}
                                            >
                                                {suggestions.map((sug, idx) => (
                                                    <div
                                                        key={sug}
                                                        onMouseDown={(e) => {
                                                            // Prevent blur so the textarea keeps focus
                                                            e.preventDefault();
                                                            const ta = textareaRef.current;
                                                            if (!ta) return;
                                                            const s = ta.selectionStart;
                                                            const v = ta.value;
                                                            const match = v.slice(0, s).match(/[a-zA-Z_]w*$/);
                                                            if (match) {
                                                                const wordStart = s - match[0].length;
                                                                const newCode = v.slice(0, wordStart) + sug + v.slice(s);
                                                                setCode(newCode);
                                                                // Move cursor after inserted word
                                                                setTimeout(() => ta.setSelectionRange(wordStart + sug.length, wordStart + sug.length), 0);
                                                            }
                                                            setSuggestions([]);
                                                        }}
                                                        className={`px-3 py-1.5 text-xs font-mono cursor-pointer transition-colors ${idx === focusedSuggestion ? 'bg-vybe-purple/40 text-white' : 'text-white/70 hover:bg-white/10'}`}
                                                    >
                                                        {sug}
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Output */}
                    <div className="glass rounded-2xl overflow-hidden border border-white/5 flex flex-col">
                        <div className="flex items-center gap-2 px-5 py-3 bg-[#121826] border-b border-white/5">
                            <Terminal className="w-4 h-4 text-vybe-blue" />
                            <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Output</span>
                        </div>
                        <div className="flex-1 p-6 font-mono text-sm overflow-auto" style={{ minHeight: 400 }}>
                            {error && (
                                <pre className="text-red-400 text-xs leading-6" style={{ whiteSpace: "pre-wrap", fontFamily: "monospace" }}>{error}</pre>
                            )}
                            {output.length > 0 && output.map((line, i) => (
                                <div key={i} className="text-green-300 leading-6" style={{ whiteSpace: "pre-wrap" }}>{line}</div>
                            ))}
                            {output.length === 0 && !error && (
                                <div className="text-white/20 italic">Hit &quot;Run Code&quot; to execute your Vybe script...</div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Keywords reference */}
                <div className="mt-6 glass rounded-2xl p-6 border border-white/5">
                    <div className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-4">Quick Reference — Lexicon</div>
                    <div className="flex flex-wrap gap-2">
                        {[
                            "vibe", "say", "sus", "fr", "nah", "maybe", "each", "in", "for", "to",
                            "match", "gng", "try", "catch", "js", "async", "await", "once",
                            "read", "write", "fetch", "run", "delete", "move", "wait", "s", "into"
                        ].map(k => (
                            <span key={k} className="text-xs font-mono bg-vybe-purple/10 text-vybe-purple border border-vybe-purple/20 px-2.5 py-1 rounded-lg">{k}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
