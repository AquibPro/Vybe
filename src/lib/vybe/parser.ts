import { Token, TokenType } from "./lexer";
import { VybeError } from "./error";
import {
    Stmt, Program, Expr, BinaryExpr, Identifier, NumericLiteral, StringLiteral,
    BooleanLiteral, VarDeclaration, AssignmentExpr, BlockStatement, IfStatement,
    WhileStatement, LoopStatement, TryCatchStatement, BreakStatement,
    ContinueStatement, ReturnStatement, FunctionDeclaration, CallExpr, ExpressionStatement,
    ArrayLiteral, NullLiteral, SayStatement, FlexStatement, PushStatement, PopStatement,
    AskExpr, StashExpr, SizeExpr, TypeExpr, PopExpr, PanicExpr, AwaitExpr, FetchExpr,
    ObjectLiteral, Property, MemberExpr, NamespaceDeclaration, ImportStatement, ForEachStatement,
    MatchStatement, MatchCase, SquadDeclaration, ForStatement, OnceStatement, ConditionalExpr, UnaryExpr, NaturalCommandStmt, JsBlock,
    RangeExpr, ServeStatement, NullCoalescingExpr, ReadExpr, RunExpr, SayExpr
} from "./ast";

export class Parser {
    private tokens: Token[] = [];
    private pos: number = 0;

    public produceAST(sourceCodeTokens: Token[]): Program {
        this.tokens = sourceCodeTokens;
        this.pos = 0;

        const program: Program = {
            kind: "Program",
            body: [],
        };

        // Check for top-level vibe main { ... }
        this.skipNewlines();
        if (this.at().type === TokenType.Vibe && (this.peek(1).type === TokenType.OpenBrace || (this.peek(1).type === TokenType.Identifier && this.peek(1).value === "main"))) {
            this.consume(TokenType.Vibe, "Expected 'vibe' keyword");
            this.skipNewlines();
            if (this.at().type === TokenType.Identifier && this.at().value === "main") {
                this.consume(TokenType.Identifier, "Expected 'main'");
                this.skipNewlines();
            }
            this.consume(TokenType.OpenBrace, "Expected '{'");
            while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
                this.skipNewlines();
                if (this.at().type === TokenType.CloseBrace) break;
                program.body.push(this.parseStmt());
                this.skipNewlines();
            }
            this.consume(TokenType.CloseBrace, "Expected '}'");
        } else {
            while (this.notEOF()) {
                this.skipNewlines();
                if (!this.notEOF()) break;
                program.body.push(this.parseStmt());
                this.skipNewlines();
            }
        }

        return program;
    }

    private notEOF(): boolean {
        return this.tokens[this.pos].type !== TokenType.EOF;
    }

    private at(): Token {
        return this.tokens[this.pos];
    }

    private peek(offset: number = 0): Token {
        return this.tokens[this.pos + offset] || { type: TokenType.EOF, value: "EOF", line: 0, column: 0 };
    }

    private skipNewlines(): void {
        while (this.notEOF() && this.at().type === TokenType.Newline) {
            this.pos++;
        }
    }

    private consume(type: TokenType, _err: string): Token {
        const prev = this.tokens[this.pos++];
        if (!prev || prev.type !== type) {
            throw new VybeError(
                "Syntax Error",
                `Expected ${TokenType[type]}, but got '${prev ? prev.value : "EOF"}'`,
                prev?.line || this.tokens[this.pos]?.line || 1,
                prev?.column || this.tokens[this.pos]?.column || 1,
                _err
            );
        }
        return prev;
    }

    // --- STATEMENTS ---

    private parseStmt(): Stmt {
        switch (this.at().type) {
            case TokenType.Cook:
                return this.parseVarDeclaration();
            case TokenType.Zone:
                return this.parseNamespaceDeclaration();
            case TokenType.Yo:
                return this.parseImportStatement();
            case TokenType.Swap:
                return this.parseAssignmentStmt();
            case TokenType.Async:
                this.consume(TokenType.Async, "");
                this.consume(TokenType.Vibe, "Expected 'vibe' after async");
                return this.parseFunctionDeclaration(true);
            case TokenType.Vibe:
                // vibe func(args) { ... } OR vibe i = 0 to 10 { ... } OR vibe condition { ... }
                if (this.peek(1).type === TokenType.Identifier && this.peek(2).type === TokenType.OpenParen) {
                    return this.parseFunctionDeclaration(false);
                }
                if (this.peek(1).type === TokenType.Identifier && this.peek(2).type === TokenType.Equals) {
                    return this.parseForStatement();
                }
                // vibe condition { ... } or vibe condition -> ...
                return this.parseWhileStatement();
            case TokenType.Sus:
                return this.parseIfStatement();
            case TokenType.Grind:
                return this.parseLoopStatement();
            case TokenType.For:
                return this.parseForStatement();
            case TokenType.Each:
                return this.parseForEachStatement();
            case TokenType.Match:
                return this.parseMatchStatement();
            case TokenType.Try:
                return this.parseTryCatchStatement();
            case TokenType.Squad:
                return this.parseSquadDeclaration();
            case TokenType.Say:
                return this.parseSayStmt();
            case TokenType.Flex:
                return this.parseFlexStatement();
            case TokenType.Push:
                return this.parsePushStatement();
            case TokenType.Pop:
                return this.parsePopStatement();
            case TokenType.Crash:
                return this.parsePanicStatement();
            case TokenType.Bounce: {
                const token = this.consume(TokenType.Bounce, "Expected 'bounce'");
                return { kind: "BreakStatement", line: token.line } as BreakStatement;
            }
            case TokenType.Skip: {
                const token = this.consume(TokenType.Skip, "Expected 'skip'");
                return { kind: "ContinueStatement", line: token.line } as ContinueStatement;
            }
            case TokenType.Once:
                return this.parseOnceStatement();
            case TokenType.Return:
                return this.parseReturnStmt();
            case TokenType.OpenBrace:
                return this.parseBlock();
            case TokenType.Read:
            case TokenType.Fetch:
            case TokenType.Run:
            case TokenType.Delete:
            case TokenType.Wait:
            case TokenType.Move:
                if (this.at().type === TokenType.Move && this.peek(1).type === TokenType.Identifier && this.peek(2).type === TokenType.OpenParen) {
                    return this.parseFunctionDeclaration(false, true);
                }
                const verbToken = this.consume(this.at().type, "");
                return this.parseNaturalCommandStmt(verbToken.value);
            case TokenType.Write:
                const writeVerb = this.consume(TokenType.Write, "");
                return this.parseNaturalCommandStmt("write");
            case TokenType.Js: {
                const jsToken = this.consume(TokenType.Js, "");
                return { kind: "JsBlock", code: jsToken.value, line: jsToken.line } as JsBlock;
            }
            case TokenType.Serve:
                return this.parseServeStatement();
            default: {
                // Pre-check for function declaration: name(...) { or name a,b ->
                if (this.at().type === TokenType.Identifier) {
                    let ahead = 1;
                    while (this.peek(ahead).type === TokenType.Newline) ahead++;

                    // Case 1: name(...)
                    if (this.peek(ahead).type === TokenType.OpenParen) {
                        let parenDepth = 1;
                        let i = ahead + 1;
                        while (this.peek(i).type !== TokenType.EOF && parenDepth > 0) {
                            if (this.peek(i).type === TokenType.OpenParen) parenDepth++;
                            else if (this.peek(i).type === TokenType.CloseParen) parenDepth--;
                            i++;
                        }
                        while (this.peek(i).type === TokenType.Newline) i++;
                        if (this.peek(i).type === TokenType.OpenBrace || this.peek(i).type === TokenType.Arrow) {
                            return this.parseFunctionDeclaration(false, false, true);
                        }
                    } else {
                        // Case 2: name a,b -> ...
                        let i = ahead;
                        let hasArrow = false;
                        let onlyIdents = true;
                        while (i < this.tokens.length && this.peek(i).type !== TokenType.Newline && this.peek(i).type !== TokenType.EOF) {
                            if (this.peek(i).type === TokenType.Arrow) { hasArrow = true; break; }
                            if (this.peek(i).type !== TokenType.Identifier && this.peek(i).type !== TokenType.Comma) {
                                onlyIdents = false;
                            }
                            i++;
                        }
                        if (hasArrow && onlyIdents) return this.parseShorthandFunction();
                    }
                }
                return this.parseExprStmt();
            }
        }
    }

    private expectStatementEnd() {
        if (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            if (this.at().type === TokenType.Newline) {
                this.skipNewlines();
            } else if (this.at().type === TokenType.Comma) {
                this.consume(TokenType.Comma, "");
            }
        }
    }

    private parseNaturalCommandStmt(verb: string): NaturalCommandStmt {
        const line = this.at().line;

        if (verb === "wait") {
            this.skipNewlines();
            const time = this.parseExpr(); // Allow loose calls in arguments
            let unit: string = "ms";
            this.skipNewlines();
            if (this.at().type === TokenType.Identifier && (this.at().value === "ms" || this.at().value === "s")) {
                unit = this.consume(TokenType.Identifier, "").value;
            }
            // we map wait time to argument and unit to destination
            return { kind: "NaturalCommandStmt", verb: "wait", argument: time, destination: { kind: "StringLiteral", value: unit, line: time.line } as StringLiteral, line };
        }

        if (verb === "run") {
            this.skipNewlines();
            const cmd = this.parseExpr(false);
            let destination: Expr | undefined;
            // Check for into on the same line or next line?
            // Let's allow into on next line but ONLY if it's 'into'
            if (this.at().type === TokenType.Into) {
                this.consume(TokenType.Into, "");
                this.skipNewlines();
                destination = this.parseExpr();
            }
            return { kind: "NaturalCommandStmt", verb: "run", argument: cmd, destination, line };
        }

        if (verb === "delete") {
            this.skipNewlines();
            const file = this.parseExpr();
            return { kind: "NaturalCommandStmt", verb: "delete", argument: file, line };
        }

        if (verb === "move") {
            this.skipNewlines();
            const src = this.parseExpr(false);
            if (this.at().type === TokenType.To) {
                this.consume(TokenType.To, "Expected 'to'");
                this.skipNewlines();
                const dest = this.parseExpr();
                return { kind: "NaturalCommandStmt", verb: "move", argument: src, destination: dest, line };
            }
            return { kind: "NaturalCommandStmt", verb: "move", argument: src, line };
        }

        if (verb === "read" || verb === "fetch") {
            this.skipNewlines();
            const source = this.parseExpr(false);
            let destination: Expr | undefined;
            if (this.at().type === TokenType.Into) {
                this.consume(TokenType.Into, "");
                this.skipNewlines();
                destination = this.parseExpr();
            }
            return { kind: "NaturalCommandStmt", verb, argument: source, destination, line };
        }

        if (verb === "write") {
            this.skipNewlines();
            const content = this.parseExpr(false);
            if (this.at().type === TokenType.To) {
                this.consume(TokenType.To, "");
                this.skipNewlines();
                const destination = this.parseExpr();
                return { kind: "NaturalCommandStmt", verb: "write", argument: content, destination, line };
            } else if (this.at().type === TokenType.With) {
                this.consume(TokenType.With, "");
                this.skipNewlines();
                const destination = this.parseExpr();
                // write "path" with data -> content is "path", destination is data. Swap.
                return { kind: "NaturalCommandStmt", verb: "write", argument: destination, destination: content, line };
            } else if (this.at().type === TokenType.Into) {
                this.consume(TokenType.Into, "");
                this.skipNewlines();
                const destination = this.parseExpr();
                // write data into "path" -> content is data, destination is "path".
                return { kind: "NaturalCommandStmt", verb: "write", argument: content, destination, line };
            } else {
                throw new VybeError("Syntax Error", "Expected 'to', 'into' or 'with' after write content", line, 1);
            }
        }

        throw new VybeError("Syntax Error", `Unknown natural command: ${verb}`, line, 1, "Check your syntax.");
    }

    private parseBlock(): BlockStatement {
        this.consume(TokenType.OpenBrace, "Expected '{' to start block");
        const body: Stmt[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            this.skipNewlines();
            if (this.at().type === TokenType.CloseBrace) break;
            body.push(this.parseStmt());
            this.skipNewlines();
        }
        this.consume(TokenType.CloseBrace, "Expected '}' to end block");
        return { kind: "BlockStatement", body };
    }

    private parseBlockOrStmt(wrapReturn: boolean = false): BlockStatement {
        this.skipNewlines();
        // Optional Arrow (might have been consumed by parent)
        if (this.at().type === TokenType.Arrow) {
            this.consume(TokenType.Arrow, "");
            this.skipNewlines();
        }

        if (this.at().type === TokenType.OpenBrace) {
            // Disambiguate: if it's an object literal, parse as expr.
            let ahead = 1;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            
            // Heuristic: { key: value } or { }
            // Note: { } is treated as a block by default for now unless wrapReturn is true.
            const isObject = (this.peek(ahead).type === TokenType.Identifier && this.peek(ahead + 1).type === TokenType.Colon);

            if (isObject) {
                 const expr = this.parseExpr();
                 if (wrapReturn) {
                     return { kind: "BlockStatement", body: [{ kind: "ReturnStatement", argument: expr, line: expr.line } as ReturnStatement] };
                 } else {
                     return { kind: "BlockStatement", body: [{ kind: "ExpressionStatement", expression: expr, line: expr.line } as ExpressionStatement] };
                 }
            }
            return this.parseBlock();
        }

        let stmt = this.parseStmt();
        if (wrapReturn && stmt.kind === "ExpressionStatement") {
            stmt = { kind: "ReturnStatement", argument: (stmt as ExpressionStatement).expression, line: stmt.line } as ReturnStatement;
        }

        return { kind: "BlockStatement", body: [stmt] };
    }

    private parseVarDeclaration(): VarDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Cook, "Expected 'cook' keyword");
        const identifier = this.consume(TokenType.Identifier, "Expected variable name").value;

        this.consume(TokenType.Equals, "Expected '=' after variable name");

        const value = this.parseExpr();

        return { kind: "VarDeclaration", identifier, value, line };
    }

    private parseAssignmentStmt(): ExpressionStatement {
        // swap x = 20 or swap obj.x = 20
        const line = this.at().line || 1;
        this.consume(TokenType.Swap, "Expected 'swap' keyword");
        const assignee = this.parseLogical(); // Use logical precedence so it stops at '='
        this.consume(TokenType.Equals, "Expected '=' for assignment");
        const value = this.parseExpr();

        const expr = { kind: "AssignmentExpr", assignee, value, operator: "=", line } as AssignmentExpr;
        return { kind: "ExpressionStatement", expression: expr, line };
    }

    private parseFunctionDeclaration(isAsync: boolean = false, isMove: boolean = false, isImplicit: boolean = false): FunctionDeclaration {
        const line = this.at().line || 1;
        if (!isAsync && !isImplicit) {
            if (isMove) {
                this.consume(TokenType.Move, "Expected 'move' keyword");
            } else {
                this.consume(TokenType.Vibe, "Expected 'vibe' keyword");
            }
        }
        const name = this.consume(TokenType.Identifier, "Expected function name").value;

        const args = this.parseArgsList();
        const parameters = args.map(a => {
            if (a.kind !== "Identifier") throw new VybeError("Syntax Error", "Expected identifier in parameters", this.at().line, this.at().column);
            return (a as Identifier).symbol;
        });

        if (this.at().type === TokenType.Arrow) {
            this.consume(TokenType.Arrow, "Expected '->' or '=>'");
            const body = this.parseBlockOrStmt(true);
            return {
                kind: "FunctionDeclaration",
                name,
                parameters,
                body,
                isArrow: true,
                isAsync,
                line
            };
        }

        const body = this.parseBlock();
        return { kind: "FunctionDeclaration", name, parameters, body, isAsync, line };
    }

    private parseSquadDeclaration(): SquadDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Squad, "Expected 'gng'");
        const name = this.consume(TokenType.Identifier, "Expected gng name").value;
        this.consume(TokenType.OpenBrace, "Expected '{'");

        const methods: FunctionDeclaration[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            this.skipNewlines();
            if (this.at().type === TokenType.CloseBrace) break;

            let isAsync = false;
            // vibe keyword is optional inside gng blocks
            if (this.at().type === TokenType.Async) {
                this.consume(TokenType.Async, "");
                if (this.at().type === TokenType.Vibe) this.consume(TokenType.Vibe, "");
                isAsync = true;
            } else if (this.at().type === TokenType.Vibe) {
                this.consume(TokenType.Vibe, "");
            }
            // Now expect: methodName(args) { body }
            const methodName = this.consume(TokenType.Identifier, "Expected method name").value;
            const args = this.parseArgsList();
            const parameters = args.map(a => {
                if (a.kind !== "Identifier") throw "Expected identifier in parameters";
                return (a as Identifier).symbol;
            });

            let body: BlockStatement;
            let isArrow = false;
            if (this.at().type === TokenType.Arrow) {
                this.consume(TokenType.Arrow, "Expected '->'");
                body = this.parseBlockOrStmt(true);
                isArrow = true;
            } else {
                body = this.parseBlock();
            }

            methods.push({ kind: "FunctionDeclaration", name: methodName, parameters, body, isAsync, isArrow, line: this.at().line } as FunctionDeclaration);
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");
        return { kind: "SquadDeclaration", name, methods, line };
    }

    private parseMatchStatement(): MatchStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Match, "Expected 'match'");
        const argument = this.parseExpr();
        this.skipNewlines();
        this.consume(TokenType.OpenBrace, "Expected '{'");

        const cases: MatchCase[] = [];
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            this.skipNewlines();
            if (this.at().type === TokenType.CloseBrace) break;

            let isDefault = false;
            let condition: Expr | undefined = undefined;

            if (this.at().type === TokenType.Identifier && this.at().value === "_") {
                this.consume(TokenType.Identifier, "");
                isDefault = true;
            } else {
                condition = this.parseExpr();
            }

            this.consume(TokenType.Arrow, "Expected '=>'");
            let body: BlockStatement;

            // Allow single line or block
            this.skipNewlines();
            if (this.at().type === TokenType.OpenBrace) {
                body = this.parseBlock();
            } else {
                body = { kind: "BlockStatement", body: [this.parseStmt()] };
            }

            cases.push({ condition: condition as Expr, body, isDefault });
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");

        return { kind: "MatchStatement", argument, cases, line };
    }

    private parseIfStatement(): IfStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Sus, "Expected 'sus' keyword");
        const condition = this.parseExpr();

        let wrapReturn = false;
        if (this.at().type === TokenType.Arrow) {
            this.consume(TokenType.Arrow, "Expected '->'");
            wrapReturn = true;
        }
        const thenBranch = this.parseBlockOrStmt(wrapReturn);

        const elseIfBranches: { condition: Expr, consequent: BlockStatement }[] = [];
        while ((this.at().type === TokenType.Maybe || this.at().type === TokenType.Fr) && this.notEOF()) {
            this.consume(this.at().type, "Expected 'fr' or 'maybe'");
            const maybeCond = this.parseExpr();
            let maybeWrapReturn = false;
            if (this.at().type === TokenType.Arrow) {
                this.consume(TokenType.Arrow, "Expected '->'");
                maybeWrapReturn = true;
            }
            const maybeBlock = this.parseBlockOrStmt(maybeWrapReturn);
            elseIfBranches.push({ condition: maybeCond, consequent: maybeBlock });
        }

        let elseBranch: BlockStatement | undefined;
        if (this.at().type === TokenType.Nah) {
            this.consume(TokenType.Nah, "Expected 'nah'");
            let elseWrapReturn = false;
            if (this.at().type === TokenType.Arrow) {
                this.consume(TokenType.Arrow, "Expected '->'");
                elseWrapReturn = true;
            }
            elseBranch = this.parseBlockOrStmt(elseWrapReturn);
        }
        return { kind: "IfStatement", condition, thenBranch, elseIfBranches, elseBranch, line };
    }

    private parseWhileStatement(): WhileStatement {
        const line = this.at().line || 1;
        this.consume(this.at().type, "Expected loop keyword");
        const condition = this.parseExpr();
        const body = this.parseBlockOrStmt();
        return { kind: "WhileStatement", condition, body, line };
    }

    private parseForStatement(): ForStatement {
        // for i = 0 to 10 { } OR for i = 1..10 -> say i
        const line = this.at().line || 1;
        this.consume(this.at().type, "Expected loop keyword");
        const init = this.consume(TokenType.Identifier, "Expected identifier").value;
        this.consume(TokenType.Equals, "Expected '='");

        let start: Expr;
        let end: Expr;

        const firstExpr = this.parseExpr();
        if (firstExpr.kind === "RangeExpr") {
            const range = firstExpr as RangeExpr;
            start = range.left;
            end = range.right;
        } else {
            start = firstExpr;
            this.consume(TokenType.To, "Expected 'to' or range syntax '..'");
            end = this.parseExpr();
        }

        const body = this.parseBlockOrStmt();
        return { kind: "ForStatement", init, start, end, body, line };
    }

    private parseLoopStatement(): LoopStatement {
        // grind 5 { ... }
        const line = this.at().line || 1;
        this.consume(TokenType.Grind, "Expected 'grind'");
        const count = this.parseExpr();
        const body = this.parseBlockOrStmt();
        return { kind: "LoopStatement", count, body, line };
    }

    private parseForEachStatement(): ForEachStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Each, "Expected 'each'");
        const item = this.consume(TokenType.Identifier, "Expected loop variable after 'each'").value;
        this.consume(TokenType.In, "Expected 'in'");
        const list = this.parseExpr();
        const body = this.parseBlockOrStmt();
        return { kind: "ForEachStatement", item, list, body, line };
    }

    private parseTryCatchStatement(): TryCatchStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Try, "Expected 'try'");
        const tryBlock = this.parseBlock();
        this.consume(TokenType.Catch, "Expected 'catch'");
        const catchIdentifier = this.consume(TokenType.Identifier, "Expected error identifier").value;
        const catchBlock = this.parseBlock();
        return { kind: "TryCatchStatement", tryBlock, catchIdentifier, catchBlock, line };
    }

    private parseSayStmt(): SayStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Say, "Expected 'say'");
        this.skipNewlines();
        const argument = this.parseExpr();
        return { kind: "SayStatement", argument, line } as SayStatement;
    }

    private parseReturnStmt(): ReturnStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Return, "Expected 'return'");
        let argument: Expr | undefined;
        if (this.at().type !== TokenType.CloseBrace && this.notEOF()) {
            argument = this.parseExpr();
        }
        return { kind: "ReturnStatement", argument, line } as ReturnStatement;
    }

    private parseFlexStatement(): FlexStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Flex, "Expected 'flex'");
        this.skipNewlines();
        const argument = this.parseExpr();
        return { kind: "FlexStatement", argument, line };
    }

    private parsePushStatement(): PushStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Push, "Expected 'push'");
        this.skipNewlines();
        const value = this.parseExpr(false);
        
        if (this.at().type === TokenType.To || this.at().type === TokenType.Into) {
            this.consume(this.at().type, "");
        } else {
            // Optional: throw error if we absolutely want a keyword, 
            // but for backward compatibility maybe leave it? 
            // The user wants to deprecate 'into' so maybe 'to' should be preferred.
        }
        this.skipNewlines();
        const list = this.parseExpr();
        return { kind: "PushStatement", list, value, line };
    }

    private parsePopStatement(): PopStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Pop, "Expected 'pop'");
        this.skipNewlines();
        const list = this.parseExpr();
        return { kind: "PopStatement", list, line };
    }

    private parsePanicStatement(): ExpressionStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Crash, "Expected 'crash' or 'panic'");
        this.skipNewlines();
        const argument = this.parseExpr();
        // Treating Panic as a built-in expression wrapped in a statement for simplistic AST
        return { kind: "ExpressionStatement", expression: { kind: "PanicExpr", argument, line } as PanicExpr, line };
    }

    private parseExprStmt(): ExpressionStatement {
        const line = this.at().line || 1;
        let expression = this.parseExpr();

        // Peek past newlines for arrow shorthand
        let ahead = 0;
        while (this.peek(ahead).type === TokenType.Newline) ahead++;

        if (this.peek(ahead).type === TokenType.Arrow) {
            // Consume newlines and then the block/stmt
            for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
            const body = this.parseBlockOrStmt(true);

            const handler = {
                kind: "FunctionDeclaration",
                name: "anonymous",
                parameters: [],
                body,
                isArrow: true,
                line
            } as FunctionDeclaration;

            if (expression.kind === "CallExpr") {
                (expression as CallExpr).args.push(handler as any);
            } else {
                expression = {
                    kind: "CallExpr",
                    caller: expression,
                    args: [handler as any],
                    line
                } as CallExpr;
            }
        }

        this.expectStatementEnd();
        return { kind: "ExpressionStatement", expression, line };
    }


    private parseNamespaceDeclaration(): NamespaceDeclaration {
        const line = this.at().line || 1;
        this.consume(TokenType.Zone, "Expected 'zone'");
        const name = this.consume(TokenType.Identifier, "Expected namespace name").value;
        const body: Stmt[] = [];
        this.consume(TokenType.OpenBrace, "Expected '{'");
        while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
            body.push(this.parseStmt());
        }
        this.consume(TokenType.CloseBrace, "Expected '}'");
        return { kind: "NamespaceDeclaration", name, body, line };
    }

    private parseImportStatement(): ImportStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Yo, "Expected 'yo' or 'plug'");

        let name: string;
        if (this.at().type === TokenType.String) {
            name = this.consume(TokenType.String, "Expected module path").value;
        } else {
            name = this.consume(TokenType.Identifier, "Expected module name").value;
        }

        return { kind: "ImportStatement", name, line };
    }

    private parseOnceStatement(): OnceStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Once, "Expected 'once'");
        const body = this.parseBlock();
        // ID is basically the line number for now, simple enough for a prototype
        return { kind: "OnceStatement", body, id: `once_${line}`, line } as OnceStatement;
    }

    private parseServeStatement(): ServeStatement {
        const line = this.at().line || 1;
        this.consume(TokenType.Serve, "Expected 'serve'");
        const port = this.parseExpr();

        let handler: BlockStatement | Expr | undefined;
        let staticPath: Expr | undefined;

        if (this.at().type === TokenType.In && this.peek(1).value === "from") {
            // This is a hack because 'from' might not be a keyword.
            // Wait, let's check lexer.
        }

        // Let's use 'from' as an identifier for now if it's not a keyword.
        if (this.at().type === TokenType.Identifier && this.at().value === "from") {
            this.consume(TokenType.Identifier, "");
            this.skipNewlines();
            staticPath = this.parseExpr();
        } else if (this.at().type === TokenType.Arrow) {
            this.consume(TokenType.Arrow, "Expected '->'");
            handler = this.parseExpr();
        } else if (this.at().type === TokenType.OpenBrace) {
            handler = this.parseBlock();
        }

        return { kind: "ServeStatement", port, handler, staticPath, line };
    }

    private parseShorthandFunction(): FunctionDeclaration {
        const line = this.at().line || 1;
        const name = this.consume(TokenType.Identifier, "Expected function name").value;

        const parameters: string[] = [];
        if (this.at().type !== TokenType.Arrow) {
            parameters.push(this.consume(TokenType.Identifier, "Expected parameter name").value);
            while (this.at().type === TokenType.Comma) {
                this.consume(TokenType.Comma, "");
                parameters.push(this.consume(TokenType.Identifier, "Expected parameter name").value);
            }
        }

        this.consume(TokenType.Arrow, "Expected '->'");
        this.skipNewlines();

        const stmt = this.parseStmt();
        let body: BlockStatement;

        if (stmt.kind === "ExpressionStatement") {
            body = {
                kind: "BlockStatement",
                body: [{ kind: "ReturnStatement", argument: (stmt as ExpressionStatement).expression, line: stmt.line } as ReturnStatement]
            };
        } else {
            body = {
                kind: "BlockStatement",
                body: [stmt]
            };
        }

        return {
            kind: "FunctionDeclaration",
            name,
            parameters,
            body,
            isArrow: true,
            line
        } as FunctionDeclaration;
    }

    // --- EXPRESSIONS ---

    private parseExpr(allowLoose: boolean = true): Expr {
        return this.parseAssignment(allowLoose);
    }

    private parseAssignment(allowLoose: boolean = true): Expr {
        const left = this.parseNullCoalescing(allowLoose);
        const tkType = this.at().type;
        if ([TokenType.Equals, TokenType.PlusEquals, TokenType.MinusEquals, TokenType.StarEquals, TokenType.SlashEquals, TokenType.PercentEquals].includes(tkType)) {
            const operatorToken = this.consume(tkType, "Expected assignment operator");
            this.skipNewlines();
            const value = this.parseAssignment(allowLoose);
            return {
                kind: "AssignmentExpr",
                assignee: left,
                value,
                operator: operatorToken.value,
                line: left.line
            } as AssignmentExpr;
        }
        return left;
    }

    private parseNullCoalescing(allowLoose: boolean = true): Expr {
        let left = this.parseConditional(allowLoose);

        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.NullCoalescing) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                this.consume(TokenType.NullCoalescing, "Expected '??'");
                this.skipNewlines();
                const right = this.parseConditional(allowLoose);
                left = { kind: "NullCoalescingExpr", left, right, line: left.line } as NullCoalescingExpr;
            } else break;
        }

        return left;
    }

    private parseConditional(allowLoose: boolean = true): Expr {
        const left = this.parsePipeline(allowLoose);

        if (this.at().type === TokenType.QuestionMark) {
            this.consume(TokenType.QuestionMark, "Expected '?'");
            const trueExpr = this.parseExpr(allowLoose);
            this.consume(TokenType.Colon, "Expected ':'");
            const falseExpr = this.parseConditional(allowLoose);
            return {
                kind: "ConditionalExpr",
                condition: left,
                trueExpr,
                falseExpr,
                line: left.line
            } as ConditionalExpr;
        }

        return left;
    }

    private parsePipeline(allowLoose: boolean = true): Expr {
        let left = this.parseLogical(allowLoose);

        while (this.notEOF()) {
            // Peek past newlines to see if a pipeline follows
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;

            if (this.peek(ahead).type === TokenType.Pipeline) {
                // Consume the newlines and the pipeline token
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                this.consume(TokenType.Pipeline, "Expected '|>'");
                this.skipNewlines();

                if (this.at().type === TokenType.Say) {
                    this.consume(TokenType.Say, "");
                    left = { kind: "CallExpr", caller: { kind: "Identifier", symbol: "say", line: left.line } as Identifier, args: [left], line: left.line } as CallExpr;
                } else {
                    const right = this.parseLogical(allowLoose);
                    if (right.kind === "CallExpr") {
                        (right as CallExpr).args.unshift(left);
                        left = right;
                    } else if (right.kind === "SizeExpr" && !(right as SizeExpr).argument) {
                        (right as SizeExpr).argument = left;
                        left = right;
                    } else if (right.kind === "TypeExpr" && !(right as TypeExpr).argument) {
                        (right as TypeExpr).argument = left;
                        left = right;
                    } else if (right.kind === "PopExpr" && !(right as PopExpr).list) {
                        (right as PopExpr).list = left;
                        left = right;
                    } else if (right.kind === "PanicExpr" && !(right as PanicExpr).argument) {
                        (right as PanicExpr).argument = left;
                        left = right;
                    } else if (right.kind === "AskExpr" && !(right as AskExpr).message) {
                        (right as AskExpr).message = left;
                        left = right;
                    } else {
                        left = { kind: "CallExpr", caller: right, args: [left], line: left.line } as CallExpr;
                    }
                }
            } else {
                break;
            }
        }

        return left;
    }

    private parseLogical(allowLoose: boolean = true): Expr {
        let left = this.parseEquality(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.And || this.peek(ahead).type === TokenType.Or) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                const operator = this.consume(this.at().type, "").value;
                this.skipNewlines();
                const right = this.parseEquality(allowLoose);
                left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
            } else break;
        }
        return left;
    }

    private parseEquality(allowLoose: boolean = true): Expr {
        let left = this.parseRelational(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.DoubleEquals || this.peek(ahead).type === TokenType.NotEquals) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                const operator = this.consume(this.at().type, "").value;
                this.skipNewlines();
                const right = this.parseRelational(allowLoose);
                left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
            } else break;
        }
        return left;
    }

    private parseRelational(allowLoose: boolean = true): Expr {
        let left = this.parseRange(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if ([TokenType.LessThan, TokenType.GreaterThan, TokenType.LessThanEquals, TokenType.GreaterThanEquals].includes(this.peek(ahead).type)) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                const operator = this.consume(this.at().type, "").value;
                this.skipNewlines();
                const right = this.parseRange(allowLoose);
                left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
            } else break;
        }
        return left;
    }

    private parseRange(allowLoose: boolean = true): Expr {
        let left = this.parseAdditive(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.Range) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                this.consume(TokenType.Range, "");
                this.skipNewlines();
                const right = this.parseAdditive(allowLoose);
                left = { kind: "RangeExpr", left, right, line: left.line } as RangeExpr;
            } else break;
        }
        return left;
    }

    private parseAdditive(allowLoose: boolean = true): Expr {
        let left = this.parseMultiplicative(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.Plus || this.peek(ahead).type === TokenType.Minus) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                const operator = this.consume(this.at().type, "").value;
                this.skipNewlines();
                const right = this.parseMultiplicative(allowLoose);
                left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
            } else break;
        }
        return left;
    }

    private parseMultiplicative(allowLoose: boolean = true): Expr {
        let left = this.parseUnary(allowLoose);
        while (this.notEOF()) {
            let ahead = 0;
            while (this.peek(ahead).type === TokenType.Newline) ahead++;
            if (this.peek(ahead).type === TokenType.Star || this.peek(ahead).type === TokenType.Slash || this.peek(ahead).type === TokenType.Percent) {
                for (let i = 0; i < ahead; i++) this.consume(TokenType.Newline, "");
                const operator = this.consume(this.at().type, "").value;
                this.skipNewlines();
                const right = this.parseUnary(allowLoose);
                left = { kind: "BinaryExpr", left, right, operator, line: left.line } as BinaryExpr;
            } else break;
        }
        return left;
    }

    private parseUnary(allowLoose: boolean = true): Expr {
        const tkType = this.at().type;
        if (tkType === TokenType.Minus) {
            const token = this.consume(TokenType.Minus, "");
            const argument = this.parseUnary(allowLoose);
            return {
                kind: "BinaryExpr",
                left: { kind: "NumericLiteral", value: 0, line: token.line } as NumericLiteral,
                right: argument,
                operator: "-",
                line: token.line
            } as BinaryExpr;
        } else if (tkType === TokenType.Not || tkType === TokenType.PlusPlus || tkType === TokenType.MinusMinus) {
            const token = this.consume(tkType, "");
            const argument = this.parseUnary(allowLoose);
            return {
                kind: "UnaryExpr",
                operator: token.value,
                argument,
                prefix: true,
                line: token.line
            } as UnaryExpr;
        }
        return this.parsePostfixExpr(allowLoose);
    }

    private parsePostfixExpr(allowLoose: boolean = true): Expr {
        let member = this.parseCallMemberExpr(allowLoose);
        if (this.at().type === TokenType.PlusPlus || this.at().type === TokenType.MinusMinus) {
            const token = this.consume(this.at().type, "");
            member = {
                kind: "UnaryExpr",
                operator: token.value,
                argument: member,
                prefix: false,
                line: member.line
            } as UnaryExpr;
        }
        return member;
    }

    private parseCallMemberExpr(allowLoose: boolean = true): Expr {
        const member = this.parseMemberExpr(allowLoose);

        if (this.at().type === TokenType.OpenParen) {
            return this.parseCallExpr(member);
        } else if (allowLoose && this.isArgumentsAhead()) {
            // Restriction: Literals cannot be callers for loose calls (e.g. 500ms is not 500(ms))
            const literalKinds = ["NumericLiteral", "StringLiteral", "BooleanLiteral", "NullLiteral"];
            if (!literalKinds.includes(member.kind)) {
                return this.parseLooseCallExpr(member);
            }
        }
        return member;
    }

    private isArgumentsAhead(): boolean {
        // If the current token can start an expression AND it's not an operator or delimiter
        // AND it's NOT a newline
        const tk = this.at();
        if (tk.type === TokenType.Newline) return false;

        const noGo = [
            TokenType.Plus, TokenType.Minus, TokenType.Star, TokenType.Slash, TokenType.Percent,
            TokenType.PlusEquals, TokenType.MinusEquals, TokenType.StarEquals, TokenType.SlashEquals, TokenType.PercentEquals,
            TokenType.Equals, TokenType.DoubleEquals, TokenType.NotEquals, TokenType.LessThan, TokenType.GreaterThan, TokenType.LessThanEquals, TokenType.GreaterThanEquals,
            TokenType.And, TokenType.Or,
            TokenType.Comma, TokenType.Colon, TokenType.Dot, TokenType.Pipeline, TokenType.Arrow, TokenType.QuestionMark,
            TokenType.CloseParen, TokenType.CloseBrace, TokenType.CloseBracket,
            TokenType.EOF, TokenType.Nah, TokenType.Maybe, TokenType.Fr, TokenType.To, TokenType.In, TokenType.Into, TokenType.With
        ];

        if (noGo.includes(tk.type)) return false;

        const starters = [
            TokenType.Identifier, TokenType.Number, TokenType.String, TokenType.Frfr, TokenType.Cap, TokenType.Ghost,
            TokenType.OpenParen, TokenType.OpenBracket,
            TokenType.Ask, TokenType.Size, TokenType.Type, TokenType.Pop, TokenType.Crash, TokenType.Stash, TokenType.Await, TokenType.Fetch,
            TokenType.Read, TokenType.Run, TokenType.Say
        ];

        return starters.includes(tk.type);
    }

    private parseLooseCallExpr(caller: Expr): Expr {
        const args = this.parseArgs();
        return {
            kind: "CallExpr",
            caller,
            args,
            line: caller.line
        } as CallExpr;
    }

    private parseMemberExpr(allowLoose: boolean = true): Expr {
        let object = this.parsePrimary();

        while (this.at().type === TokenType.Dot || this.at().type === TokenType.OpenBracket) {
            const operator = this.consume(this.at().type, "");
            let property: Expr;
            let computed: boolean;

            if (operator.type === TokenType.Dot) {
                computed = false;
                const propTk = this.tokens[this.pos++];
                property = { kind: "Identifier", symbol: propTk.value, line: propTk.line } as Identifier;
            } else {
                computed = true;
                property = this.parseExpr(allowLoose);
                this.consume(TokenType.CloseBracket, "Expected closing ']'");
            }

            object = {
                kind: "MemberExpr",
                object,
                property,
                computed,
                line: object.line
            } as MemberExpr;
        }

        return object;
    }

    private parseCallExpr(caller: Expr): Expr {
        let callExpr: Expr = {
            kind: "CallExpr",
            caller,
            args: this.parseArgsList(),
            line: caller.line
        } as CallExpr;

        // Handle chained calls like foo()()
        if (this.at().type === TokenType.OpenParen) {
            callExpr = this.parseCallExpr(callExpr);
        }
        return callExpr;
    }

    private parseArgsList(): Expr[] {
        this.consume(TokenType.OpenParen, "Expected '('");
        const args = this.at().type === TokenType.CloseParen ? [] : this.parseArgs();
        this.skipNewlines();
        this.consume(TokenType.CloseParen, "Expected ')'");
        return args;
    }

    private parseArgs(): Expr[] {
        this.skipNewlines();
        if (this.at().type === TokenType.CloseParen || this.at().type === TokenType.CloseBracket) return [];

        const args = [this.parseExpr()];
        while (this.at().type === TokenType.Comma && this.notEOF()) {
            this.consume(TokenType.Comma, "Expected ','");
            this.skipNewlines();
            if (this.at().type === TokenType.CloseParen || this.at().type === TokenType.CloseBracket || this.at().type === TokenType.CloseBrace) break;
            args.push(this.parseExpr());
        }
        return args;
    }

    private parsePrimary(): Expr {
        const tk = this.at();

        switch (tk.type) {
            case TokenType.Ask:
                this.consume(TokenType.Ask, "");
                return { kind: "AskExpr", message: this.isArgumentsAhead() ? this.parseUnary() : undefined, line: tk.line } as AskExpr;

            case TokenType.Size:
                this.consume(TokenType.Size, "");
                return { kind: "SizeExpr", argument: this.isArgumentsAhead() ? this.parseUnary() : undefined, line: tk.line } as SizeExpr;

            case TokenType.Type:
                this.consume(TokenType.Type, "");
                return { kind: "TypeExpr", argument: this.isArgumentsAhead() ? this.parseUnary() : undefined, line: tk.line } as TypeExpr;

            case TokenType.Pop:
                this.consume(TokenType.Pop, "");
                return { kind: "PopExpr", list: this.isArgumentsAhead() ? this.parseUnary() : undefined, line: tk.line } as PopExpr;

            case TokenType.Crash:
                this.consume(TokenType.Crash, "");
                return { kind: "PanicExpr", argument: this.isArgumentsAhead() ? this.parseUnary() : undefined, line: tk.line } as PanicExpr;

            case TokenType.Stash:
                this.consume(TokenType.Stash, "");
                if (this.at().type === TokenType.OpenBracket) {
                    this.consume(TokenType.OpenBracket, "");
                    const elements: Expr[] = [];
                    while (this.at().type !== TokenType.CloseBracket && this.notEOF()) {
                        this.skipNewlines();
                        if (this.at().type === TokenType.CloseBracket) break;
                        elements.push(this.parseExpr());
                        this.skipNewlines();
                        if (this.at().type === TokenType.Comma) {
                            this.consume(TokenType.Comma, "");
                            this.skipNewlines();
                        }
                    }
                    this.consume(TokenType.CloseBracket, "Expected ']'");
                    return { kind: "StashExpr", elements, line: tk.line } as StashExpr;
                }
                return { kind: "StashExpr", elements: [], line: tk.line } as StashExpr;

            case TokenType.Await:
                this.consume(TokenType.Await, "");
                return { kind: "AwaitExpr", argument: this.parseUnary(), line: tk.line } as AwaitExpr;

            case TokenType.Read:
                this.consume(TokenType.Read, "");
                return { kind: "ReadExpr", source: this.parseUnary(), line: tk.line } as ReadExpr;

            case TokenType.Run:
                this.consume(TokenType.Run, "");
                return { kind: "RunExpr", command: this.parseUnary(), line: tk.line } as RunExpr;

            case TokenType.Fetch:
                this.consume(TokenType.Fetch, "");
                return { kind: "FetchExpr", url: this.parseUnary(), line: tk.line } as FetchExpr;

            case TokenType.Identifier:
            case TokenType.Wait:
            case TokenType.Check:
                return { kind: "Identifier", symbol: this.consume(tk.type, "").value, line: tk.line } as Identifier;

            case TokenType.Number:
                return { kind: "NumericLiteral", value: parseFloat(this.consume(TokenType.Number, "").value), line: tk.line } as NumericLiteral;

            case TokenType.String:
                return { kind: "StringLiteral", value: this.consume(TokenType.String, "").value, line: tk.line } as StringLiteral;

            case TokenType.Frfr:
            case TokenType.Fr:
                this.consume(tk.type, "");
                return { kind: "BooleanLiteral", value: true, line: tk.line } as BooleanLiteral;

            case TokenType.Cap:
                this.consume(TokenType.Cap, "");
                return { kind: "BooleanLiteral", value: false, line: tk.line } as BooleanLiteral;

            case TokenType.Say:
                this.consume(TokenType.Say, "");
                return { kind: "SayExpr", argument: this.parseUnary(), line: tk.line } as SayExpr;

            case TokenType.Ghost:
                this.consume(TokenType.Ghost, "");
                return { kind: "NullLiteral", line: tk.line } as NullLiteral;

            case TokenType.OpenParen: {
                // Check if it's an arrow function:
                let isArrow = false;
                let tempPos = this.pos + 1;
                let parenCount = 1;
                while (tempPos < this.tokens.length && parenCount > 0) {
                    if (this.tokens[tempPos].type === TokenType.OpenParen) parenCount++;
                    if (this.tokens[tempPos].type === TokenType.CloseParen) parenCount--;
                    tempPos++;
                }
                if (tempPos < this.tokens.length && this.tokens[tempPos].type === TokenType.Arrow) {
                    isArrow = true;
                }

                if (isArrow) {
                    this.consume(TokenType.OpenParen, "");
                    const params: string[] = [];
                    if (this.at().type !== TokenType.CloseParen) {
                        params.push(this.consume(TokenType.Identifier, "Expected parameter identifier").value);
                        while (this.at().type === TokenType.Comma && this.notEOF()) {
                            this.consume(TokenType.Comma, "");
                            params.push(this.consume(TokenType.Identifier, "Expected parameter identifier").value);
                        }
                    }
                    this.consume(TokenType.CloseParen, "");
                    this.consume(TokenType.Arrow, "Expected '=>'");

                    const bodyExpr = this.parseExpr();
                    const body: BlockStatement = { kind: "BlockStatement", body: [{ kind: "ReturnStatement", argument: bodyExpr, line: tk.line } as ReturnStatement] };
                    // Cast to Expr so it can be returned safely from parsePrimary
                    return { kind: "FunctionDeclaration", name: "anonymous", parameters: params, body, isArrow: true, line: tk.line } as unknown as Expr;
                }

                this.consume(TokenType.OpenParen, "");
                const value = this.parseExpr();
                this.consume(TokenType.CloseParen, "Expected closing ')'");
                return value;
            }

            case TokenType.OpenBracket: {
                this.consume(TokenType.OpenBracket, "");
                const elements: Expr[] = [];
                while (this.at().type !== TokenType.CloseBracket && this.notEOF()) {
                    this.skipNewlines();
                    if (this.at().type === TokenType.CloseBracket) break;
                    elements.push(this.parseExpr());
                    this.skipNewlines();
                    if (this.at().type === TokenType.Comma) {
                        this.consume(TokenType.Comma, "");
                        this.skipNewlines();
                    }
                }
                this.consume(TokenType.CloseBracket, "Expected ']'");
                return { kind: "ArrayLiteral", elements, line: tk.line } as ArrayLiteral;
            }

            case TokenType.OpenBrace: {
                const tk = this.at();
                if (process.env.VYBE_DEBUG) console.log(`[DEBUG] parseObjectLiteral at line ${tk.line} col ${tk.column}. Next token: ${this.peek(1).value} (${TokenType[this.peek(1).type]})`);
                this.consume(TokenType.OpenBrace, "");
                const properties: Property[] = [];

                while (this.notEOF() && this.at().type !== TokenType.CloseBrace) {
                    this.skipNewlines();
                    if (this.at().type === TokenType.CloseBrace) break;

                    const keyTk = this.consume(TokenType.Identifier, "Expected object key");
                    const key = keyTk.value;

                    this.skipNewlines();
                    if (this.at().type === TokenType.Comma) {
                        this.consume(TokenType.Comma, "");
                        properties.push({ kind: "Property", key, line: tk.line } as Property);
                        continue;
                    } else if (this.at().type === TokenType.CloseBrace) {
                        properties.push({ kind: "Property", key, line: tk.line } as Property);
                        continue;
                    }

                    this.consume(TokenType.Colon, "Expected ':' after key");
                    this.skipNewlines();
                    const value = this.parseExpr();
                    properties.push({ kind: "Property", key, value, line: tk.line } as Property);

                    this.skipNewlines();
                    if (this.at().type === TokenType.Comma) {
                        this.consume(TokenType.Comma, "");
                        this.skipNewlines();
                    }
                }

                this.skipNewlines();
                this.consume(TokenType.CloseBrace, "Expected '}'");
                return { kind: "ObjectLiteral", properties, line: tk.line } as ObjectLiteral;
            }

            default: {
                throw new VybeError(
                    "Syntax Error",
                    `Unexpected token: ${tk.value} (type: ${TokenType[tk.type]})`,
                    tk.line,
                    tk.column,
                    "Check your syntax."
                );
            }
        }
    }
}
