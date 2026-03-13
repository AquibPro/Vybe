export enum TokenType {
    // Literals
    Number, String, Identifier,

    // Keywords (Canonical)
    Vibe, Cook, Swap, Ghost, Say, Ask, Flex,
    Sus, Nah, Maybe, Fr, Grind, Each, In,
    Yo, Zone, Squad, Return, Crash,
    For, To, Match, Async, Await, Frfr, Cap,
    Try, Catch, Once,

    // Control Flow
    Bounce, Skip,

    // Extra Phase 2/3
    Stash, Push, Pop, Size, Wait, Check, Type,

    // Natural Commands Phase 11
    Read, Into, Fetch, Run, Move, Delete, Seconds, Write, With,
    Serve,

    // JS Interop
    Js,

    // Operators / Symbols
    Equals, DoubleEquals, NotEquals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals,
    And, Or, Not, Plus, Minus, Star, Slash, Percent,
    PlusEquals, MinusEquals, StarEquals, SlashEquals, PercentEquals, PlusPlus, MinusMinus,
    OpenParen, CloseParen, OpenBrace, CloseBrace, OpenBracket, CloseBracket,
    Comma, Colon, Dot, Pipeline, Arrow, QuestionMark, Range, NullCoalescing,
    Newline,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    vibe: TokenType.Vibe, spin: TokenType.Vibe,
    cook: TokenType.Cook, swap: TokenType.Swap, ghost: TokenType.Ghost, void: TokenType.Ghost,
    say: TokenType.Say, ask: TokenType.Ask, flex: TokenType.Flex,
    sus: TokenType.Sus, nah: TokenType.Nah, maybe: TokenType.Maybe, fr: TokenType.Fr,
    grind: TokenType.Grind, each: TokenType.Each, in: TokenType.In,
    yo: TokenType.Yo, plug: TokenType.Yo, zone: TokenType.Zone,
    squad: TokenType.Squad, gng: TokenType.Squad, return: TokenType.Return, crash: TokenType.Crash, panic: TokenType.Crash,
    for: TokenType.For, to: TokenType.To, match: TokenType.Match,
    async: TokenType.Async, await: TokenType.Await, frfr: TokenType.Frfr, cap: TokenType.Cap,
    try: TokenType.Try, catch: TokenType.Catch,
    bounce: TokenType.Bounce, skip: TokenType.Skip,
    stash: TokenType.Stash, push: TokenType.Push, pop: TokenType.Pop,
    size: TokenType.Size, wait: TokenType.Wait, check: TokenType.Check, type: TokenType.Type,
    once: TokenType.Once,
    and: TokenType.And, or: TokenType.Or, not: TokenType.Not,

    // Natural Commands Phase 11
    read: TokenType.Read, into: TokenType.Into, fetch: TokenType.Fetch,
    run: TokenType.Run, move: TokenType.Move, delete: TokenType.Delete,
    seconds: TokenType.Seconds, write: TokenType.Write, with: TokenType.With,
    serve: TokenType.Serve,

    // JS Interop
    js: TokenType.Js
};

export interface Token {
    value: string;
    type: TokenType;
    line: number;
    column: number;
}

/**
 * Tokenize source code into a stream of tokens.
 */
export function tokenize(sourceCode: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    let line = 1;
    let column = 1;

    function push(type: TokenType, value: string, startLine: number, startCol: number) {
        tokens.push({ type, value, line: startLine, column: startCol });
    }

    function advance(offset: number = 1) {
        for (let i = 0; i < offset; i++) {
            if (sourceCode[pos] === "\n") {
                line++;
                column = 1;
            } else {
                column++;
            }
            pos++;
        }
    }

    function isAlpha(char: string): boolean {
        return /[a-zA-Z_]/.test(char);
    }

    function isNumeric(char: string): boolean {
        return /[0-9]/.test(char);
    }

    function isAlphaNumeric(char: string): boolean {
        return /[a-zA-Z0-9_]/.test(char);
    }

    while (pos < sourceCode.length) {
        let char = sourceCode[pos];
        const startLine = line;
        const startCol = column;

        if (char === "(") { push(TokenType.OpenParen, char, startLine, startCol); advance(); }
        else if (char === ")") { push(TokenType.CloseParen, char, startLine, startCol); advance(); }
        else if (char === "{") { push(TokenType.OpenBrace, char, startLine, startCol); advance(); }
        else if (char === "}") { push(TokenType.CloseBrace, char, startLine, startCol); advance(); }
        else if (char === "[") { push(TokenType.OpenBracket, char, startLine, startCol); advance(); }
        else if (char === "]") { push(TokenType.CloseBracket, char, startLine, startCol); advance(); }
        else if (char === ",") { push(TokenType.Comma, char, startLine, startCol); advance(); }
        else if (char === ":") { push(TokenType.Colon, char, startLine, startCol); advance(); }
        else if (char === ".") {
            if (sourceCode[pos + 1] === ".") {
                push(TokenType.Range, "..", startLine, startCol);
                advance(2);
            } else {
                push(TokenType.Dot, char, startLine, startCol);
                advance();
            }
        }

        else if (char === "\n") { push(TokenType.Newline, "\\n", startLine, startCol); advance(); }
        else if (char === " " || char === "\t" || char === "\r") { advance(); }
        else if (char === "?") {
            if (sourceCode[pos + 1] === "?") {
                push(TokenType.NullCoalescing, "??", startLine, startCol);
                advance(2);
            } else {
                push(TokenType.QuestionMark, char, startLine, startCol);
                advance();
            }
        }

        // Comments //
        else if (char === "/" && sourceCode[pos + 1] === "/") {
            advance(2);
            while (pos < sourceCode.length && sourceCode[pos] !== "\n") {
                advance();
            }
        }
        else if (char === "/" && sourceCode[pos + 1] === "*") {
            advance(2);
            while (pos < sourceCode.length && !(sourceCode[pos] === "*" && sourceCode[pos + 1] === "/")) {
                advance();
            }
            advance(2); // skip */
        }

        // Operators
        else if (char === "!") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.NotEquals, "!=", startLine, startCol); advance(2); }
            else {
                console.warn(`Lexer Warning: '!' is deprecated. Use 'not' instead at line ${line}`);
                advance();
            }
        }
        else if (char === "<") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.LessThanEquals, "<=", startLine, startCol); advance(2); }
            else { push(TokenType.LessThan, char, startLine, startCol); advance(); }
        }
        else if (char === ">") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.GreaterThanEquals, ">=", startLine, startCol); advance(2); }
            else { push(TokenType.GreaterThan, char, startLine, startCol); advance(); }
        }
        else if (char === "&" && sourceCode[pos + 1] === "&") {
            console.warn(`Lexer Warning: '&&' is deprecated. Use 'and' instead at line ${line}`);
            advance(2);
        }
        else if (char === "|") {
            if (sourceCode[pos + 1] === ">") { push(TokenType.Pipeline, "|>", startLine, startCol); advance(2); }
            else if (sourceCode[pos + 1] === "|") {
                console.warn(`Lexer Warning: '||' is deprecated. Use 'or' instead at line ${line}`);
                advance(2);
            }
            else {
                throw new Error(`Lexer Error: Unexpected char '${char}' at line ${line}`);
            }
        }

        else if (char === "-") {
            if (sourceCode[pos + 1] === ">") { push(TokenType.Arrow, "->", startLine, startCol); advance(2); }
            else if (sourceCode[pos + 1] === "=") { push(TokenType.MinusEquals, "-=", startLine, startCol); advance(2); }
            else if (sourceCode[pos + 1] === "-") { push(TokenType.MinusMinus, "--", startLine, startCol); advance(2); }
            else { push(TokenType.Minus, char, startLine, startCol); advance(); }
        }
        else if (char === "=") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.DoubleEquals, "==", startLine, startCol); advance(2); }
            else if (sourceCode[pos + 1] === ">") { push(TokenType.Arrow, "=>", startLine, startCol); advance(2); }
            else { push(TokenType.Equals, char, startLine, startCol); advance(); }
        }

        else if (char === "+") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.PlusEquals, "+=", startLine, startCol); advance(2); }
            else if (sourceCode[pos + 1] === "+") { push(TokenType.PlusPlus, "++", startLine, startCol); advance(2); }
            else { push(TokenType.Plus, char, startLine, startCol); advance(); }
        }
        else if (char === "*") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.StarEquals, "*=", startLine, startCol); advance(2); }
            else { push(TokenType.Star, char, startLine, startCol); advance(); }
        }
        else if (char === "/") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.SlashEquals, "/=", startLine, startCol); advance(2); }
            else { push(TokenType.Slash, char, startLine, startCol); advance(); }
        }
        else if (char === "%") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.PercentEquals, "%=", startLine, startCol); advance(2); }
            else { push(TokenType.Percent, char, startLine, startCol); advance(); }
        }

        // Strings
        else if (char === '"' || char === "'") {
            const quote = char;
            let str = "";
            advance();

            const interpolationTokens: Token[] = [];

            while (pos < sourceCode.length && sourceCode[pos] !== quote) {
                if (sourceCode[pos] === '{') {
                    if (str.length > 0) {
                        interpolationTokens.push({ value: str, type: TokenType.String, line: startLine, column: startCol });
                        interpolationTokens.push({ value: "+", type: TokenType.Plus, line, column });
                        str = "";
                    }

                    advance();

                    let exprString = "";
                    let braceCount = 1;
                    const exprStartLine = line;
                    const exprStartCol = column;
                    while (pos < sourceCode.length && braceCount > 0) {
                        const c = sourceCode[pos];
                        if (c === "{") braceCount++;
                        if (c === "}") braceCount--;
                        if (braceCount > 0) {
                            exprString += c;
                        }
                        advance();
                    }

                    const subTokens = tokenize(exprString);
                    if (subTokens.length > 0 && subTokens[subTokens.length - 1].type === TokenType.EOF) subTokens.pop();

                    interpolationTokens.push({ value: "(", type: TokenType.OpenParen, line: exprStartLine, column: exprStartCol });
                    interpolationTokens.push(...subTokens);
                    interpolationTokens.push({ value: ")", type: TokenType.CloseParen, line, column });
                    interpolationTokens.push({ value: "+", type: TokenType.Plus, line, column });

                    // Update start of next potential string chunk
                } else {
                    if (sourceCode[pos] === "\\") {
                        advance();
                        const escape = sourceCode[pos];
                        if (escape === "n") str += "\n";
                        else if (escape === "t") str += "\t";
                        else str += escape;
                    } else {
                        str += sourceCode[pos];
                    }
                    advance();
                }
            }
            advance(); // skip closing quote

            if (interpolationTokens.length > 0) {
                if (str.length > 0) {
                    interpolationTokens.push({ value: str, type: TokenType.String, line: startLine, column: startCol });
                } else {
                    if (interpolationTokens[interpolationTokens.length - 1].type === TokenType.Plus) {
                        interpolationTokens.pop();
                    }
                }
                tokens.push(...interpolationTokens);
            } else {
                push(TokenType.String, str, startLine, startCol);
            }
        }

        // Numbers
        else if (isNumeric(char)) {
            let num = "";
            while (pos < sourceCode.length && (isNumeric(sourceCode[pos]) || sourceCode[pos] === ".")) {
                if (sourceCode[pos] === "." && sourceCode[pos + 1] === ".") break;
                num += sourceCode[pos];
                advance();
            }
            push(TokenType.Number, num, startLine, startCol);
        }

        // Identifiers
        else if (isAlpha(char)) {
            let ident = "";
            while (pos < sourceCode.length && isAlphaNumeric(sourceCode[pos])) {
                ident += sourceCode[pos];
                advance();
            }

            if (ident === "js") {
                // Skip whitespace to see if { follows
                let tempPos = pos;
                while (tempPos < sourceCode.length && (sourceCode[tempPos] === " " || sourceCode[tempPos] === "\t" || sourceCode[tempPos] === "\r" || sourceCode[tempPos] === "\n")) {
                    tempPos++;
                }
                if (sourceCode[tempPos] === "{") {
                    // It's a JS block. Consume everything until matching }
                    // Advance to {
                    advance(tempPos - pos + 1);
                    let code = "";
                    let braceCount = 1;
                    while (pos < sourceCode.length && braceCount > 0) {
                        if (sourceCode[pos] === "{") braceCount++;
                        if (sourceCode[pos] === "}") braceCount--;
                        if (braceCount > 0) {
                            code += sourceCode[pos];
                        }
                        advance();
                    }
                    push(TokenType.Js, code, startLine, startCol);
                    continue; // Skip the default push below
                }
            }

            const reserved = KEYWORDS[ident];
            push(reserved !== undefined ? reserved : TokenType.Identifier, ident, startLine, startCol);
        }

        else {
            throw new Error(`Lexer Error: Unexpected character '${char}' at line ${line}, column ${column}`);
        }
    }

    tokens.push({ type: TokenType.EOF, value: "EOF", line, column });
    return tokens;
}
