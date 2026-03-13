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

    // JS Interop
    Js,

    // Operators / Symbols
    Equals, DoubleEquals, NotEquals, LessThan, GreaterThan, LessThanEquals, GreaterThanEquals,
    And, Or, Not, Plus, Minus, Star, Slash, Percent,
    PlusEquals, MinusEquals, StarEquals, SlashEquals, PercentEquals, PlusPlus, MinusMinus,
    OpenParen, CloseParen, OpenBrace, CloseBrace, OpenBracket, CloseBracket,
    Comma, Colon, Dot, Pipeline, Arrow, QuestionMark,
    EOF,
}

const KEYWORDS: Record<string, TokenType> = {
    vibe: TokenType.Vibe, spin: TokenType.Vibe,
    cook: TokenType.Cook, swap: TokenType.Swap, ghost: TokenType.Ghost, void: TokenType.Ghost,
    say: TokenType.Say, spill: TokenType.Say, ask: TokenType.Ask, flex: TokenType.Flex,
    sus: TokenType.Sus, nah: TokenType.Nah, maybe: TokenType.Maybe, fr: TokenType.Fr,
    grind: TokenType.Grind, each: TokenType.Each, in: TokenType.In,
    yo: TokenType.Yo, plug: TokenType.Yo, zone: TokenType.Zone,
    squad: TokenType.Squad, gng: TokenType.Squad, return: TokenType.Return, yeet: TokenType.Return, drop: TokenType.Return, crash: TokenType.Crash, panic: TokenType.Crash,
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

    // JS Interop
    js: TokenType.Js
};

export interface Token {
    value: string;
    type: TokenType;
    line: number;
    column: number;
}

export function tokenize(sourceCode: string): Token[] {
    const tokens: Token[] = [];
    let pos = 0;
    let line = 1;
    let column = 1;

    function push(type: TokenType, value: string) {
        tokens.push({ type, value, line, column });
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

    while (pos < sourceCode.length) {
        let char = sourceCode[pos];

        if (char === "(") { push(TokenType.OpenParen, char); advance(); }
        else if (char === ")") { push(TokenType.CloseParen, char); advance(); }
        else if (char === "{") { push(TokenType.OpenBrace, char); advance(); }
        else if (char === "}") { push(TokenType.CloseBrace, char); advance(); }
        else if (char === "[") { push(TokenType.OpenBracket, char); advance(); }
        else if (char === "]") { push(TokenType.CloseBracket, char); advance(); }
        else if (char === ",") { push(TokenType.Comma, char); advance(); }
        else if (char === ":") { push(TokenType.Colon, char); advance(); }
        else if (char === ".") { push(TokenType.Dot, char); advance(); }

        else if (char === "\n") { advance(); }
        else if (char === " " || char === "\t" || char === "\r") { advance(); }
        else if (char === "?") { push(TokenType.QuestionMark, char); advance(); }

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
            if (sourceCode[pos + 1] === "=") { push(TokenType.NotEquals, "!="); advance(2); }
            else {
                console.warn(`Lexer Warning: '!' is deprecated. Use 'not' instead at line ${line}`);
                advance();
            }
        }
        else if (char === "<") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.LessThanEquals, "<="); advance(2); }
            else { push(TokenType.LessThan, char); advance(); }
        }
        else if (char === ">") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.GreaterThanEquals, ">="); advance(2); }
            else { push(TokenType.GreaterThan, char); advance(); }
        }
        else if (char === "&" && sourceCode[pos + 1] === "&") {
            console.warn(`Lexer Warning: '&&' is deprecated. Use 'and' instead at line ${line}`);
            advance(2);
        }
        else if (char === "|") {
            if (sourceCode[pos + 1] === ">") { push(TokenType.Pipeline, "|>"); advance(2); }
            else if (sourceCode[pos + 1] === "|") {
                console.warn(`Lexer Warning: '||' is deprecated. Use 'or' instead at line ${line}`);
                advance(2);
            }
            else {
                throw new Error(`Lexer Error: Unexpected char '${char}' at line ${line}`);
            }
        }

        else if (char === "-") {
            if (sourceCode[pos + 1] === ">") { push(TokenType.Arrow, "->"); advance(2); }
            else if (sourceCode[pos + 1] === "=") { push(TokenType.MinusEquals, "-="); advance(2); }
            else if (sourceCode[pos + 1] === "-") { push(TokenType.MinusMinus, "--"); advance(2); }
            else { push(TokenType.Minus, char); advance(); }
        }
        else if (char === "=") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.DoubleEquals, "=="); advance(2); }
            else if (sourceCode[pos + 1] === ">") { push(TokenType.Arrow, "=>"); advance(2); }
            else { push(TokenType.Equals, char); advance(); }
        }

        else if (char === "+") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.PlusEquals, "+="); advance(2); }
            else if (sourceCode[pos + 1] === "+") { push(TokenType.PlusPlus, "++"); advance(2); }
            else { push(TokenType.Plus, char); advance(); }
        }
        else if (char === "*") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.StarEquals, "*="); advance(2); }
            else { push(TokenType.Star, char); advance(); }
        }
        else if (char === "/") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.SlashEquals, "/="); advance(2); }
            else { push(TokenType.Slash, char); advance(); }
        }
        else if (char === "%") {
            if (sourceCode[pos + 1] === "=") { push(TokenType.PercentEquals, "%="); advance(2); }
            else { push(TokenType.Percent, char); advance(); }
        }

        // Strings
        else if (char === '"' || char === "'") {
            const quote = char;
            let str = "";
            let startLine = line;
            let startCol = column;
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

                    interpolationTokens.push({ value: "(", type: TokenType.OpenParen, line, column });
                    interpolationTokens.push(...subTokens);
                    interpolationTokens.push({ value: ")", type: TokenType.CloseParen, line, column });
                    interpolationTokens.push({ value: "+", type: TokenType.Plus, line, column });

                    startLine = line;
                    startCol = column;
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
                push(TokenType.String, str);
            }
        }

        // Numbers
        else if (isDigit(char)) {
            let num = "";
            while (pos < sourceCode.length && (isDigit(sourceCode[pos]) || sourceCode[pos] === ".")) {
                num += sourceCode[pos];
                advance();
            }
            push(TokenType.Number, num);
        }

        // Identifiers & Keywords
        else if (isAlpha(char)) {
            let ident = "";
            while (pos < sourceCode.length && isAlphaNumeric(sourceCode[pos])) {
                ident += sourceCode[pos];
                advance();
            }
            const reserved = KEYWORDS[ident];
            if (reserved !== undefined) {
                // Special case: js keyword - capture raw JS block content
                if (reserved === TokenType.Js) {
                    // skip whitespace
                    while (pos < sourceCode.length && (sourceCode[pos] === ' ' || sourceCode[pos] === '\t' || sourceCode[pos] === '\r' || sourceCode[pos] === '\n')) {
                        advance();
                    }
                    if (sourceCode[pos] === '{') {
                        advance(); // skip {
                        let rawCode = '';
                        let depth = 1;
                        while (pos < sourceCode.length && depth > 0) {
                            if (sourceCode[pos] === '{') depth++;
                            else if (sourceCode[pos] === '}') { depth--; if (depth === 0) { advance(); break; } }
                            rawCode += sourceCode[pos];
                            advance();
                        }
                        push(TokenType.Js, rawCode);
                    } else {
                        push(reserved, ident);
                    }
                } else {
                    push(reserved, ident);
                }
            } else {
                push(TokenType.Identifier, ident);
            }
        }

        else {
            throw new Error(`Lexer Error: Unrecognized character '${char}' at line ${line}`);
        }
    }

    tokens.push({ type: TokenType.EOF, value: "EOF", line, column });
    return tokens;
}

function isAlpha(src: string): boolean {
    return src.toUpperCase() !== src.toLowerCase() || src === "_";
}

function isDigit(src: string): boolean {
    return "0123456789".includes(src);
}

function isAlphaNumeric(src: string): boolean {
    return isAlpha(src) || isDigit(src);
}
