export interface FormatToken {
    type: "string" | "comment" | "operator" | "punctuation" | "word" | "newline" | "whitespace" | "number";
    value: string;
}

export function tokenizeForFormatter(source: string): FormatToken[] {
    const tokens: FormatToken[] = [];
    let pos = 0;

    const pushPunctuation = (char: string) => {
        tokens.push({ type: "punctuation", value: char });
        pos++;
    };

    while (pos < source.length) {
        const char = source[pos];

        // String
        if (char === '"' || char === "'") {
            let str = char;
            pos++;
            while (pos < source.length && source[pos] !== char) {
                if (source[pos] === "\\") {
                    str += source[pos];
                    pos++;
                    if (pos < source.length) {
                        str += source[pos];
                        pos++;
                    }
                } else {
                    str += source[pos];
                    pos++;
                }
            }
            if (pos < source.length) {
                str += source[pos];
                pos++;
            }
            tokens.push({ type: "string", value: str });
            continue;
        }

        // Comment
        if (char === "/" && source[pos + 1] === "/") {
            let comment = "//";
            pos += 2;
            while (pos < source.length && source[pos] !== "\n") {
                comment += source[pos];
                pos++;
            }
            tokens.push({ type: "comment", value: comment });
            continue;
        }
        if (char === "/" && source[pos + 1] === "*") {
            let comment = "/*";
            pos += 2;
            while (pos < source.length && !(source[pos] === "*" && source[pos + 1] === "/")) {
                comment += source[pos];
                pos++;
            }
            if (pos < source.length) {
                comment += "*/";
                pos += 2;
            }
            tokens.push({ type: "comment", value: comment });
            continue;
        }

        if (char === "\n") {
            tokens.push({ type: "newline", value: "\n" });
            pos++;
            continue;
        }

        if (char === " " || char === "\t" || char === "\r") {
            let ws = char;
            pos++;
            while (pos < source.length && (source[pos] === " " || source[pos] === "\t" || source[pos] === "\r")) {
                ws += source[pos];
                pos++;
            }
            tokens.push({ type: "whitespace", value: ws });
            continue;
        }

        // Operators
        const twoCharOp = source.substring(pos, pos + 2);
        if (["==", "!=", ">=", "<=", "->", "=>", "|>", "+=", "-=", "*=", "/=", "%=", "++", "--", "..", "??"].includes(twoCharOp)) {
            tokens.push({ type: "operator", value: twoCharOp });
            pos += 2;
            continue;
        }
        if (["=", "+", "-", "*", "/", ">", "<", "?", ":", "!"].includes(char)) {
            tokens.push({ type: "operator", value: char });
            pos++;
            continue;
        }

        if (["{", "}", "(", ")", "[", "]", ",", ".", ";"].includes(char)) {
            pushPunctuation(char);
            continue;
        }

        // Number
        if (char >= '0' && char <= '9') {
            let num = "";
            while (pos < source.length && ((source[pos] >= '0' && source[pos] <= '9') || source[pos] === ".")) {
                num += source[pos];
                pos++;
            }
            tokens.push({ type: "number", value: num });
            continue;
        }

        // Word
        let word = "";
        while (pos < source.length && !(" \t\r\n\"'[]{}(),.=+-*/><?:!;".includes(source[pos]))) {
            word += source[pos];
            pos++;
        }
        if (word.length > 0) {
            tokens.push({ type: "word", value: word });
            continue;
        }

        tokens.push({ type: "word", value: source[pos] });
        pos++;
    }

    return tokens;
}

export class Formatter {
    formatString(sourceCode: string): string {
        const tokens = tokenizeForFormatter(sourceCode);

        const meaningfulTokens: FormatToken[] = [];
        for (const t of tokens) {
            if (t.type !== "whitespace") {
                meaningfulTokens.push(t);
            }
        }

        const statementStarters = new Set([
            "vibe", "cook", "spill", "say", "sus", "nah", "maybe", "grind", "each",
            "yo", "zone", "squad", "gng", "yeet", "crash", "for", "match", "try",
            "catch", "bounce", "skip", "push", "pop", "once", "flex", "ask", "await", "serve"
        ]);

        const initialLines: FormatToken[][] = [[]];

        const noBreakBeforeMap = new Set([
            "=", "+", "-", "*", "/", ">", "<", ">=", "<=", "==", "!=",
            "(", "[", ":", "?", ",", "in", "to", "into", "with", "=>", "->", "|>",
            "+=", "-=", "*=", "/=", "%=", "++", "--", "??"
        ]);

        for (let i = 0; i < meaningfulTokens.length; i++) {
            const t = meaningfulTokens[i];

            if (t.type === "newline") {
                initialLines.push([]);
                continue;
            }

            // Keyword upgrades
            if (t.type === "word") {
                if (t.value === "squad") t.value = "gng";
                if (t.value === "spill") t.value = "say";
            }

            const currentLine = initialLines[initialLines.length - 1];

            if (t.value === "{") {
                currentLine.push(t);
                continue;
            }

            if (t.value === "}") {
                if (currentLine.length > 0) {
                    initialLines.push([t]);
                } else {
                    currentLine.push(t);
                }
                continue;
            }

            let forceBreak = false;
            if (currentLine.length > 0) {
                const prev = currentLine[currentLine.length - 1];

                if (t.type === "word" && statementStarters.has(t.value)) {
                    if (!noBreakBeforeMap.has(prev.value) && prev.type !== "operator") {
                        if (t.value === "maybe" || t.value === "nah" || t.value === "catch") {
                            forceBreak = true;
                        } else {
                            forceBreak = true;
                        }
                    }
                }

                if (prev.value === "}" && !["maybe", "nah", "catch"].includes(t.value)) {
                    forceBreak = true;
                }

                if (prev.value === "{") {
                    forceBreak = true;
                }

                if (t.type === "word" && (prev.type === "number" || prev.type === "string" || prev.value === ")" || prev.value === "]")) {
                    if (!["in", "to", "into", "with"].includes(t.value)) {
                        forceBreak = true;
                    }
                }
            }

            if (forceBreak) {
                initialLines.push([t]);
            } else {
                currentLine.push(t);
            }
        }

        const finalLines: FormatToken[][] = [];
        let blankLineCount = 0;

        const blockStarters = new Set([
            "vibe", "sus", "maybe", "nah", "each", "spin", "grind",
            "once", "try", "catch", "squad", "gng", "match", "zone", "serve"
        ]);

        for (const line of initialLines) {
            if (line.length === 0) {
                blankLineCount++;
            } else {
                if (blankLineCount > 0) {
                    finalLines.push([]);
                } else if (finalLines.length > 0) {
                    const prevLine = finalLines[finalLines.length - 1];
                    if (prevLine && prevLine.length > 0) {
                        const lastToken = prevLine[prevLine.length - 1];
                        const firstToken = line[0];

                        if (firstToken.type === "word" && blockStarters.has(firstToken.value) && lastToken.value !== "{") {
                            finalLines.push([]);
                        }
                        else if (lastToken.value === "}") {
                            finalLines.push([]);
                        }
                    }
                }

                finalLines.push(line);
                blankLineCount = 0;
            }
        }

        let outputLines: string[] = [];
        let indentLevel = 0;

        for (const line of finalLines) {
            if (line.length === 0) {
                outputLines.push("");
                continue;
            }

            let openBraces = 0;
            let closeBraces = 0;
            for (const t of line) {
                if (t.value === "{") openBraces++;
                if (t.value === "}") closeBraces++;
            }

            let myIndent = indentLevel;
            if (line[0].value === "}") myIndent = Math.max(0, indentLevel - 1);
            if (line[0].value === "maybe" || line[0].value === "nah" || line[0].value === "catch") myIndent = Math.max(0, indentLevel - 1);

            let str = "  ".repeat(Math.max(0, myIndent));
            let prev: FormatToken | null = null;

            for (let i = 0; i < line.length; i++) {
                const t = line[i];
                let space = false;

                if (prev) {
                    if (t.type === "operator" || prev.type === "operator") space = true;
                    if (t.value === "{") space = true;
                    if (t.value === "maybe" || t.value === "nah" || t.value === "catch") space = true;

                    if (t.type === "word" && prev.type === "word") space = true;
                    if (t.type === "word" && prev.type === "string") space = true;
                    if (t.type === "string" && prev.type === "word") space = true;
                    if (t.type === "number" && prev.type === "word") space = true;
                    if (t.type === "word" && prev.type === "number") space = true;
                    if (t.type === "number" && prev.type === "operator") space = true;
                    if (t.type === "operator" && prev.type === "number") space = true;

                    if (prev.value === ",") space = true;
                    if (prev.value === ":") space = true;
                    if (t.value === ":") space = true;
                    if (prev.value === "?") space = true;
                    if (t.value === "?") space = true;
                    if (t.value === "=>" || prev.value === "=>" || t.value === "->" || prev.value === "->") space = true;
                    if (t.value === ".." || prev.value === "..") space = false;

                    if (t.value === "++" && prev.type === "word") space = false;
                    if (t.value === "--" && prev.type === "word") space = false;
                    if (prev.value === "++" && t.type === "word") space = false;
                    if (prev.value === "--" && t.type === "word") space = false;

                    if ((prev.value === "-" || prev.value === "+") && i >= 2 && (line[i - 2].type === "operator" || ["(", "[", ",", ":", "?"].includes(line[i - 2].value))) {
                        space = false;
                    } else if ((prev.value === "-" || prev.value === "+") && i === 1) {
                        space = false;
                    }

                    if (t.value === "(") {
                        if (prev.type === "word" && !["sus", "maybe", "spin", "grind", "each", "match", "catch", "for", "while"].includes(prev.value)) {
                            space = false;
                        } else {
                            space = true;
                        }
                    }
                    if (t.value === ")") space = false;
                    if (prev.value === "(") space = false;

                    if (t.value === "[") space = true;
                    if (prev.value === "[") space = false;
                    if (t.value === "]") space = false;

                    if (t.value === ".") space = false;
                    if (prev.value === ".") space = false;

                    if (t.value === ",") space = false;
                }

                if (space && str[str.length - 1] !== " ") {
                    str += " ";
                }
                str += t.value;
                prev = t;
            }

            outputLines.push(str);
            indentLevel += openBraces;
            indentLevel -= closeBraces;
        }

        const finalOutput: string[] = [];
        let blankCount = 0;
        for (const l of outputLines) {
            if (l.trim() === "") {
                blankCount++;
                if (blankCount <= 1 && finalOutput.length > 0) {
                    finalOutput.push("");
                }
            } else {
                finalOutput.push(l);
                blankCount = 0;
            }
        }

        if (finalOutput.length > 0 && finalOutput[finalOutput.length - 1] === "") {
            finalOutput.pop();
        }

        return finalOutput.join("\n") + "\n";
    }
}
