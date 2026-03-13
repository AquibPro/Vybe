"use client";

import React from "react";

export const KEYWORDS = ["cook", "swap", "vibe", "move", "say", "spill", "sus", "fr", "nah", "maybe", "each", "in", "for", "to", "grind", "spin", "match", "gng", "drop", "bounce", "skip", "crash", "panic", "try", "catch", "async", "await", "push", "pop", "size", "type", "once", "yo", "plug", "zone", "frfr", "cap", "ghost", "rand", "flow", "time", "int", "float", "str", "Math", "String", "File"];

interface HighlightProps {
    code: string;
    className?: string;
    style?: React.CSSProperties;
}

export default function VybeHighlighter({ code, className = "", style }: HighlightProps) {
    const highlight = (text: string) => {
        if (!text) return [];

        // Comprehensive Vybe syntax highlighting
        const tokens = [
            { regex: /\b(cook|swap|vibe|move|say|spill|sus|fr|nah|maybe|each|in|for|to|grind|spin|match|gng|drop|bounce|skip|crash|panic|try|catch|async|await|push|pop|size|type|once|yo|plug|zone|flex)\b/g, color: "text-vybe-blue font-bold" },
            { regex: /\b(flow|rand|wait|type|time|int|float|str)\b/g, color: "text-vybe-blue font-semibold" },
            { regex: /\b(int|float|string|bool|list|map|ghost|void)\b/g, color: "text-vybe-blue/60" },
            { regex: /\b(frfr|cap|ghost)\b/g, color: "text-vybe-purple font-bold italic" },
            { regex: /".*?"/g, color: "text-yellow-400" },
            { regex: /\/\/.*$/gm, color: "text-white/30" },
            { regex: /\/\*[\s\S]*?\*\//g, color: "text-white/30" },
            { regex: /\b\d+(\.\d+)?\b/g, color: "text-vybe-purple font-bold" },
            { regex: /([{}()\[\],.])|(\|>)|(\+\+)|(--)|([+\-*/%=]=?)|([<>!=]=?)/g, color: "text-white/40" },
        ];

        // Break text into parts carefully preserving spaces/newlines
        const parts = text.split(/(\b\w+\b|".*?"|\/\/.*|\/\*[\s\S]*?\*\/|[{}().,\[\]]|\|>|\+\+|--|[+\-*/%=]=?|[<>!=]=?|\s+)/g);

        return parts.map((part, i) => {
            if (!part) return null;
            if (part.match(/^\s+$/)) return part;

            let color = "text-white";

            for (const token of tokens) {
                if (part.match(token.regex)) {
                    color = token.color;
                    break;
                }
            }

            return <span key={i} className={color}>{part}</span>;
        });
    };

    return (
        <pre className={`font-mono leading-6 overflow-x-auto ${className}`} style={style}>
            <code>{highlight(code)}</code>
        </pre>
    );
}
